// Import Node.js core modules for HTTP/HTTPS server, filesystem access, and path handling.
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

// Import helper functions, types, and configuration utilities.
import { getEnvVar, Routes, ServerConfig, setHeaders } from './backend/util';
// Import routes for Braintree integration.
import { braintreeRoutes } from './backend/braintree';
// Import routes and initialization function for MongoDB.
import { mongodbRoutes, initMongoClient } from './backend/mongodb';
import { btMongoRoutes } from './backend/bt_mongo';

// External documentation links for Braintree integration:
// https://developer.paypal.com/braintree/docs/start/overview/
// https://developer.paypal.com/braintree/docs/start/drop-in

// Define the server configuration settings.
const serverConfig: ServerConfig = {
  protocol: 'https', // Choose 'http' or 'https'. Here, HTTPS is used.
  host: 'localhost', // Server hostname.
  port: 3000,        // Port number for the server.
  keypath: './server.key',  // Path to the SSL key file (required for HTTPS).
  certpath: './server.crt', // Path to the SSL certificate file (required for HTTPS).
  startpage: 'index.html'   // Default page to serve when accessing the root URL.
};

// Base route to provide client configuration details.
// This route can be used for user authentication and retrieving necessary credentials.
const baseRoutes: Routes = {
  "/config": {
    GET: (request, response, cfg) => {
      // Prepare configuration object with values fetched from environment variables.
      const config = {
        // The following values are commented out as the frontend typically doesn't require these:
        // braintreeClientId: getEnvVar('BRAINTREE_CLIENT_ID', ''),
        // braintreeApiKey: getEnvVar('BRAINTREE_API_KEY', ''),
        googleClientId: getEnvVar('GOOGLE_CLIENTID', ''),
        googleMapsKey: getEnvVar('GOOGLE_MAPS_KEY', '')
      };
      // Set HTTP headers for a successful response.
      setHeaders(response, 200);
      // Send the configuration as a JSON response.
      response.end(JSON.stringify(config));
    }
  },
};

// Merge all routes (base, Braintree, MongoDB) into a single routes object.
const routes: Routes = {
  ...baseRoutes,
  ...braintreeRoutes,
  ...mongodbRoutes,
  ...btMongoRoutes
}

// --- Request handler ---
// Handles incoming HTTP/HTTPS requests based on defined routes.
function onRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  cfg: ServerConfig
) {
  // Handle CORS preflight requests.
  if (request.method === 'OPTIONS') {
    setHeaders(response, 200);
    response.end();
    return;
  }

  // Find a matching route based on the requested URL.
  const route = routes[request.url || ''];
  if (route) {
    // Retrieve the handler for the specific HTTP method (GET, POST, etc.).
    const methodHandler = route[request.method || ''];
    if (methodHandler) {
      // Execute the route handler, catching any errors.
      Promise.resolve(methodHandler(request, response, cfg))
        .catch((err) => {
          console.error(err);
          // Send a 500 Internal Server Error response if an error occurs.
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
      return;
    } else {
      // Respond with 405 Method Not Allowed if the HTTP method is not supported.
      setHeaders(response, 405, 'text/html');
      response.end('Method Not Allowed');
      return;
    }
  }

  // If no route matches, serve static files.
  // Default to the start page if the root URL is requested.
  let urlPath = request.url || "";
  if (urlPath === "/" || urlPath === "") {
    urlPath = "/" + cfg.startpage;
  }
  // Map the URL to a file path on the server.
  const requestURL = '.' + urlPath;

  // Check if the requested file exists.
  if (fs.existsSync(requestURL)) {
    // Read the file from disk.
    fs.readFile(requestURL, (error, content) => {
      if (error) {
        // If reading fails, respond with a 500 error.
        setHeaders(response, 500, 'text/html');
        response.end('Internal Server Error');
      } else {
        // Determine the file's extension to set the proper MIME type.
        const extname = String(path.extname(requestURL)).toLowerCase();
        const mimeType: { [key: string]: string } = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.json': 'application/json'
        };
        // Set headers and serve the file content.
        setHeaders(response, 200, mimeType[extname] || 'application/octet-stream');
        response.end(content, 'utf-8');
      }
    });
  } else {
    // Respond with a 404 Not Found if the file does not exist.
    setHeaders(response, 404, 'text/html');
    response.end('404 Not Found', 'utf-8');
  }
}

// --- Create and start the server ---
// Function to create a server based on the specified protocol.
function createServer(cfg: ServerConfig) {
  if (cfg.protocol === 'http') {
    // Create an HTTP server.
    return http.createServer((request, response) =>
      onRequest(request, response, cfg)
    );
  } else if (cfg.protocol === 'https') {
    // Read SSL certificate and key files for HTTPS.
    const options = {
      key: fs.readFileSync(cfg.keypath!),
      cert: fs.readFileSync(cfg.certpath!)
    };
    // Create an HTTPS server using SSL options.
    return https.createServer(options, (request, response) =>
      onRequest(request, response, cfg)
    );
  }
  // Throw an error if an unsupported protocol is specified.
  throw new Error('Invalid protocol specified');
}

// Function to start the server.
function startServer(cfg: ServerConfig) {
  // Update the port using the environment variable if available.
  cfg.port = Number(getEnvVar('PORT', cfg.port));
  // Create the server using the appropriate protocol.
  const server = createServer(cfg);
  // Begin listening on the configured host and port.
  server.listen(cfg.port, cfg.host, () => {
    console.log(`Server running at ${cfg.protocol}://${cfg.host}:${cfg.port}/`);
    // Initialize the MongoDB client once the server starts.
    initMongoClient();
  });
  
  return server;
}

// Start the server with the defined configuration.
startServer(serverConfig);
