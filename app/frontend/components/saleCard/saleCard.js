import StateCircle from "../stateCircle/stateCircle.js";

export default class SaleCard extends Component {
    constructor(context) {
        super(context, 'sale-card');
    }

    async beforeLoad() {
        if (this.context?.bsPrice) {
            this.component.shadowRoot.querySelector('.bs_price__value').innerText = this.context.bsPrice * this.context.total;
        } else {
            this.component.shadowRoot.querySelector('.bs_price__container').remove()
        }

        if(!this.context.hideName) this.component.shadowRoot.querySelector('.card__title_name').innerText = this.context.nombres;
        this.component.shadowRoot.querySelector(`td[name='fecha']`).innerText = this.context.fecha.toLocaleString();
        this.component.shadowRoot.querySelector(`[name='total']`).innerText = this.context.total;

        const stateContainer = this.component.shadowRoot.querySelector(`td[name='estado']`);

        const stateCircle = await new StateCircle(this.context).loadComponent();
        stateContainer.append(stateCircle.component);

        const link = '/detalle_de_venta?id=' + this.context.venta_id

        this.component.shadowRoot.querySelector('.card__container').addEventListener('click', e => {
            window.location = link
        })

        this.component.shadowRoot.querySelector('#delete_button').addEventListener('click', async e => {
            if(confirm('¿Esta seguro que desea eliminar la venta?')) {
                await globalThis.models.ventas.delete(this.context.venta_id);
                location.reload();
            }
        })
    }

}