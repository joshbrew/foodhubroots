// Import Node.js modules for file system operations and URL-encoded query string parsing.
import * as fs from 'fs';
import * as querystring from 'querystring';

// Import the Braintree library.  
// Note: Depending on your version/configuration, you might need to import it using “import * as braintree from 'braintree'” instead.
import braintree from 'braintree';

// Import helper functions and types for getting the request body, setting headers, and defining routes.
import { getRequestBody, Routes, setHeaders } from './util';

// --- Set up the Braintree Gateway ---
// Create a new instance of the BraintreeGateway using environment variables for credentials.
// The non-null assertions (!) assume that these environment variables are always set,
// which could lead to runtime errors if any of them are missing.
export const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!
});

// Define Braintree-specific server request routes.
export const braintreeRoutes: Routes = {
  // Route to generate and return a client token.
  "/client-token": {
    GET: async (request, response, cfg) => {
      try {
        // Generate a client token for frontend use.
        const res = await btGateway.clientToken.generate({});
        console.log("generated client token: ", res.clientToken);
        setHeaders(response, 200);
        response.end(JSON.stringify({ clientToken: res.clientToken }));
      } catch (err) {
        // Respond with a 500 error if token generation fails.
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to generate client token' }));
      }
    }
  },

  // Route to fetch details of a transaction using its transactionId.
  "/transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { transactionId } = JSON.parse(body);
        // Look up the transaction in Braintree.
        const transaction = await btGateway.transaction.find(transactionId);
        console.log("generated transaction: ", transaction);
        setHeaders(response, 200);
        response.end(JSON.stringify({ transaction }));
      } catch (err) {
        // Using 404 here may be misleading if the error isn’t due to a missing transaction.
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Transaction not found' }));
      }
    }
  },

  // Route to process a checkout (sale transaction).
  "/checkout": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, amount } = JSON.parse(body);
        // Build the sale request object.
        const saleRequest: braintree.TransactionRequest = {
          amount: amount,
          customerId: customerId,
          options: {
            submitForSettlement: true
          }
        };
        // Attempt to process the transaction.
        const result = await btGateway.transaction.sale(saleRequest);
        if (!result.success) {
          // Consider whether a 500 error is appropriate here or if a 400-level status might be better.
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

  // Route to create a new customer.
  "/create-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { firstName, lastName, email, paymentMethodNonce } = JSON.parse(body);
        const result = await btGateway.customer.create({
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

  // Route to fetch a customer by ID.
  // Note: Although this is a retrieval operation, it uses POST instead of GET.
  "/get-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId } = JSON.parse(body);
        const customer = await btGateway.customer.find(customerId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ customer }));
      } catch (err) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Customer not found' }));
      }
    }
  },

  // Route to update a customer's information.
  "/update-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, firstName, lastName, email, address, city, state, zip, country } = JSON.parse(body);
        // Attempt to update the customer. Note: Updating billing address inside "creditCard" may not be valid in all cases.
        const result = await btGateway.customer.update(customerId, {
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

  // Route to create a submerchant account.
  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        // Use the master merchant account ID from the environment.
        const masterMerchantAccountId = process.env.BRAINTREE_MASTER_MERCHANT_ID!;
        const result = await btGateway.merchantAccount.create({
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

  // Route to process a split transaction.
  "/split-transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        const { subMerchantAccountId, amount, nonce, customerId } = bodyJson;
        const decimalAmount = parseFloat(amount);
        // Calculate a 2% service fee.
        const serviceFeeDecimal = decimalAmount * 0.02;
        const serviceFeeAmount = serviceFeeDecimal.toFixed(2);
        const saleRequest: braintree.TransactionRequest = {
          merchantAccountId: subMerchantAccountId,
          amount: amount,
          serviceFeeAmount: serviceFeeAmount,
          options: { submitForSettlement: true }
        };
        // Use customerId if provided; otherwise, use the payment method nonce.
        if (customerId) {
          saleRequest.customerId = customerId;
        } else if (nonce) {
          saleRequest.paymentMethodNonce = nonce;
        }
        const result = await btGateway.transaction.sale(saleRequest);
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
  },

  // Route to fetch all transactions (with a filter on creation date).
  "/transactions": {
    GET: async (request, response, cfg) => {
      try {
        // Wrap the Braintree search in a Promise.
        const transactions = await new Promise<any[]>((resolve, reject) => {
          const result: any[] = [];
          btGateway.transaction.search(
            (search) => {
              // Set a minimum date to capture transactions (from Jan 1, 2000).
              search.createdAt().min(new Date(2000, 0, 1));
            },
            //@ts-ignore
            (err: any, collection: any) => {
              if (err) return reject(err);
              // Iterate over each transaction in the result collection.
              (collection.each as any)((err: any, transaction: any) => {
                if (err) return reject(err);
                result.push(transaction);
              }, () => resolve(result));
            }
          );
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ transactions }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch transactions' }));
      }
    }
  },

  // Route to fetch all customers.
  "/customers": {
    GET: async (request, response, cfg) => {
      try {
        // Wrap the customer search in a Promise.
        const customers = await new Promise<any[]>((resolve, reject) => {
          const result: any[] = [];
          btGateway.customer.search(
            (search) => {
              // No predicates added – returns all customers.
            },
            //@ts-ignore
            (err: any, collection: any) => {
              if (err) return reject(err);
              (collection.each as any)((err: any, customer: any) => {
                if (err) return reject(err);
                result.push(customer);
              }, () => resolve(result));
            }
          );
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ customers }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch customers' }));
      }
    }
  },

  // Route to fetch a single submerchant account using its ID.
  "/get-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { merchantAccountId } = JSON.parse(body);
        // Note: Wrapping a promise in a new Promise is redundant here,
        // as btGateway.merchantAccount.find already returns a promise.
        const subMerchant = await new Promise<any>((resolve, reject) => {
          btGateway.merchantAccount.find(merchantAccountId)
            .then((merchantAccount: any) => {
              resolve(merchantAccount);
            })
            .catch((err: any) => { if (err) return reject(err); });
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ subMerchant }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Submerchant not found' }));
      }
    }
  },

  // Route to fetch submerchant details by parsing an approved submerchant file.
  "/submerchants": {
    GET: async (request, response, cfg) => {
      try {
        // Check if the file storing approved submerchant IDs exists.
        if (!fs.existsSync('approved_submerchants.txt')) {
          setHeaders(response, 200);
          response.end(JSON.stringify({ submerchants: [] }));
          return;
        }
        // Read the file asynchronously.
        const data = await fs.promises.readFile('approved_submerchants.txt', 'utf-8');
        // Split the file content into an array of IDs, ignoring empty lines.
        const submerchantIds = data.split("\n").filter((line) => line.trim() !== "");
        // For each submerchant ID, fetch the details from Braintree.
        const submerchants = await Promise.all(
          submerchantIds.map(async (id) => {
            try {
              const merchantAccount = await btGateway.merchantAccount.find(id);
              return merchantAccount;
            } catch (err) {
              return { id, error: "Submerchant not found" };
            }
          })
        );
        setHeaders(response, 200);
        response.end(JSON.stringify({ submerchants }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch submerchants' }));
      }
    }
  },

  // --- Webhook Endpoint ---
  // This endpoint is used to receive webhook notifications from Braintree.
  // Note: The HTTPS URL must be configured as per Braintree’s documentation.
  "/webhook": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        // Parse the URL-encoded body to extract bt_signature and bt_payload.
        const parsedBody = querystring.parse(body);
        const btSignature = parsedBody.bt_signature as string;
        const btPayload = parsedBody.bt_payload as string;

        // Parse the webhook notification using Braintree's SDK.
        btGateway.webhookNotification.parse(btSignature, btPayload, 
          //@ts-ignore    
          (err, webhookNotification) => {
            if (err) {
              setHeaders(response, 500);
              response.end(JSON.stringify({ error: 'Failed to parse webhook notification' }));
              return;
            }

            console.log("\n WEBHOOK NOTIFICATION: ", webhookNotification.message);
            // Handle various webhook notification kinds.
            switch (webhookNotification.kind) {
              //@ts-ignore   
              case braintree.WebHookNotification.Kind.SubMerchantAccountApproved:
                // Append the approved submerchant ID to a file.
                fs.appendFile('approved_submerchants.txt', webhookNotification.merchantAccount.id + "\n", (err) => {
                  if (err) console.error('Error writing approved submerchant:', err);
                });
                break;
              //@ts-ignore   
              case braintree.WebhookNotification.Kind.SubMerchantAccountDeclined:
                // Optionally log or handle declined submerchants.
                break;
              //@ts-ignore   
              case braintree.WebhookNotification.Kind.TransactionDisbursed:
                // Intentional fallthrough.
              //@ts-ignore   
              case braintree.WebhookNotification.Kind.TransactionSettled:
                // Append successful transaction ID to a file.
                fs.appendFile('successful_transactions.txt', webhookNotification.transaction.id + "\n", (err) => {
                  if (err) console.error('Error writing successful transaction:', err);
                });
                break;
              //@ts-ignore   
              case braintree.WebhookNotification.Kind.TransactionSettlementDeclined:
                // Append declined transaction ID to a file.
                fs.appendFile('declined_transactions.txt', webhookNotification.transaction.id + "\n", (err) => {
                  if (err) console.error('Error writing declined transaction:', err);
                });
                break;
              default:
                // Log other notification kinds for debugging purposes.
                console.log('Received webhook notification of kind:', webhookNotification.kind);
            }

            // Always acknowledge receipt of the webhook.
            setHeaders(response, 200);
            response.end(JSON.stringify({ received: true }));
          }
        );
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to process webhook' }));
      }
    }
  }
}
