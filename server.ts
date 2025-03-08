import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import braintree from 'braintree';
import dotenv from 'dotenv';
dotenv.config();

// --- Server configuration interface ---
interface ServerConfig {
  protocol: 'http' | 'https';
  host: string;
  port: number;
  startpage: string;
  keypath?: string;
  certpath?: string;
}

const serverConfig: ServerConfig = {
  protocol: 'http',
  host: 'localhost',
  port: 3000,
  startpage: 'index.html'
};

// --- Set up the Braintree Gateway ---
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!
});

// --- Utility functions ---
function getEnvVar(name: string, defaultValue: any) {
  return process.env[name] || defaultValue;
}

function setHeaders(
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
async function getRequestBody(request: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

// --- Define route handler type and routes ---
type Handler = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  cfg: ServerConfig
) => Promise<void> | void;

interface Routes {
  [route: string]: {
    [method: string]: Handler;
  };
}

const routes: Routes = {
  "/config": {
    GET: (request, response, cfg) => {
      const config = {
        clientId: getEnvVar('BRAINTREE_CLIENT_ID', ''),
        apiKey: getEnvVar('BRAINTREE_API_KEY', '')
      };
      setHeaders(response, 200);
      response.end(JSON.stringify(config));
    }
  },
  "/client-token": {
    GET: async (request, response, cfg) => {
      try {
        const res = await gateway.clientToken.generate({});
        setHeaders(response, 200);
        response.end(JSON.stringify({ clientToken: res.clientToken }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to generate client token' }));
      }
    }
  },
  "/transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { transactionId } = JSON.parse(body);
        const transaction = await gateway.transaction.find(transactionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ transaction }));
      } catch (err) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Transaction not found' }));
      }
    }
  },
  "/checkout": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, amount } = JSON.parse(body);
        const saleRequest: braintree.TransactionRequest = {
          amount: amount,
          customerId: customerId,
          options: {
            submitForSettlement: true
          }
        };
        const result = await gateway.transaction.sale(saleRequest);
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({
            success: true,
            transactionId: result.transaction.id
          }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Checkout failed' }));
      }
    }
  },
  "/create-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { firstName, lastName, email, paymentMethodNonce } = JSON.parse(body);
        const result = await gateway.customer.create({
          firstName,
          lastName,
          email,
          paymentMethodNonce
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({
            success: true,
            customerId: result.customer.id
          }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to create customer' }));
      }
    }
  },
  "/get-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId } = JSON.parse(body);
        const customer = await gateway.customer.find(customerId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ customer }));
      } catch (err) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Customer not found' }));
      }
    }
  },
  "/update-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, firstName, lastName, email, address, city, state, zip, country } = JSON.parse(body);
        const result = await gateway.customer.update(customerId, {
          firstName,
          lastName,
          email,
          creditCard: {
            billingAddress: {
              streetAddress: address,
              locality: city,
              region: state,
              postalCode: zip,
              countryCodeAlpha2: country
            }
          }
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({ success: true }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to update customer' }));
      }
    }
  },
  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        // Use your master merchant account ID from the environment.
        const masterMerchantAccountId = process.env.BRAINTREE_MASTER_MERCHANT_ID!;
        const result = await gateway.merchantAccount.create({
          individual: bodyJson.individual,
          funding: bodyJson.funding,
          tosAccepted: true,
          masterMerchantAccountId: masterMerchantAccountId
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
          return;
        }
        const subMerchantAccountId = result.merchantAccount.id;
        setHeaders(response, 200);
        response.end(JSON.stringify({
          success: true,
          subMerchantAccountId
        }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to create submerchant' }));
      }
    }
  },
  "/split-transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        const { subMerchantAccountId, amount, nonce, customerId } = bodyJson;
        const decimalAmount = parseFloat(amount);
        const serviceFeeDecimal = decimalAmount * 0.02; // 2% fee
        const serviceFeeAmount = serviceFeeDecimal.toFixed(2);
        const saleRequest: braintree.TransactionRequest = {
          merchantAccountId: subMerchantAccountId,
          amount: amount,
          serviceFeeAmount: serviceFeeAmount,
          options: { submitForSettlement: true }
        };
        if (customerId) {
          saleRequest.customerId = customerId;
        } else if (nonce) {
          saleRequest.paymentMethodNonce = nonce;
        }
        const result = await gateway.transaction.sale(saleRequest);
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({
          success: true,
          transactionId: result.transaction.id,
          subMerchantEarnings: (decimalAmount - parseFloat(serviceFeeAmount)).toFixed(2),
          masterMerchantEarnings: serviceFeeAmount
        }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to process split transaction' }));
      }
    }
  }
};

// --- Request handler ---
function onRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  cfg: ServerConfig
) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    setHeaders(response, 200);
    response.end();
    return;
  }

  const route = routes[request.url || ''];
  if (route) {
    const methodHandler = route[request.method || ''];
    if (methodHandler) {
      Promise.resolve(methodHandler(request, response, cfg))
        .catch((err) => {
          console.error(err);
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
      return;
    } else {
      setHeaders(response, 405, 'text/html');
      response.end('Method Not Allowed');
      return;
    }
  }

  // Serve static files if they exist.
  const requestURL = '.' + (request.url || '');
  if (fs.existsSync(requestURL)) {
    fs.readFile(requestURL, (error, content) => {
      if (error) {
        setHeaders(response, 500, 'text/html');
        response.end('Internal Server Error');
      } else {
        const extname = String(path.extname(requestURL)).toLowerCase();
        const mimeType: { [key: string]: string } = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.json': 'application/json'
        };
        setHeaders(response, 200, mimeType[extname] || 'application/octet-stream');
        response.end(content, 'utf-8');
      }
    });
  } else {
    setHeaders(response, 404, 'text/html');
    response.end('404 Not Found', 'utf-8');
  }
}

// --- Create and start the server ---
function createServer(cfg: ServerConfig) {
  if (cfg.protocol === 'http') {
    return http.createServer((request, response) =>
      onRequest(request, response, cfg)
    );
  } else if (cfg.protocol === 'https') {
    const options = {
      key: fs.readFileSync(cfg.keypath!),
      cert: fs.readFileSync(cfg.certpath!)
    };
    return https.createServer(options, (request, response) =>
      onRequest(request, response, cfg)
    );
  }
  throw new Error('Invalid protocol specified');
}

function startServer(cfg: ServerConfig) {
  cfg.port = Number(getEnvVar('PORT', cfg.port));
  const server = createServer(cfg);
  server.listen(cfg.port, cfg.host, () => {
    console.log(`Server running at ${cfg.protocol}://${cfg.host}:${cfg.port}/`);
  });
  return server;
}

startServer(serverConfig);
