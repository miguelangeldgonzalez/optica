import Init from "./init.js";
import Header from "../../components/header/header.js";
import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

export default class PanelPrincipal extends Init{
    constructor() {
        super()
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();
    }

    async afterLoad() {
        VentasController.getSalesResume();
    }

    async beforeLoad() {
        
    }
}