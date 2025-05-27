import http, { Server } from 'http'
import path from 'path';
import fs from 'fs/promises';
// import http from 'http';
// import https from 'https';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createSession, createChannel, Session } from 'better-sse';

import { createHash } from "crypto";
function sha1(input: string) {
  return createHash("sha1").update(input).digest("hex");
}


// ────────────────────────────────────────────────────────────────────
// Generic request-context passed to all route handlers
// ────────────────────────────────────────────────────────────────────
export interface Context {
  /** Raw HTTP request (present in all contexts) */
  req: http.IncomingMessage;
  /** Raw HTTP response (undefined for pure WS ctx but kept optional) */
  res?: http.ServerResponse;
  /** WebSocket instance for WS routes (undefined in HTTP/SSE ctx) */
  ws?: WebSocket;

  /** Path parameters captured from a   /route/:param   pattern */
  params: Record<string, string>;
  /** Query-string key/value pairs */
  query: Record<string, string>;

  /* Convenience helpers added by createHttpContext / createWsContext */
  json(status: number, data: unknown): void | Promise<void>;
  text(status: number, data: string): void | Promise<void>;
  body(): Promise<any>;                // lazily parsed JSON body (HTTP only)
}

// ────────────────────────────────────────────────────────────────────
// Server configuration interface
// ────────────────────────────────────────────────────────────────────
export interface ServerConfig {
  protocol: "http" | "https";
  host: string;
  port: number;
  startpage: string;
  keypath?: string;
  certpath?: string;
}

// ────────────────────────────────────────────────────────────────────
// Route handler & table types
// ────────────────────────────────────────────────────────────────────
export type Handler = (ctx: Context) => void | Promise<void>;

export interface Routes {
  [route: string]: {
    [method: string]: Handler;   // e.g.  GET, POST, PATCH, etc.
  };
}

dotenv.config();

export const RATE_LIMIT_INTERVAL_MS = 500; // Minimum interval between OpenAI API calls (500ms = 120 RPM)


// ─── Utils for colored logging ─────────────────────────────────────────
export const COLORS = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m"
};
export function logInfo(msg) { console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${msg}`); }
export function logSuccess(msg) { console.log(`${COLORS.green}[OK]${COLORS.reset}  ${msg}`); }
export function logWarn(msg) { console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${msg}`); }
export function logError(msg) { console.error(`${COLORS.red}[ERR]${COLORS.reset}  ${msg}`); }


export const sseChannel = createChannel();
export const pendingConsoleHistory = new Map();
/**
 * Get an environment variable, falling back to a default.
 */
export function getEnvVar(name, defaultValue) {
  return process.env[name] ?? defaultValue;
}

/**
 * Set common headers (incl. CORS) and status code on the response. 
 * This is unsecure fyi should be configd for what ports or urls you 
 * specifically want
 * 
 * TODO: SECURE
 */
export function setHeaders(response, statusCode, contentType = 'application/json') {
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    "Access-Control-Allow-Origin": "*"
  });
}

/**
 * Read the full request body as a string.
 */
export async function getRequestBody(request): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

// --- Context factories ---
export function createHttpContext(req, res, params, query) {
  return {
    req,
    res,
    params,
    query,
    async json(status, data) {
      setHeaders(res, status, 'application/json');
      res.end(JSON.stringify(data));
    },
    async text(status, data) {
      setHeaders(res, status, 'text/plain');
      res.end(data);
    },
    async body() {
      return JSON.parse(await getRequestBody(req));
    },
  };
}

