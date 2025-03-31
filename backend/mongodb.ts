/**
 * # MongoDB Operations & Routes Module
 *
 * This module serves as the central hub for managing MongoDB connectivity and CRUD
 * operations for three main collections:
 *
 * - **Product Listings:** Manages product data using the "productListings" collection.
 * - **Seller Profiles:** Manages seller information using the "sellerProfiles" collection.
 * - **User Profiles:** Manages user account data using the "userProfiles" collection.
 *
 * Additionally, this module defines HTTP route handlers (via a Routes object) for each of the
 * above resources, mapping each HTTP method to its corresponding CRUD operation:
 *
 * - **GET:** Retrieves data from the database.
 *   - For example, GET requests to `/productListing` or `/userProfile` will call functions like
 *     `getProductListingFromDB` or `getUserProfileFromDB` to return the requested document.
 *
 * - **POST:** Creates new documents in the database.
 *   - For example, POST requests to `/sellerProfile` or `/productListing` trigger functions like
 *     `createSellerProfileInDB` or `createProductListingInDB` to insert new records.
 *
 * - **PUT:** Updates existing documents in the database.
 *   - For example, PUT requests to `/userProfile` or `/sellerProfile` invoke functions such as
 *     `updateUserProfileInDB` or `updateSellerProfileInDB` to modify records.
 *
 * - **DELETE:** Removes documents from the database.
 *   - For example, DELETE requests to `/productListing` or `/userProfile` use functions like
 *     `deleteProductListingInDB` or `deleteUserProfileInDB` to delete records.
 *
 * 1. **MongoDB Initialization:**  
 *    - `initMongoClient`: Initializes the MongoDB client and sets the database instance.
 *
 * 2. **ProductListing Operations:**  
 *    - `createProductListingInDB` (POST): Inserts a new product listing document.
 *    - `getProductListingFromDB` (GET): Retrieves a product listing by its ID.
 *    - `updateProductListingInDB` (PUT): Updates an existing product listing.
 *    - `deleteProductListingInDB` (DELETE): Deletes a product listing.
 *
 * 3. **SellerProfile Operations:**  
 *    - `createSellerProfileInDB` (POST): Inserts a new seller profile document.
 *    - `getSellerProfileFromDB` (GET): Retrieves a seller profile by its ID.
 *    - `updateSellerProfileInDB` (PUT): Updates an existing seller profile.
 *    - `deleteSellerProfileInDB` (DELETE): Deletes a seller profile.
 *
 * 4. **UserProfile Operations:**  
 *    - `createUserProfileInDB` (POST): Inserts a new user profile document.
 *    - `getUserProfileFromDB` (GET): Retrieves a user profile by its ID.
 *    - `updateUserProfileInDB` (PUT): Updates an existing user profile.
 *    - `deleteUserProfileInDB` (DELETE): Deletes a user profile.
 *
 * ## Usage
 *
 * - Ensure that the `MONGODB_URI` environment variable is set for a successful connection.
 * - Import and run `initMongoClient` on server startup.
 * - Use the provided CRUD functions in your application logic or expose them via RESTful endpoints.
 */

import { getEnvVar, getRequestBody, Routes, setHeaders } from "./util";
import { MongoClient, Db } from 'mongodb';
import {
    ProductListing, SellerProfile, UserProfile, 
    createProductListing, createSellerProfile, createUserProfile
} from '../scripts/data';

/* ============================================================
   Global MongoDB Object
   ============================================================
   The `mongo` object holds the MongoClient instance and the current
   database instance. It is initialized by the `initMongoClient` function.
*/
export const mongo = {} as { 
    client?: MongoClient;
    db?: Db;
};

/* ============================================================
   MongoDB Client Initialization
   ============================================================
   Initializes the MongoDB client using the MONGODB_URI environment variable.
   If the URI is provided, the client connects and sets the database instance.
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
   Functions to perform CRUD operations on the "productListings" collection.
*/

/**
 * Inserts a new ProductListing document into the "productListings" collection.
 * If the `listing_id` is not set, it assigns the MongoDB `insertedId`.
 *
 * @param props - Partial properties of a ProductListing.
 * @returns The complete ProductListing document.
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
 * Retrieves a ProductListing document by its `listing_id`.
 *
 * @param listingId - The unique identifier of the product listing.
 * @returns The found ProductListing document or null if not found.
 */
