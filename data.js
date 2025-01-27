//largely using GPT to generate and just tuning it to our needs 
export const sellerProfileSample = { 
    "_id": "seller123", // Unique identifier for the seller
    "name": "Fresh Foods Inc.",
    "location": {
        "country": "United States",
        "state": "California",
        "city": "Los Angeles",
        "zipcode": "90001",
        //allow arbitrary fields too
        //Mongo geoJSON data:
        "type":"Point",
        "coordinates":[34.0522,-118.2437]
    },
    "contact": {
        "email": "ab@cd.com",
        "phone": "123-456-7890",
        "website":"ffinc.com",
        "socials":{
            "facebook":"fb.com/ffinc",
            "instagram": "ffinc"
        }
        //allow arbitrary fields too
    },
    "products":[
        "product123"
        //list of product item ids associated with this account
    ],
    "seller_page": {
        "layout":{
            "header":{
                "title":"Hello world",
                "splash": "https://ffinc.com/headersplash.jpg",
                "featured":{
                    "style":0,
                    "lists":{ 
    
                    },
                }
            },
            "body":{
                "style":0,
                "lists":{ //we are just restyling tables in this case
                    "Fruits and Vegetables":{
                        "ids":["product123"], //specific product ids
                        "categories":["Fruits","Vegetables"], //or specific categories
                        "tags":{},  //Or specific tags
                        "position": 0 //e.g. style zero is just sets of rows of listings
                    }
                },
            },
            "footer":{
                "style":0, //we are just restyling tables in this case
                "lists":{ 
                    "Contact":{
                        "email":true,
                        "phone":true,
                        "socials":true //e.g. facebook, instagram icons
                    }
                },
            }
            //layout hierarchy of seller page w/ product ids and custom table layouts
        }
    },
    "images": { //we should definitely allow cross origin urls so we can limit the amount of image hosting we require
        "logo":"https://ffinc.com/logo.png", //seller logo
        "logo128":"https://ffinc.com/logo128.png" //128x128 compressed logo
    },
    "videos": {
        //just host video embeds.
        "Our Company":"https://youtube.com/v/abc123"
    }
};

export const sellerProfileSample1 = {
    "_id": "seller789",
    "name": "Valley Fresh Produce",
    "location": {
        "country": "United States",
        "state": "Washington",
        "city": "Spokane",
        "zipcode": "99201",
        "type": "Point",
        "coordinates": [47.6588, -117.4260]
    },
    "contact": {
        "email": "sales@valleyfresh.com",
        "phone": "509-123-4567",
        "website": "valleyfreshproduce.com",
        "socials": {
            "facebook": "fb.com/valleyfresh",
            "twitter": "valleyfreshprod"
        }
    },
    "products": ["product456"],
    "seller_page": {
        // ... additional layout configuration as needed
    },
    "images": {
        "logo": "https://valleyfreshproduce.com/logo.png",
        "logo128": "https://valleyfreshproduce.com/logo128.png"
    },
    "videos": {
        "Intro": "https://youtube.com/v/valleyfreshintro"
    }
};

export const sellerProfileSample2 = {
    "_id": "seller456",
    "name": "Garden Fresh Co.",
    "location": {
        "country": "United States",
        "state": "Washington",
        "city": "Seattle",
        "zipcode": "98101",
        "type": "Point",
        "coordinates": [47.6062, -122.3321]
    },
    "contact": {
        "email": "contact@gardenfresh.com",
        "phone": "206-123-4567",
        "website": "gardenfresh.com",
        "socials": {
            "facebook": "fb.com/gardenfresh",
            "instagram": "gardenfreshco"
        }
    },
    "products": [
        "product456"
    ],
    "seller_page": {
        // ... seller page structure
    },
    "images": {
        "logo": "https://gardenfresh.com/logo.png",
        "logo128": "https://gardenfresh.com/logo128.png"
    },
    "videos": {
        "Our Philosophy": "https://youtube.com/v/def456"
    }
};

