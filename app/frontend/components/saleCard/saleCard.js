import Component from "../component.js";

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

        if(Array.isArray(this.context.estados) && this.context.estados.length !== 0) {
            for (const e of this.context.estados) {
                const stateCircle = await new StateCircle({
                    nombre_estado: e.nombre_estado,
                    color: e.color
                }).loadComponent();

                stateContainer.append(stateCircle.component);
            }
        } else {
            const e = await globalThis.models.estados.findAll({
                where: {
                    por_defecto: true
                }
            })

            const stateCircle = await new StateCircle({
                nombre_estado: e[0].nombre_estado,
                color: e[0].color
            }).loadComponent();

            stateContainer.append(stateCircle.component);
        }

        this.component.shadowRoot.querySelector('.card__container').onclick = e => {
            window.location = '/detalle_de_venta?id=' + this.context.venta_id
        }
    }

}