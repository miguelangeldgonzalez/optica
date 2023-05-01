import Component from '../component.js';

export default class ProductItem extends Component {
    common = true;
    
    constructor(context) {
        super(context, 'product-item');
    }

    async getPrices() {
        this.componentsLoaded.forEach(element => {
            const input = element.querySelector("input[name='precio']");
            if (input) input.addEventListener("keyup", e => {
                const producto_id = e.target.getAttribute('producto_id')
                const index = this.data.findIndex(p => p.producto_id == producto_id);
                
                this.data[index].precio = +e.target.value;
                this.data[index].nombre = e.target.getAttribute('nombre') || this.context.button.value;

                if(!this.data[index].necesita_formula) this.data[index].necesita_formula = e.target.getAttribute('necesita_formula');

                if (this.common) {
                    this.context.parentContext.setCommonItem(this.id, this.data[0]);
                } else {
                    this.context.parentContext.setGlassesItem(this.id, this.data);
                }
            })
        })
    }

    unsetItems(title = true, producto_id = -1) {
        if (this.common) {
            this.context.parentContext.unsetCommonItem(this.id);
        } else {
            if (title) {
                this.context.parentContext.unsetGlassesItem(this.id);
            } else {
                const index = this.data.findIndex(p => p.producto_id == parseInt(producto_id));
                delete this.data[index];
                this.context.parentContext.setGlassesItem(this.id, this.data);
            }
        }
    }

    async delete() {
        this.componentsLoaded[0].querySelector('#delete').addEventListener("click", e => {
            this.componentsLoaded.forEach(tr => tr.remove());
            this.unsetItems()
        })

        if  (!this.common) {
            this.componentsLoaded[3].querySelector('#delete').addEventListener("click", e => {
                this.componentsLoaded[3].remove();
                this.unsetItems(false, e.target.getAttribute('producto_id'));
            })
        }
    }

    loadGlasses() {
        this.id = this.context.parentContext.getGlassItemID();
        this.data = [];

        for (let i = 1; i <= 3; i++) this.data.push({
            producto_id: i
        })
    }

    loadCommon() {
        this.id = this.context.parentContext.getCommonItemID();
        const producto_id = this.context.button.getAttribute('productid');
        const necesita_formula = this.context.button.getAttribute('necesita_formula') == "1" ? true : false;
        this.DOMComponent.querySelector('#product_name').innerText = this.context.button.value;
        this.DOMComponent.querySelector("input[name='precio']").setAttribute('producto_id', producto_id);

        this.data = [
            {
                producto_id,
                necesita_formula
            }
        ]
    }

    beforeLoad() {
        let removeQuery;
        console.log();

        if (this.context.button.value == 'Lentes') {
            removeQuery = '.common';
            this.common = false;
            this.loadGlasses();
        } else {
            removeQuery = '.glasses';  
            this.loadCommon();
        }

        this.DOMComponent.querySelectorAll(removeQuery).forEach(r => r.remove());
    }
    
    afterLoad() {
        const selector = this.common ? '2' : '5';
        this.componentsLoaded = document.querySelectorAll(`#products_table .item:nth-last-child(-n+${selector})`);

        this.delete();
        this.getPrices();
    }
}