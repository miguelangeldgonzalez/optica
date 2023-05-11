import Init from "./init.js";
import Header from "../../components/header/header.js";

import VentasController from "../../../backend/controllers/ventas.controller.js";

// Controllers
import FormFormula from "../../components/formFormula/formFormula.js";
import ProductButton from "../../components/productButton/productButton.js";
import UserController from "../../../backend/controllers/user.controller.js";
import ShowClientData from "../../components/showClientData/showClientData.js";
import ProductItemSale from "../../components/productItemSale/productItemSale.js";
import ProductController from "../../../backend/controllers/product.controller.js";

export default class AgregarVenta extends Init {
    step = 1;
    total = 0;

    glassesId = 0;
    commonItemId = 0;
    formFormulaId = 0;

    clientData = {}

    commonItem = {};
    formFormula = [];
    glassesItem = {};

    commonProductsWithFormula = []

    constructor() {
        super();
    }

    /* Form Formula Handlers */
    setFormFormula(id, data) {
        this.formFormula[id] = data;
    }

    unsetFormFormula(id) {
        console.log(id);
        this.formFormula.splice(id, 1);
    }

    /* Glasses and common Item handlers */

    getCommonItemID() {
        const currentId = this.commonItemId;
        this.commonItemId++;

        return currentId;
    }

    setCommonItem(id, data) {
        this.commonItem[id] = data
        this.updateTotal();
    }

    unsetCommonItem(id) {
        delete this.commonItem[id]
        this.updateTotal();
    }

    getGlassItemID() {
        const currentId = this.glassesId;
        this.glassesId++;

        return currentId;
    }

    unsetGlassesItem(id) {
        delete this.glassesItem[id]
        this.updateTotal();
    }

    setGlassesItem(id, data) {
        this.glassesItem[id] = {
            ...data
        }
        this.updateTotal();
    }

    updateTotal() {
        let total = 0;
        for (const i in this.commonItem) {
            if (this.commonItem[i]?.precio) total += this.commonItem[i].precio
        }

        for (const g in this.glassesItem) {
            for (const i in this.glassesItem[g]) {
                if(this.glassesItem[g][i]?.precio) total += this.glassesItem[g][i]?.precio
            }
        }
        
        this.total = total;
        document.querySelector('#total_value').innerText = this.total;
    }

