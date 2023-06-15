

import StateCircle from "../stateCircle/stateCircle.js";

export default class SaleCard extends Component {
    constructor(context) {
        super(context, 'sale-card');
    }

    async beforeLoad() {
        this.component.shadowRoot.querySelector('.card__title_name').innerText = this.context.cliente.nombres;
        this.component.shadowRoot.querySelector(`td[name='fecha']`).innerText = this.context.fecha.toLocaleDateString();
        this.component.shadowRoot.querySelector(`td[name='total']`).innerText = this.context.total;

        const stateContainer = this.component.shadowRoot.querySelector(`td[name='estado']`);

        console.log(this.context.estado_global);
        const stateCircle = await new StateCircle(this.context.estado_global).loadComponent();
        stateContainer.append(stateCircle.component);

        const link = '/detalle_de_venta?id=' + this.context.venta_id

        this.component.shadowRoot.querySelector('#card__title_link').setAttribute('href', link)

        this.component.shadowRoot.querySelector('#delete_button').addEventListener('click', async e => {
            if(confirm('¿Esta seguro que desea eliminar la venta?')) {
                await globalThis.models.ventas.delete(this.context.venta_id);
                location.reload();
            }
        })
    }

}