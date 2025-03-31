import fs from 'fs';
import querystring from 'querystring';
import braintree from 'braintree';
import { getRequestBody, Routes, setHeaders } from './util';
import { 
  AddressResponse, DisputeResponse, CustomerResponse, TransactionResponse,
  SubscriptionResponse, DiscountResponse, CreditCardResponse, VenmoAccountResponse, 
  UsBankAccountResponse, MerchantAccountResponse, SepaDebitAccountResponse, VisaCheckoutCardResponse,
  UsBankAccountVerificationResponse, ClientTokenRequest, CustomerCreateRequest,
  CreditCardCreateRequest, CreditCardVerificationRequest, SubMerchantAccountWebhookNotification
} from '../scripts/braintree_datastructures';

/**
 * # Braintree Payment System Integration Module
 *
 * This module integrates with Braintree to perform a variety of payment operations,
 * including generating client tokens, processing transactions, creating and updating
 * customers, handling split transactions, and managing subscriptions. It also defines
 * HTTP route handlers that map to these operations (using GET, POST, PUT, DELETE as needed).
 *
 * ## Overview of Operations and HTTP Methods:
 *
 * - **GET Operations:**
 *   - `/client-token` (GET): Returns a newly generated client token.
 *   - `/transactions` (GET): Retrieves all transactions (filtered by creation date).
 *   - `/customers` (GET): Retrieves all customers.
 *
 * - **POST Operations:**
 *   - `/transaction` (POST): Retrieves a specific transaction (by passing transactionId).
 *   - `/checkout` (POST): Processes a sale transaction (checkout) for a customer.
 *   - `/create-customer` (POST): Creates a new customer using the provided data.
 *   - `/get-customer` (POST): Retrieves a customer by customerId.
 *   - `/update-customer` (POST): Updates customer details.
 *   - `/create-submerchant` (POST): Creates a submerchant account.
 *   - `/split-transaction` (POST): Processes a split transaction.
 *   - `/get-submerchant` (POST): Retrieves a submerchant account by merchantAccountId.
 *   - `/webhook` (POST): Processes webhook notifications from Braintree.
 *   - `/refund` (POST): Refunds a transaction.
 *   - `/void-transaction` (POST): Voids a transaction.
 *   - `/delete-customer` (POST): Deletes a customer.
 *   - `/create-payment-method` (POST): Creates a new payment method.
 *   - `/update-payment-method` (POST): Updates a payment method.
 *   - `/delete-payment-method` (POST): Deletes a payment method.
 *   - `/create-subscription` (POST): Creates a subscription for a customer.
 *   - `/cancel-subscription` (POST): Cancels an existing subscription.
 *   - `/get-subscription` (POST): Retrieves a subscription by its ID.
 *
 * - **PUT Operations:**  
 *   (Note: In this integration, update operations are handled with POST methods for simplicity,
 *    but conceptually these correspond to HTTP PUT for updating resources.)
 */

/* ===================================================================
   Braintree Gateway Setup
   ===================================================================
   Initializes the Braintree gateway using environment variables.
*/
export const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID!,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY!,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY!
});

/* ===================================================================
   Payment Operations
   =================================================================== */

/**
 * Generates and returns a client token.
 *
 * @returns A Promise resolving to a client token string.
 *
 * **HTTP Mapping:**  
 * GET `/client-token`
 */
export async function generateClientToken(): Promise<string> {
  const res = await btGateway.clientToken.generate({});
  return res.clientToken;
}

/**
 * Finds and returns a transaction by its transactionId.
 *
 * @param transactionId - The unique identifier for the transaction.
 * @returns A Promise resolving to a Transaction object that may be either
 * a braintree.Transaction or a TransactionResponse type.
 *
 * **HTTP Mapping:**  
 * POST `/transaction` (typically used to retrieve a transaction by ID)
 */
export async function findTransaction(transactionId: string): Promise<braintree.Transaction | TransactionResponse> {
  return await btGateway.transaction.find(transactionId);
}

/**
 * Processes a sale transaction (checkout) for a customer.
 *
 * @param customerId - The unique identifier of the customer.
 * @param amount - The transaction amount as a string.
 * @returns A Promise resolving to the transaction ID of the processed sale.
 *
 * **HTTP Mapping:**  
 * POST `/checkout`
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
 *
 * Uses the `CustomerCreateRequest` type for the input data.
 *
 * @param data - Customer creation details.
 * @returns A Promise resolving to the new customer's ID.
 *
 * **HTTP Mapping:**  
 * POST `/create-customer`
 */
export async function createCustomer(data: CustomerCreateRequest): Promise<string> {
  const result = await btGateway.customer.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    paymentMethodNonce: data.paymentMethodNonce,
    company: data.company,
    fax: data.fax,
    phone: data.phone,
    website: data.website,
    // Additional fields from CustomerCreateRequest may be included as needed.
  });
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.customer.id;
}

