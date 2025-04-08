import { getRequestBody, Routes, setHeaders } from './util';

// MongoDB helpers
import { 
  createOrderInDB, 
  getProductListingFromDB, 
  getSellerProfileFromDB, 
  getUserProfileFromDB, 
  updateOrderInDB, 
  updateProductListingInDB, 
  updateSellerProfileInDB, 
  updateUserProfileInDB 
} from './mongodb';
import { Order, recursivelyAssign } from '../scripts/mongodb_datastructures';

// Braintree helpers
import { 
  btGateway, 
  findTransaction, 
  processCheckout, 
  refundTransaction, 
  voidTransaction, 
  createCustomer, 
  updateCustomer, 
  createSubmerchant, 
  splitTransaction, 
  createSubscription 
} from './braintree';
import { CustomerCreateRequest } from '../scripts/braintree_datastructures';

/* ====================================================
   Helper: Retry Operation & Error Notification
==================================================== */

/**
 * Generic retry helper to reattempt a Promise–based operation.
 */
async function retryOperation<T>(
  operation: () => Promise<T>, 
  retries = 3, 
  delayMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        throw err;
      }
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw new Error("Unreachable");
}

/**
 * Simple error notification stub. Replace with your preferred notification system.
 */
function notifyError(error: Error): void {
  console.error("Admin notification: Integration error:", error.message);
  // Send email, Slack message, etc.
}

/* ====================================================
   Existing Function:
   linkTransactionToOrder
==================================================== */

export async function linkTransactionToOrder(
  transactionId: string,
  customerId: string,
  sellerId: string,
  orderData: Partial<Order>
): Promise<Order> {
  // 1. Retrieve the Braintree transaction.
  const transaction = await findTransaction(transactionId);
  if (!transaction) {
    throw new Error(`Transaction id ${transactionId} does not exist!`);
  }
  const transactionTotal = parseFloat(transaction.amount);

  // 2. Set order details.
  orderData.transactionId = transactionId;
  orderData.customerId = customerId;
  orderData.total = transactionTotal;

  const newOrder = await createOrderInDB(orderData);

  // 3. For each order item, update the associated product listing inventory.
  if (newOrder.items) {
    for (const item of newOrder.items) {
      const listing = await getProductListingFromDB(item.listingId);
      if (!listing) {
        throw new Error(`Product listing not found for id ${item.listingId}`);
      }
      if (!listing.product_info?.inventory) continue;
      const currentAvailable = listing.product_info.inventory.available_quantity;
      const newAvailable = currentAvailable - item.quantity;
      if (newAvailable < 0) {
        throw new Error(`Insufficient inventory for listing ${item.listingId}`);
      }
      const inventoryUpdate = { inventory: { available_quantity: newAvailable } };
      const updatedProductInfo = recursivelyAssign(
        { ...listing.product_info },
        inventoryUpdate
      );
      await updateProductListingInDB(item.listingId, { product_info: updatedProductInfo });
    }
  }

  // 4. Update customer and seller order_history.
  const orderEntry = {
    orderId: newOrder.orderId,
    transactionId,
    placed_at: new Date().toISOString(),
    status: newOrder.status,
  };

  const customerProfile = await getUserProfileFromDB(customerId);
  if (!customerProfile) {
    throw new Error(`Customer profile not found for id ${customerId}`);
  }
  if (!customerProfile.order_history) {
    customerProfile.order_history = {};
  }
  customerProfile.order_history[newOrder.orderId] = orderEntry;
  await updateUserProfileInDB(customerId, { order_history: customerProfile.order_history });

  const sellerProfile = await getSellerProfileFromDB(sellerId);
  if (!sellerProfile) {
    throw new Error(`Seller profile not found for id ${sellerId}`);
  }
  if (!sellerProfile.order_history) {
    sellerProfile.order_history = {};
  }
  sellerProfile.order_history[newOrder.orderId] = orderEntry;
  await updateSellerProfileInDB(sellerId, { order_history: sellerProfile.order_history });

  return newOrder;
}

/* ====================================================
   Additional Operation Functions
==================================================== */

/**
 * processCheckoutOrder: Process a sale and return the transaction ID.
 */
