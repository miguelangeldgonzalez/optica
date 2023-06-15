import StateCircle from "../stateCircle/stateCircle.js";

export default class ItemProductTable extends Component {
    constructor(context) {
        super(context, 'item-product-table');
    }

    async beforeLoad() {
        console.log(this.context)
        const name = this.context.producto.nombre;

        this.component.shadowRoot.querySelector('#product_name').innerText = this.context.producto.nombre;
        this.component.shadowRoot.querySelector('#price').innerText = this.context.precio;

        const editButton = this.component.shadowRoot.querySelector('.edit_button');

        if (name === 'Cristal') {
            const stateCircle = await new StateCircle(this.context.estado).loadComponent();
            this.component.shadowRoot.querySelector('#state').append(stateCircle.component);

            editButton.addEventListener('click', async e => {
                let newEstadoId;
                if (this.context.estado.estado_id == 1) {
                    newEstadoId = 2;
                } else {
                    newEstadoId = 1;
                }

                await globalThis.models.ventas_productos.update(this.context.id, {
                    estado_id: newEstadoId
                })

                const estado = await globalThis.models.estados.findByPk(newEstadoId);
                this.context.estado = estado[0];

                console.log(this.context.estado);

                stateCircle.setContext(this.context.estado);
            })
        } else {
            editButton.remove();
        }
    }
}