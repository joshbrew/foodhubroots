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

import { Context, getEnvVar, Routes } from "./util";
import { MongoClient, Db } from 'mongodb';
// Import core types and helper functions from Roots FoodHub MVP.
import { 
  ProductListing, SellerProfile, UserProfile, Order, Ticket, 
  createProductListing, createSellerProfile, createUserProfile
} from '../scripts/mongodb_datastructures';





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
  if (!newListing.listingId) {
    newListing.listingId = result.insertedId.toString();
    await mongo.db.collection('productListings').updateOne(
      { _id: result.insertedId },
      { $set: { listingId: newListing.listingId } }
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
  return await mongo.db.collection('productListings').findOne({ listingId: listingId }) as ProductListing | null;
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
    { listingId: listingId },
    { $set: updates }
  );
  return await mongo.db.collection('productListings').findOne({ listingId: listingId }) as ProductListing | null;
}

/**
 * Deletes a ProductListing document.
 *
 * **Route (POST):** /db_productListing_delete?listing_id=...
 */
export async function deleteProductListingInDB(listingId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('productListings').deleteOne({ listingId: listingId });
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
  if (!newProfile.sellerId) {
    newProfile.sellerId = result.insertedId.toString();
    await mongo.db.collection('sellerProfiles').updateOne(
      { _id: result.insertedId },
      { $set: { sellerId: newProfile.sellerId } }
    );
  }
  return newProfile;
}

/**
 * Retrieves a SellerProfile by its id.
 *
 * **Route (GET):** /db_sellerProfile_get?id=...
 */
export async function getSellerProfileFromDB(sellerId: string): Promise<SellerProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('sellerProfiles').findOne({ sellerId: sellerId }) as SellerProfile | null;
}

/**
 * Updates a SellerProfile document.
 *
 * **Route (POST):** /db_sellerProfile_update?id=...
 */
export async function updateSellerProfileInDB(
  sellerId: string,
  updates: Partial<SellerProfile>
): Promise<SellerProfile | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  await mongo.db.collection('sellerProfiles').updateOne(
    { sellerId: sellerId },
    { $set: updates }
  );
  return await mongo.db.collection('sellerProfiles').findOne({ id: sellerId }) as SellerProfile | null;
}

/**
 * Deletes a SellerProfile document.
 *
 * **Route (POST):** /db_sellerProfile_delete?id=...
 */
