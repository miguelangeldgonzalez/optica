import Header from '../../components/header/header.js';
import ClientRow from '../../components/clientRow/clientRow.js';
import UserController from '../../../backend/controllers/user.controller.js';

export default class Clientes extends Init {
    constructor() {
        super()
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        this.allClients = await globalThis.models.clientes.findAll();
        console.log(this.allClients);

        const table = document.querySelector('table');
        
        for (const user of this.allClients) {
            const ur = await new ClientRow(user).loadComponent();
            table.append(ur.component.shadowRoot);
        }
    }
}