import { getEnvVar, getRequestBody, Routes, setHeaders } from "./util";
import { MongoClient, Db } from 'mongodb';
import {
    ProductListing, SellerProfile, UserProfile, 
    createProductListing, createSellerProfile, createUserProfile, 
    updateProductListing, updateSellerProfile, updateUserProfile
} from '../scripts/data'

export const mongo = {} as { 
    client?:MongoClient
    db?:Db 
};

//run on init
export async function initMongoClient() {
    await new Promise((res,rej) => {
        const URI = getEnvVar('MONGODB_URI', '');
        if(URI) {
          const client = new MongoClient(URI);
          mongo.db = client.db(); //dbname in connection string
          console.log(`MongoDB Client Connected!`);
          res(true);
        }
        else {
            console.log(`No MongoDB URI provided`);
            rej(undefined);
        }
    });
}


/* ============================
   ProductListing Operations
   ============================ */

/**
 * Inserts a new ProductListing document into the "productListings" collection.
 * If the listing_id is not set, it assigns the MongoDB insertedId.
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
   */
  export async function getProductListingFromDB(listingId: string): Promise<ProductListing | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('productListings').findOne({ listing_id: listingId }) as ProductListing | null;
  }
  
  /**
   * Updates an existing ProductListing document identified by its listing_id.
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
   */
  export async function deleteProductListingInDB(listingId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('productListings').deleteOne({ listing_id: listingId });
    return result.deletedCount === 1;
  }
  
  /* ============================
     SellerProfile Operations
     ============================ */
  
  /**
   * Inserts a new SellerProfile document into the "sellerProfiles" collection.
   * If the id is not set, it assigns the MongoDB insertedId.
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
   */
  export async function getSellerProfileFromDB(profileId: string): Promise<SellerProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('sellerProfiles').findOne({ id: profileId }) as SellerProfile | null;
  }
  
  /**
   * Updates an existing SellerProfile document identified by its id.
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
   */
  export async function deleteSellerProfileInDB(profileId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('sellerProfiles').deleteOne({ id: profileId });
    return result.deletedCount === 1;
  }
  
  /* ============================
     UserProfile Operations
     ============================ */
  
  /**
   * Inserts a new UserProfile document into the "userProfiles" collection.
   * If the id is not set, it assigns the MongoDB insertedId.
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
   */
  export async function getUserProfileFromDB(userId: string): Promise<UserProfile | null> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    return await mongo.db.collection('userProfiles').findOne({ id: userId }) as UserProfile | null;
  }
  
  /**
   * Updates an existing UserProfile document identified by its id.
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
   */
  export async function deleteUserProfileInDB(userId: string): Promise<boolean> {
    if (!mongo.db) throw new Error("MongoDB not initialised");
    const result = await mongo.db.collection('userProfiles').deleteOne({ id: userId });
    return result.deletedCount === 1;
  }



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
  