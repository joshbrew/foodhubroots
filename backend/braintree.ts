import fs from 'fs';
import querystring from 'querystring';
import braintree from 'braintree';
import { getRequestBody, Routes, setHeaders } from './util';

// Set up the Braintree Gateway.
export const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!
});

/**
 * Generates and returns a client token.
 */
export async function generateClientToken(): Promise<string> {
  const res = await btGateway.clientToken.generate({});
  return res.clientToken;
}

/**
 * Finds and returns a transaction by its transactionId.
 */
export async function findTransaction(transactionId: string): Promise<any> {
  return await btGateway.transaction.find(transactionId);
}

/**
 * Processes a sale transaction (checkout) for a customer.
 */
export async function processCheckout(customerId: string, amount: string): Promise<string> {
  const saleRequest: braintree.TransactionRequest = {
    amount: amount,
    customerId: customerId,
    options: { submitForSettlement: true }
  };
  const result = await btGateway.transaction.sale(saleRequest);
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.transaction.id;
}

/**
 * Creates a new customer with the provided data.
 */
export async function createCustomer(data: {
  firstName: string;
  lastName: string;
  email: string;
  paymentMethodNonce: string;
}): Promise<string> {
  const result = await btGateway.customer.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    paymentMethodNonce: data.paymentMethodNonce
  });
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.customer.id;
}

/**
 * Retrieves and returns a customer by its customerId.
 */
export async function getCustomer(customerId: string): Promise<any> {
  return await btGateway.customer.find(customerId);
}

/**
 * Updates a customer's details.
 */
export async function updateCustomer(data: {
  customerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): Promise<void> {
  const result = await btGateway.customer.update(data.customerId, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    creditCard: {
      billingAddress: {
        streetAddress: data.address,
        locality: data.city,
        region: data.state,
        postalCode: data.zip,
        countryCodeAlpha2: data.country
      }
    }
  });
  if (!result.success) {
    throw new Error(result.message);
  }
}

/**
 * Creates a submerchant account using provided data.
 */
export async function createSubmerchant(data: {
  individual: any;
  funding: any;
}): Promise<string> {
  const masterMerchantAccountId = process.env.BRAINTREE_MASTER_MERCHANT_ID!;
  const result = await btGateway.merchantAccount.create({
    individual: data.individual,
    funding: data.funding,
    tosAccepted: true,
    masterMerchantAccountId
  });
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.merchantAccount.id;
}

/**
 * Processes a split transaction and returns details.
 */
export async function splitTransaction(params: {
  subMerchantAccountId: string;
  amount: string;
  nonce?: string;
  customerId?: string;
}): Promise<{
  transactionId: string;
  subMerchantEarnings: string;
  masterMerchantEarnings: string;
}> {
  const decimalAmount = parseFloat(params.amount);
  const serviceFeeDecimal = decimalAmount * 0.02;
  const serviceFeeAmount = serviceFeeDecimal.toFixed(2);
  const saleRequest: braintree.TransactionRequest = {
    merchantAccountId: params.subMerchantAccountId,
    amount: params.amount,
    serviceFeeAmount: serviceFeeAmount,
    options: { submitForSettlement: true }
  };
  if (params.customerId) {
    saleRequest.customerId = params.customerId;
  } else if (params.nonce) {
    saleRequest.paymentMethodNonce = params.nonce;
  }
  const result = await btGateway.transaction.sale(saleRequest);
  if (!result.success) {
    throw new Error(result.message);
  }
  return {
    transactionId: result.transaction.id,
    subMerchantEarnings: (decimalAmount - parseFloat(serviceFeeAmount)).toFixed(2),
    masterMerchantEarnings: serviceFeeAmount
  };
}

/**
 * Retrieves all transactions (filtered by creation date).
 */
export async function getTransactions(): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    const result: any[] = [];
    btGateway.transaction.search(
      (search) => {
        search.createdAt().min(new Date(2000, 0, 1));
      },
      //@ts-ignore
      (err: any, collection: any) => {
        if (err) return reject(err);
        collection.each((err: any, transaction: any) => {
          if (err) return reject(err);
          result.push(transaction);
        }, () => resolve(result));
      }
    );
  });
}

/**
 * Retrieves all customers.
 */
export async function getAllCustomers(): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    const result: any[] = [];
    btGateway.customer.search(
      (search) => {
        // No predicates—returns all customers.
      },
      //@ts-ignore
      (err: any, collection: any) => {
        if (err) return reject(err);
        collection.each((err: any, customer: any) => {
          if (err) return reject(err);
          result.push(customer);
        }, () => resolve(result));
      }
    );
  });
}

/**
 * Retrieves a submerchant account by its merchantAccountId.
 */
export async function getSubmerchant(merchantAccountId: string): Promise<any> {
  return await btGateway.merchantAccount.find(merchantAccountId);
}

/**
 * Retrieves submerchant accounts by reading approved submerchant IDs from a file.
 */
