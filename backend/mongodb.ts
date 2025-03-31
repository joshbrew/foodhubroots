/**
 * # MongoDB Operations & Routes Module
 *
 * This module manages MongoDB connectivity and CRUD operations for the Roots FoodHub MVP.
 * It covers the following data sets:
 *
 * - **Product Listings:** Stored in the "productListings" collection.
 *   (Uses the ProductListing type from ../scripts/data.ts, which includes embedded inventory info.)
 *
 * - **Seller Profiles:** Stored in the "sellerProfiles" collection.
 *   (Uses the SellerProfile type from ../scripts/data.ts. Seller profiles store all local seller data.
 *    Braintree is used for detailed submerchant information.)
 *
 * - **User Profiles:** Stored in the "userProfiles" collection.
 *   (Uses the UserProfile type from ../scripts/data.ts.)
 *
 * - **Orders:** Stored in the "orders" collection.
 *   **Note:** Braintree already stores detailed order/transaction info. This collection is optional
 *   and intended only for local caching or custom processing.
 *
 * - **Tickets:** Stores customer service support tickets.
 *
 * All endpoints are exposed as GET or POST routes with a `/db_` prefix and explicit operation names.
 *
 * ## Usage
 *
 * 1. Ensure the `MONGODB_URI` environment variable is set.
 * 2. Call `initMongoClient()` on server startup.
 * 3. Use the provided CRUD functions directly or via the exposed HTTP endpoints.
 */

import { getEnvVar, getRequestBody, Routes, setHeaders } from "./util";
import { MongoClient, Db } from 'mongodb';
// Import core types and helper functions from Roots FoodHub MVP.
import { 
  ProductListing, SellerProfile, UserProfile, Order, Ticket, 
  createProductListing, createSellerProfile, createUserProfile
} from '../scripts/data';





/* ============================================================
   Global MongoDB Object & Initialization
   ============================================================
   The `mongo` object holds the MongoClient instance and the current database instance.
*/
export const mongo = {} as { 
  client?: MongoClient;
  db?: Db;
};

/**
 * Initializes the MongoDB client using the MONGODB_URI environment variable.
 * Sets the global `mongo.db` instance for use in all operations.
 */
export async function initMongoClient() {
  await new Promise((res, rej) => {
    const URI = getEnvVar('MONGODB_URI', '');
    if (URI) {
      const client = new MongoClient(URI);
      mongo.db = client.db(); // Database name is derived from the connection string
      console.log(`MongoDB Client Connected!`);
      res(true);
    } else {
      console.log(`No MongoDB URI provided`);
      rej(undefined);
    }
  });
}

/* ============================================================
   ProductListing Operations (productListings Collection)
   ============================================================
   CRUD functions for product listings.
*/

/**
 * Creates a new ProductListing document.
 *
 * **Route (POST):** /db_productListing_create
 */
export async function createProductListingInDB(
  props: Partial<ProductListing>
): Promise<ProductListing> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newListing = createProductListing(props);
  const result = await mongo.db.collection('productListings').insertOne(newListing);
  if (!newListing.listing_id) {
    newListing.listing_id = result.insertedId.toString();
    await mongo.db.collection('productListings').updateOne(
      { _id: result.insertedId },
      { $set: { listing_id: newListing.listing_id } }
    );
  }
  return newListing;
}

/**
 * Retrieves a ProductListing by its listing_id.
 *
 * **Route (GET):** /db_productListing_get?listing_id=...
 */
export async function getProductListingFromDB(listingId: string): Promise<ProductListing | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('productListings').findOne({ listing_id: listingId }) as ProductListing | null;
}

/**
 * Updates an existing ProductListing document.
 *
 * **Route (POST):** /db_productListing_update?listing_id=...
 */
export async function updateProductListingInDB(
  listingId: string,
  updates: Partial<ProductListing>
): Promise<ProductListing | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  await mongo.db.collection('productListings').updateOne(
    { listing_id: listingId },
    { $set: updates }
  );
  return await mongo.db.collection('productListings').findOne({ listing_id: listingId }) as ProductListing | null;
}

/**
 * Deletes a ProductListing document.
 *
 * **Route (POST):** /db_productListing_delete?listing_id=...
 */
export async function deleteProductListingInDB(listingId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('productListings').deleteOne({ listing_id: listingId });
  return result.deletedCount === 1;
}

/* ============================================================
   SellerProfile Operations (sellerProfiles Collection)
   ============================================================
   CRUD functions for seller profiles.
*/

/**
 * Creates a new SellerProfile document.
 *
 * **Route (POST):** /db_sellerProfile_create
 */
export async function createSellerProfileInDB(
  props: Partial<SellerProfile>
): Promise<SellerProfile> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newProfile = createSellerProfile(props);
  const result = await mongo.db.collection('sellerProfiles').insertOne(newProfile);
  if (!newProfile.id) {
    newProfile.id = result.insertedId.toString();
    await mongo.db.collection('sellerProfiles').updateOne(
      { _id: result.insertedId },
      { $set: { id: newProfile.id } }
    );
  }
  return newProfile;
}

