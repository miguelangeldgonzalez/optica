import AvailableItem from "../availableItem/availableItem.js";
import FormulaSelector from "../formulaSelector/formulaSelector.js";

export default class FormFormula extends Component {
    constructor(context, id, first = false) {
        super(context, 'form-formula');
        this.id = id;
        this.first = first;
    }

    beforeLoad() {
        this.component.shadowRoot.querySelector('.form_formula__container').setAttribute('form_id', this.id);
        if (!this.first) this.component.shadowRoot.querySelector(`div[form_id='${this.id}'] .delete_form_formula`).classList.remove('display_none');

        this.component.shadowRoot.querySelector('#search_dni').addEventListener('click', async e => {
            console.log(e.target.nextElementSibling.value);
            const cliente = await globalThis.models.clientes.findAll({
                where: {
                    cedula: e.target.nextElementSibling.value
                },
                include: [
                    new globalThis.Association(
                        globalThis.models.formulas,
                        {
                            hasForeighKey: true,
                            type: 'ONE_TO_MANY'
                        }
                    )
                ]
            })

            if(cliente.length >= 1) {
                let newData = cliente[0];
                console.log(cliente);
                this.cliente_id = cliente[0].cliente_id

                if (cliente[0].formulas.length >= 1) {
                    const selector = await new FormulaSelector(cliente[0]).loadComponent();
                    console.log(selector);

                    if (selector) {
                        newData = {
                            ...newData,
                            ...selector
                        }

                        this.formula_id = selector.formula_id
                    }

                }

                console.log(this);
                this.chageClientData(newData);
            } else {
                alert('No hay ningun cliente con esa cedula')
            }
        })
    }

    chageClientData(data) {
        document.querySelectorAll(`div[form_id='${this.id}'] .client_data`).forEach(i => {
            for(const d in data) {
                if (i.getAttribute('name') == d) {
                    if (i.type === 'date') {
                        try {
                            const value = data[d] instanceof Date ? data[d] : new Date(data[d]);
                            i.value = value.toISOString().split('T')[0];
                        } catch {}
                    } else {
                        i.value = data[d];
                    }
                }
            }
        })
    }

    async loadDelete() {
        document.querySelector(`div[form_id='${this.id}'] .delete_form_formula`).addEventListener('click', e => {
            document.querySelector(`div[form_id='${this.id}']`).remove();
            this.context.unsetFormFormula(this.id);
        })
    }

    async loadAvailable() {
        const availables = this.context.getAvaliables();
        for (const a in availables) {
            const availableItem = await new AvailableItem(availables[a]).loadComponent(); 
            document.querySelector(`div[form_id='${this.id}'] .available_items`).append(availableItem.component.shadowRoot); 
        }
    }

    afterLoad() {
        this.loadDelete()
        this.loadAvailable()
    }

    async reloadAvailables() {
        document.querySelectorAll(`div[form_id='${this.id}'] .available_items label`).forEach(l => l.remove());
        await this.loadAvailable();
    }
    
    getData() {
        const clientData = {};

        if (this.cliente_id) {
            clientData.cliente_id = this.cliente_id
        }
        document.querySelectorAll(`div[form_id='${this.id}'] .form_group .client_data`).forEach(i => {
            clientData[i.getAttribute('name')] = i.value;
        })

        clientData.formula = {
            usedIn: []
        };

        if (this.formula_id) {
            clientData.formula.formula_id = this.formula_id;
        }

        document.querySelectorAll(`div[form_id='${this.id}'] .formula_data input`).forEach(i => {
            let value;

            switch (i.value) {
                case 'on':
                    value = true;
                    break;
                case 'off':
                    value = false;
                    break;
                default:
                    value = i.value;
            }

            clientData.formula[i.getAttribute('name')] = value;
        })

        document.querySelectorAll(`div[form_id='${this.id}'] input[type='checkbox']`).forEach(i => {
            if (i.checked) {
                if (i.getAttribute('available_type') === 'common') {
                    clientData.formula.usedIn.push({
                        type: 'common',
                        id: i.getAttribute('common_id')
                    })
                } else {
                    clientData.formula.usedIn.push({
                        type: 'glasses',
                        glasses_id: i.getAttribute('glasses_id'),
                        item_id: i.getAttribute('item_id')
                    })
                }
            } 
        })

        console.log(clientData);
        return clientData;
    }

    hasOneChecked() {
        let valid = false;
        document.querySelectorAll(`div[form_id='${this.id}'] input[type=checkbox]`).forEach(b => {
            if(b.checked) valid = true;
        })

        return valid;
    }
}