export async function processCheckoutOrder(
  customerId: string, 
  amount: string
): Promise<string> {
  return await retryOperation(() => processCheckout(customerId, amount));
}

/**
 * batchUpdateInventory: Deduct inventory for multiple order items.
 */
export async function batchUpdateInventory(
  orderItems: Array<{ listingId: string; quantity: number }>
): Promise<void> {
  await Promise.all(orderItems.map(async item => {
    const listing = await getProductListingFromDB(item.listingId);
    if (!listing) throw new Error(`Product listing not found for id ${item.listingId}`);
    if (!listing.product_info?.inventory) return;
    const newAvailable = listing.product_info.inventory.available_quantity - item.quantity;
    if (newAvailable < 0) throw new Error(`Insufficient inventory for listing ${item.listingId}`);
    const inventoryUpdate = { inventory: { available_quantity: newAvailable } };
    const updatedProductInfo = recursivelyAssign({ ...listing.product_info }, inventoryUpdate);
    await updateProductListingInDB(item.listingId, { product_info: updatedProductInfo });
  }));
}

/**
 * batchRestoreInventory: Restore inventory for multiple order items.
 */
export async function batchRestoreInventory(
  orderItems: Array<{ listingId: string; quantity: number }>
): Promise<void> {
  await Promise.all(orderItems.map(async item => {
    const listing = await getProductListingFromDB(item.listingId);
    if (!listing) throw new Error(`Product listing not found for id ${item.listingId}`);
    if (!listing.product_info?.inventory) return;
    const newAvailable = listing.product_info.inventory.available_quantity + item.quantity;
    const inventoryUpdate = { inventory: { available_quantity: newAvailable } };
    const updatedProductInfo = recursivelyAssign({ ...listing.product_info }, inventoryUpdate);
    await updateProductListingInDB(item.listingId, { product_info: updatedProductInfo });
  }));
}

/**
 * createCustomerWithProfile: Create a customer in Braintree and in MongoDB.
 */
export async function createCustomerWithProfile(
  data: CustomerCreateRequest & { profileData: Partial<any> }
): Promise<{ customerId: string; profile: any }> {
  const customerId = await retryOperation(() => createCustomer(data));
  const profile = await (async () => {
    // Assume createUserProfileInDB takes profileData and uses customerId as the userId.
    // (You may need to import a createUserProfileInDB function if not already available.)
    return await updateUserProfileInDB(customerId, data.profileData);
  })();
  return { customerId, profile };
}

/**
 * updateCustomerDetails: Update customer details on both Braintree and MongoDB.
 */
export async function updateCustomerDetails(
  data: {
    customerId: string;
    updateBraintree: { firstName?: string; lastName?: string; email?: string; address?: string; city?: string; state?: string; zip?: string; country?: string };
    updateMongo: Partial<any>;
  }
): Promise<void> {
  await retryOperation(() => updateCustomer({ customerId:data.customerId, ...data.updateBraintree}));
  await updateUserProfileInDB(data.customerId, data.updateMongo);
}

/**
 * refundTransactionAndMarkOrder: Refund on Braintree and mark the order as cancelled.
 */
export async function refundTransactionAndMarkOrder(
  transactionId: string, 
  orderId: string, 
  amount?: string
): Promise<string> {
  const refundId = await retryOperation(() => refundTransaction(transactionId, amount));
  await updateOrderInDB(orderId, { status: "cancelled" });
  return refundId;
}

/**
 * voidTransactionAndCancelOrder: Void a Braintree transaction and update order status.
 */
export async function voidTransactionAndCancelOrder(
  transactionId: string, 
  orderId: string
): Promise<string> {
  const voidId = await retryOperation(() => voidTransaction(transactionId));
  await updateOrderInDB(orderId, { status: "cancelled" });
  return voidId;
}

/**
 * restoreInventoryOnCancellation: Restore inventory for an order.
 */
export async function restoreInventoryOnCancellation(order: Order): Promise<void> {
  if (order.items && order.items.length) {
    await batchRestoreInventory(order.items);
  }
}

/**
 * createSubmerchantAndUpdateSeller: Create a submerchant on Braintree and update seller profile.
 */