export async function getSubmerchantsFromFile(): Promise<any[]> {
  if (!fs.existsSync('approved_submerchants.txt')) {
    return [];
  }
  const data = await fs.promises.readFile('approved_submerchants.txt', 'utf-8');
  const submerchantIds = data.split("\n").filter((line) => line.trim() !== "");
  const submerchants = await Promise.all(
    submerchantIds.map(async (id) => {
      try {
        return await btGateway.merchantAccount.find(id);
      } catch (err) {
        return { id, error: "Submerchant not found" };
      }
    })
  );
  return submerchants;
}

/**
 * Processes a webhook notification from Braintree.
 */
export async function processWebhook(btSignature: string, btPayload: string): Promise<any> {
  return new Promise((resolve, reject) => {
    btGateway.webhookNotification.parse(btSignature, btPayload, 
      //@ts-ignore
      (err, webhookNotification) => {
      if (err) return reject(err);
      // Additional processing (e.g. file logging) can be done here.
      resolve(webhookNotification);
    });
  });
}

export const braintreeRoutes: Routes = {
  "/client-token": {
    GET: async (request, response, cfg) => {
      try {
        const token = await generateClientToken();
        setHeaders(response, 200);
        response.end(JSON.stringify({ clientToken: token }));
      } catch (err: any) {
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
        const transaction = await findTransaction(transactionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ transaction }));
      } catch (err: any) {
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
        const transactionId = await processCheckout(customerId, amount);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, transactionId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Checkout failed' }));
      }
    }
  },

  "/create-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { firstName, lastName, email, paymentMethodNonce } = JSON.parse(body);
        const customerId = await createCustomer({ firstName, lastName, email, paymentMethodNonce });
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, customerId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create customer' }));
      }
    }
  },

  "/get-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId } = JSON.parse(body);
        const customer = await getCustomer(customerId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ customer }));
      } catch (err: any) {
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
        await updateCustomer({ customerId, firstName, lastName, email, address, city, state, zip, country });
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to update customer' }));
      }
    }
  },

  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const subMerchantAccountId = await createSubmerchant(data);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, subMerchantAccountId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create submerchant' }));
      }
    }
  },

  "/split-transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { subMerchantAccountId, amount, nonce, customerId } = JSON.parse(body);
        const result = await splitTransaction({ subMerchantAccountId, amount, nonce, customerId });
        setHeaders(response, 200);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to process split transaction' }));
      }
    }
  },

  "/transactions": {
    GET: async (request, response, cfg) => {
      try {
        const transactions = await getTransactions();
        setHeaders(response, 200);
        response.end(JSON.stringify({ transactions }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch transactions' }));
      }
    }
  },

  "/customers": {
    GET: async (request, response, cfg) => {
      try {
        const customers = await getAllCustomers();
        setHeaders(response, 200);
        response.end(JSON.stringify({ customers }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch customers' }));
      }
    }
  },

  "/get-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { merchantAccountId } = JSON.parse(body);
        const subMerchant = await getSubmerchant(merchantAccountId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ subMerchant }));
      } catch (err: any) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Submerchant not found' }));
      }
    }
  },

  "/submerchants": {
    GET: async (request, response, cfg) => {
      try {
        const submerchants = await getSubmerchantsFromFile();
        setHeaders(response, 200);
        response.end(JSON.stringify({ submerchants }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to fetch submerchants' }));
      }
    }
  },

  "/webhook": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const parsedBody = querystring.parse(body);
        const btSignature = parsedBody.bt_signature as string;
        const btPayload = parsedBody.bt_payload as string;
        const webhookNotification = await processWebhook(btSignature, btPayload);

        // Example of additional handling based on webhook kind.
        switch (webhookNotification.kind) {
          //@ts-ignore
          case braintree.WebhookNotification.Kind.SubMerchantAccountApproved:
            fs.appendFile('approved_submerchants.txt', webhookNotification.merchantAccount.id + "\n", (err) => {
              if (err) console.error('Error writing approved submerchant:', err);
            });
            break;
            //@ts-ignore
          case braintree.WebhookNotification.Kind.TransactionSettled:
            //@ts-ignore
          case braintree.WebhookNotification.Kind.TransactionDisbursed:
            fs.appendFile('successful_transactions.txt', webhookNotification.transaction.id + "\n", (err) => {
              if (err) console.error('Error writing successful transaction:', err);
            });
            break;
            //@ts-ignore
          case braintree.WebhookNotification.Kind.TransactionSettlementDeclined:
            fs.appendFile('declined_transactions.txt', webhookNotification.transaction.id + "\n", (err) => {
              if (err) console.error('Error writing declined transaction:', err);
            });
            break;
          default:
            console.log('Received webhook notification of kind:', webhookNotification.kind);
        }

        setHeaders(response, 200);
        response.end(JSON.stringify({ received: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: 'Failed to process webhook' }));
      }
    }
  }
};