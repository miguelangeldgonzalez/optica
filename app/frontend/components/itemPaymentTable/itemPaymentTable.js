export default class ItemPaymentTable extends Component {
    constructor(context) {
        super(context, 'item-product-table');
    }

    async beforeLoad() {
        console.log(this.context);

        if(!this.context.insertMode) {
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