/**
 * Retrieves and returns a customer by its customerId.
 *
 * @param customerId - The unique identifier for the customer.
 * @returns A Promise resolving to a customer object, which may be either a
 * braintree.Customer or a CustomerResponse.
 *
 * **HTTP Mapping:**  
 * POST `/get-customer`
 */
export async function getCustomer(customerId: string): Promise<braintree.Customer | CustomerResponse> {
  return await btGateway.customer.find(customerId);
}

/**
 * Updates a customer's details.
 *
 * @param data - An object containing the customerId and any fields to update.
 * @returns A Promise that resolves when the update is successful.
 *
 * **HTTP Mapping:**  
 * POST `/update-customer` (conceptually a PUT operation)
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
 *
 * @param data - An object containing the `individual` and `funding` details.
 * @returns A Promise resolving to a MerchantAccount object, which may be either
 * a braintree.MerchantAccount or a MerchantAccountResponse.
 *
 * **HTTP Mapping:**  
 * POST `/create-submerchant`
 */
export async function createSubmerchant(data: {
  individual: any;
  funding: any;
}): Promise<braintree.MerchantAccount | MerchantAccountResponse> {
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
  return result.merchantAccount;
}

/**
 * Processes a split transaction and returns earnings details.
 *
 * @param params - Contains subMerchantAccountId, amount, and optionally nonce or customerId.
 * @returns A Promise resolving to an object with the transactionId, subMerchantEarnings,
 * and masterMerchantEarnings.
 *
 * **HTTP Mapping:**  
 * POST `/split-transaction`
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
 *
 * @returns A Promise resolving to an array of TransactionResponse objects.
 *
 * **HTTP Mapping:**  
 * GET `/transactions`
 */
export async function getTransactions(): Promise<TransactionResponse[]> {
  return new Promise<TransactionResponse[]>((resolve, reject) => {
    const result: TransactionResponse[] = [];
    btGateway.transaction.search(
      (search) => {
        search.createdAt().min(new Date(2000, 0, 1));
      },
      // @ts-ignore
      (err: any, collection: any) => {
        if (err) return reject(err);
        collection.each((err: any, transaction: TransactionResponse) => {
          if (err) return reject(err);
          result.push(transaction);
        }, () => resolve(result));
      }
    );
  });
}

/**
 * Retrieves all customers.
 *
 * @returns A Promise resolving to an array of CustomerResponse objects.
 *
 * **HTTP Mapping:**  
 * GET `/customers`
 */
export async function getAllCustomers(): Promise<CustomerResponse[]> {
  return new Promise<CustomerResponse[]>((resolve, reject) => {
    const result: CustomerResponse[] = [];
    btGateway.customer.search(
      (search) => {
        // No predicates—returns all customers.
      },
      // @ts-ignore
      (err: any, collection: any) => {
        if (err) return reject(err);
        collection.each((err: any, customer: CustomerResponse) => {
          if (err) return reject(err);
          result.push(customer);
        }, () => resolve(result));
      }
    );
  });
}

/**
 * Retrieves a submerchant account by its merchantAccountId.
 *
 * @param merchantAccountId - The unique identifier for the submerchant account.
 * @returns A Promise resolving to a MerchantAccount object.
 *
 * **HTTP Mapping:**  
 * POST `/get-submerchant`
 */
export async function getSubmerchant(merchantAccountId: string): Promise<braintree.MerchantAccount | MerchantAccountResponse> {
  return await btGateway.merchantAccount.find(merchantAccountId);
}

/**
 * Retrieves submerchant accounts by reading approved submerchant IDs from a file.
 *
 * @returns A Promise resolving to an array of MerchantAccount objects.
 *
 * **HTTP Mapping:**  
 * GET `/submerchants`
 */
export async function getSubmerchantsFromFile(): Promise<(braintree.MerchantAccount | MerchantAccountResponse)[]> {
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
        return { id, error: "Submerchant not found" } as unknown as (MerchantAccountResponse | braintree.MerchantAccount);
      }
    })
  );
  return submerchants;
}

/**
 * Processes a webhook notification from Braintree.
 *
 * @param btSignature - The Braintree signature provided in the webhook.
 * @param btPayload - The payload of the webhook notification.
 * @returns A Promise resolving to a SubMerchantAccountWebhookNotification or an error.
 *
 * **HTTP Mapping:**  
 * POST `/webhook`
 */
export async function processWebhook(btSignature: string, btPayload: string): Promise<SubMerchantAccountWebhookNotification | any> {
  return new Promise((resolve, reject) => {
    btGateway.webhookNotification.parse(btSignature, btPayload, 
      // @ts-ignore
      (err, webhookNotification) => {
      if (err) return reject(err);
      // Additional processing (e.g., logging to a file) can be done here.
      resolve(webhookNotification);
    });
  });
}

