import Init from "./init.js";
import Header from "../../components/header/header.js";
import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import SaleCard from "../../components/saleCard/saleCard.js";

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
        this.ventas = await VentasController.getSalesResume();
        const main = document.querySelector('.panel__sales');

        if (Array.isArray(this.ventas))  {
            for (const v of this.ventas) {
                let estados = [];
    
                if(v.lentes.length) {
                    for (let index = 0; index < v.lentes.length; index++) {
                        const element = v.lentes[index];
                        estados.push(element.estado)
                    }
                }
    
                const saleCard = await new SaleCard({
                    total: v.total,
                    cliente: v.cliente,
                    fecha: v.fecha,
                    venta_id: v.venta_id,
                    estados
                }).loadComponent()
                
                main.append(saleCard.component.shadowRoot);
            }
        }
    }

    async beforeLoad() {
        
    }
}