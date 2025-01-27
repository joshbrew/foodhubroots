import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import braintree from 'braintree';
import dotenv from 'dotenv';
dotenv.config();

// Load configuration and start the server
const serverConfig = {
    protocol: 'http',
    host: 'localhost',
    port: 3000,
    startpage: 'index.html'
};

// Set up Braintree Gateway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

// Utility to read environment variables
function getEnvVar(name, defaultValue) {
    return process.env[name] || defaultValue;
}

// Utility function to set headers, including CORS headers
function setHeaders(response, statusCode, contentType = 'application/json') {
    response.writeHead(statusCode, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // Allow all origins (or specify your front-end URL)
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// Define a hash table for routes
const routes = {
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
        GET: (request, response, cfg) => {
            gateway.clientToken.generate({}, (err, res) => {
                if (err) {
                    setHeaders(response, 500);
                    response.end(JSON.stringify({ error: 'Failed to generate client token' }));
                } else {
                    setHeaders(response, 200);
                    response.end(JSON.stringify({ clientToken: res.clientToken }));
                }
            });
        }
    },
    "/transaction": {
        POST: (request, response, cfg) => {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const { transactionId } = JSON.parse(body);
                gateway.transaction.find(transactionId, (err, transaction) => {
                    if (err) {
                        setHeaders(response, 404);
                        response.end(JSON.stringify({ error: 'Transaction not found' }));
                    } else {
                        setHeaders(response, 200);
                        response.end(JSON.stringify({ transaction }));
                    }
                });
            });
        }
    },
    "/checkout": {
        POST: (request, response, cfg) => {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const { customerId, amount } = JSON.parse(body);
                gateway.transaction.sale({
                    amount: amount,
                    customerId: customerId,
                    options: {
                        submitForSettlement: true
                    }
                }, (err, result) => {
                    if (err || !result.success) {
                        setHeaders(response, 500);
                        response.end(JSON.stringify({ error: err || result.message }));
                    } else {
                        setHeaders(response, 200);
                        response.end(JSON.stringify({ success: true, transactionId: result.transaction.id }));
                    }
                });
            });
        }
    },
    "/create-customer": {
        POST: (request, response, cfg) => {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const { firstName, lastName, email, paymentMethodNonce } = JSON.parse(body);
                gateway.customer.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    paymentMethodNonce: paymentMethodNonce
                }, (err, result) => {
                    if (err || !result.success) {
                        setHeaders(response, 500);
                        response.end(JSON.stringify({ error: err || result.message }));
                    } else {
                        const customerId = result.customer.id;
                        setHeaders(response, 200);
                        response.end(JSON.stringify({ success: true, customerId: customerId }));
                    }
                });
            });
        }
    },
    "/get-customer": {
        POST: (request, response, cfg) => {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const { customerId } = JSON.parse(body);
                gateway.customer.find(customerId, (err, customer) => {
                    if (err) {
                        setHeaders(response, 404);
                        response.end(JSON.stringify({ error: 'Customer not found' }));
                    } else {
                        setHeaders(response, 200);
                        response.end(JSON.stringify({ customer }));
                    }
                });
            });
        }
    },
    "/update-customer": {
        POST: (request, response, cfg) => {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                const { customerId, firstName, lastName, email, address, city, state, zip, country } = JSON.parse(body);
                gateway.customer.update(customerId, {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    creditCard: {
                        billingAddress: {
                            streetAddress: address,
                            locality: city,
                            region: state,
                            postalCode: zip,
                            countryCodeAlpha2: country
                        }
                    }
                }, (err, result) => {
                    if (err || !result.success) {
                        setHeaders(response, 500);
                        response.end(JSON.stringify({ error: err || result.message }));
                    } else {
                        setHeaders(response, 200);
                        response.end(JSON.stringify({ success: true }));
                    }
                });
            });
        }
    }
};

// Function to handle incoming requests
function onRequest(request, response, cfg) {
    const requestURL = '.' + request.url;
    const route = routes[request.url];
    if (route) {
        const methodHandler = route[request.method];
        if (methodHandler) {
            methodHandler(request, response, cfg);
            return;
        } else {
            setHeaders(response, 405, 'text/html');
            response.end('Method Not Allowed');
            return;
        }
    }

    if (fs.existsSync(requestURL)) {
        fs.readFile(requestURL, (error, content) => {
            if (error) {
                setHeaders(response, 500, 'text/html');
                response.end('Internal Server Error');
            } else {
                const extname = String(path.extname(requestURL)).toLowerCase();
                const mimeType = {
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

// Function to create and start the server
function createServer(cfg) {
    if (cfg.protocol === 'http') {
        return http.createServer((request, response) => onRequest(request, response, cfg));
    } else if (cfg.protocol === 'https') {
        const options = {
            key: fs.readFileSync(cfg.keypath),
            cert: fs.readFileSync(cfg.certpath)
        };
        return https.createServer(options, (request, response) => onRequest(request, response, cfg));
    }
    throw new Error('Invalid protocol specified');
}

// Start the server
function startServer(cfg) {
    cfg.port = getEnvVar('PORT', cfg.port);

    const server = createServer(cfg);
    server.listen(cfg.port, cfg.host, () => {
        console.log(`Server running at ${cfg.protocol}://${cfg.host}:${cfg.port}/`);
    });

    return server;
}

startServer(serverConfig);