/* ===================================================================
   Additional Professional Operations
   =================================================================== */

/**
 * Refunds a transaction.
 *
 * @param transactionId - The transaction ID to refund.
 * @param amount - (Optional) The amount to refund.
 * @returns A Promise resolving to the refund transaction ID.
 *
 * **HTTP Mapping:**  
 * POST `/refund`
 */
export async function refundTransaction(transactionId: string, amount?: string): Promise<string> {
  const result = await btGateway.transaction.refund(transactionId, amount);
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.transaction.id;
}

/**
 * Voids a transaction.
 *
 * @param transactionId - The transaction ID to void.
 * @returns A Promise resolving to the voided transaction ID.
 *
 * **HTTP Mapping:**  
 * POST `/void-transaction`
 */
export async function voidTransaction(transactionId: string): Promise<string> {
  const result = await btGateway.transaction.void(transactionId);
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.transaction.id;
}

/**
 * Deletes a customer.
 *
 * @param customerId - The unique identifier for the customer.
 * @returns A Promise that resolves when the customer is deleted.
 *
 * **HTTP Mapping:**  
 * POST `/delete-customer`
 */
export async function deleteCustomer(customerId: string): Promise<void> {
  await btGateway.customer.delete(customerId);
}

/**
 * Creates a new payment method for a customer.
 *
 * @param data - An object containing customerId, paymentMethodNonce, and an optional makeDefault flag.
 * @returns A Promise resolving to the token for the new payment method.
 *
 * **HTTP Mapping:**  
 * POST `/create-payment-method`
 */
export async function createPaymentMethod(data: { customerId: string; paymentMethodNonce: string; makeDefault?: boolean }): Promise<string> {
  const result = await btGateway.paymentMethod.create({
    customerId: data.customerId,
    paymentMethodNonce: data.paymentMethodNonce,
    options: {
      makeDefault: data.makeDefault || false
    }
  });
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.paymentMethod.token;
}

/**
 * Updates a payment method.
 *
 * @param token - The token identifying the payment method.
 * @param data - An object containing fields to update (e.g., cardholderName, expirationDate).
 * @returns A Promise that resolves when the update is complete.
 *
 * **HTTP Mapping:**  
 * POST `/update-payment-method`
 */
export async function updatePaymentMethod(token: string, data: { cardholderName?: string; expirationDate?: string }): Promise<void> {
  const result = await btGateway.paymentMethod.update(token, data);
  if (!result.success) {
    throw new Error(result.message);
  }
}

/**
 * Deletes a payment method.
 *
 * @param token - The token identifying the payment method.
 * @returns A Promise that resolves when the payment method is deleted.
 *
 * **HTTP Mapping:**  
 * POST `/delete-payment-method`
 */
export async function deletePaymentMethod(token: string): Promise<void> {
  const result = await btGateway.paymentMethod.delete(token);
  return result;
}

/**
 * Creates a subscription for a customer.
 *
 * @param data - An object containing paymentMethodToken, planId, and an optional price.
 * @returns A Promise resolving to the new subscription's ID.
 *
 * **HTTP Mapping:**  
 * POST `/create-subscription`
 */
export async function createSubscription(data: { paymentMethodToken: string; planId: string; price?: string }): Promise<string> {
  const request: braintree.SubscriptionRequest = {
    paymentMethodToken: data.paymentMethodToken,
    planId: data.planId,
  };
  if (data.price) {
    request.price = data.price;
  }
  const result = await btGateway.subscription.create(request);
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.subscription.id;
}

/**
 * Cancels a subscription.
 *
 * @param subscriptionId - The subscription ID to cancel.
 * @returns A Promise that resolves when the subscription is cancelled.
 *
 * **HTTP Mapping:**  
 * POST `/cancel-subscription`
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const result = await btGateway.subscription.cancel(subscriptionId);
  return result;
}

/**
 * Retrieves a subscription.
 *
 * @param subscriptionId - The unique identifier for the subscription.
 * @returns A Promise resolving to the subscription object, which may be either a
 * braintree.Subscription or a SubscriptionResponse.
 *
 * **HTTP Mapping:**  
 * POST `/get-subscription`
 */
export async function getSubscription(subscriptionId: string): Promise<braintree.Subscription | SubscriptionResponse> {
  return await btGateway.subscription.find(subscriptionId);
}

