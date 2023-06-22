export default class ItemPaymentTable extends Component {
    constructor(context) {
        super(context, 'item-product-table');
    }

    async beforeLoad() {
        if(!this.context.insertMode) {
            if (this.context?.bsPrice) {
                this.component.shadowRoot.querySelector('.bs_price__value').innerText = this.context.bsPrice * this.context.cantidad;
            } else {
                this.component.shadowRoot.querySelector('.bs_price__container').remove()
            }
            this.component.shadowRoot.querySelector('.insert_mode').remove();

            this.component.shadowRoot.querySelector('#product_name').innerText = this.context.metodo_pago;
            this.component.shadowRoot.querySelector('#fecha').innerText = this.context.fecha.toLocaleDateString();
            this.component.shadowRoot.querySelector('#price').innerText = this.context.cantidad;
    
            if(this.context.referencia) this.component.shadowRoot.querySelector('#referencia').innerText = this.context.referencia
            this.component.shadowRoot.querySelector('#referencia').innerText = 'No se especificó';
        } else {
            this.component.shadowRoot.querySelectorAll('.normal_mode').forEach(td => td.remove());
        }
    }
}