import dotenv from 'dotenv';
import * as http from 'http';

dotenv.config();

// --- Server configuration interface ---
export interface ServerConfig {
    protocol: 'http' | 'https';
    host: string;
    port: number;
    startpage: string;
    keypath?: string;
    certpath?: string;
}
  
  // --- Define route handler type and routes ---
export type Handler = (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    cfg: ServerConfig
) => Promise<void> | void;
  
export interface Routes {
    [route: string]: {
        [method: string]: Handler;
    };
}
// --- Utility functions ---
export function getEnvVar(name: string, defaultValue: any) {
  return process.env[name] || defaultValue;
}


export function setHeaders(
  response: http.ServerResponse,
  statusCode: number,
  contentType: string = 'application/json'
) {
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*', // Adjust to your front-end URL if needed.
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}


  
// Helper to read request body
export async function getRequestBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}
