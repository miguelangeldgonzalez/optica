import Header from "../../components/header/header.js";
import SaleCard from "../../components/saleCard/saleCard.js";
import TrashButton from "../../components/trashButton/trashButton.js";

import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import getCurrency from "../../../utilities/currency.js";

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
        this.bsPrice = await getCurrency();
        for (const s of sale) {
            const card = await new SaleCard({
                ...s,
                bsPrice: this.bsPrice,
                hideName: true
            }).loadComponent();
            document.querySelector('#cards__container').append(card.component.shadowRoot);
        }
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

        document.querySelector('#buttons').append(trashButton.component.shadowRoot);
    }
}