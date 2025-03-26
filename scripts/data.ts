/**
 * Roots FoodHub MVP - Data Structures
 *
 * This module defines the core types and helper functions for the Roots FoodHub
 * platform. The structures support product listings, seller profiles, and user
 * profiles with considerations for geolocation, tiered pricing, secure payments,
 * order approval flows, and administrative configurations.
 */

/* ================================
   Product Listing Data Structure
   ================================ */
   export type ProductListing = {
    listing_id: string; // Unique identifier for the listing
    seller_id: string; // Unique identifier for the seller
    status: "active" | "inactive" | "pending" | "draft"; // Listing status
    visibility: "public" | "private" | "restricted"; // Who can view this listing
  
    product_info: {
      name: string; // Product name
      description: string; // Detailed product description
      category: string; // Broad category (e.g., "Fruits")
      subcategory?: string; // Optional subcategory (e.g., "Apples")
      tags?: string[]; // Searchable tags for improved discovery
      attributes?: {
        unit_weight?: string;
        unit_volume?: string;
        shelf_life?: string;
        harvest_method?: string;
        storage_requirements?: string;
        organic?: boolean;
        non_gmo?: boolean;
        packaging?: string; // e.g., bulk, box, bag, etc.
        [key: string]: string | boolean | undefined; // Additional attributes
      };
      pricing: {
        currency: string; // e.g., "USD"
        retail_price?: number; // Single unit price (if applicable)
        price_tiers: Record<number, number>; // Tiered pricing (e.g., { 1: price, 10: discounted price })
        discounts?: {
          bulk_discount?: string;
          promotions?: string[];
        };
      };
      inventory: {
        minimum_quantity: number;
        available_quantity: number;
        availability?: "in_stock" | "out_of_stock" | "preorder";
      };
      origin?: {
        country: string;
        region?: string;
        farm_name?: string;
      };
    };
  
    fulfillment: {
      pickup?: boolean;
      delivery?: {
        enabled: boolean;
        local_delivery?: {
          flat_rate: number;
          distance_limit_km?: number;
        };
        regional_shipping?: {
          enabled: boolean;
          shipping_rates?: Record<string, number>;
        };
        international_shipping?: {
          enabled: boolean;
          regions?: string[];
        };
        /**
         * Optional estimated delivery time in days.
         */
        estimated_delivery_days?: number;
      };
      custom_options?: Record<string, number>;
      /**
       * Indicates if the sale requires seller approval before processing.
       */
      requiresApproval?: boolean;
      /**
       * Specifies the order type:
       * - "direct": On-demand purchase.
       * - "approval": Purchase requires seller confirmation.
       * - "mixed": Hybrid approach with both immediate and approval-based items.
       */
      orderType?: "direct" | "approval" | "mixed";
    };
  
    compliance?: {
      certifications?: string[]; // E.g., state food safety certifications
      allergen_information?: string[];
      safety_measures?: string[];
      traceability?: {
        batch_code?: string;
        harvest_date?: string;
        expiry_date?: string;
      };
    };
  
    location: {
      business_name?: string;
      address: {
        street: string;
        country: string;
        state: string;
        city: string;
        zipcode: string;
      }[];
      geo?: {
        type: "Point";
        coordinates: [number, number];
      }[];
    };
  
    media?: {
      images?: Record<
        string,
        {
          url: string;
          description?: string;
          variants?: {
            thumbnail?: string;
            medium?: string;
            high_res?: string;
          };
        }
      >;
      videos?: Record<
        string,
        {
          url: string;
          description?: string;
        }
      >;
    };
  
    ratings?: {
      average_rating: number;
      total_reviews: number;
      reviews?: Record<
        string,
        {
          user_id: string;
          rating: number;
          comment: string;
          timestamp: string;
          helpful_votes?: number;
          flagged?: boolean;
        }
      >;
    };
  
    metrics?: {
      views?: {
        product_views: number;
        listing_views: number;
      };
      sales?: {
        total_units: number;
        total_orders: number;
        unit_sales_this_month?: number;
        monthly_sales?: Record<string, number>;
      };
      wishlist_count?: number;
      engagement_score?: number;
    };
  
    metadata?: {
      created_at: string;
      updated_at: string;
      created_by: string;
      last_updated_by: string;
      seasonal?: boolean;
      best_seller?: boolean;
      featured?: boolean;
      tags_for_search?: string[];
      /**
       * Optional override for the platform fee percentage for this listing.
       */
      platform_fee_percentage?: number;
    };
  };
  
  /* ================================
     Seller Profile Data Structure
     ================================ */
  export type SellerProfile = {
    id: string; // Unique identifier for the seller
    name: string; // Seller or business name
    bio?: string; // Brief biography or description
  
    location: {
      country: string;
      state?: string;
      city?: string;
      zipcode?: string;
      geo?: {
        type: "Point";
        coordinates: [number, number];
      }[];
      [key: string]: unknown;
    };
  
    contact: {
      email?: string;
      phone?: string;
      website?: string;
      socials?: Record<string, string>;
      [key: string]: unknown;
    };
  
    products?: string[]; // Associated product listing IDs
  
    seller_page?: {
      layout: {
        header?: {
          title?: string;
          splash?: string;
          featured?: {
            style?: number;
            lists?: Record<string, unknown>;
          };
        };
        body?: {
          style?: number;
          lists?: Record<
            string,
            {
              ids?: string[];
              categories?: string[];
              tags?: Record<string, unknown>;
              position?: number;
            }
          >;
        };
        footer?: {
          style?: number;
          lists?: Record<
            string,
            {
              email?: boolean;
              phone?: boolean;
              socials?: boolean;
            }
          >;
        };
      };
    };
  
    media?: {
      images?: Record<
        string,
        {
          url: string;
          description?: string;
        }
      >;
      videos?: Record<string, string>;
    };
  
    ratings?: {
      average_rating: number;
      total_reviews: number;
      reviews?: Record<
        string,
        {
          user_id: string;
          rating: number;
          comment: string;
          timestamp: string;
          verified_purchase?: boolean;
        }
      >;
    };
  
    // Payment and shipping details for sub-merchant integrations.
    braintree_submerchant_id?: string; // Braintree sub-merchant account ID for direct deposits
    approval_status?: "pending" | "approved" | "suspended" | "rejected"; // Seller onboarding status
    shipping_details?: {
      shipping_fee_flat?: number;
      shipping_fee_percentage?: number;
      handling_fee?: number;
    };
  
    /**
     * Certifications provided by the seller (e.g., food safety licenses).
     * Key can be the certification type, value can be a number, URL, or document reference.
     */
    certifications?: Record<string, string>;
  
    metadata?: {
      established_at?: string;
      verified_seller?: boolean;
      preferred_seller?: boolean;
      seller_tags?: string[];
      total_products?: number;
      braintree_enabled?: boolean;
      /**
       * Optional default platform fee percentage applied to the seller’s listings.
       */
      default_platform_fee_percentage?: number;
      /**
       * Optional timestamp when the seller was approved.
       */
      approved_at?: string;
    };
  };
  
  /* ================================
     User Profile Data Structure
     ================================ */
  export type UserProfile = {
    id: string;
    name: {
      first_name: string;
      last_name: string;
    };
    email: string;
    phone?: string;
    /**
     * Optional identifier for Google or other OAuth providers.
     */
    google_id?: string;
    address_book: Record<
      string,
      {
        label?: string;
        address: {
          street: string;
          city: string;
          state: string;
          country: string;
          zipcode: string;
        }[];
        geo?: {
          type: "Point";
          coordinates: [number, number];
        }[];
      }
    >;
    preferences?: {
      currency?: string;
      language?: string;
      notifications?: {
        email?: boolean;
        sms?: boolean;
      };
      [key: string]: unknown;
    };
    cart: {
      items: Record<
        string,
        {
          product_id: string;
          seller_id?: string; // Optional seller reference for each item
          name: string;
          quantity: number;
          price_per_unit: number;
          total_price: number;
        }
      >;
      total_price: number;
      last_updated: string;
    };
    saved_carts?: Record<
      string,
      {
        name: string;
        items: Record<
          string,
          {
            product_id: string;
            name: string;
            quantity: number;
            price_per_unit: number;
          }
        >;
        saved_at: string;
      }
    >;
    order_history: Record<
      string,
      {
        /**
         * Extended status to support orders requiring seller approval.
         */
        status:
          | "pending"
          | "approval_pending"
          | "processing"
          | "shipped"
          | "delivered"
          | "cancelled";
        placed_at: string;
        items: Record<
          string,
          {
            product_id: string;
            name: string;
            quantity: number;
            price_per_unit: number;
            total_price: number;
          }
        >;
        total_price: number;
        shipping_address: {
          street: string;
          city: string;
          state: string;
          country: string;
          zipcode: string;
        };
        tracking_info?: {
          carrier: string;
          tracking_number: string;
          tracking_url?: string;
        };
        /**
         * Optional information regarding chargebacks or refunds.
         */
        chargeback_info?: {
          status: "none" | "pending" | "resolved";
          reason?: string;
          amount?: number;
        };
      }
    >;
    subscriptions?: Record<
      string,
      {
        product_id: string;
        name: string;
        quantity: number;
        price_per_unit: number;
        interval: "daily" | "weekly" | "biweekly" | "monthly";
        next_delivery: string;
        status: "active" | "paused" | "cancelled";
      }
    >;
    wishlist?: string[];
    /**
     * User role for permission management:
     * - "customer"
     * - "merchant"
     * - "admin"
     */
    role?: "customer" | "merchant" | "admin";
    metadata?: {
      registered_at?: string;
      vip_status?: boolean;
      average_order_value?: number;
      total_spent?: number;
      lifetime_orders?: number;
      braintree_customer_id?: string; // For linking saved payment methods
    };
  };
  
  /* ================================
     Helper Functions
     ================================ */
  
  /**
   * Creates a new ProductListing object with default values merged with provided properties.
   *
   * @param props Partial product listing properties to override defaults.
   * @returns A fully initialized ProductListing object.
   */
  export function createProductListing(props: Partial<ProductListing> = {}): ProductListing {
    const defaultProductListing: ProductListing = {
      listing_id: "",
      seller_id: "",
      status: "draft",
      visibility: "public",
      product_info: {
        name: "",
        description: "",
        category: "",
        tags: [],
        attributes: {},
        pricing: {
          currency: "USD",
          price_tiers: {},
        },
        inventory: {
          minimum_quantity: 0,
          available_quantity: 0,
        },
      },
      fulfillment: {},
      compliance: {},
      location: {
        address: [{
          street: "",
          country: "",
          state: "",
          city: "",
          zipcode: "",
        }],
      },
      media: {
        images: {},
        videos: {},
      },
      ratings: {
        average_rating: 0,
        total_reviews: 0,
        reviews: {},
      },
      metrics: {
        views: {
          product_views: 0,
          listing_views: 0,
        },
        sales: {
          total_units: 0,
          total_orders: 0,
        },
      },
      metadata: {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "",
        last_updated_by: "",
      },
    };
    return recursivelyAssign(defaultProductListing, props);
  }
  
  /**
   * Creates a new SellerProfile object with default values merged with provided properties.
   *
   * @param props Partial seller profile properties to override defaults.
   * @returns A fully initialized SellerProfile object.
   */
  export function createSellerProfile(props: Partial<SellerProfile> = {}): SellerProfile {
    const defaultSellerProfile: SellerProfile = {
      id: "",
      name: "",
      location: {
        country: "",
      },
      contact: {
        socials: {},
      },
      products: [],
      seller_page: {
        layout: {
          header: {},
          body: {},
          footer: {},
        },
      },
      media: {
        images: {},
        videos: {},
      },
      ratings: {
        average_rating: 0,
        total_reviews: 0,
        reviews: {},
      },
      metadata: {
        established_at: new Date().toISOString(),
        verified_seller: false,
      },
    };
    return recursivelyAssign(defaultSellerProfile, props);
  }
  
  /**
   * Creates a new UserProfile object with default values merged with provided properties.
   *
   * @param props Partial user profile properties to override defaults.
   * @returns A fully initialized UserProfile object.
   */
  export function createUserProfile(props: Partial<UserProfile> = {}): UserProfile {
    const defaultUserProfile: UserProfile = {
      id: "",
      name: {
        first_name: "",
        last_name: "",
      },
      email: "",
      address_book: {},
      preferences: {
        currency: "USD",
        language: "en-US",
      },
      cart: {
        items: {},
        total_price: 0,
        last_updated: new Date().toISOString(),
      },
      order_history: {},
      subscriptions: {},
      wishlist: [],
      metadata: {
        registered_at: new Date().toISOString(),
        vip_status: false,
      },
    };
    return recursivelyAssign(defaultUserProfile, props);
  }
  
  /**
   * Recursively assigns properties from the source object into the target object.
   *
   * @param target The target object to assign properties to.
   * @param obj The source object containing updates.
   * @param maxDepth Maximum depth for recursive assignment (default is Infinity).
   * @param curDepth Current recursion depth (used internally).
   * @returns The target object with properties assigned.
   */
  export function recursivelyAssign(target: any, obj: any, maxDepth = Infinity, curDepth = 0): any {
    for (const key in obj) {
      if (obj[key]?.constructor?.name === "Object" && curDepth < maxDepth) {
        curDepth++;
        if (target[key]?.constructor?.name === "Object") {
          recursivelyAssign(target[key], obj[key], maxDepth, curDepth);
        } else {
          target[key] = recursivelyAssign({}, obj[key], maxDepth, curDepth);
        }
      } else {
        target[key] = obj[key];
      }
    }
    return target;
  }
  
  /**
   * Updates an existing ProductListing object with new properties.
   *
   * @param target The original ProductListing object.
   * @param updates Partial properties to update.
   * @returns The updated ProductListing object.
   */
  export function updateProductListing(
    target: ProductListing,
    updates: Partial<ProductListing>
  ): ProductListing {
    return recursivelyAssign(target, updates);
  }
  
  /**
   * Updates an existing SellerProfile object with new properties.
   *
   * @param target The original SellerProfile object.
   * @param updates Partial properties to update.
   * @returns The updated SellerProfile object.
   */
  export function updateSellerProfile(
    target: SellerProfile,
    updates: Partial<SellerProfile>
  ): SellerProfile {
    return recursivelyAssign(target, updates);
  }
  
  /**
   * Updates an existing UserProfile object with new properties.
   *
   * @param target The original UserProfile object.
   * @param updates Partial properties to update.
   * @param maxDepth Maximum recursion depth for the assignment.
   * @returns The updated UserProfile object.
   */
  export function updateUserProfile(
    target: UserProfile,
    updates: Partial<UserProfile>,
    maxDepth = Infinity
  ): UserProfile {
    return recursivelyAssign(target, updates);
  }
  