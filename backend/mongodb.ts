/**
 * # MongoDB Operations & Routes Module
 *
 * This module serves as the central hub for managing MongoDB connectivity and CRUD
 * operations for multiple data sets including:
 *
 * - **Product Listings:** Manages product data using the "productListings" collection.
 * - **Seller Profiles:** Manages seller information using the "sellerProfiles" collection.
 * - **User Profiles:** Manages user account data using the "userProfiles" collection.
 * - **Inventory Items:** Manages product inventory levels.
 * - **Orders:** Manages customer orders.
 * - **Submerchants:** Manages professional submerchant records.
 * - **Customer Service Tickets:** Manages support tickets.
 *
 * The HTTP routes have been split into GET and POST endpoints only, with explicit naming
 * (e.g., `/ticket_update` instead of using a PUT method). GET routes are used for data retrieval,
 * while POST routes cover create, update, and delete operations.
 *
 * ## Usage
 *
 * - Ensure that the `MONGODB_URI` environment variable is set.
 * - Call `initMongoClient()` on server startup.
 * - Use the provided CRUD functions in your application logic or via the exposed RESTful endpoints.
 */

import { getEnvVar, getRequestBody, Routes, setHeaders } from "./util";
import { MongoClient, Db } from 'mongodb';
import {
    ProductListing, SellerProfile, UserProfile, 
    createProductListing, createSellerProfile, createUserProfile
} from '../scripts/data';

/* ------------------------------------------------------------------
   New Types for Additional Collections
--------------------------------------------------------------------
   These interfaces represent additional collections.
*/

// InventoryItem represents an item in the product inventory.
export interface InventoryItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order represents a customer order.
export interface Order {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Submerchant represents a professional submerchant record.
export interface Submerchant {
  id: string;
  name: string;
  merchantAccountId: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket represents a customer service ticket.
export interface Ticket {
  ticketId: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

/* ============================================================
   Global MongoDB Object
   ============================================================
   The `mongo` object holds the MongoClient instance and the current database instance.
*/
export const mongo = {} as { 
    client?: MongoClient;
    db?: Db;
};

/* ============================================================
   MongoDB Client Initialization
   ============================================================
   Initializes the MongoDB client using the MONGODB_URI environment variable.
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
   ProductListing Operations
   ============================================================
   CRUD operations for the "productListings" collection.
*/

/**
 * Inserts a new ProductListing document.
 *
 * **Route (POST):** /productListing_create
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
 * Retrieves a ProductListing document by its listing_id.
 *
 * **Route (GET):** /productListing_get?listing_id=...
 */
export async function getProductListingFromDB(listingId: string): Promise<ProductListing | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('productListings').findOne({ listing_id: listingId }) as ProductListing | null;
}

/**
 * Updates a ProductListing document by its listing_id.
 *
 * **Route (POST):** /productListing_update?listing_id=...
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
 * **Route (POST):** /productListing_delete?listing_id=...
 */
export async function deleteProductListingInDB(listingId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('productListings').deleteOne({ listing_id: listingId });
    return result.deletedCount === 1;
}

/* ============================================================
   SellerProfile Operations
   ============================================================
   CRUD operations for the "sellerProfiles" collection.
*/

/**
 * Inserts a new SellerProfile document.
 *
 * **Route (POST):** /sellerProfile_create
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
 * Retrieves a SellerProfile document by its id.
 *
 * **Route (GET):** /sellerProfile_get?id=...
 */
export async function getSellerProfileFromDB(profileId: string): Promise<SellerProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('sellerProfiles').findOne({ id: profileId }) as SellerProfile | null;
}

/**
 * Updates a SellerProfile document by its id.
 *
 * **Route (POST):** /sellerProfile_update?id=...
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
 * **Route (POST):** /sellerProfile_delete?id=...
 */
export async function deleteSellerProfileInDB(profileId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('sellerProfiles').deleteOne({ id: profileId });
    return result.deletedCount === 1;
}

/* ============================================================
   UserProfile Operations
   ============================================================
   CRUD operations for the "userProfiles" collection.
*/

/**
 * Inserts a new UserProfile document.
 *
 * **Route (POST):** /userProfile_create
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
 * Retrieves a UserProfile document by its id.
 *
 * **Route (GET):** /userProfile_get?id=...
 */
export async function getUserProfileFromDB(userId: string): Promise<UserProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('userProfiles').findOne({ id: userId }) as UserProfile | null;
}

/**
 * Updates a UserProfile document by its id.
 *
 * **Route (POST):** /userProfile_update?id=...
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
 * **Route (POST):** /userProfile_delete?id=...
 */
export async function deleteUserProfileInDB(userId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('userProfiles').deleteOne({ id: userId });
    return result.deletedCount === 1;
}