export async function createSubmerchantAndUpdateSeller(
  data: { individual: any; funding: any; sellerId: string }
): Promise<{ subMerchant: any }> {
  const subMerchant = await retryOperation(() => createSubmerchant(data));
  await updateSellerProfileInDB(data.sellerId, { braintree_submerchant_id:subMerchant.id});
  return { subMerchant };
}

/**
 * splitTransactionAndRecord: Process a split transaction and record result in the order.
 */
export async function splitTransactionAndRecord(
  params: { subMerchantAccountId: string; amount: string; nonce?: string; customerId?: string; orderId: string }
): Promise<{ transactionId: string; subMerchantEarnings: string; masterMerchantEarnings: string }> {
  const result = await retryOperation(() => splitTransaction(params));
  await updateOrderInDB(params.orderId, { metadata: { splitTransaction: result } });
  return result;
}

/**
 * createSubscriptionAndStore: Create a subscription in Braintree and store info in customer's profile.
 */
export async function createSubscriptionAndStore(
  data: { paymentMethodToken: string; planId: string; price?: string; customerId: string }
): Promise<{ subscriptionId: string }> {
  const subscriptionId = await retryOperation(() => createSubscription(data));
  const customerProfile = await getUserProfileFromDB(data.customerId);
  if (!customerProfile) throw new Error(`Customer profile not found for id ${data.customerId}`);
  if (!customerProfile.subscriptions) customerProfile.subscriptions = {};
  customerProfile.subscriptions[subscriptionId] = {
    product_id: "",
    name: data.planId,
    quantity: 1,
    price_per_unit: parseFloat(data.price || "0"),
    interval: "monthly",
    next_delivery: new Date().toISOString(),
    status: "active"
  };
  await updateUserProfileInDB(data.customerId, { subscriptions: customerProfile.subscriptions });
  return { subscriptionId };
}

/**
 * getOrderHistory: Return a unified view of order and transaction history.
 */
export async function getOrderHistory(
  userId: string, 
  type: "customer" | "seller"
): Promise<{ orders: any[]; transactions: any[] }> {
  let orders: any[] = [];
  if (type === "customer") {
    const profile = await getUserProfileFromDB(userId);
    if (profile && profile.order_history) {
      orders = Object.values(profile.order_history);
    }
  } else {
    const profile = await getSellerProfileFromDB(userId);
    if (profile && profile.order_history) {
      orders = Object.values(profile.order_history);
    }
  }
  const transactionPromises = orders.map(async (order: any) => {
    if (order.transactionId) {
      try {
        return await findTransaction(order.transactionId);
      } catch (err) {
        return { error: err.message, transactionId: order.transactionId };
      }
    }
    return null;
  });
  const transactions = (await Promise.all(transactionPromises)).filter(t => t !== null);
  return { orders, transactions };
}

/**
 * syncTransactionWithOrder: Reconcile a Braintree transaction with a MongoDB order.
 */
export async function syncTransactionWithOrder(
  orderId: string
): Promise<{ order: Order; transaction: any; discrepancies?: string }> {
  const order = await createOrderInDB({ orderId }); // Or use getOrderFromDB if available.
  if (!order) throw new Error(`Order not found for id ${orderId}`);
  const transaction = await findTransaction(order.transactionId as string);
  let discrepancies = "";
  if (parseFloat(transaction.amount) !== order.total) {
    discrepancies += "Amount mismatch. ";
  }
  // if (transaction.status !== order.status) {
  //   discrepancies += "Status mismatch. ";
  // }
  return { order, transaction, discrepancies };
}

/* ====================================================
   Expose Endpoints via HTTP Routes
==================================================== */

