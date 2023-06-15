import Header from "../../components/header/header.js";
import TrashButton from "../../components/trashButton/trashButton.js";

import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

export default class DetalleCliente extends Init {
    constructor() {
        super()
    }

    trashOnClick() {

    }

    loadClientInformation() {
        document.querySelectorAll('.client_data').forEach(i => {
            let filled = false;
            for (const d in this.client) {
                const name = i.getAttribute('name')

                if (name === d) {
                    if (name === 'sexo') {
                        switch(this.client[d]) {
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
                        i.innerText = this.client[d];
                        filled = true;
                    }
                }
            }

            if (!filled) i.innerText = 'No se especificó';
        })
    }

    async loadSaleTable() {
        const sale = await VentasController.getSalesResume({cliente_id: this.client.cliente_id});
        console.log(sale);
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        const clientId = window.getParameterByName('cliente_id');
        this.client = await globalThis.models.clientes.findByPk(clientId);

        if (this.client.length == 0) {
            window.location = '/agregar_venta'
        }

        this.client = this.client[0]

        this.loadClientInformation();
        this.loadSaleTable();

        const trashButton = await new TrashButton({
            onclick: this.trashOnClick
        }).loadComponent();

        document.querySelector('.client_information__top').append(trashButton.component.shadowRoot);
    }
}