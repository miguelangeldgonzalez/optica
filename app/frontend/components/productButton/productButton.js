import Component from "../component.js";
import ProductItem from "../productItem/productItem.js";

export default class ProductButton extends Component {
    constructor(context) {
        super(context, 'product-button');
    }

    async click() {
        this.DOMComponent.addEventListener('click', async e => {
            const productItem = await new ProductItem({button: e.target, parentContext: this.context.parentContext}).loadComponent();
            document.querySelector('#products_total').before(productItem.component.shadowRoot);

            productItem.afterLoad();
        })
    }

    beforeLoad() {
        const input = this.DOMComponent.querySelector('input');
        input.setAttribute('necesita_formula', this.context.button.necesita_formula);
        input.setAttribute('productId', this.context.button.producto_id);
        input.setAttribute('value', this.context.button.nombre);
        this.click();
    }
}