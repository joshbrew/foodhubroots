## Roots FoodHub (very WIP)
AGPL v3.0 software

Braintree-based industrial wholesaling site featuring submerchant accounts. 

#### Note, nothing is implemented at all whatsoever, this is just a base for future updates upon project funding.

Whitepaper: https://drive.google.com/file/d/1_EyT7h5XfdrkGmCme_pW86Rytb5BniRw/view?usp=sharing

Todo: 
- Dynamic seller profiles and listing tables. Kind of like aliexpress's seller profiles or amazon's.
- Mouser listing and search system, with an amazon-like ratings system.
- User profiles, ratings, order lists, braintree payments and order security.
- Users create recurring buy lists like on mouser, can even schedule purchases (we need failsafes for this tho)
- Sellers request accounts page


```
       [Roots Platform Interface]
              /        \
             /          \
       [Wholesalers & Distributors]
            /                \
           /                  \
    [Product Listing]  [Submerchant Accounts]
         |                       |
         |                       |
    [Consumers]------[Braintree Payment Processing]
         |                       |
         |                       |
    [Order Fulfillment]----[Shipping & Logistics]
         |
    [Feedback System]

```
