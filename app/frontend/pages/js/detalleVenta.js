import Header from "../../components/header/header.js";
import TrashButton from "../../components/trashButton/trashButton.js";
import PaymentTable from "../../components/paymentTable/paymentTable.js";
import CommonProductsTable from "../../components/commonProductsTable/commonProductsTable.js";

import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import GlassesTable from "../../components/glassesTable/glassesTable.js";

export default class DetalleVenta extends Init {
    constructor() {
        super();
    }

    async loadGlassesInformation() {
        for (const lente of this.venta.lentes) {
            const glassesTable = await new CommonProductsTable(lente.parte_lentes).loadComponent();
            document.querySelector('.products_information').append(glassesTable.component);
        }

    }

    async loadProductInformation() {
        if(this.venta.lentes.length !== 0) {
            this.loadGlassesInformation()
        }

        if(this.venta.ventas_productos.length !== 0) {
            const table = await new CommonProductsTable(this.venta.ventas_productos).loadComponent();
            document.querySelector('.products_information').append(table.component.shadowRoot);
        }
    }

    async trashOnClick(e, context) {
        if(confirm('¿Esta seguro que desea eliminar la venta?')) {
            await globalThis.models.ventas.delete(context[0].venta_id);
            window.location = '/ventas'
        }
    }

    loadClientInformation() {
        document.querySelectorAll('.client_data').forEach(i => {
            let filled = false;
            for (const d in this.venta.cliente) {
                const name = i.getAttribute('name')

                if (name === d) {
                    if (name === 'sexo') {
                        switch(this.venta.cliente[d]) {
                            case 'M':
                                i.innerText = 'Masculino';
                                filled = true;
                                break;
                            case 'F':
                                i.innerText = 'Femenino';
                                filled = true;
                                break;
                        }
                    } else {
                        i.innerText = this.venta.cliente[d];
                        filled = true;
                    }
                }
            }

            if (!filled) i.innerText = 'No se especificó';
        })
    }

    async loadPaymentInformation() {
        document.querySelector('#total').innerText = this.venta.total;

        const paymentTable = await new PaymentTable(this.venta.pagos).loadComponent();
        document.querySelector('.products_information').after(paymentTable.component.shadowRoot);
    }
    
    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        const id = window.getParameterByName('id');

        
        const venta = await VentasController.getSalesResume({
            venta_id: parseInt(id)
        });
        if (venta.length === 0) window.location = '/ventas';

        const trashButton = await new TrashButton({
            onclick: e => {
                this.trashOnClick(e, venta)
            }
        }).loadComponent();

        document.querySelector('.client_information__top').append(trashButton.component.shadowRoot);

        this.venta = venta[0];

        this.loadClientInformation();
        this.loadProductInformation();
        this.loadPaymentInformation();

        this.main = document.querySelector('main');
        console.log(this);
    }
}