export const userProfileSample = {
    "_id": "user123",
    "name": "Big Joe",
    //credit card info etc will be stored on braintree, we can do active order info etc too
    //contact info etc should be in braintree
    "orders": { //we'll track a set here for our own needs to avoid needing braintree for everything
        "unfulfilled":{},
        "fulfilled":{}
    },
    "user_reviews": {
        "product123":{
            "user_id": "user123",
            "rating": 4.5,
            "comment": "These apples are delicious and fresh. Highly recommended!",
            "timestamp": "2023-09-25"
        },
    },
    "lists": { //grocery lists and recurring purchases. can be public or private (user profiles)
        "scheduled":{
            "mylist":{
                "recurs":"Friday",
                "list":{
                    "product123":{
                        "qty":2,
                        "fulfillment":"local pickup" //select fulfillment methods on recurring purchases
                    } //product id and quantity to purchase
                }
            }
        },
        "saved":{
            "list1":{ //etc..
                "product123":{
                    "qty":2,
                    "fulfillment":"local pickup" //select fulfillment methods on recurring purchases
                } //product id and quantity to purchase
            }
        }
    },
    "recommended": {
        "product123":true, //just display a list of recommended products in a simple list
    },
    "images": {
        "profile":"https://some/mongo/img.jpg"
    }
}

export const userProfileSample1 = {
    "_id": "user789",
    "name": "Alice Johnson",
    "orders": {
        "unfulfilled": {},
        "fulfilled": {}
    },
    "user_reviews": {
        "product456": {
            "user_id": "user789",
            "rating": 4.9,
            "comment": "The berries were incredibly sweet and fresh. Will buy again!",
            "timestamp": "2023-10-01"
        },
    },
    "lists": {
        // ... list configuration as needed
    },
    "images": {
        "profile": "https://somecdn.com/images/user789.jpg"
    }
};

//need to make this braintree compliant but otherwise we can generally manage these data structures ourselves
export const sampleItemListing = {
    "_id": "product123",//ObjectId("someid123"), // Unique identifier
    "seller": sellerProfileSample, //pointer to or id or something
    "product_info": {
        "name": "Organic Gala Apples",
        "description": "Fresh and juicy organic apples",
        "category": "Fruits",
        "tags":{
            "class":"fruit",
            "type": "apple",
            "kind": "gala"
            //etc arbitrary tags (for rounding down results like mouser)
        },
        "unit_weight": "1 kg", //should just have a kg/lb toggle conversion but we can store stuff in kg
        //"unit_volume": "1 L"
        "unit_price": {
            //etc
            1:      2.99, 
            10:    11.99,
            100:   32.99,
            1000: 150.00,
            //options for different harvests on sale maybe
        },
        "fulfillment":{
            "pickup":true,
            "shipping":{
                //should do an integration
            },
            "custom":{
                "pickup": "free",
                "local delivery": 5.00,
                "gift box": 12.00
            }
        },
        "minimum_quantity": 1,
        "available_quantity": 500,
        "harvest_dates": [ //https://www.mongodb.com/community/forums/t/finding-data-between-two-dates-by-using-a-query-in-mongodb-charts/102506
            "2023-09-15", 
            "2023-09-20"
        ],
        "sale_expiration_dates": [
            "2023-10-15",
            "2023-10-15"
        ], 
        // e.g. harvest expiration
        "additional_payment_options":{ 
            // non-credit card/braintree payments (i.e. in-person methods)
            "cash":true,
            "SNAP":true,
            "EBT":true
        },
        "location": { //the product's location
            "name":"Fresh Foods Country Store",
            "country": "United States",
            "state": "California",
            "city": "Los Angeles",
            "zipcode": "90001",
            //Mongo geoJSON data:
            "type":"Point",
            "coordinates":[34.0522,-118.2437]
        },
        "rating_summary": { 
            // Aggregate ratings data
            "average_rating": 4.8, //updated when user_reviews is updated
            "total_reviews": 150 
        },
        "sales_data": { 
            // Aggregate sales data
            "unit_sales": 350,
            "total_purchases":55,
            "unit_sales_this_month":25, //running tally
            "monthly_sales": { 
                // Monthly sales data for the last 6 months
                "2023-04": 30,
                "2023-05": 45,
                "2023-06": 50,
                "2023-07": 60,
                "2023-08": 75,
                "2023-09": 90
            }
        },
        "popularity_metrics": { 
            // Metrics to measure product popularity
            "product_views": 1200, //views on product page
            "listing_views": 11000, //times listed in an array
            "user_wishlist_count": 300 
        }
    },
    "listed": true,
    "user_reviews": [
        // More user reviews can be added
        {
            "user_id": "user123",
            "rating": 4.5,
            "comment": "These apples are delicious and fresh. Highly recommended!",
            "timestamp": "2023-09-25"
        },
        //...
    ],
    "images": {
        "main":{
            "url": "https://example.com/seller123/listing123/apple_image1.jpg",
            "description": "Fresh Organic Apples"
        },
        1:{
            "url": "https://example.com/seller123/listing123/apple_image2.jpg",
            "description": "Organic Apple Close-up"
        },
        "main128":{ //we are gonna do compression
            "url": "https://example.com/seller123/listing123/apple_image1_128.jpg",
            "description": "Fresh Organic Apples"
        }
    },
    "videos": [
        //video embeds.
    ],
    "food_safety_compliance": {
        "certifications": [
            "Organic Certification", 
            "FDA Approved"
        ],
        "safety_measures": [
            "HACCP Plan", 
            "Traceability System"
        ],
        "allergen_information": [
            "Contains no allergens"
        ]
    },
    "product_codes":{
        "FDA":"abc123"
    }
};

