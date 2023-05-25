import Init from "./init.js";
import Header from "../../components/header/header.js";
import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import GlassesTable from "../../components/glassesTable/glassesTable.js";

export default class DetalleVenta extends Init {
    constructor() {
        super();
    }

    async loadGlassesInformation() {
        for (const lente of this.venta.lentes) {
            const glassesTable = await new GlassesTable(lente).loadComponent();
            this.main.append(glassesTable.component);
        }

    }

    async loadProductInformation() {
        if(this.venta.lentes.length !== 0) {
            this.loadGlassesInformation()
        }
    }
    
    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        const id = window.getParameterByName('id');

        const venta = await VentasController.getSalesResume(parseInt(id));
        if (venta.length === 0) window.location = '/ventas';

        this.venta = venta[0];

        this.loadProductInformation();
        this.main = document.querySelector('main');
    }
}