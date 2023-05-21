import Component from "../component.js";

export default class ShowClientData extends Component {
    constructor(context) {
        super(context, 'show-client-data')
    }

    beforeLoad() {
        const clientKeys = Object.keys(this.context);
        const formulaKeys = this.context.formula ? Object.keys(this.context.formula) : false;
        
        this.component.shadowRoot.querySelectorAll('td').forEach(e => {
            const name = e.getAttribute('name');
            
            if (clientKeys.some(k => k === name)) e.innerText = this.context[name];
        })

        if (Array.isArray(formulaKeys)) {
            this.component.shadowRoot.querySelectorAll('input').forEach(e => {
                const name = e.getAttribute('name');

                if(formulaKeys.some(k => k === name)) {
                    let value;

                    switch (this.context.formula[name]) {
                        case true:
                            value = 'Si';
                            break;
                        case false:
                            value = 'No';
                            break;
                        default:
                            value = this.context.formula[name]
                    }

                    e.value = value;
                }
                    
            })
        } else {
            this.DOMComponent.querySelector('.formula_data').remove();
        }
    }
}