/* ============================================================
   InventoryItem Operations
   ============================================================
   CRUD operations for the "inventoryItems" collection.
*/

/**
 * Inserts a new InventoryItem document.
 *
 * **Route (POST):** /inventory_create
 */
export async function createInventoryItemInDB(
  props: Partial<InventoryItem>
): Promise<InventoryItem> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  // Set default timestamps
  const newItem: InventoryItem = {
    sku: props.sku || '',
    name: props.name || '',
    quantity: props.quantity || 0,
    price: props.price || 0,
    description: props.description,
    category: props.category,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await mongo.db.collection('inventoryItems').insertOne(newItem);
  return newItem;
}

/**
 * Retrieves an InventoryItem by its SKU.
 *
 * **Route (GET):** /inventory_get?sku=...
 */
export async function getInventoryItemFromDB(sku: string): Promise<InventoryItem | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('inventoryItems').findOne({ sku }) as InventoryItem | null;
}

/**
 * Updates an InventoryItem by its SKU.
 *
 * **Route (POST):** /inventory_update?sku=...
 */
export async function updateInventoryItemInDB(
  sku: string,
  updates: Partial<InventoryItem>
): Promise<InventoryItem | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  updates.updatedAt = new Date();
  await mongo.db.collection('inventoryItems').updateOne({ sku }, { $set: updates });
  return await mongo.db.collection('inventoryItems').findOne({ sku }) as InventoryItem | null;
}

/**
 * Deletes an InventoryItem by its SKU.
 *
 * **Route (POST):** /inventory_delete?sku=...
 */
export async function deleteInventoryItemInDB(sku: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('inventoryItems').deleteOne({ sku });
  return result.deletedCount === 1;
}

/**
 * Lists all InventoryItems.
 *
 * **Route (GET):** /inventory_list
 */
export async function listInventoryItemsInDB(): Promise<InventoryItem[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('inventoryItems').find({}).toArray() as InventoryItem[];
}

/* ============================================================
   Order Operations
   ============================================================
   CRUD operations for the "orders" collection.
*/

/**
 * Inserts a new Order document.
 *
 * **Route (POST):** /order_create
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
 * **Route (GET):** /order_get?orderId=...
 */
export async function getOrderFromDB(orderId: string): Promise<Order | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('orders').findOne({ orderId }) as Order | null;
}

/**
 * Updates an Order by its orderId.
 *
 * **Route (POST):** /order_update?orderId=...
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
 * Deletes an Order by its orderId.
 *
 * **Route (POST):** /order_delete?orderId=...
 */
export async function deleteOrderInDB(orderId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('orders').deleteOne({ orderId });
  return result.deletedCount === 1;
}

/**
 * Lists all Orders.
 *
 * **Route (GET):** /order_list
 */
export async function listOrdersInDB(): Promise<Order[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('orders').find({}).toArray() as Order[];
}

/* ============================================================
   Submerchant Operations
   ============================================================
   CRUD operations for the "submerchants" collection.
*/

/**
 * Inserts a new Submerchant document.
 *
 * **Route (POST):** /submerchant_create
 */
export async function createSubmerchantInDB(
  props: Partial<Submerchant>
): Promise<Submerchant> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const newSubmerchant: Submerchant = {
    id: props.id || '',
    name: props.name || '',
    merchantAccountId: props.merchantAccountId || '',
    email: props.email || '',
    phone: props.phone,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  await mongo.db.collection('submerchants').insertOne(newSubmerchant);
  return newSubmerchant;
}

/**
 * Retrieves a Submerchant by its id.
 *
 * **Route (GET):** /submerchant_get?id=...
 */
export async function getSubmerchantFromDB(id: string): Promise<Submerchant | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('submerchants').findOne({ id }) as Submerchant | null;
}

/**
 * Updates a Submerchant by its id.
 *
 * **Route (POST):** /submerchant_update?id=...
 */
export async function updateSubmerchantInDB(
  id: string,
  updates: Partial<Submerchant>
): Promise<Submerchant | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  updates.updatedAt = new Date();
  await mongo.db.collection('submerchants').updateOne({ id }, { $set: updates });
  return await mongo.db.collection('submerchants').findOne({ id }) as Submerchant | null;
}

/**
 * Deletes a Submerchant by its id.
 *
 * **Route (POST):** /submerchant_delete?id=...
 */
export async function deleteSubmerchantInDB(id: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('submerchants').deleteOne({ id });
  return result.deletedCount === 1;
}

/**
 * Lists all Submerchants.
 *
 * **Route (GET):** /submerchant_list
 */
export async function listSubmerchantsInDB(): Promise<Submerchant[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('submerchants').find({}).toArray() as Submerchant[];
}

