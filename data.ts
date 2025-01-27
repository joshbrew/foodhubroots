type ProductListing = {
    listing_id: string; // Unique identifier for the listing
    seller_id: string; // Unique identifier for the seller
    status: "active" | "inactive" | "pending" | "draft"; // Listing status
    visibility: "public" | "private" | "restricted"; // Visibility of the listing

    product_info: {
        name: string; // Product name
        description: string; // Detailed product description
        category: string; // Broad category (e.g., "Fruits")
        subcategory?: string; // Optional subcategory (e.g., "Apples")
        tags?: string[]; // Optional array of searchable tags
        attributes?: {
            unit_weight?: string;
            unit_volume?: string;
            shelf_life?: string;
            harvest_method?: string;
            storage_requirements?: string;
            organic?: boolean;
            non_gmo?: boolean;
            [key: string]: string | boolean | undefined; // Additional attributes
        };
        pricing: {
            currency: string; // e.g., "USD"
            price_tiers: Record<number, number>; // Tiered pricing
            discounts?: {
                bulk_discount?: string;
                promotions?: string[];
            };
        };
        inventory: {
            minimum_quantity: number;
            available_quantity: number;
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
        };
        custom_options?: Record<string, number>;
    };

    compliance?: {
        certifications?: string[];
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
            country: string;
            state: string;
            city: string;
            zipcode: string;
        };
        geo?: {
            type: "Point";
            coordinates: [number, number];
        };
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
    };
};

type SellerProfile = {
    id: string; // Unique identifier for the seller
    name: string; // Seller name or business name

    location: {
        country: string;
        state?: string;
        city?: string;
        zipcode?: string;
        geo?: {
            type: "Point";
            coordinates: [number, number];
        };
        [key: string]: unknown;
    };

    contact: {
        email?: string;
        phone?: string;
        website?: string;
        socials?: Record<string, string>;
        [key: string]: unknown;
    };

    products?: string[]; // List of associated product IDs

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

    metadata?: {
        established_at?: string;
        verified_seller?: boolean;
        preferred_seller?: boolean;
        seller_tags?: string[];
        total_products?: number;
    };
};

type UserProfile = {
    id: string;
    name: {
        first_name: string;
        last_name: string;
    };
    email: string;
    phone?: string;
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
            };
            geo?: {
                type: "Point";
                coordinates: [number, number];
            };
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
            status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
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
    metadata?: {
        registered_at?: string;
        vip_status?: boolean;
        average_order_value?: number;
        total_spent?: number;
        lifetime_orders?: number;
    };
};


function createProductListing(props: Partial<ProductListing> = {}): ProductListing {
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
            address: {
                country: "",
                state: "",
                city: "",
                zipcode: "",
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

function createSellerProfile(props: Partial<SellerProfile> = {}): SellerProfile {
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

function createUserProfile(props: Partial<UserProfile> = {}): UserProfile {
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
        metadata: {
            registered_at: new Date().toISOString(),
            vip_status: false,
        },
    };
    return recursivelyAssign(defaultUserProfile, props);
}


function updateProductListing(
    target: ProductListing,
    updates: Partial<ProductListing>
): ProductListing {
    return recursivelyAssign(target, updates);
}

function updateSellerProfile(
    target: SellerProfile,
    updates: Partial<SellerProfile>
): SellerProfile {
    return recursivelyAssign(target, updates);
}

function updateUserProfile(
    target: UserProfile,
    updates: Partial<UserProfile>,
    maxDepth = Infinity
): UserProfile {
    return recursivelyAssign(target, updates);
}

function recursivelyAssign(target, obj, maxDepth = Infinity, curDepth = 0) {
    for (const key in obj) {
        if (obj[key]?.constructor.name === 'Object' && curDepth < maxDepth) {
            curDepth++;
            if (target[key]?.constructor.name === 'Object')
                recursivelyAssign(target[key], obj[key], maxDepth, curDepth);
            else target[key] = recursivelyAssign({}, obj[key], maxDepth, curDepth);
        } else {
            target[key] = obj[key];
            //if(typeof target[key] === 'function') target[key] = target[key].bind(this);
        }
    }

    return target;
}
