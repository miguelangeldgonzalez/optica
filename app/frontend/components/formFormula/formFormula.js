import Component from "../component.js"; 

import AvailableItem from "../availableItem/availableItem.js";

export default class FormFormula extends Component {
    constructor(context, id, first = false) {
        super(context, 'form-formula');
        this.id = id;
        this.first = first;
    }

    beforeLoad() {
        this.component.shadowRoot.querySelector('.form_formula__container').setAttribute('form_id', this.id);
        if (!this.first) this.component.shadowRoot.querySelector(`div[form_id='${this.id}'] .delete_form_formula`).classList.remove('display_none');
    }

    chageClientData(data) {
        document.querySelectorAll(`div[form_id='${this.id}'] .client_data`).forEach(i => {
            for(const d in data) {
                if(i.getAttribute('name') == d) {
                    i.value = data[d];
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
    
    getData() {
        const clientData = {};
        document.querySelectorAll(`div[form_id='${this.id}'] .client_data`).forEach(i => {
            clientData[i.getAttribute('name')] = i.value;
        })

        clientData.formula = {};
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