/* ===================================================================
   HTTP Route Handlers
   ===================================================================
   The following routes expose the above operations via HTTP endpoints.
   Each endpoint maps to a specific CRUD operation using GET, POST, PUT, or DELETE.
*/
export const braintreeRoutes: Routes = {
  /**
   * GET /client-token  
   * Returns a generated client token for Braintree operations.
   */
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

  /**
   * POST /transaction  
   * Retrieves a transaction by its transactionId.
   */
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

  /**
   * POST /checkout  
   * Processes a sale transaction (checkout) for a customer.
   */
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

  /**
   * POST /create-customer  
   * Creates a new customer using provided data.
   */
  "/create-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data: CustomerCreateRequest = JSON.parse(body);
        const customerId = await createCustomer(data);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, customerId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create customer' }));
      }
    }
  },

  /**
   * POST /get-customer  
   * Retrieves a customer by customerId.
   */
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

  /**
   * POST /update-customer  
   * Updates customer details.
   */
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

  /**
   * POST /create-submerchant  
   * Creates a new submerchant account.
   */
  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const subMerchantAccount = await createSubmerchant(data);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, subMerchantAccount }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create submerchant' }));
      }
    }
  },

  /**
   * POST /split-transaction  
   * Processes a split transaction and returns earnings details.
   */
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

  /**
   * GET /transactions  
   * Retrieves all transactions.
   */
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

  /**
   * GET /customers  
   * Retrieves all customers.
   */
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

  /**
   * POST /get-submerchant  
   * Retrieves a submerchant account by merchantAccountId.
   */
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

  /**
   * GET /submerchants  
   * Retrieves all approved submerchant accounts from a file.
   */
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

  /**
   * POST /webhook  
   * Processes incoming webhook notifications from Braintree.
   */
  "/webhook": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const parsedBody = querystring.parse(body);
        const btSignature = parsedBody.bt_signature as string;
        const btPayload = parsedBody.bt_payload as string;
        const webhookNotification = await processWebhook(btSignature, btPayload);

        // Additional handling based on webhook kind:
        switch (webhookNotification.kind) {
          // @ts-ignore
          case braintree.WebhookNotification.Kind.SubMerchantAccountApproved:
            fs.appendFile('approved_submerchants.txt', webhookNotification.merchantAccount.id + "\n", (err) => {
              if (err) console.error('Error writing approved submerchant:', err);
            });
            break;
          // @ts-ignore
          case braintree.WebhookNotification.Kind.TransactionSettled:
          // @ts-ignore
          case braintree.WebhookNotification.Kind.TransactionDisbursed:
            fs.appendFile('successful_transactions.txt', webhookNotification.transaction.id + "\n", (err) => {
              if (err) console.error('Error writing successful transaction:', err);
            });
            break;
          // @ts-ignore
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
  },

  /**
   * POST /refund  
   * Refunds a transaction.
   */
  "/refund": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { transactionId, amount } = JSON.parse(body);
        const refundId = await refundTransaction(transactionId, amount);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, refundId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Refund failed' }));
      }
    }
  },

  /**
   * POST /void-transaction  
   * Voids a transaction.
   */
  "/void-transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { transactionId } = JSON.parse(body);
        const voidId = await voidTransaction(transactionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, voidId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Void transaction failed' }));
      }
    }
  },

  /**
   * POST /delete-customer  
   * Deletes a customer.
   */
  "/delete-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId } = JSON.parse(body);
        await deleteCustomer(customerId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to delete customer' }));
      }
    }
  },

  /**
   * POST /create-payment-method  
   * Creates a new payment method for a customer.
   */
  "/create-payment-method": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, paymentMethodNonce, makeDefault } = JSON.parse(body);
        const token = await createPaymentMethod({ customerId, paymentMethodNonce, makeDefault });
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, token }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create payment method' }));
      }
    }
  },

  /**
   * POST /update-payment-method  
   * Updates a payment method.
   */
  "/update-payment-method": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { token, cardholderName, expirationDate } = JSON.parse(body);
        await updatePaymentMethod(token, { cardholderName, expirationDate });
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to update payment method' }));
      }
    }
  },

  /**
   * POST /delete-payment-method  
   * Deletes a payment method.
   */
  "/delete-payment-method": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { token } = JSON.parse(body);
        await deletePaymentMethod(token);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to delete payment method' }));
      }
    }
  },

  /**
   * POST /create-subscription  
   * Creates a subscription for a customer.
   */
  "/create-subscription": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { paymentMethodToken, planId, price } = JSON.parse(body);
        const subscriptionId = await createSubscription({ paymentMethodToken, planId, price });
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, subscriptionId }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to create subscription' }));
      }
    }
  },

  /**
   * POST /cancel-subscription  
   * Cancels a subscription.
   */
  "/cancel-subscription": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { subscriptionId } = JSON.parse(body);
        await cancelSubscription(subscriptionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message || 'Failed to cancel subscription' }));
      }
    }
  },

  /**
   * POST /get-subscription  
   * Retrieves a subscription by its ID.
   */
  "/get-subscription": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { subscriptionId } = JSON.parse(body);
        const subscription = await getSubscription(subscriptionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ subscription }));
      } catch (err: any) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: 'Subscription not found' }));
      }
    }
  }
};
