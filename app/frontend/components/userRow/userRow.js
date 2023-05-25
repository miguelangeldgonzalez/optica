import Component from "../component.js";

import TrashButton from "../trashButton/trashButton.js";
import UserController from "../../../backend/controllers/user.controller.js";

export default class UserRow extends Component {
    constructor(context) {
        super(context, 'user-row');
    }

    static async deleteUser(e, usuario) {
        console.log(usuario);
        const message = `¿Esta seguro que desea eliminar al usuario ${usuario.nombres}?`;

        if (confirm(message)) {
            console.log(usuario.usuario_id);
            //UserController.delete(usuario.usuario_id);
        }

    }

    async beforeLoad() {
        const celdas = this.component.shadowRoot.querySelectorAll('td, span');
        const usuario = this.context;

        const trashButton = await new TrashButton({
            onclick: e => {
                UserRow.deleteUser(e, usuario)
            }
        }).loadComponent();

        this.component.shadowRoot.querySelector('#buttons').append(trashButton.component.shadowRoot);  

        celdas.forEach(c => {
            const name = c.getAttribute('name');

            if(name != undefined) c.innerText = this.context[name];
        })
    }
}