

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
            //await UserController.delete(usuario.usuario_id);
            location.reload();
        }

    }

    loadEdit() {
        const usuario = this.context
        this.component.shadowRoot.querySelector('#edit_button').addEventListener('click', async e => {
            const rol = this.context.rol === 'ADMINISTRADOR' ? 'USUARIO' : 'ADMINISTRADOR'
            const message = `¿Esta seguro que desea cambiar el rol del usuario a ${rol}`;

            if (confirm(message)) {
                await UserController.changeRol(usuario.usuario_id);
                location.reload();
            }
        })
    }

    async beforeLoad() {
        const celdas = this.component.shadowRoot.querySelectorAll('td, span');
        const usuario = this.context;

        this.loadEdit()

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