    async loadHeader() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component);
        header.afterLoad();
    }

    nextAction(steps = 0) {
        document.querySelector('.slider').style.right = `calc(100% * ${this.step + steps})`;
        this.step += (steps + 1);
    }

    async loadNextAction() {
        document.querySelector('#first_step').addEventListener('submit', e => {
            e.preventDefault();
            this.clientData = FormData.extractFromElement('#first_step');
            this.nextAction();
        })

        document.querySelector('#second_step').addEventListener('submit', async e => {
            e.preventDefault();
            
            if (!Object.isEmpty(this.glassesItem) || !Object.isEmpty(this.commonItem)) {
                let commonProductsWithFormula = [];
    
                for (const i in this.commonItem) {
                    if(this.commonItem[i].necesita_formula) commonProductsWithFormula.push(this.commonItem[i]);
                }

                if (commonProductsWithFormula.length != 0 || !Object.isEmpty(this.glassesItem)) {
                    this.commonProductsWithFormula = commonProductsWithFormula;
                    await this.loadThirdStep();
                    this.nextAction();
                } else {
                    this.nextAction(1);
                }

            } else {
                alert('No ha seleccionado ningún producto')
            }
        })

        document.querySelector('#third_step').addEventListener('submit', async e => {
            e.preventDefault();
            const checked = [];

            document.querySelectorAll(".available_items input[type='checkbox']").forEach(i => {
                if (i.checked) {
                    if(checked[parseInt(i.getAttribute('available_id'))]) {
                        checked[parseInt(i.getAttribute('available_id'))]++;
                    } else {
                        checked[parseInt(i.getAttribute('available_id'))] = 1
                    }
                }
            })

            if (checked.filter(c => c > 1).length != 0) return alert("No se puede seleccionar el mismo productos en más de una formula");
            if (checked.filter(c => c).length != this.availablesLength) return alert('Debe indicar a que formula pertenece cada producto');
            if (this.formFormula.filter(f => f.hasOneChecked()).length != this.formFormula.length) return alert('Todas las formulas deben contener al menos un producto');

            this.nextAction();
        })

        document.querySelector('#fourth_step').addEventListener('submit', e => {
            e.preventDefault();

            this.paymentData = FormData.extractFromElement('#fourth_step');
            this.loadFifthStep();
            this.nextAction();
        })
    }

    async loadProducButtons() {
        this.products = await ProductController.getAll();
        const container = document.querySelector('.products_button__container')

        for(const p of this.products) {
            const productButton = await new ProductButton({button: p, parentContext: this}).loadComponent();
            container.append(productButton.component);
        }
    }

    loadCheckbox(component) {
        document.querySelector("input[type='checkbox'").addEventListener('change', e => {
            this.clientUsed = e.target.checked;
            if (e.target.checked)  {
                component.chageClientData(this.clientData);
            } else {
                component.chageClientData({nombres: '', cedula: ''});
            }
        })
    }

    async loadFifthStep() {
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
        const clientFormulaContainer = document.querySelector('#client_formula_data');
        clientFormulaContainer.append(clientData.component.shadowRoot);

        if (Array.isArray(clientes)) {
            for (let index = 0; index < clientes.length; index++) {
                const element = clientes[index];
                const cliente = await new ShowClientData(element).loadComponent();

                clientFormulaContainer.append(cliente.component.shadowRoot);
            }
        }

        const productData = document.querySelector('#products_data__table');

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
                data_cliente: this.clientData,
                commonItem: this.commonItem,
                glassesItem: this.glassesItem,
                payment: this.paymentData
            })
            
            if (result) {
                alert("Se ha introducido la compra correctamente");
                window.location = '/panel_principal';
            } else {
                alert("Algo ha salido mal, recargue e intentelo de nuevo");
            }
        })
    }

    async loadThirdStep() {
        document.querySelector('#client_name').innerText = this.clientData?.nombres;
        const firstFormFormula = await new FormFormula(this, this.formFormulaId, true).loadComponent();

        this.loadCheckbox(firstFormFormula);
        document.querySelector('#third_step .buttons').before(firstFormFormula.component.shadowRoot);
        
        firstFormFormula.afterLoad();
        this.formFormula[this.formFormulaId] = firstFormFormula;
        
        document.querySelector("#add_formula").addEventListener("click", async e => {
            this.formFormulaId++;
            const formFormula = await new FormFormula(this, this.formFormulaId).loadComponent();
            document.querySelector('#third_step .buttons').before(formFormula.component.shadowRoot);
            formFormula.afterLoad();

            this.formFormula[this.formFormulaId] = formFormula;
        })
    }

    async secondStep() {
        document.querySelector('#second_step').addEventListener('submit', e => {
            e.preventDefault();

            const productIds = document.querySelectorAll("input[name='producto_id']");
            const productPrices = document.querySelectorAll("input[name='precio']");
            let products = new Array();

            for (let i = 0; i < productIds.length; i++) {
                products.push({
                    producto_id: productIds[i],
                    precio: productPrices[i]
                })
            }

            this.products = products;
        })

        document.querySelector('#total_value').innerText = this.total;
    }

    getAvaliables() {
        let availables = {};
        let id = 0;

        for (const i in this.commonProductsWithFormula) {
            availables[id] = {
                description: this.commonProductsWithFormula[i].nombre + ' - ' + this.commonProductsWithFormula[i].precio + '$',
                commonId: i,
                type: 'common',
                id
            }
            id++
        }

        for (const g in this.glassesItem) {
            for(const i in this.glassesItem[g]) {
                if (this.glassesItem[g][i].necesita_formula) {
                    availables[id] = {
                        description: `Lentes - ${this.glassesItem[g][i].nombre} - ${this.glassesItem[g][i].precio} $`,
                        glassesId: g,
                        itemId: i,
                        type: 'glasses',
                        id
                    }
                    id++;
                }
            }
        }

        this.availablesLength = id;
        return availables;
    }

    load() {
        this.secondStep();
        this.loadProducButtons();
        this.loadHeader();
        this.loadNextAction();
    }
}