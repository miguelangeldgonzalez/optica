import Component from '../component.js';
import UserController from "../../../backend/controllers/user.controller.js";


export default class Header extends Component {
    menuOpen = true;

    constructor (context) {
        super(context, 'header-component');
    }

    async closeSession() {
        document.querySelector('#close_session').addEventListener('click', async e => {
            await UserController.closeSession();
            window.location = '/'
        });
    }

    async userMenu() {
        const menu = document.querySelector('.user-menu__container');
        document.querySelector('#profile_img').addEventListener('click', e => {
            this.menuOpen ? menu.classList.remove('display_none') : menu.classList.add('display_none')
            this.menuOpen = !this.menuOpen;
        })
    }
    
    afterLoad() {
        if(this.context.user.rol !== 'ADMINISTRADOR') document.querySelectorAll('.only_admin').forEach(element => {
            element.remove();
        });

        this.closeSession()
        this.userMenu()
    }
}