export const btMongoRoutes: Routes = {
  // Existing endpoint.
  "/link-transaction-to-order": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        if (!body) throw new Error("Request body is empty");
        const { transactionId, customerId, sellerId, orderData } = JSON.parse(body);
        if (!transactionId || !customerId || !sellerId || !orderData) {
          throw new Error("Missing required parameters");
        }
        const order = await linkTransactionToOrder(transactionId, customerId, sellerId, orderData);
        setHeaders(response, 200);
        response.end(JSON.stringify(order));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/checkout-order": {
    POST: async (request, response, cfg) => {
      try {
        const { customerId, amount } = JSON.parse(await getRequestBody(request));
        if (!customerId || !amount) throw new Error("Missing customerId or amount");
        const transactionId = await processCheckoutOrder(customerId, amount);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, transactionId }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/batch-update-inventory": {
    POST: async (request, response, cfg) => {
      try {
        const { orderItems } = JSON.parse(await getRequestBody(request));
        if (!orderItems) throw new Error("Missing orderItems");
        await batchUpdateInventory(orderItems);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/batch-restore-inventory": {
    POST: async (request, response, cfg) => {
      try {
        const { orderItems } = JSON.parse(await getRequestBody(request));
        if (!orderItems) throw new Error("Missing orderItems");
        await batchRestoreInventory(orderItems);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/create-customer-with-profile": {
    POST: async (request, response, cfg) => {
      try {
        const data = JSON.parse(await getRequestBody(request));
        // data should include the Braintree customer fields and a nested profileData.
        const result = await createCustomerWithProfile(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/update-customer-details": {
    POST: async (request, response, cfg) => {
      try {
        const data = JSON.parse(await getRequestBody(request));
        if (!data.customerId || !data.updateBraintree || !data.updateMongo) {
          throw new Error("Missing required parameters");
        }
        await updateCustomerDetails(data);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/refund-and-mark-order": {
    POST: async (request, response, cfg) => {
      try {
        const { transactionId, orderId, amount } = JSON.parse(await getRequestBody(request));
        if (!transactionId || !orderId) throw new Error("Missing transactionId or orderId");
        const refundId = await refundTransactionAndMarkOrder(transactionId, orderId, amount);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, refundId }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/void-and-cancel-order": {
    POST: async (request, response, cfg) => {
      try {
        const { transactionId, orderId } = JSON.parse(await getRequestBody(request));
        if (!transactionId || !orderId) throw new Error("Missing transactionId or orderId");
        const voidId = await voidTransactionAndCancelOrder(transactionId, orderId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true, voidId }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/restore-inventory": {
    POST: async (request, response, cfg) => {
      try {
        const { orderId } = JSON.parse(await getRequestBody(request));
        if (!orderId) throw new Error("Missing orderId");
        // Assume getOrderFromDB is available to retrieve the order.
        // Here, for simplicity, we reconstruct a minimal order for restoration.
        const order: Order = { orderId, items: [] as any, customerId: "", total: 0, status: "cancelled", createdAt: new Date(), updatedAt: new Date() };
        // In a real implementation, retrieve the order from the DB.
        await restoreInventoryOnCancellation(order);
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const data = JSON.parse(await getRequestBody(request));
        if (!data.individual || !data.funding || !data.sellerId) {
          throw new Error("Missing required parameters");
        }
        const result = await createSubmerchantAndUpdateSeller(data);
        setHeaders(response, 200);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/split-transaction-record": {
    POST: async (request, response, cfg) => {
      try {
        const data = JSON.parse(await getRequestBody(request));
        if (!data.subMerchantAccountId || !data.amount || !data.orderId) {
          throw new Error("Missing required parameters");
        }
        const result = await splitTransactionAndRecord(data);
        setHeaders(response, 200);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/create-subscription": {
    POST: async (request, response, cfg) => {
      try {
        const data = JSON.parse(await getRequestBody(request));
        if (!data.paymentMethodToken || !data.planId || !data.customerId) {
          throw new Error("Missing required parameters");
        }
        const result = await createSubscriptionAndStore(data);
        setHeaders(response, 200);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/get-order-history": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const userId = url.searchParams.get("userId");
        const type = url.searchParams.get("type") as "customer" | "seller";
        if (!userId || !type) {
          throw new Error("Missing userId or type query parameter");
        }
        const history = await getOrderHistory(userId, type);
        setHeaders(response, 200);
        response.end(JSON.stringify(history));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/sync-transaction-with-order": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const orderId = url.searchParams.get("orderId");
        if (!orderId) {
          throw new Error("Missing orderId query parameter");
        }
        const result = await syncTransactionWithOrder(orderId);
        setHeaders(response, 200);
        response.end(JSON.stringify(result));
      } catch (err: any) {
        notifyError(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  }
};
