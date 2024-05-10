Sellers are submerchants

We split payments so we get a small percentage of wholesales thru site.

Site is a product listing site like Mouser, but we don't initially handle shipping, it's local or seller-specific.

Todo: 
- Dynamic seller profiles and listing tables. Kind of like aliexpress's seller profiles or amazon's.
- Mouser listing and search system, with an amazon-like ratings system.
- User profiles, ratings, order lists, braintree payments and order security.
- Users create recurring buy lists like on mouser, can even schedule purchases (we need failsafes for this tho)
- Sellers request accounts page

       [Roots Platform Interface]
              /        \
             /          \
       [Wholesalers]--[Distributors]
            /           /       |
           /           /        |
    [Product Listing]--[Submerchant Accounts]
         |                       |
         |                       |
    [Consumers]------[Braintree Payment Processing]
         |                       |
         |                       |
    [Order Fulfillment]----[Shipping & Logistics]
         |
    [Feedback System]