// --- HTTP handler export ---
export function httpHandler(req, res, next, routes) {
  
  // — CORS preflight support —
  if (req.method === 'OPTIONS') {
    const acrh = req.headers["access-control-request-headers"] || "";
    res.writeHead(204, {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,DELETE",
      // echo back exactly what the browser asked for
      "Access-Control-Allow-Headers": Array.isArray(acrh) ? acrh.join(",") : acrh
    });
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const route = findRoute(url.pathname, routes);
  if (!route) return next();

  const handler = route.methods[req.method];
  if (!handler) {
    setHeaders(res, 405, 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const ctx = createHttpContext(
    req,
    res,
    route.params,
    Object.fromEntries(url.searchParams.entries())
  );
  handler(ctx).catch(err => {
    console.error(err);
    ctx.json(500, { error: err.message });
  });
}

export function createWsContext(
  ws: WebSocket,
  msg: { params?: any; query?: any; body?: any }
) {
  return {
    ws,
    params: msg.params || {},
    query: msg.query || {},
    async json(status: number, data: any) {
      ws.send(JSON.stringify({ status, data }));
    },
    async text(status: number, data: string) {
      ws.send(JSON.stringify({ status, data }));
    },
    body: msg.body || {},
  };
}

// Payload we expect the browser to send over the socket
interface WsMessage {
  /** Matches a route key, e.g. "/chat/123" */
  path: string;
  /** One of "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "PUT" etc. */
  method: string;
  /** Optional query params the client wants to surface */
  query?: Record<string, string>;
  /** Optional body for POST/PUT/PATCH */
  body?: unknown;
  /** Optionally let client send explicit params (overridden by server’s own) */
  params?: Record<string, string>;
}

/* ────────────────────────────────────────────────────────────────
   WebSocket Registry  (mirrors the SSE registry logic)
   ────────────────────────────────────────────────────────────────*/

interface RegisteredSocket {
  ws: WebSocket;
  /** optional label, e.g. which page/component opened it */
  channel?: string;
}

export const wsRegistry = new Map<
  string,                           // ip
  Map<string, Set<RegisteredSocket>>// deviceKey → sockets
>();

function registerWs(ip: string, dev: string, sock: WebSocket, channel?: string) {
  let ipMap = wsRegistry.get(ip);
  if (!ipMap) {
    ipMap = new Map();
    wsRegistry.set(ip, ipMap);
  }
  let bucket = ipMap.get(dev);
  if (!bucket) {
    bucket = new Set();
    ipMap.set(dev, bucket);
  }
  bucket.add({ ws: sock, channel });
}

function unregisterWs(ip: string, dev: string, sock: WebSocket) {
  const ipMap = wsRegistry.get(ip);
  const bucket = ipMap?.get(dev);
  if (!bucket) return;

  for (const entry of bucket) {
    if (entry.ws === sock) bucket.delete(entry);
  }
  if (bucket.size === 0) ipMap!.delete(dev);
  if (ipMap!.size === 0) wsRegistry.delete(ip);
}

/* ────────────────────────────────────────────────────────────────
   Broadcast helpers
   ────────────────────────────────────────────────────────────────*/

export function wsPushToIp(
  ip: string,
  data: any,
  channelFilter?: string
) {
  const ipMap = wsRegistry.get(ip);
  if (!ipMap) return;
  const msg = JSON.stringify(data);
  for (const bucket of ipMap.values())
    for (const { ws, channel } of bucket)
      if (!channelFilter || channel === channelFilter)
        if (ws.readyState === ws.OPEN) ws.send(msg);
}

export function wsPushToDevice(
  ip: string,
  deviceKey: string,
  data: any,
  channelFilter?: string
) {
  const bucket = wsRegistry.get(ip)?.get(deviceKey);
  if (!bucket) return;
  const msg = JSON.stringify(data);
  for (const { ws, channel } of bucket)
    if (!channelFilter || channel === channelFilter)
      if (ws.readyState === ws.OPEN) ws.send(msg);
}

/* ────────────────────────────────────────────────────────────────
   attachWebSocketHandler  – augmented with registry logic
   ────────────────────────────────────────────────────────────────*/

export function attachWebSocketHandler(
  server: Server,
  routes: Routes,
  socketUrl = "/ws"
): void {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    if (url.pathname !== socketUrl) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", (ws: WebSocket, req) => {
    const ip = (req.socket.remoteAddress || "").replace("::ffff:", "");
    const url = new URL(req.url || "", `http://${req.headers.host}`);

    // a) deviceKey via ?deviceId=
    let deviceKey = url.searchParams.get("deviceId") ?? "";
    // b) cookie fallback
    if (!deviceKey && req.headers.cookie) {
      const m = req.headers.cookie.match(/(?:^|;\s*)deviceId=([^;]+)/);
      if (m) deviceKey = decodeURIComponent(m[1]);
    }
    // c) hash UA fallback
    if (!deviceKey) deviceKey = sha1(req.headers["user-agent"] || "");

    // Optional logical channel name:  ?channel=chat
    const channel = url.searchParams.get("channel") ?? undefined;

    registerWs(ip, deviceKey, ws, channel);

    ws.addEventListener("close", () => unregisterWs(ip, deviceKey, ws));

    /* ───── REST-ish routing over the socket ───── */
    ws.addEventListener("message", async raw => {
      let msg: WsMessage;
      try { msg = JSON.parse(raw.toString()); }
      catch { return ws.send(JSON.stringify({ error: "Invalid JSON" })); }

      const route = findRoute(msg.path, routes);
      if (!route) return ws.send(JSON.stringify({ error: "Not found" }));
      const handler = route.methods[msg.method];
      if (!handler) return ws.send(JSON.stringify({ error: "Method not allowed" }));

      const ctx = createWsContext(ws, { ...msg, params: route.params });
      try { await handler(ctx as any); }
      catch (err: any) { ctx.json(500, { error: err.message }); }
    });
  });
}

export const sseRegistry = new Map<string, Map<string, Set<Session>>>();


function registerSSESession(ip: string, dev: string, sess: Session) {
  let ipMap = sseRegistry.get(ip);
  if (!ipMap) {
    ipMap = new Map();
    sseRegistry.set(ip, ipMap);
  }
  let bucket = ipMap.get(dev);
  if (!bucket) {
    bucket = new Set();
    ipMap.set(dev, bucket);
  }
  bucket.add(sess);
}

function unregisterSSESession(ip: string, dev: string, sess: Session) {
  const ipMap = sseRegistry.get(ip);
  if (!ipMap) return;
  const bucket = ipMap.get(dev);
  if (!bucket) return;

  bucket.delete(sess);
  if (bucket.size === 0) ipMap.delete(dev);
  if (ipMap.size === 0) sseRegistry.delete(ip);
}

// ---------------------------------------------------------------------
export async function createSseSession(req, res, params) {
  const sess = await createSession(req, res);

  const ip  = (req.socket.remoteAddress || '').replace('::ffff:', '');
  const url = new URL(req.url || '', `http://${req.headers.host}`);

  /* 0)  path param wins if present */
  let deviceKey = params?.deviceId || '';

  /* 1)  ?deviceId= in query string */
  if (!deviceKey) deviceKey = url.searchParams.get('deviceId') || '';

  /* 2)  cookie fallback */
  if (!deviceKey && req.headers.cookie) {
    const m = req.headers.cookie.match(/(?:^|;\s*)deviceId=([^;]+)/);
    if (m) deviceKey = decodeURIComponent(m[1]);
  }

  /* 3)  hash of UA as last-resort */
  if (!deviceKey) deviceKey = sha1(req.headers['user-agent'] || '');

  registerSSESession(ip, deviceKey, sess);
  sseChannel.register(sess);

  sess.on('close', () => {
    sseChannel.deregister(sess);
    unregisterSSESession(ip, deviceKey, sess);
  });
}

// ---------------------------------------------------------------------
// Broadcast helpers
export function pushToIp(
  ip: string,
  eventName: string,
  data: any,
  eventId?: string
) {
  const ipMap = sseRegistry.get(ip);
  if (!ipMap) return;
  for (const bucket of ipMap.values())
    for (const sess of bucket)
      sess.push(JSON.stringify(data), eventName, eventId);
}

export function pushToDevice(
  ip: string,
  deviceKey: string,
  eventName: string,
  data: any,
  eventId?: string
) {
  const ipMap = sseRegistry.get(ip);
  const bucket = ipMap?.get(deviceKey);
  if (!bucket) return;
  for (const sess of bucket)
    sess.push(JSON.stringify(data), eventName, eventId);
}

// -------------------------------------------------------------------
//  Route finder (querystring‐aware)
// -------------------------------------------------------------------
export function findRoute(rawPathname: string, routes: Record<string, any>) {
  // 1) drop query and hash
  const pathname = rawPathname.split(/[?#]/)[0];

  // 2) exact match
  if (routes[pathname]) {
    return { methods: routes[pathname], params: {} };
  }

  // 3) parameterized match (/:foo/:bar…)
  for (const [pattern, methods] of Object.entries(routes)) {
    if (!pattern.includes('/:')) continue;

    const parts = pattern.split('/').filter(Boolean);
    const segs  = pathname.split('/').filter(Boolean);
    if (parts.length !== segs.length) continue;

    const paramNames: string[] = [];
    const regex = new RegExp(
      '^/' +
      parts.map(p => {
        if (p.startsWith(':')) {
          paramNames.push(p.slice(1));
          return '([^/]+)';
        }
        // escape literal segments
        return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }).join('/') +
      '/?$'
    );

    const m = pathname.match(regex);
    if (!m) continue;

    const params = paramNames.reduce<Record<string,string>>((acc, name, i) => {
      acc[name] = decodeURIComponent(m[i + 1]);
      return acc;
    }, {});

    return { methods, params };
  }

  // 4) nothing matched
  return null;
}


// ─── Flatten content array to text ───────────────────────────────────
export function flattenContent(contents) {
  return contents
    .map(c => typeof c.text === 'string' ? c.text : c.text.value)
    .join('\n');
}

// ─── Rate Limiting ───────────────────────────────────────────────────
let lastApiCallTime = 0;
export async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastApiCallTime;
  if (elapsed < RATE_LIMIT_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_INTERVAL_MS - elapsed));
  }
  lastApiCallTime = Date.now();
}

