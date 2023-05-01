let template = document.createElement('template');
template.innerHTML = '<div>hola</div>';

customElements.define('element-details',
  class extends HTMLElement {
    constructor() {
      super();
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
);

const element = document.createElement('element-details');

const body = document.querySelector('body');
body.appendChild(element);