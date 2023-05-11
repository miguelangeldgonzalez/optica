import Component from '../component.js';

export default class ProductItemSale extends Component {
    common = true;
    
    constructor(context) {
        super(context, 'product-item-sale');
    }

    beforeLoad() {
        if (this.context.type === 'common') {
            this.component.shadowRoot.querySelectorAll('.glasses').forEach(g => g.remove());

            this.component.shadowRoot.querySelector('#product_name').innerText = this.context.nombre;
            this.component.shadowRoot.querySelector('#product_price').value = this.context.precio;
        } else {
            this.component.shadowRoot.querySelector('.common').remove();
            this.component.shadowRoot.querySelectorAll('.glasses').forEach(gR => {
                if (!gR.classList.contains('title')) {
                    let exists = false;
    
                    for (const g in this.context) {
                        if (this.context[g]?.nombre) {
                            if (gR.getAttribute('nombre') === this.context[g]?.nombre) {
                                gR.querySelector('input').value = this.context[g].precio;
                                exists = true;
                            }
                            
                        }
                    }
                    if (!exists) gR.remove();
                }
            })
        }


    }
}