export async function getProductListingFromDB(listingId: string): Promise<ProductListing | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('productListings').findOne({ listing_id: listingId }) as ProductListing | null;
}

/**
 * Updates an existing ProductListing document identified by its `listing_id`.
 *
 * @param listingId - The unique identifier of the product listing.
 * @param updates - Partial updates to apply.
 * @returns The updated ProductListing document or null if not found.
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
 * Deletes a ProductListing document from the "productListings" collection.
 *
 * @param listingId - The unique identifier of the product listing.
 * @returns True if deletion was successful, otherwise false.
 */
export async function deleteProductListingInDB(listingId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('productListings').deleteOne({ listing_id: listingId });
    return result.deletedCount === 1;
}

/* ============================================================
   SellerProfile Operations
   ============================================================
   Functions to perform CRUD operations on the "sellerProfiles" collection.
*/

/**
 * Inserts a new SellerProfile document into the "sellerProfiles" collection.
 * If the `id` is not set, it assigns the MongoDB `insertedId`.
 *
 * @param props - Partial properties of a SellerProfile.
 * @returns The complete SellerProfile document.
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
 * Retrieves a SellerProfile document by its `id`.
 *
 * @param profileId - The unique identifier of the seller profile.
 * @returns The found SellerProfile document or null if not found.
 */
export async function getSellerProfileFromDB(profileId: string): Promise<SellerProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('sellerProfiles').findOne({ id: profileId }) as SellerProfile | null;
}

/**
 * Updates an existing SellerProfile document identified by its `id`.
 *
 * @param profileId - The unique identifier of the seller profile.
 * @param updates - Partial updates to apply.
 * @returns The updated SellerProfile document or null if not found.
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
 * Deletes a SellerProfile document from the "sellerProfiles" collection.
 *
 * @param profileId - The unique identifier of the seller profile.
 * @returns True if deletion was successful, otherwise false.
 */
export async function deleteSellerProfileInDB(profileId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('sellerProfiles').deleteOne({ id: profileId });
    return result.deletedCount === 1;
}

/* ============================================================
   UserProfile Operations
   ============================================================
   Functions to perform CRUD operations on the "userProfiles" collection.
*/

/**
 * Inserts a new UserProfile document into the "userProfiles" collection.
 * If the `id` is not set, it assigns the MongoDB `insertedId`.
 *
 * @param props - Partial properties of a UserProfile.
 * @returns The complete UserProfile document.
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
 * Retrieves a UserProfile document by its `id`.
 *
 * @param userId - The unique identifier of the user profile.
 * @returns The found UserProfile document or null if not found.
 */
export async function getUserProfileFromDB(userId: string): Promise<UserProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('userProfiles').findOne({ id: userId }) as UserProfile | null;
}

/**
 * Updates an existing UserProfile document identified by its `id`.
 *
 * @param userId - The unique identifier of the user profile.
 * @param updates - Partial updates to apply.
 * @returns The updated UserProfile document or null if not found.
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
 * Deletes a UserProfile document from the "userProfiles" collection.
 *
 * @param userId - The unique identifier of the user profile.
 * @returns True if deletion was successful, otherwise false.
 */
export async function deleteUserProfileInDB(userId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('userProfiles').deleteOne({ id: userId });
    return result.deletedCount === 1;
}

/* ============================================================
   HTTP Routes for MongoDB Operations
   ============================================================
   The `mongodbRoutes` object defines HTTP endpoints to expose the
   CRUD operations for ProductListing, SellerProfile, and UserProfile.
   Each endpoint handles GET, POST, PUT, and DELETE methods.
*/
export const mongodbRoutes: Routes = {
  "/productListing": {
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
    },
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
    },
    PUT: async (request, response, cfg) => {
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
    },
    DELETE: async (request, response, cfg) => {
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

  "/sellerProfile": {
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
    },
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
    },
    PUT: async (request, response, cfg) => {
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
    },
    DELETE: async (request, response, cfg) => {
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

  "/userProfile": {
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
    },
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
    },
    PUT: async (request, response, cfg) => {
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
    },
    DELETE: async (request, response, cfg) => {
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
  }
};