// ─── Reset project utility ───────────────────────────────────────────
export async function resetProject() {
  const root = process.cwd();
  const defaultDir = path.join(root, 'gpt_dev', 'default');

  // 1) Remove everything at root except dist, node_modules, and gpt_dev
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (['dist', 'node_modules', 'gpt_dev', '.env'].includes(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
  }

  // 2) Recursively copy defaults back into project root
  async function copyRecursive(srcDir, destDir) {
    await fs.mkdir(destDir, { recursive: true });
    const items = await fs.readdir(srcDir, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);
      if (item.isDirectory()) {
        await copyRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
  await copyRecursive(defaultDir, root);

  return 'Project reset from ./gpt_dev/default';
}



//for reading directories
export const makeFileWalker = opts => async function walk(dir) {
  const out = [] as any[];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === 'dist') continue;
    if (e.name === 'node_modules') {
      if (opts.skip_node_modules) continue;
      if (!opts.deep_node_modules) {
        const pkgs = await fs.readdir(path.join(dir, 'node_modules'));
        out.push({ name: 'node_modules', children: pkgs.map(n => ({ name: n })) });
        continue;
      }
    }
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const node = { name: e.name } as any;
      if (opts.recursive) node.children = await walk(full);
      out.push(node);
    } else {
      out.push({ name: e.name });
    }
  }
  return out;
};



// ─── Simple thread lock ──────────────────────────────────────────────
const threadLocks = new Map();
export async function lockThread(threadId) {
  while (threadLocks.get(threadId)) {
    await new Promise(r => setTimeout(r, 100));
  }
  threadLocks.set(threadId, true);
}
export function unlockThread(threadId) {
  threadLocks.delete(threadId);
}



