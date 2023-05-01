import Component from '../component.js';
import UserController from "../../../backend/controllers/user.controller.js";


export default class Header extends Component {
    menuOpen = true;

    constructor (context) {
        super(context, 'header-component');
    }

    async closeSession() {
        this.DOMComponent.querySelector('#close_session').addEventListener('click', async e => {
            await UserController.closeSession();
            window.location = '/'
        });
    }

    async userMenu() {
        this.DOMComponent.querySelector('#profile_img').addEventListener('click', e => {
            if (this.menuOpen) {
                this.DOMComponent.querySelector('.user-menu__container').style.animationName = 'show_menu';
                
                setTimeout(() => {
                    this.DOMComponent.querySelector('.user-menu__container').classList.add('menu_open')
                    this.DOMComponent.querySelector('.user-menu__container').classList.remove('menu_close')
                }, 300)
            } else {
                this.DOMComponent.querySelector('.user-menu__container').style.animationName = 'hide_menu';
                setTimeout(() => {
                    this.DOMComponent.querySelector('.user-menu__container').classList.add('menu_close')
                    this.DOMComponent.querySelector('.user-menu__container').classList.remove('menu_open')
                }, 300)
            }

            this.menuOpen = !this.menuOpen;
        })
    }
    
    afterLoad() {
        if(this.context.user.rol == 'ADMINISTRADOR') this.DOMComponent.querySelector('#user_option').style.display = 'block';


        this.closeSession()
        this.userMenu()
    }
}
