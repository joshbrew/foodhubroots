
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
  
    // Set the order details based on transaction and provided IDs.
    orderData.transactionId = transactionId;
    orderData.customerId = customerId;
    orderData.total = transactionTotal;
  
    // Create a new Order in the database.
    const newOrder = await createOrderInDB(orderData);
  
    // Update each associated product listing's available quantity.
    if (newOrder.items) {
      for (const item of newOrder.items) {
        // Retrieve the current product listing.
        const listing = await getProductListingFromDB(item.listingId);
        if (!listing) {
          throw new Error(`Product listing not found for id ${item.listingId}`);
        }
        if (!listing.product_info?.inventory) continue;
        
        const currentAvailable = listing.product_info.inventory.available_quantity;
        const newAvailable = currentAvailable - item.quantity;
        
        // Optionally check for insufficient inventory.
        if (newAvailable < 0) {
          throw new Error(`Insufficient inventory for listing ${item.listingId}`);
        }
        
        // Create an update object for inventory changes.
        const inventoryUpdate = { inventory: { available_quantity: newAvailable } };
  
        // Merge the update into the existing product_info using recursivelyAssign.
        const updatedProductInfo = recursivelyAssign(
          { ...listing.product_info },
          inventoryUpdate
        );
  
        // Update the product listing with the merged product_info.
        await updateProductListingInDB(item.listingId, { product_info: updatedProductInfo });
      }
    }
  
    // Prepare an order entry to be recorded in both customer and seller profiles.
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
    if (!customerProfile.order_history) {
      customerProfile.order_history = {};
    }
    customerProfile.order_history[newOrder.orderId] = orderEntry;
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
  

export const btMongoRoutes: Routes = {
    "/link-transaction-to-order": {
      POST: async (request, response, cfg) => {
        try {
          // Retrieve and parse the request body.
          const body = await getRequestBody(request);
          if(!body) throw new Error("")
          const { transactionId, customerId, sellerId, orderData } = JSON.parse(body);
          
          // Validate required parameters.
          if (!transactionId || !customerId || !sellerId || !orderData) {
            throw new Error("Missing required parameters: transactionId, customerId, sellerId, or orderData");
          }
          
          // Call the function to link the transaction to an order.
          const order = await linkTransactionToOrder(transactionId, customerId, sellerId, orderData);
          
          // Set HTTP headers and return the created order.
          setHeaders(response, 200);
          response.end(JSON.stringify(order));
        } catch (err) {
          // On error, set headers to indicate failure and return the error message.
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: err.message }));
        }
      }
    }
  };
  