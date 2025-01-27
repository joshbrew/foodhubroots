import template from './tablecomponent.html'

export class ProductListing extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
  }

  set productData(input=[]) {
    this.renderProducts(input);
  }

  renderProducts(input=[]) {
    input.forEach((data) => {
      const tbody = this.shadowRoot.querySelector('tbody');
      tbody.innerHTML = ''; // Clear existing rows

      // Create a single row for the product
      const tr = document.createElement('tr');

      // Selection checkbox
      const selectCell = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      selectCell.appendChild(checkbox);
      tr.appendChild(selectCell);

      // Product image
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = data.images[0]?.url;
      image.alt = data.images[0]?.description;
      image.style.width = '50px'; // Adjust as needed
      imageCell.appendChild(image);
      tr.appendChild(imageCell);

      // Product name and description
      const nameCell = document.createElement('td');
      nameCell.textContent = `${data.product_info.name} - ${data.product_info.description}`;
      tr.appendChild(nameCell);

      // Seller information
      const sellerCell = document.createElement('td');
      sellerCell.textContent = data.seller.name;
      tr.appendChild(sellerCell);

      // Product category
      const categoryCell = document.createElement('td');
      categoryCell.textContent = data.product_info.category;
      tr.appendChild(categoryCell);

      // Pricing information
      const priceCell = document.createElement('td');
      priceCell.innerHTML = this.createPriceList(data.product_info.unit_price);
      tr.appendChild(priceCell);


      // Quantity in stock
      const quantityCell = document.createElement('td');
      quantityCell.textContent = data.product_info.available_quantity;
      tr.appendChild(quantityCell);

      // Rating summary with stars
      const ratingCell = document.createElement('td');
      const starRating = this.createStarRating(data.product_info.rating_summary.average_rating);
      ratingCell.appendChild(starRating);
      tr.appendChild(ratingCell);

      // Buy button
      const buyCell = document.createElement('td');
      const buyInput = document.createElement('input');
      buyInput.type = 'number';
      const buyButton = document.createElement('button');
      buyButton.textContent = 'Add';
      buyButton.classList.add('buy-button');
      buyButton.onclick = () => this.buyProduct(data,buyInput.value);
      buyCell.appendChild(buyInput);
      buyCell.appendChild(buyButton);
      tr.appendChild(buyCell);

      

      // Append the row to the table body
      tbody.appendChild(tr);
    })
  }

  buyProduct(product, qty) {
    console.log('Buying product', product, qty);
    // Implement the buy functionality, possibly by emitting a custom event with the product data
  }

  createPriceList(unitPrices) {
    // Sort the quantities to ensure they are displayed in ascending order
    const sortedQuantities = Object.keys(unitPrices).sort((a, b) => parseInt(a) - parseInt(b));
    // Slice the first 5 quantities for display
    const displayQuantities = sortedQuantities.slice(0, 5);
  
    return displayQuantities.map(quantity => {
      return `${quantity}: $${unitPrices[quantity].toFixed(2)}`;
    }).join('<br>'); // Join with line breaks for HTML display
  }

  createStarRating(rating) {
    const starRatingContainer = document.createElement('div');
    starRatingContainer.classList.add('star-rating');
    for (let i = 1; i < 6; i++) {
      const star = document.createElement('span');
      console.log(rating);
      star.textContent = i < (rating+0.5) ? '★' : '☆'; // Full star for each rating point
      star.classList.add('star');
      starRatingContainer.appendChild(star);
    }
    return starRatingContainer;
  }

  connectedCallback() {
    // If you want to fetch product data from an API when the component mounts
    // this.fetchProductData().then(data => this.renderProduct(data));
  }
}

// Define the custom element
customElements.define('product-listing', ProductListing);

export default ProductListing;