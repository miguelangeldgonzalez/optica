export default class FormulaSelectorItem extends Component {
    constructor(context) {
        super(context, 'formula-selector-item');
    }

    beforeLoad() {
        console.log(this.context.formula);

        this.component.shadowRoot.querySelectorAll('td').forEach(td => {
            for (const f in this.context.formula) {
                if(td.getAttribute('name') == f) td.innerText = this.context.formula[f];
            }
        })

        this.component.shadowRoot.querySelector('button').addEventListener('click', e => {
            this.context.close()
            this.context.resolve(this.context.formula);
        })
    }
}