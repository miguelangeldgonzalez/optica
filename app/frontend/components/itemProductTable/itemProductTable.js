import StateCircle from "../stateCircle/stateCircle.js";

export default class ItemProductTable extends Component {
    constructor(context) {
        super(context, 'item-paymenttable');
    }

    async beforeLoad() {
        const name = this.context.producto.nombre;
        if (this.context?.bsPrice) {
            this.component.shadowRoot.querySelector('.bs_price__value').innerText = this.context.bsPrice * this.context.precio;
        } else {
            this.component.shadowRoot.querySelector('.bs_price__container').remove()
        }

        this.component.shadowRoot.querySelector('#product_name').innerText = this.context.producto.nombre;
        this.component.shadowRoot.querySelector('#price').innerText = this.context.precio;

        const editButton = this.component.shadowRoot.querySelector('.edit_button');

        if (name === 'Cristal') {
            const stateCircle = await new StateCircle(this.context.estado).loadComponent();
            let cliente;
            let parteFormulas;

            if (this.context.isGlassesItem) {
                
            } else {
                parteFormulas = await globalThis.models.partes_formulas.findAll({
                    where: {
                        ventas_productos_id: this.context.ventas_productos_id
                    },
                    include: [
                        new globalThis.Association(
                            globalThis.models.formulas,
                            {
                                as: 'formula'
                            }
                        )
                    ]
                })

            }
            
            if(parteFormulas.length >= 0) {
                cliente = await globalThis.models.clientes.findByPk(parteFormulas[0].formula.cliente_id);
                if(cliente.length >= 0) cliente = cliente[0]
            }
            
            if (cliente) {
                this.component.shadowRoot.querySelector('#client_name').innerText = cliente.nombres
                this.component.shadowRoot.querySelector('.client_link').setAttribute('href', `/detalle_cliente?cliente_id=${cliente.cliente_id}`);
            } else {
                this.component.shadowRoot.querySelector('.client_name__container').remove();
            }


            this.component.shadowRoot.querySelector('#state').append(stateCircle.component);

            editButton.addEventListener('click', async e => {
                let newEstadoId;
                if (this.context.estado.estado_id == 1) {
                    newEstadoId = 2;
                } else {
                    newEstadoId = 1;
                }

                let model = this.context.isGlassesItem ? 
                    globalThis.models.parte_lentes :
                    globalThis.models.ventas_productos;

                await model.update(this.context.ventas_productos_id, {
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