/* ============================================================
   Ticket (Customer Service) Operations
   ============================================================
   CRUD operations for the "tickets" collection.
*/

/**
 * Inserts a new Ticket document.
 *
 * **Route (POST):** /ticket_create
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
 * **Route (GET):** /ticket_get?ticketId=...
 */
export async function getTicketFromDB(ticketId: string): Promise<Ticket | null> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('tickets').findOne({ ticketId }) as Ticket | null;
}

/**
 * Updates a Ticket by its ticketId.
 *
 * **Route (POST):** /ticket_update?ticketId=...
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
 * Deletes a Ticket by its ticketId.
 *
 * **Route (POST):** /ticket_delete?ticketId=...
 */
export async function deleteTicketInDB(ticketId: string): Promise<boolean> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  const result = await mongo.db.collection('tickets').deleteOne({ ticketId });
  return result.deletedCount === 1;
}

/**
 * Lists all Tickets.
 *
 * **Route (GET):** /ticket_list
 */
export async function listTicketsInDB(): Promise<Ticket[]> {
  if (!mongo.db) throw new Error("MongoDB not initialised");
  return await mongo.db.collection('tickets').find({}).toArray() as Ticket[];
}

/* ============================================================
   HTTP Routes for MongoDB Operations
   ============================================================
   All routes now use only GET and POST endpoints with explicit naming.
*/
export const mongodbRoutes: Routes = {
  // --------- ProductListing Routes ---------
  "/productListing_get": {
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
  "/productListing_create": {
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
  "/productListing_update": {
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
  "/productListing_delete": {
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
  "/sellerProfile_get": {
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
  "/sellerProfile_create": {
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
  "/sellerProfile_update": {
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
  "/sellerProfile_delete": {
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
  "/userProfile_get": {
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
  "/userProfile_create": {
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
  "/userProfile_update": {
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
  "/userProfile_delete": {
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

  // --------- Inventory Routes ---------
  "/inventory_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const sku = url.searchParams.get("sku");
        if (!sku) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing sku query parameter" }));
          return;
        }
        const item = await getInventoryItemFromDB(sku);
        if (!item) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Inventory item not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(item));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/inventory_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newItem = await createInventoryItemInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newItem));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/inventory_update": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const sku = url.searchParams.get("sku");
        if (!sku) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing sku query parameter" }));
          return;
        }
        const body = await getRequestBody(request);
        const updates = JSON.parse(body);
        const updatedItem = await updateInventoryItemInDB(sku, updates);
        if (!updatedItem) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Inventory item not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedItem));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/inventory_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const sku = url.searchParams.get("sku");
        if (!sku) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing sku query parameter" }));
          return;
        }
        const success = await deleteInventoryItemInDB(sku);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Inventory item not found or could not be deleted" }));
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
  "/inventory_list": {
    GET: async (request, response, cfg) => {
      try {
        const items = await listInventoryItemsInDB();
        setHeaders(response, 200);
        response.end(JSON.stringify({ items }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },

  // --------- Order Routes ---------
  "/order_get": {
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
  "/order_create": {
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
  "/order_update": {
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
  "/order_delete": {
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
  "/order_list": {
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

  // --------- Submerchant Routes ---------
  "/submerchant_get": {
    GET: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const submerchant = await getSubmerchantFromDB(id);
        if (!submerchant) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Submerchant not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(submerchant));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/submerchant_create": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const data = JSON.parse(body);
        const newSubmerchant = await createSubmerchantInDB(data);
        setHeaders(response, 201);
        response.end(JSON.stringify(newSubmerchant));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/submerchant_update": {
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
        const updatedSubmerchant = await updateSubmerchantInDB(id, updates);
        if (!updatedSubmerchant) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Submerchant not found" }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify(updatedSubmerchant));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },
  "/submerchant_delete": {
    POST: async (request, response, cfg) => {
      try {
        const url = new URL(request.url!, `http://${request.headers.host}`);
        const id = url.searchParams.get("id");
        if (!id) {
          setHeaders(response, 400);
          response.end(JSON.stringify({ error: "Missing id query parameter" }));
          return;
        }
        const success = await deleteSubmerchantInDB(id);
        if (!success) {
          setHeaders(response, 404);
          response.end(JSON.stringify({ error: "Submerchant not found or could not be deleted" }));
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
  "/submerchant_list": {
    GET: async (request, response, cfg) => {
      try {
        const submerchants = await listSubmerchantsInDB();
        setHeaders(response, 200);
        response.end(JSON.stringify({ submerchants }));
      } catch (err: any) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: err.message }));
      }
    }
  },

  // --------- Ticket Routes ---------
  "/ticket_get": {
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
  "/ticket_create": {
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
  "/ticket_update": {
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
  "/ticket_delete": {
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
  "/ticket_list": {
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
