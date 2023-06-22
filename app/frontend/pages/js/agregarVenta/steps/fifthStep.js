import { stepEvents } from "../utils.js";

import VentasController from '../../../../../backend/controllers/ventas.controller.js';

import ShowClientData from '../../../../components/showClientData/showClientData.js';
import ProductItemSale from '../../../../components/productItemSale/productItemSale.js';

export default async function fifthStep(event) {
    switch (event) {
        case stepEvents.PRELOAD_STEP: 
            const previousClientData = document.querySelectorAll('.show_client_data');

            if (previousClientData.length !== 0) previousClientData.forEach(cD => cD.remove());

            const clientFormulaContainer = document.querySelector('#client_formula_data');
            const productData = document.querySelector('#products_data__table');

            productData.innerHTML = '';

            let clientes = []
            if (this.clientUsed) {
                const telefono = this.clientData.telefono;
                this.clientData = this.formFormula[0].getData();
                this.clientData.telefono = telefono;

                if (this.formFormula.length > 1) {
                    for (let index = 1; index < this.formFormula.length; index++) {
                        const f = this.formFormula[index];
                        clientes.push(f.getData());
                    }
                }
            } else {
                for (let index = 0; index < this.formFormula.length; index++) {
                    const f = this.formFormula[index];
                    clientes.push(f.getData());
                }
            }

            const clientData = await new ShowClientData(this.clientData).loadComponent();
            clientFormulaContainer.append(clientData.component.shadowRoot);

            if (Array.isArray(clientes)) {
                for (let index = 0; index < clientes.length; index++) {
                    const element = clientes[index];
                    const cliente = await new ShowClientData(element).loadComponent();

                    clientFormulaContainer.append(cliente.component.shadowRoot);
                }
            }


            if (!Object.isEmpty(this.commonItem)) {
                for (const i in this.commonItem) {
                    const item = await new ProductItemSale({type: 'common', ...this.commonItem[i]}).loadComponent();
                    productData.append(item.component.shadowRoot);
                } 
            }

            if (!Object.isEmpty(this.glassesItem)) {
                for (const i in this.glassesItem) {
                    const item = await new ProductItemSale({type: 'glasses', ...this.glassesItem[i]}).loadComponent();
                    productData.append(item.component.shadowRoot);
                }
            }

            document.querySelector('#show_total').innerText = this.total;

            document.querySelector('#end').addEventListener('click', async e => {
                const result = await VentasController.create({
                    clientes,
                    data_cliente: this.clientData || this.clientAlreadyExists,
                    commonItem: this.commonItem,
                    glassesItem: this.glassesItem,
                    payment: this.paymentData
                })
                
                if (result) {
                    alert("Se ha introducido la compra correctamente");
                    window.location = '/ventas';
                } else {
                    alert("Algo ha salido mal, recargue e intentelo de nuevo");
                }
            })
            break;
    }
}