/**
 * Retrieves a SellerProfile by its id.
 *
 * **Route (GET):** /db_sellerProfile_get?id=...
 */
export async function getSellerProfileFromDB(profileId: string): Promise<SellerProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('sellerProfiles').findOne({ id: profileId }) as SellerProfile | null;
}

/**
 * Updates a SellerProfile document.
 *
 * **Route (POST):** /db_sellerProfile_update?id=...
 */
export async function updateSellerProfileInDB(
  profileId: string,
  updates: Partial<SellerProfile>
): Promise<SellerProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  await mongo.db.collection('sellerProfiles').updateOne(
    { id: profileId },
    { $set: updates }
  );
  return await mongo.db.collection('sellerProfiles').findOne({ id: profileId }) as SellerProfile | null;
}

/**
 * Deletes a SellerProfile document.
 *
 * **Route (POST):** /db_sellerProfile_delete?id=...
 */
export async function deleteSellerProfileInDB(profileId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('sellerProfiles').deleteOne({ id: profileId });
  return result.deletedCount === 1;
}

/* ============================================================
   UserProfile Operations (userProfiles Collection)
   ============================================================
   CRUD functions for user profiles.
*/

/**
 * Creates a new UserProfile document.
 *
 * **Route (POST):** /db_userProfile_create
 */
export async function createUserProfileInDB(
  props: Partial<UserProfile>
): Promise<UserProfile> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newUser = createUserProfile(props);
  const result = await mongo.db.collection('userProfiles').insertOne(newUser);
  if (!newUser.id) {
    newUser.id = result.insertedId.toString();
    await mongo.db.collection('userProfiles').updateOne(
      { _id: result.insertedId },
      { $set: { id: newUser.id } }
    );
  }
  return newUser;
}

/**
 * Retrieves a UserProfile by its id.
 *
 * **Route (GET):** /db_userProfile_get?id=...
 */
export async function getUserProfileFromDB(userId: string): Promise<UserProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('userProfiles').findOne({ id: userId }) as UserProfile | null;
}

/**
 * Updates a UserProfile document.
 *
 * **Route (POST):** /db_userProfile_update?id=...
 */
export async function updateUserProfileInDB(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  await mongo.db.collection('userProfiles').updateOne(
    { id: userId },
    { $set: updates }
  );
  return await mongo.db.collection('userProfiles').findOne({ id: userId }) as UserProfile | null;
}

/**
 * Deletes a UserProfile document.
 *
 * **Route (POST):** /db_userProfile_delete?id=...
 */
export async function deleteUserProfileInDB(userId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('userProfiles').deleteOne({ id: userId });
  return result.deletedCount === 1;
}

/* ============================================================
   Order Operations (orders Collection)
   ============================================================
   CRUD functions for orders.
   NOTE: Braintree stores detailed transaction/order info. This collection is optional.
*/

/**
 * Creates a new Order document.
 *
 * **Route (POST):** /db_order_create
 */
export async function createOrderInDB(
  props: Partial<Order>
): Promise<Order> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newOrder: Order = {
    orderId: props.orderId || '',
    customerId: props.customerId || '',
    items: props.items || [],
    total: props.total || 0,
    status: props.status || "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await mongo.db.collection('orders').insertOne(newOrder);
  return newOrder;
}

/**
 * Retrieves an Order by its orderId.
 *
 * **Route (GET):** /db_order_get?orderId=...
 */
export async function getOrderFromDB(orderId: string): Promise<Order | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('orders').findOne({ orderId }) as any as Order | null;
}

/**
 * Updates an Order document.
 *
 * **Route (POST):** /db_order_update?orderId=...
 */
export async function updateOrderInDB(
  orderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  updates.updatedAt = new Date();
  await mongo.db.collection('orders').updateOne({ orderId }, { $set: updates });
  return await mongo.db.collection('orders').findOne({ orderId }) as Order | null;
}

/**
 * Deletes an Order document.
 *
 * **Route (POST):** /db_order_delete?orderId=...
 */
export async function deleteOrderInDB(orderId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('orders').deleteOne({ orderId });
  return result.deletedCount === 1;
}

/**
 * Lists all Orders.
 *
 * **Route (GET):** /db_order_list
 */
export async function listOrdersInDB(): Promise<Order[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('orders').find({}).toArray() as any as Order[];
}

/* ============================================================
   Ticket Operations (tickets Collection)
   ============================================================
   CRUD functions for customer service tickets.
*/

/**
 * Creates a new Ticket document.
 *
 * **Route (POST):** /db_ticket_create
 */
export async function createTicketInDB(
  props: Partial<Ticket>
): Promise<Ticket> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newTicket: Ticket = {
    ticketId: props.ticketId || '',
    userId: props.userId || '',
    subject: props.subject || '',
    message: props.message || '',
    status: props.status || 'open',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await mongo.db.collection('tickets').insertOne(newTicket);
  return newTicket;
}

/**
 * Retrieves a Ticket by its ticketId.
 *
 * **Route (GET):** /db_ticket_get?ticketId=...
 */
export async function getTicketFromDB(ticketId: string): Promise<Ticket | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('tickets').findOne({ ticketId }) as Ticket | null;
}

