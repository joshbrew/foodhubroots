import fs from 'fs';
import querystring from 'querystring';
import braintree from 'braintree';
import { Context, getRequestBody, Routes } from './util';
import { parse } from 'url';
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


/** Street address details */
export interface AddressInput {
  streetAddress: string;
  locality:      string;
  region:        string;
  postalCode:    string;
}

/** Individual (owner) details */
export interface IndividualInput {
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  dateOfBirth: string;  // YYYY-MM-DD
  ssn:         string;  // last-4 or full
  address:     AddressInput;
}

/** Business (DBA) details */
export interface BusinessInput {
  legalName: string;
  dbaName:   string;
  taxId:     string;
  address:   AddressInput;
}

/** Funding instructions for payouts */
export interface FundingInput {
  descriptor:    string;
  destination:   "bank" | "mobile"; 
  email:         string;
  mobilePhone:   string;
  accountNumber: string;
  routingNumber: string;
}

/** Full request shape for creating a sub-merchant */
export interface SubmerchantCreateRequest {
  /** Optional override for the merchant account ID */
  id?: string;
  individual:               IndividualInput;
  business?:                BusinessInput;
  funding:                  FundingInput;
  tosAccepted:              boolean;
  /** If omitted, pulled from process.env.BRAINTREE_MASTER_MERCHANT_ID */
  masterMerchantAccountId?: string;
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

export async function createSubmerchant(
  data: SubmerchantCreateRequest
): Promise<braintree.MerchantAccount | MerchantAccountResponse> {
  const request: braintree.MerchantAccountCreateRequest = {
    individual: {
      firstName:    data.individual.firstName,
      lastName:     data.individual.lastName,
      email:        data.individual.email,
      phone:        data.individual.phone,
      dateOfBirth:  data.individual.dateOfBirth,
      ssn:          data.individual.ssn,
      address:      {
        streetAddress: data.individual.address.streetAddress,
        locality:      data.individual.address.locality,
        region:        data.individual.address.region,
        postalCode:    data.individual.address.postalCode,
      }
    },
    funding: {
      descriptor:    data.funding.descriptor,
      destination:   data.funding.destination,
      email:         data.funding.email,
      mobilePhone:   data.funding.mobilePhone,
      accountNumber: data.funding.accountNumber,
      routingNumber: data.funding.routingNumber,
    },
    tosAccepted: data.tosAccepted,
    masterMerchantAccountId:
      data.masterMerchantAccountId ||
      process.env.BRAINTREE_MASTER_MERCHANT_ID!,

    // optional overrides:
    ...(data.id ? { id: data.id } : {}),
    ...(data.business
      ? {
          business: {
            legalName: data.business.legalName,
            dbaName:   data.business.dbaName,
            taxId:     data.business.taxId,
            address:   {
              streetAddress: data.business.address.streetAddress,
              locality:      data.business.address.locality,
              region:        data.business.address.region,
              postalCode:    data.business.address.postalCode,
            }
          }
        }
      : {}),
  };

  const result = await btGateway.merchantAccount.create(request);
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


import { Readable } from "stream";

export interface TransactionQuery {
  startDate?: string;         // ISO date string
  endDate?: string;           // ISO date string
  status?: keyof typeof braintree.Transaction.Status;
  customerId?: string;
}

export async function getTransactions(
  filters: TransactionQuery = {}
): Promise<TransactionResponse[]> {
  const transactions: TransactionResponse[] = [];

  // start a stream of matching TransactionResponse
  const stream: Readable = btGateway.transaction.search((search) => {
    // if user passed absolutely no filters, default to “created before now”
    if (
      !filters.startDate &&
      !filters.endDate &&
      !filters.status &&
      !filters.customerId
    ) {
      search.createdAt().max(new Date());
    }

    if (filters.startDate) {
      search.createdAt().min(new Date(filters.startDate));
    }
    if (filters.endDate) {
      search.createdAt().max(new Date(filters.endDate));
    }
    if (filters.status) {
      search
        .status()
        .is(braintree.Transaction.Status[filters.status] as any);
    }
    if (filters.customerId) {
      search.customerId().is(filters.customerId);
    }
  });

  return new Promise<TransactionResponse[]>((resolve, reject) => {
    stream.on("data", (txn: TransactionResponse) => transactions.push(txn));
    stream.on("end", () => resolve(transactions));
    stream.on("error", (err) => reject(err));
  });
}

export interface CustomerQuery {
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export async function getAllCustomers(
  filters: CustomerQuery = {}
): Promise<CustomerResponse[]> {
  const customers: CustomerResponse[] = [];

  // start a stream of matching CustomerResponse
  const stream: Readable = btGateway.customer.search((search) => {
    // default to “created before now” if no filters at all
    if (
      !filters.email &&
      !filters.firstName &&
      !filters.lastName &&
      !filters.createdAfter &&
      !filters.createdBefore
    ) {
      search.createdAt().max(new Date());
    }

    if (filters.email) {
      search.email().is(filters.email);
    }
    if (filters.firstName) {
      search.firstName().startsWith(filters.firstName);
    }
    if (filters.lastName) {
      search.lastName().startsWith(filters.lastName);
    }
    if (filters.createdAfter) {
      search.createdAt().min(new Date(filters.createdAfter));
    }
    if (filters.createdBefore) {
      search.createdAt().max(new Date(filters.createdBefore));
    }
  });

  return new Promise<CustomerResponse[]>((resolve, reject) => {
    stream.on("data", (cust: CustomerResponse) => customers.push(cust));
    stream.on("end", () => resolve(customers));
    stream.on("error", (err) => reject(err));
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
    btGateway.webhookNotification.parse(btSignature, btPayload)
    .then(resolve)
    .catch(reject);
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


/**
 * Retrieves the configured master merchant account.
 *
 * Uses the `BRAINTREE_MERCHANT_ID` env var.
 *
 * @returns Promise resolving to the master braintree.MerchantAccount
 */
export async function getMasterMerchantAccount(): Promise<
  braintree.MerchantAccount | MerchantAccountResponse
> {
  const masterId = process.env.BRAINTREE_MERCHANT_USERNAME!;
  const merchantAcct = await btGateway.merchantAccount.find(masterId);
  return merchantAcct;
}

/* ===================================================================
   HTTP Route Handlers
   ===================================================================
   The following routes expose the above operations via HTTP endpoints.
   Each endpoint maps to a specific CRUD operation using GET, POST, PUT, or DELETE.
*/
export const braintreeRoutes: Routes = {
  /* ─────────────  CLIENT TOKEN  ───────────── */
  "/client-token": {
    GET: async (ctx: Context) => {
      try {
        const token = await generateClientToken();
        await ctx.json(200, { clientToken: token });
      } catch {
        await ctx.json(500, { error: "Failed to generate client token" });
      }
    }
  },


  "/transactions": {
    GET: async (ctx: Context) => {
      try {
        const { query } = parse(ctx.req.url || '', true);
        // parse all string params straight off the URL:
        const filters: TransactionQuery = {
          startDate: typeof query.startDate === 'string' ? query.startDate : undefined,
          endDate: typeof query.endDate === 'string' ? query.endDate : undefined,
          status: typeof query.status === 'string' ? query.status : undefined as any,
          customerId: typeof query.customerId === 'string' ? query.customerId : undefined
        };
        const transactions = await getTransactions(filters);
        console.log("TRANSACTION QUERY:", transactions);
        await ctx.json(200, { transactions });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || 'Failed to fetch transactions' });
      }
    }
  },

  "/customers": {
    GET: async (ctx: Context) => {
      console.log("CALLED /customers")
      try {
        const { query } = parse(ctx.req.url || '', true);
        const filters: CustomerQuery = {
          email: typeof query.email === 'string' ? query.email : undefined,
          firstName: typeof query.firstName === 'string' ? query.firstName : undefined,
          lastName: typeof query.lastName === 'string' ? query.lastName : undefined,
          createdAfter: typeof query.createdAfter === 'string' ? query.createdAfter : undefined,
          createdBefore: typeof query.createdBefore === 'string' ? query.createdBefore : undefined
        };
        const customers = await getAllCustomers(filters);
        console.log("CUSTOMER QUERY:", customers);
        await ctx.json(200, { customers });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || 'Failed to fetch customers' });
      }
    }
  },

  /* ─────────────  TRANSACTION LOOK-UP  ───────────── */
  "/transaction": {
    POST: async (ctx: Context) => {
      try {
        const { transactionId } = await ctx.body();
        const transaction = await findTransaction(transactionId);
        await ctx.json(200, { transaction });
      } catch {
        await ctx.json(404, { error: "Transaction not found" });
      }
    }
  },

  /* ─────────────  CHECKOUT  ───────────── */
  "/checkout": {
    POST: async (ctx: Context) => {
      try {
        const { customerId, amount } = await ctx.body();
        const transactionId = await processCheckout(customerId, amount);
        await ctx.json(200, { success: true, transactionId });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Checkout failed" });
      }
    }
  },

  /* ─────────────  CUSTOMER CRUD  ───────────── */
  "/create-customer": {
    POST: async (ctx: Context) => {
      try {
        const data = await ctx.body();          // CustomerCreateRequest shape
        const customerId = await createCustomer(data);
        await ctx.json(200, { success: true, customerId });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to create customer" });
      }
    }
  },

  "/get-customer": {
    POST: async (ctx: Context) => {
      try {
        const { customerId } = await ctx.body();
        const customer = await getCustomer(customerId);
        await ctx.json(200, { customer });
      } catch {
        await ctx.json(404, { error: "Customer not found" });
      }
    }
  },

  "/update-customer": {
    POST: async (ctx: Context) => {
      try {
        const {
          customerId, firstName, lastName, email,
          address, city, state, zip, country
        } = await ctx.body();
        await updateCustomer({ customerId, firstName, lastName, email, address, city, state, zip, country });
        await ctx.json(200, { success: true });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to update customer" });
      }
    }
  },

  "/delete-customer": {
    POST: async (ctx: Context) => {
      try {
        const { customerId } = await ctx.body();
        await deleteCustomer(customerId);
        await ctx.json(200, { success: true });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to delete customer" });
      }
    }
  },

  /* ─────────────  SUB-MERCHANTS  ───────────── */
  "/create-submerchant": {
    POST: async (ctx: Context) => {
      try {
        const data = await ctx.body();
        const subMerchantAccount = await createSubmerchant(data);
        await ctx.json(200, { success: true, subMerchantAccount });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to create submerchant" });
      }
    }
  },

  /* ─────────────  MASTER MERCHANT INFO  ───────────── */
  "/master-merchant": {
    GET: async (ctx: Context) => {
      try {
        const account = await getMasterMerchantAccount();
        await ctx.json(200, { account });
      } catch (err: any) {
        await ctx.json(500, {
          error: err.message || "Failed to fetch master merchant account"
        });
      }
    }
  },

  "/get-submerchant": {
    POST: async (ctx: Context) => {
      try {
        const { merchantAccountId } = await ctx.body();
        const subMerchant = await getSubmerchant(merchantAccountId);
        await ctx.json(200, { subMerchant });
      } catch {
        await ctx.json(404, { error: "Submerchant not found" });
      }
    }
  },

  "/submerchants": {
    GET: async (ctx: Context) => {
      try {
        const submerchants = await getSubmerchantsFromFile();
        await ctx.json(200, { submerchants });
      } catch {
        await ctx.json(500, { error: "Failed to fetch submerchants" });
      }
    }
  },

  /* ─────────────  SPLIT-PAYMENT / TRANSACTIONS  ───────────── */
  "/split-transaction": {
    POST: async (ctx: Context) => {
      try {
        const { subMerchantAccountId, amount, nonce, customerId } = await ctx.body();
        const result = await splitTransaction({ subMerchantAccountId, amount, nonce, customerId });
        await ctx.json(200, result);
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to process split transaction" });
      }
    }
  },

  /* ─────────────  REFUND / VOID  ───────────── */
  "/refund": {
    POST: async (ctx: Context) => {
      try {
        const { transactionId, amount } = await ctx.body();
        const refundId = await refundTransaction(transactionId, amount);
        await ctx.json(200, { success: true, refundId });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Refund failed" });
      }
    }
  },

  "/void-transaction": {
    POST: async (ctx: Context) => {
      try {
        const { transactionId } = await ctx.body();
        const voidId = await voidTransaction(transactionId);
        await ctx.json(200, { success: true, voidId });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Void transaction failed" });
      }
    }
  },

  /* ─────────────  PAYMENT METHODS  ───────────── */
  "/create-payment-method": {
    POST: async (ctx: Context) => {
      try {
        const { customerId, paymentMethodNonce, makeDefault } = await ctx.body();
        const token = await createPaymentMethod({ customerId, paymentMethodNonce, makeDefault });
        await ctx.json(200, { success: true, token });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to create payment method" });
      }
    }
  },

  "/update-payment-method": {
    POST: async (ctx: Context) => {
      try {
        const { token, cardholderName, expirationDate } = await ctx.body();
        await updatePaymentMethod(token, { cardholderName, expirationDate });
        await ctx.json(200, { success: true });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to update payment method" });
      }
    }
  },

  "/delete-payment-method": {
    POST: async (ctx: Context) => {
      try {
        const { token } = await ctx.body();
        await deletePaymentMethod(token);
        await ctx.json(200, { success: true });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to delete payment method" });
      }
    }
  },

  /* ─────────────  SUBSCRIPTIONS  ───────────── */
  "/create-subscription": {
    POST: async (ctx: Context) => {
      try {
        const { paymentMethodToken, planId, price } = await ctx.body();
        const subscriptionId = await createSubscription({ paymentMethodToken, planId, price });
        await ctx.json(200, { success: true, subscriptionId });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to create subscription" });
      }
    }
  },

  "/cancel-subscription": {
    POST: async (ctx: Context) => {
      try {
        const { subscriptionId } = await ctx.body();
        await cancelSubscription(subscriptionId);
        await ctx.json(200, { success: true });
      } catch (err: any) {
        await ctx.json(500, { error: err.message || "Failed to cancel subscription" });
      }
    }
  },

  "/get-subscription": {
    POST: async (ctx: Context) => {
      try {
        const { subscriptionId } = await ctx.body();
        const subscription = await getSubscription(subscriptionId);
        await ctx.json(200, { subscription });
      } catch {
        await ctx.json(404, { error: "Subscription not found" });
      }
    }
  },

  /* ─────────────  BRAINTREE WEBHOOK  ───────────── */
  "/webhook": {
    POST: async (ctx: Context) => {
      try {
        // Braintree sends URL-encoded payload, so read raw:
        const raw = await getRequestBody(ctx.req);
        const parsed = querystring.parse(raw);
        const btSignature = parsed.bt_signature as string;
        const btPayload = parsed.bt_payload as string;
        const webhookNotification = await processWebhook(btSignature, btPayload);

        // handle certain webhook kinds
        switch (webhookNotification.kind) {
          // @ts-ignore -- depends on braintree types version
          case braintree.WebhookNotification.Kind.SubMerchantAccountApproved:
            fs.appendFileSync("approved_submerchants.txt", webhookNotification.merchantAccount.id + "\n");
            break;
          // @ts-ignore
          case braintree.WebhookNotification.Kind.TransactionSettled:
          // @ts-ignore
          case braintree.WebhookNotification.Kind.TransactionDisbursed:
            fs.appendFileSync("successful_transactions.txt", webhookNotification.transaction.id + "\n");
            break;
          // @ts-ignore
          case braintree.WebhookNotification.Kind.TransactionSettlementDeclined:
            fs.appendFileSync("declined_transactions.txt", webhookNotification.transaction.id + "\n");
            break;
          default:
            console.log("Received webhook notification of kind:", webhookNotification.kind);
        }

        await ctx.json(200, { received: true });
      } catch {
        await ctx.json(500, { error: "Failed to process webhook" });
      }
    }
  }
};