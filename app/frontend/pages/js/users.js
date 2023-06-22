import Header from '../../components/header/header.js';
import UserRow from '../../components/userRow/userRow.js';
import UserController from '../../../backend/controllers/user.controller.js';

export default class Users extends Init {
    constructor() {
        super()
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';
        if (this.user.rol !== 'ADMINISTRADOR') window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        this.allUsers = await UserController.getAllUsers();
        console.log(this.allUsers);

        const table = document.querySelector('table');
        
        for (const user of this.allUsers) {
            const ur = await new UserRow(user).loadComponent();
            table.append(ur.component.shadowRoot);
        }
    }
}