export const sampleItemListing1 = {
    "_id": "product456",
    "seller_id": "seller789",
    "product_info": {
        "name": "Organic Blueberries",
        "description": "Plump and sweet organic blueberries, perfect for baking or snacking",
        "category": "Fruits",
        "tags": {
            "class": "fruit",
            "type": "berry",
            "flavor": "sweet"
        },
        "unit_weight": "500 g",
        "unit_price": {
            1: 4.99,
            10: 19.99,
            100: 49.99,
            1000: 199.99,
        },
        "fulfillment": {
            "pickup": true,
            "shipping": {},
            "custom": {}
        },
        "minimum_quantity": 1,
        "available_quantity": 200,
        "harvest_dates": ["2023-08-01", "2023-08-15"],
        "sale_expiration_dates": ["2023-12-01"],
        "additional_payment_options": {
            "cash": true,
            "SNAP": false,
            "EBT": false
        },
        "location": {
            "name": "Valley Fresh Produce Farm",
            "country": "United States",
            "state": "Washington",
            "city": "Spokane",
            "zipcode": "99201",
            "type": "Point",
            "coordinates": [47.6588, -117.4260]
        },
        "rating_summary": {
            "average_rating": 4.9,
            "total_reviews": 120
        },
        "sales_data": {
            "unit_sales": 1000,
            "total_purchases": 220,
            "unit_sales_this_month": 150,
            "monthly_sales": {
                "2023-04": 100,
                "2023-05": 150,
                "2023-06": 200,
                "2023-07": 250,
                "2023-08": 300
            }
        },
        "popularity_metrics": {
            "product_views": 5000,
            "listing_views": 30000,
            "user_wishlist_count": 800
        }
    },
    "listed": true,
    "user_reviews": [
        {
            "user_id": "user789",
            "rating": 5.0,
            "comment": "Best blueberries I've ever had!",
            "timestamp": "2023-08-05"
        },
        //....
    ],
    "images": {
        "main": {
            "url": "https://valleyfreshproduce.com/products/blueberries.jpg",
            "description": "Organic Blueberries"
        },
        "main128": {
            "url": "https://valleyfreshproduce.com/products/blueberries128.jpg",
            "description": "Organic Blueberries"
        }
    },
    "food_safety_compliance": {
        "certifications": ["USDA Organic", "Non-GMO Project"],
        "safety_measures": ["Regular Lab Testing", "Pesticide-Free"],
        "allergen_information": ["No known allergens"]
    },
    "product_codes": {
        "UPC": "012345678912"
    }
};
// other structures should be dynamically generated using MongoDBs query logic,
// e.g. geoJSON, boolean logic, and so on, as it's fast.
// Use braintree for secure payment info and order safety, don't store any of that ourselves