export async function deleteSellerProfileInDB(sellerId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('sellerProfiles').deleteOne({ sellerId: sellerId });
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
  if (!newUser.userId) {
    newUser.userId = result.insertedId.toString();
    await mongo.db.collection('userProfiles').updateOne(
      { _id: result.insertedId },
      { $set: { userId: newUser.userId } }
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
  return await mongo.db.collection('userProfiles').findOne({ userId: userId }) as UserProfile | null;
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
  return await mongo.db.collection('userProfiles').findOne({ userId: userId }) as UserProfile | null;
}

/**
 * Deletes a UserProfile document.
 *
 * **Route (POST):** /db_userProfile_delete?id=...
 */
export async function deleteUserProfileInDB(userId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('userProfiles').deleteOne({ userId: userId });
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
  /* ─────────────  PRODUCT LISTING  ───────────── */
  "/db_productListing_get": {
    GET: async (ctx: Context) => {
      const { listingId } = ctx.query as Record<string, string>;
      if (!listingId)
        return ctx.json(400, { error: "Missing listingId query parameter" });

      const listing = await getProductListingFromDB(listingId);
      if (!listing)
        return ctx.json(404, { error: "ProductListing not found" });

      await ctx.json(200, listing);
    }
  },

  "/db_productListing_create": {
    POST: async (ctx: Context) => {
      const data = await ctx.body();
      const newListing = await createProductListingInDB(data);
      await ctx.json(201, newListing);
    }
  },

  "/db_productListing_update": {
    POST: async (ctx: Context) => {
      const { listingId } = ctx.query as Record<string, string>;
      if (!listingId)
        return ctx.json(400, { error: "Missing listingId query parameter" });

      const updates = await ctx.body();
      const updatedListing = await updateProductListingInDB(listingId, updates);
      if (!updatedListing)
        return ctx.json(404, { error: "ProductListing not found" });

      await ctx.json(200, updatedListing);
    }
  },

  "/db_productListing_delete": {
    POST: async (ctx: Context) => {
      const { listingId } = ctx.query as Record<string, string>;
      if (!listingId)
        return ctx.json(400, { error: "Missing listingId query parameter" });

      const success = await deleteProductListingInDB(listingId);
      if (!success)
        return ctx.json(404, { error: "ProductListing not found or could not be deleted" });

      await ctx.json(200, { success: true });
    }
  },

  /* ─────────────  SELLER PROFILE  ───────────── */
  "/db_sellerProfile_get": {
    GET: async (ctx: Context) => {
      const { sellerId } = ctx.query as Record<string, string>;
      if (!sellerId)
        return ctx.json(400, { error: "Missing sellerId query parameter" });

      const profile = await getSellerProfileFromDB(sellerId);
      if (!profile)
        return ctx.json(404, { error: "SellerProfile not found" });

      await ctx.json(200, profile);
    }
  },

  "/db_sellerProfile_create": {
    POST: async (ctx: Context) => {
      const data = await ctx.body();
      const newProfile = await createSellerProfileInDB(data);
      await ctx.json(201, newProfile);
    }
  },

  "/db_sellerProfile_update": {
    POST: async (ctx: Context) => {
      const { sellerId } = ctx.query as Record<string, string>;
      if (!sellerId)
        return ctx.json(400, { error: "Missing sellerId query parameter" });

      const updates = await ctx.body();
      const updatedProfile = await updateSellerProfileInDB(sellerId, updates);
      if (!updatedProfile)
        return ctx.json(404, { error: "SellerProfile not found" });

      await ctx.json(200, updatedProfile);
    }
  },

  "/db_sellerProfile_delete": {
    POST: async (ctx: Context) => {
      const { sellerId } = ctx.query as Record<string, string>;
      if (!sellerId)
        return ctx.json(400, { error: "Missing sellerId query parameter" });

      const success = await deleteSellerProfileInDB(sellerId);
      if (!success)
        return ctx.json(404, { error: "SellerProfile not found or could not be deleted" });

      await ctx.json(200, { success: true });
    }
  },

  /* ─────────────  USER PROFILE  ───────────── */
  "/db_userProfile_get": {
    GET: async (ctx: Context) => {
      const { userId } = ctx.query as Record<string, string>;
      if (!userId)
        return ctx.json(400, { error: "Missing userId query parameter" });

      const user = await getUserProfileFromDB(userId);
      if (!user)
        return ctx.json(404, { error: "UserProfile not found" });

      await ctx.json(200, user);
    }
  },

  "/db_userProfile_create": {
    POST: async (ctx: Context) => {
      const data = await ctx.body();
      const newUser = await createUserProfileInDB(data);
      await ctx.json(201, newUser);
    }
  },

  "/db_userProfile_update": {
    POST: async (ctx: Context) => {
      const { userId } = ctx.query as Record<string, string>;
      if (!userId)
        return ctx.json(400, { error: "Missing userId query parameter" });

      const updates = await ctx.body();
      const updatedUser = await updateUserProfileInDB(userId, updates);
      if (!updatedUser)
        return ctx.json(404, { error: "UserProfile not found" });

      await ctx.json(200, updatedUser);
    }
  },

  "/db_userProfile_delete": {
    POST: async (ctx: Context) => {
      const { userId } = ctx.query as Record<string, string>;
      if (!userId)
        return ctx.json(400, { error: "Missing userId query parameter" });

      const success = await deleteUserProfileInDB(userId);
      if (!success)
        return ctx.json(404, { error: "UserProfile not found or could not be deleted" });

      await ctx.json(200, { success: true });
    }
  },

  /* ─────────────  ORDER (optional)  ───────────── */
  "/db_order_get": {
    GET: async (ctx: Context) => {
      const { orderId } = ctx.query as Record<string, string>;
      if (!orderId)
        return ctx.json(400, { error: "Missing orderId query parameter" });

      const order = await getOrderFromDB(orderId);
      if (!order)
        return ctx.json(404, { error: "Order not found" });

      await ctx.json(200, order);
    }
  },

  "/db_order_create": {
    POST: async (ctx: Context) => {
      const data = await ctx.body();
      const newOrder = await createOrderInDB(data);
      await ctx.json(201, newOrder);
    }
  },

  "/db_order_update": {
    POST: async (ctx: Context) => {
      const { orderId } = ctx.query as Record<string, string>;
      if (!orderId)
        return ctx.json(400, { error: "Missing orderId query parameter" });

      const updates = await ctx.body();
      const updatedOrder = await updateOrderInDB(orderId, updates);
      if (!updatedOrder)
        return ctx.json(404, { error: "Order not found" });

      await ctx.json(200, updatedOrder);
    }
  },

  "/db_order_delete": {
    POST: async (ctx: Context) => {
      const { orderId } = ctx.query as Record<string, string>;
      if (!orderId)
        return ctx.json(400, { error: "Missing orderId query parameter" });

      const success = await deleteOrderInDB(orderId);
      if (!success)
        return ctx.json(404, { error: "Order not found or could not be deleted" });

      await ctx.json(200, { success: true });
    }
  },

  "/db_order_list": {
    GET: async (ctx: Context) => {
      const orders = await listOrdersInDB();
      await ctx.json(200, { orders });
    }
  },

  /* ─────────────  TICKETS  ───────────── */
  "/db_ticket_get": {
    GET: async (ctx: Context) => {
      const { ticketId } = ctx.query as Record<string, string>;
      if (!ticketId)
        return ctx.json(400, { error: "Missing ticketId query parameter" });

      const ticket = await getTicketFromDB(ticketId);
      if (!ticket)
        return ctx.json(404, { error: "Ticket not found" });

      await ctx.json(200, ticket);
    }
  },

  "/db_ticket_create": {
    POST: async (ctx: Context) => {
      const data = await ctx.body();
      const newTicket = await createTicketInDB(data);
      await ctx.json(201, newTicket);
    }
  },

  "/db_ticket_update": {
    POST: async (ctx: Context) => {
      const { ticketId } = ctx.query as Record<string, string>;
      if (!ticketId)
        return ctx.json(400, { error: "Missing ticketId query parameter" });

      const updates = await ctx.body();
      const updatedTicket = await updateTicketInDB(ticketId, updates);
      if (!updatedTicket)
        return ctx.json(404, { error: "Ticket not found" });

      await ctx.json(200, updatedTicket);
    }
  },

  "/db_ticket_delete": {
    POST: async (ctx: Context) => {
      const { ticketId } = ctx.query as Record<string, string>;
      if (!ticketId)
        return ctx.json(400, { error: "Missing ticketId query parameter" });

      const success = await deleteTicketInDB(ticketId);
      if (!success)
        return ctx.json(404, { error: "Ticket not found or could not be deleted" });

      await ctx.json(200, { success: true });
    }
  },

  "/db_ticket_list": {
    GET: async (ctx: Context) => {
      const tickets = await listTicketsInDB();
      await ctx.json(200, { tickets });
    }
  }
};