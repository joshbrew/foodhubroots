import html from './categorygen.html'

export class CategorySelect extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = html;
    }

    // Assume the array of product objects is passed as a property
    set productData(products) {
      this.populateDropdowns(products);
    }

    populateDropdowns(products) {
      const sellers = [...new Set(products.map(product => product.seller.name))];
      const categories = [...new Set(products.map(product => product.product_info.category))];
      const tags = this.extractUniqueTags(products);

      this.renderDropdown(this.shadowRoot.querySelector('#seller-select'), sellers);
      this.renderDropdown(this.shadowRoot.querySelector('#category-select'), categories);
      this.renderDropdown(this.shadowRoot.querySelector('#tag-select'), tags);
    }

    extractUniqueTags(products) {
      const allTags = products.flatMap(product => Object.values(product.product_info.tags));
      return [...new Set(allTags)];
    }

    renderDropdown(dropdown, options) {
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        dropdown.appendChild(optionElement);
      });
    }
  }

  customElements.define('category-select', CategorySelect);