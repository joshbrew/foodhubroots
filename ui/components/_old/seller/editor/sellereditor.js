import html from './sellereditor.html'

export class SellerProfileCreator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = html;
        this.form = this.shadowRoot.getElementById('seller-profile-form');
        this.form.onsubmit = this.handleSubmit.bind(this);
        
        this.shadowRoot.querySelector('#add-contact-field').addEventListener('click', this.addContactField.bind(this));
        this.shadowRoot.querySelector('#add-image').addEventListener('click', this.addImageField.bind(this));
        this.shadowRoot.querySelector('#add-video').addEventListener('click', this.addVideoField.bind(this));
      }

    addContactField() {
        const container = this.shadowRoot.querySelector('#contact-fields-container');
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.innerHTML = `
          <input type="text" name="contactKey" placeholder="Contact Field Name" class="contact-key">
          <input type="text" name="contactValue" placeholder="Contact Value" class="contact-value">
          <button type="button" class="remove-field">Remove</button>
        `;
        container.appendChild(inputGroup);
      
        inputGroup.querySelector('.remove-field').addEventListener('click', () => {
          inputGroup.remove();
        });
      }
      
      addImageField() {
        const container = this.shadowRoot.querySelector('#images-container');
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.innerHTML = `
          <input type="text" name="imageName" placeholder="Image Label" class="image-label">
          <input type="url" name="imageUrl" placeholder="Image URL" class="image-url">
          <input type="file" name="imageFile" accept="image/png, image/jpeg" class="image-file">
          <button type="button" class="remove-field">Remove</button>
        `;
        container.appendChild(inputGroup);
      
        inputGroup.querySelector('.remove-field').addEventListener('click', () => {
          inputGroup.remove();
        });
      }
      
      addVideoField() {
        const container = this.shadowRoot.querySelector('#videos-container');
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group');
        inputGroup.innerHTML = `
          <input type="text" name="videoTitle" placeholder="Video Title" class="video-title">
          <input type="url" name="videoUrl" placeholder="Video URL" class="video-url">
          <button type="button" class="remove-field">Remove</button>
        `;
        container.appendChild(inputGroup);
      
        inputGroup.querySelector('.remove-field').addEventListener('click', () => {
          inputGroup.remove();
        });
    }

    
    // This method will be called on form submission.
    // It will construct the data object from all the dynamic fields.
   
  constructFormData() {
    const formData = new FormData(this.form);

    // Process dynamic contact fields
    const contactGroups = this.shadowRoot.querySelectorAll('#contact-fields-container .input-group');
    contactGroups.forEach(group => {
      const key = group.querySelector('.contact-key').value.trim();
      const value = group.querySelector('.contact-value').value.trim();
      if (key && value) {
        formData.append(`contact[${key}]`, value);
      }
    });

    // Process dynamic image fields
    const imageGroups = this.shadowRoot.querySelectorAll('#images-container .input-group');
    imageGroups.forEach((group, index) => {
      const label = group.querySelector('.image-label').value.trim();
      const url = group.querySelector('.image-url').value.trim();
      const fileInput = group.querySelector('.image-file');
      if (label) {
        formData.append(`images[${index}][label]`, label);
        if (url) {
          formData.append(`images[${index}][url]`, url);
        }
        if (fileInput.files.length > 0) {
          formData.append(`images[${index}][file]`, fileInput.files[0]);
        }
      }
    });

    // Process dynamic video fields
    const videoGroups = this.shadowRoot.querySelectorAll('#videos-container .input-group');
    videoGroups.forEach((group, index) => {
      const title = group.querySelector('.video-title').value.trim();
      const url = group.querySelector('.video-url').value.trim();
      if (title && url) {
        formData.append(`videos[${index}][title]`, title);
        formData.append(`videos[${index}][url]`, url);
      }
    });

    return formData;
  }


    handleSubmit(event) {
        event.preventDefault();
        const formData = this.constructFormData();
        // Handle form submission, for example, using fetch to send the data to a server
        // The formData object now contains both file data and text inputs
        console.log(Array.from(formData.entries())); // for debugging
    }
    
    // Additional methods to handle form data, file uploads, and submission...
}

customElements.define('seller-profile-creator', SellerProfileCreator);