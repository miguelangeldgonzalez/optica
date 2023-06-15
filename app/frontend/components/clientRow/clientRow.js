import TrashButton from "../trashButton/trashButton.js";

export default class ClientRow extends Component {
    constructor(context) {
        super(context, 'user-row');
    }

    static async deleteClient(e, usuario) {
        console.log(usuario);
        const message = `¿Esta seguro que desea eliminar al cliente ${usuario.nombres}?`;

        if (confirm(message)) {
            console.log(usuario.cliente_id);
            await globalThis.models.clientes.delete(usuario.cliente_id);
            location.reload();
        }

    }

    async beforeLoad() {
        const celdas = this.component.shadowRoot.querySelectorAll('td, span, a');
        const usuario = this.context;
        
        const trashButton = await new TrashButton({
            onclick: e => {
                ClientRow.deleteClient(e, usuario)
            }
        }).loadComponent();
        
        this.component.shadowRoot.querySelector('#buttons').append(trashButton.component.shadowRoot);  
        this.component.shadowRoot.querySelector(`a[name='cliente_id']`).setAttribute('href', `/detalle_cliente?cliente_id=${this.context.cliente_id}`)

        celdas.forEach(c => {
            const name = c.getAttribute('name');

            if(name != undefined && this.context[name] != undefined) {
                c.innerText = this.context[name]
            }
        })
    }
}