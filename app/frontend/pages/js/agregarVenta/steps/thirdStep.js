import { stepEvents } from "../utils.js";
import FormFormula from "../../../../components/formFormula/formFormula.js";

export default async function thirdStep(event) {
    this.loadCheckbox = function(component) {
        document.querySelector("input[type='checkbox'").addEventListener('change', e => {
            this.clientUsed = e.target.checked;
            if (e.target.checked)  {
                component.chageClientData(this.clientData);

                if(this.clientAlreadyExists) {
                    document.querySelector('.form_formula__container #search_dni').click();
                }
            } else {
                component.chageClientData({nombres: '', cedula: ''});
            }
        })
    }

    this.getAvaliables = function() {
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

    this.renderThirdStep = async function() {
        this.thirdStepAlreadyRendered = true;
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

    this.onThirdStep = async function() {
        // Si no hay productos con formula o lentes pasa al siguiente paso
        if (!(this?.commonProductsWithFormula?.length != 0 || !Object.isEmpty(this.glassesItem))) {
            this.nextAction();
            this.skipThirdStep = true;
        } else {
            this.skipThirdStep = false;
            document.querySelector('#client_name').innerText = this.clientData?.nombres;
            if (!this.thirdStepAlreadyRendered) await this.renderThirdStep();
        }

    }

    this.validateThirdStep = async function() {
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
    }

    switch (event) {
        case stepEvents.BEFORE_NEXT_STEP: 
            await this.validateThirdStep();
            break;
        case stepEvents.ON_STEP:
            console.log("hola")
            await this.onThirdStep();
    }
}