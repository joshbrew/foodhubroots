
import { getRequestBody, Routes, setHeaders } from './util';

//CRUD client
import { btGateway, findTransaction } from './braintree';

//mongo client after init
import { createOrderInDB, getProductListingFromDB, getSellerProfileFromDB, getUserProfileFromDB, mongo, updateProductListingInDB, updateSellerProfileInDB, updateUserProfileInDB } from './mongodb';
import { Order, recursivelyAssign } from '../scripts/mongodb_datastructures';

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
    if (!transaction) {
      throw new Error(`Transaction id ${transactionId} does not exist!`);
    }
    // Assuming the transaction has an "amount" property (as a string).
    const transactionTotal = parseFloat(transaction.amount);
    
    // 2. Set the order details based on transaction and provided IDs.
    orderData.transactionId = transactionId;
    orderData.customerId = customerId;
    orderData.total = transactionTotal;
    
    // Create a new Order in the database.
    const newOrder = await createOrderInDB(orderData);
    
    // 3. Update each associated product listing's available quantity.
    // Iterate over each item in the order.
    if (newOrder.items) {
      for (const item of newOrder.items) {
        // Retrieve the current product listing.
        const listing = await getProductListingFromDB(item.listingId);
        if (!listing) {
          throw new Error(`Product listing not found for id ${item.listingId}`);
        }
        
        // Compute the new available quantity.
        if (!listing.product_info?.inventory) continue;
        const currentAvailable = listing.product_info.inventory.available_quantity;
        const newAvailable = currentAvailable - item.quantity;
        
        // Optionally check for insufficient inventory.
        if (newAvailable < 0) {
          throw new Error(`Insufficient inventory for listing ${item.listingId}`);
        }
        
        // Preserve the existing product_info and update only the inventory.available_quantity.
        const updatedInventory = {
          ...listing.product_info.inventory,
          available_quantity: newAvailable,
        };
        
        const updatedProductInfo = {
          ...listing.product_info,
          inventory: updatedInventory,
        };
        
        // Update the product listing with the new product_info.
        await updateProductListingInDB(item.listingId, { product_info: updatedProductInfo });
      }
    }
    
    // 4. Prepare an order entry to be recorded in both customer and seller profiles.
    const orderEntry = {
      orderId: newOrder.orderId,
      transactionId,
      placed_at: new Date().toISOString(),
      status: newOrder.status,
    };
    
    // --- Update the Customer Profile ---
    const customerProfile = await getUserProfileFromDB(customerId);
    if (!customerProfile) {
      throw new Error(`Customer profile not found for id ${customerId}`);
    }
    // Ensure order_history exists.
    if (!customerProfile.order_history) {
      customerProfile.order_history = {};
    }
    // Add the new order entry.
    customerProfile.order_history[newOrder.orderId] = orderEntry;
    // Update the customer profile in the database.
    await updateUserProfileInDB(customerId, { order_history: customerProfile.order_history });
    
    // --- Update the Seller Profile ---
    const sellerProfile = await getSellerProfileFromDB(sellerId);
    if (!sellerProfile) {
      throw new Error(`Seller profile not found for id ${sellerId}`);
    }
    if (!sellerProfile.order_history) {
      sellerProfile.order_history = {};
    }
    sellerProfile.order_history[newOrder.orderId] = orderEntry;
    await updateSellerProfileInDB(sellerId, { order_history: sellerProfile.order_history });
    
    // Return the newly created order.
    return newOrder;
  }
  