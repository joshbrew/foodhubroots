
import { getRequestBody, Routes, setHeaders } from './util';

//CRUD client
import { btGateway, findTransaction } from './braintree';

//mongo client after init
import { createOrderInDB, getSellerProfileFromDB, getUserProfileFromDB, mongo, updateSellerProfileInDB, updateUserProfileInDB } from './mongodb';
import { Order } from '../scripts/data';

//need to have handles to connect mongodb and braintree calls, really should just be macros probably


/**
 * Links a Braintree transaction to a new Order record and updates
 * the corresponding customer and seller profiles.
 *
 * @param transactionId - The Braintree transaction ID.
 * @param customerId - The customer’s unique identifier.
 * @param sellerId - The seller’s unique identifier.
 * @param orderData - Partial order details to be stored in the DB.
 * @returns A Promise that resolves to the newly created Order.
 *
 * **Process:**
 * 1. Retrieve the Braintree transaction details.
 * 2. Create a new Order in the orders collection, embedding the transactionId.
 * 3. Retrieve and update the customer profile to include this order in their order_history.
 * 4. Retrieve and update the seller profile to include this order in their order_history.
 */
export async function linkTransactionToOrder(
    transactionId: string,
    customerId: string,
    sellerId: string,
    orderData: Partial<Order>
  ): Promise<Order> {
    // Retrieve the Braintree transaction (this could include additional details if needed)
    const transaction = await findTransaction(transactionId);
    
    if(!transaction) {
        throw new Error(`Transaction id ${transactionId} does not exist!`);
    }
    // Incorporate the transaction details into the order record.
    // Here we ensure the transactionId and customerId are set.
    orderData.transactionId = transactionId;
    orderData.customerId = customerId;
    // Additional order details (e.g., items, total, status) should be provided in orderData.
    
    // Create a new order in the database.
    const newOrder = await createOrderInDB(orderData);
    
    // Prepare an order entry to add to profiles.
    const orderEntry = {
      orderId: newOrder.orderId,
      transactionId: transactionId,
      placed_at: new Date().toISOString(),
      status: newOrder.status,
    };
  
    // --- Update the Customer Profile ---
    const customerProfile = await getUserProfileFromDB(customerId);
    if (!customerProfile) {
      throw new Error(`Customer profile not found for id ${customerId}`);
    }
    // Initialize the order_history if needed.
    if (!customerProfile.order_history) {
      customerProfile.order_history = {};
    }
    // Use the orderId as the key.
    customerProfile.order_history[newOrder.orderId] = orderEntry;
    // Update the customer profile in the DB.
    await updateUserProfileInDB(customerId, { order_history: customerProfile.order_history });
    
    // --- Update the Seller Profile ---
    const sellerProfile = await getSellerProfileFromDB(sellerId);
    if (!sellerProfile) {
      throw new Error(`Seller profile not found for id ${sellerId}`);
    }
    // Initialize the order_history if needed.
    if (!sellerProfile.order_history) {
      sellerProfile.order_history = {};
    }
    sellerProfile.order_history[newOrder.orderId] = orderEntry;
    // Update the seller profile in the DB.
    await updateSellerProfileInDB(sellerId, { order_history: sellerProfile.order_history });
    
    return newOrder;
  }
  