/**
 * Updates a Ticket document.
 *
 * **Route (POST):** /db_ticket_update?ticketId=...
 */
export async function updateTicketInDB(
  ticketId: string,
  updates: Partial<Ticket>
): Promise<Ticket | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  updates.updatedAt = new Date();
  await mongo.db.collection('tickets').updateOne({ ticketId }, { $set: updates });
  return await mongo.db.collection('tickets').findOne({ ticketId }) as Ticket | null;
}

/**
 * Deletes a Ticket document.
 *
 * **Route (POST):** /db_ticket_delete?ticketId=...
 */
export async function deleteTicketInDB(ticketId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('tickets').deleteOne({ ticketId });
  return result.deletedCount === 1;
}

/**
 * Lists all Tickets.
 *
 * **Route (GET):** /db_ticket_list
 */
export async function listTicketsInDB(): Promise<Ticket[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('tickets').find({}).toArray() as any as Ticket[];
}

/* ============================================================
   HTTP Routes for MongoDB Operations
   ============================================================
   All endpoints use only GET and POST routes with an explicit "/db_" prefix.
*/
export const mongodbRoutes: Routes = {
  // --------- ProductListing Routes ---------
  "/db_productListing_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const listingId = url.searchParams.get("listing_id");
        if (!listingId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing listing_id query parameter" }));
          return;
        }
        const listing = await getProductListingFromDB(listingId);
        if (!listing) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "ProductListing not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(listing));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_productListing_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newListing = await createProductListingInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newListing));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_productListing_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const listingId = url.searchParams.get("listing_id");
        if (!listingId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing listing_id query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedListing = await updateProductListingInDB(listingId, updates);
        if (!updatedListing) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "ProductListing not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedListing));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_productListing_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const listingId = url.searchParams.get("listing_id");
        if (!listingId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing listing_id query parameter" }));
          return;
        }
        const success = await deleteProductListingInDB(listingId);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "ProductListing not found or could not be deleted" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },

  // --------- SellerProfile Routes ---------
  "/db_sellerProfile_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const profile = await getSellerProfileFromDB(id);
        if (!profile) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "SellerProfile not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(profile));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_sellerProfile_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newProfile = await createSellerProfileInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newProfile));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_sellerProfile_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedProfile = await updateSellerProfileInDB(id, updates);
        if (!updatedProfile) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "SellerProfile not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedProfile));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_sellerProfile_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const success = await deleteSellerProfileInDB(id);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "SellerProfile not found or could not be deleted" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },

  // --------- UserProfile Routes ---------
  "/db_userProfile_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const user = await getUserProfileFromDB(id);
        if (!user) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "UserProfile not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(user));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_userProfile_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newUser = await createUserProfileInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newUser));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_userProfile_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedUser = await updateUserProfileInDB(id, updates);
        if (!updatedUser) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "UserProfile not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedUser));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },
  "/db_userProfile_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const success = await deleteUserProfileInDB(id);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "UserProfile not found or could not be deleted" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (error: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: error.message }));
      }
    }
  },

  // --------- Order Routes ---------
  // NOTE: This collection is optional; Braintree stores detailed transaction/order info.
  "/db_order_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const orderId = url.searchParams.get("orderId");
        if (!orderId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing orderId query parameter" }));
          return;
        }
        const order = await getOrderFromDB(orderId);
        if (!order) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Order not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(order));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_order_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newOrder = await createOrderInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newOrder));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_order_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const orderId = url.searchParams.get("orderId");
        if (!orderId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing orderId query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedOrder = await updateOrderInDB(orderId, updates);
        if (!updatedOrder) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Order not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedOrder));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_order_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const orderId = url.searchParams.get("orderId");
        if (!orderId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing orderId query parameter" }));
          return;
        }
        const success = await deleteOrderInDB(orderId);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Order not found or could not be deleted" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_order_list": {
    GET: async (request, response, cfg) => {
      try {
        const orders = await listOrdersInDB();
        setHeaders(response, 200);
        response.end(JSON.stringify({ orders }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },

  // --------- Ticket Routes ---------
  "/db_ticket_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const ticketId = url.searchParams.get("ticketId");
        if (!ticketId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing ticketId query parameter" }));
          return;
        }
        const ticket = await getTicketFromDB(ticketId);
        if (!ticket) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Ticket not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(ticket));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_ticket_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newTicket = await createTicketInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newTicket));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_ticket_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const ticketId = url.searchParams.get("ticketId");
        if (!ticketId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing ticketId query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedTicket = await updateTicketInDB(ticketId, updates);
        if (!updatedTicket) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Ticket not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedTicket));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_ticket_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const ticketId = url.searchParams.get("ticketId");
        if (!ticketId) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing ticketId query parameter" }));
          return;
        }
        const success = await deleteTicketInDB(ticketId);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Ticket not found or could not be deleted" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/db_ticket_list": {
    GET: async (request, response, cfg) => {
      try {
        const tickets = await listTicketsInDB();
        setHeaders(response, 200);
        response.end(JSON.stringify({ tickets }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  }
};
