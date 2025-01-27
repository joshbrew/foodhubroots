
import braintree from 'braintree-web'
import * as btdropin from './scripts/dropin.min.cjs';
import './index.css'; // Your compiled CSS from esbuild
import './ui/components/products/listings/listing_table/tablecomponent';
import './ui/components/products/listings/categorygen/categorygen';
import { sampleItemListing } from './data';


// Create and append category and product listing components
let cat = document.createElement('category-select');
cat.productData = [sampleItemListing];
document.body.appendChild(cat);

let products = document.createElement('product-listing');
products.productData = [sampleItemListing];
document.body.appendChild(products);

function createDropIn() {
    document.body.insertAdjacentHTML('beforeend', `
    <h1>Mock Store</h1>

    <div id="inventory">
        <h2>Products</h2>
        <ul>
            <li>
                Product 1 - $10.00 <button onclick="selectProduct(1, 10)">Buy</button>
            </li>
            <li>
                Product 2 - $20.00 <button onclick="selectProduct(2, 20)">Buy</button>
            </li>
            <li>
                Product 3 - $15.00 <button onclick="selectProduct(3, 15)">Buy</button>
            </li>
        </ul>
    </div>

    <div id="payment">
        <h2>Payment</h2>
        <div id="dropin-container"></div>
        <button id="submit-button">Submit Payment</button>
        <p id="payment-message"></p>
    </div>

    <div id="shipping-info">
        <h2>Shipping Info</h2>
        <form id="shipping-form">
            <label for="firstName">First Name:</label><br>
            <input type="text" id="firstName" name="firstName"><br>
            <label for="lastName">Last Name:</label><br>
            <input type="text" id="lastName" name="lastName"><br>
            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email"><br>
            <label for="address">Address:</label><br>
            <input type="text" id="address" name="address"><br>
            <label for="city">City:</label><br>
            <input type="text" id="city" name="city"><br>
            <label for="state">State:</label><br>
            <input type="text" id="state" name="state"><br>
            <label for="zip">Zip Code:</label><br>
            <input type="text" id="zip" name="zip"><br>
            <label for="country">Country:</label><br>
            <input type="text" id="country" name="country"><br>
        </form>
    </div>

    <div id="edit-customer">
        <h2>Edit Customer Information</h2>
        <form id="edit-customer-form">
            <label for="edit-firstName">First Name:</label><br>
            <input type="text" id="edit-firstName" name="firstName"><br>
            <label for="edit-lastName">Last Name:</label><br>
            <input type="text" id="edit-lastName" name="lastName"><br>
            <label for="edit-email">Email:</label><br>
            <input type="email" id="edit-email" name="email"><br>
            <label for="edit-address">Address:</label><br>
            <input type="text" id="edit-address" name="address"><br>
            <label for="edit-city">City:</label><br>
            <input type="text" id="edit-city" name="city"><br>
            <label for="edit-state">State:</label><br>
            <input type="text" id="edit-state" name="state"><br>
            <label for="edit-zip">Zip Code:</label><br>
            <input type="text" id="edit-zip" name="zip"><br>
            <label for="edit-country">Country:</label><br>
            <input type="text" id="edit-country" name="country"><br>
            <button type="button" id="edit-submit-button">Update Customer</button>
        </form>
    </div>
    `);

    let selectedProduct = { id: null, price: null };
    const customerId = 'your-customer-id'; // Example, dynamically get customer ID from your logic.

    function selectProduct(productId, price) {
        selectedProduct = { id: productId, price: price };
        document.getElementById('payment-message').textContent = `Product ${productId} selected - $${price}`;
    }

    // Fetch the client token from the backend
    fetch('/client-token').then(response => response.json()).then(data => {
        console.log(braintree, btdropin);
        btdropin.create({
            authorization: data.clientToken,
            container: '#dropin-container'
        }, function (createErr, instance) {
            document.querySelector('#submit-button').addEventListener('click', function () {
                if (selectedProduct.id === null) {
                    alert('Please select a product');
                    return;
                }

                instance.requestPaymentMethod(function (err, payload) {
                    if (err) {
                        console.log('Payment method error:', err);
                        return;
                    }

                    // Gather shipping info
                    const shippingInfo = {
                        firstName: document.getElementById('firstName').value,
                        lastName: document.getElementById('lastName').value,
                        email: document.getElementById('email').value,
                        address: document.getElementById('address').value,
                        city: document.getElementById('city').value,
                        state: document.getElementById('state').value,
                        zip: document.getElementById('zip').value,
                        country: document.getElementById('country').value
                    };

                    // Create customer and link to payment method
                    fetch('/create-customer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            firstName: shippingInfo.firstName,
                            lastName: shippingInfo.lastName,
                            email: shippingInfo.email,
                            paymentMethodNonce: payload.nonce
                        })
                    }).then(response => response.json()).then(result => {
                        if (result.success) {
                            const customerId = result.customerId;

                            // After customer creation, perform the transaction
                            fetch('/checkout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ customerId: customerId, amount: selectedProduct.price })
                            }).then(response => response.json()).then(result => {
                                if (result.success) {
                                    document.getElementById('payment-message').textContent = 'Payment successful!';
                                } else {
                                    document.getElementById('payment-message').textContent = 'Payment failed: ' + result.error;
                                }
                            });
                        }
                    }).catch(error => console.error('Error creating customer:', error));
                });
            });
        });
    });

    // Fetch customer details and populate form
    function loadCustomerDetails() {
        fetch('/get-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: customerId })
        }).then(response => response.json()).then(data => {
            if (data.customer) {
                document.getElementById('edit-firstName').value = data.customer.firstName;
                document.getElementById('edit-lastName').value = data.customer.lastName;
                document.getElementById('edit-email').value = data.customer.email;
                document.getElementById('edit-address').value = data.customer.creditCards[0].billingAddress.streetAddress;
                document.getElementById('edit-city').value = data.customer.creditCards[0].billingAddress.locality;
                document.getElementById('edit-state').value = data.customer.creditCards[0].billingAddress.region;
                document.getElementById('edit-zip').value = data.customer.creditCards[0].billingAddress.postalCode;
                document.getElementById('edit-country').value = data.customer.creditCards[0].billingAddress.countryCodeAlpha2;
            }
        }).catch(err => console.error('Error fetching customer data:', err));
    }

    loadCustomerDetails();

    // Submit updated customer details
    document.getElementById('edit-submit-button').addEventListener('click', function () {
        const updatedData = {
            customerId: customerId,
            firstName: document.getElementById('edit-firstName').value,
            lastName: document.getElementById('edit-lastName').value,
            email: document.getElementById('edit-email').value,
            address: document.getElementById('edit-address').value,
            city: document.getElementById('edit-city').value,
            state: document.getElementById('edit-state').value,
            zip: document.getElementById('edit-zip').value,
            country: document.getElementById('edit-country')
        };

        fetch('/update-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        }).then(response => response.json()).then(result => {
            if (result.success) {
                alert('Customer updated successfully');
            } else {
                alert('Error updating customer: ' + result.error);
            }
        }).catch(err => console.error('Error updating customer:', err));
    });
}

createDropIn();




//Google or Paypal/Venmo login
// Create customer in our DB
// Create sellers/submerchants. Submerchants receive direct payment.
// Sellers create/modify listings
// Mongodb stores listings and image data + video links
// User payment info stored in braintree vault
