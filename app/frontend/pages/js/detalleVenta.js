import Header from "../../components/header/header.js";
import TrashButton from "../../components/trashButton/trashButton.js";
import PaymentTable from "../../components/paymentTable/paymentTable.js";
import ProductsTable from "../../components/productsTable/productsTable.js";

import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import getCurrency from "../../../utilities/currency.js";

export default class DetalleVenta extends Init {
    constructor() {
        super();
    }

    async loadProductInformation() {
        const table = await new ProductsTable({
            ...this.venta,
            bsPrice: this.bsPrice
        }).loadComponent();
        document.querySelector('.products_information').append(table.component.shadowRoot);
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
        const paymentTable = await new PaymentTable({
            bsPrice: this.bsPrice,
            pagos: this.venta.pagos
        }).loadComponent();
        document.querySelector('.payment_information').append(paymentTable.component.shadowRoot);
    }
    
    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        this.bsPrice = await getCurrency();


        const id = window.getParameterByName('id');

        
        const venta = await VentasController.getSaleById({
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
        await this.loadProductInformation();
        this.loadPaymentInformation();

        this.main = document.querySelector('main');

        console.log(this);
    }
}