// ────────────────────────────────────────────────────────────────────────────
//  Unified HTTP / SSE / WebSocket server (Braintree + Mongo)
//  * Uses generalized routing helpers (ctx factories, param matching)
//  * Safe, flexible static‑file resolver with alias support and directory‑traversal
//    protection; streams files via createReadStream like legacy util.
//  * WebSocket upgrades mapped to same route table.
//  * No OpenAI / Git helper routes included.
// ────────────────────────────────────────────────────────────────────────────

import * as http  from 'http';
import * as https from 'https';
import * as fs    from 'fs';
import * as path  from 'path';
import * as fsp   from 'fs/promises';

import {
  getEnvVar,
  setHeaders,
  httpHandler,
  attachWebSocketHandler,
  createSseSession,
  Routes,
  ServerConfig
} from './backend/util';

import { braintreeRoutes }                 from './backend/braintree';
import { mongodbRoutes, initMongoClient }  from './backend/mongodb';
import { btMongoRoutes }                   from './backend/bt_mongo';

// ─── Config ────────────────────────────────────────────────────────────
const serverConfig: ServerConfig = {
  protocol : getEnvVar('PROTOCOL', 'https') as 'http' | 'https',
  host     : getEnvVar('HOST',     'localhost'),
  port     : Number(getEnvVar('PORT', '3000')),
  keypath  : './server.key',
  certpath : './server.crt',
  startpage: 'index.html'
};

// ─── Base utility routes ───────────────────────────────────────────────
const baseRoutes: Routes = {
  '/config': {
    GET: async ctx => {
      await ctx.json(200, {
        googleClientId: getEnvVar('GOOGLE_CLIENTID', ''),
        googleMapsKey : getEnvVar('GOOGLE_MAPS_KEY', '' )
      });
    }
  },
  
  // plain  /events     → device key resolved from query/cookie/UA
  '/events': {
    GET: async ctx => createSseSession(ctx.req, ctx.res, ctx.params)   // {}
  },

  // param  /events/:deviceId  → device key taken from the path first
  '/events/:deviceId': {
    GET: async ctx => createSseSession(ctx.req, ctx.res, ctx.params)   // { deviceId: 'abc' }
  }
};

export const routesConfig: Routes = {
  ...baseRoutes,
  ...braintreeRoutes,
  ...mongodbRoutes,
  ...btMongoRoutes
};

// ─── Static‑file resolver (streams) ────────────────────────────────────
async function staticServe(req: http.IncomingMessage, res: http.ServerResponse, cfg: ServerConfig) {
  const url    = new URL(req.url || '/', `http://${req.headers.host}`);
  let pathname = url.pathname;
  if (pathname === '/' || pathname === '') pathname = '/' + cfg.startpage;

  const absPath = path.normalize(path.join(process.cwd(), pathname));
  if (!absPath.startsWith(process.cwd())) {
    setHeaders(res, 400, 'text/plain');
    return res.end('Bad Request');
  }

  try {
    const stat = await fsp.stat(absPath);
    if (!stat.isFile()) throw new Error('Not-file');

    const ext  = path.extname(absPath).toLowerCase();
    const mime: Record<string,string> = {
      '.html': 'text/html',
      '.js'  : 'application/javascript',
      '.json': 'application/json',
      '.css' : 'text/css',
      '.svg' : 'image/svg+xml',
      '.png' : 'image/png',
      '.jpg' : 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.ico' : 'image/x-icon'
    };

    res.writeHead(200, {
      'Content-Type'  : mime[ext] || 'application/octet-stream',
      'Content-Length': stat.size
    });
    fs.createReadStream(absPath).pipe(res);
  } catch {
    setHeaders(res, 404, 'text/plain');
    res.end('404 Not Found');
  }
}

// ─── Primary request handler ──────────────────────────────────────────
function onRequest(req: http.IncomingMessage, res: http.ServerResponse, cfg: ServerConfig) {
  httpHandler(req, res, () => staticServe(req, res, cfg), routesConfig);
}

// ─── Server factory & startup ─────────────────────────────────────────
function createServer(cfg: ServerConfig) {
  if (cfg.protocol === 'https') {
    const ssl = { key: fs.readFileSync(cfg.keypath!), cert: fs.readFileSync(cfg.certpath!) };
    return https.createServer(ssl, (req, res) => onRequest(req, res, cfg));
  }
  return http.createServer((req, res) => onRequest(req, res, cfg));
}

function startServer(cfg: ServerConfig) {
  const server = createServer(cfg);
  attachWebSocketHandler(
    server, 
    routesConfig,
    "/ws"
  );
  server.listen(cfg.port, cfg.host, () => {
    console.log(`🚀  Server running at ${cfg.protocol}://${cfg.host}:${cfg.port}/`);
    initMongoClient().catch(console.error);
  });
  return server;
}

startServer(serverConfig);
