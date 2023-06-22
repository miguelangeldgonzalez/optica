import FormulaSelectorItem from "../formulaSelectorItem/formulaSelectorItem.js";

export default class FormulaSelector extends Component {
    constructor(context) {
        super(context, 'formula-selector');

        this.loadComponentOld = this.loadComponent;

        this.loadComponent = async function () {
            await this.loadComponentOld();

            const height = document.querySelector('html').getBoundingClientRect().height;
            this.component.shadowRoot.querySelector('.formula_list__background').style.height = height + 'px';
            this.component.shadowRoot.querySelector('#nombre_cliente').innerText = this.context.nombres
            
            return new Promise(async (resolve, reject) => {
                const list = this.component.shadowRoot.querySelector('.formula_list')

                for (const formula of this.context.formulas) {
                    const item = await new FormulaSelectorItem({
                        formula,
                        resolve,
                        close: this.close
                    }).loadComponent();

                    list.append(item.component.shadowRoot);
                }

                this.component.shadowRoot.querySelector('#cancel').addEventListener('click', e => {
                    this.close();
                    resolve(null);
                })


                document.querySelector('html').append(this.component.shadowRoot);
            })
        }
    }

    close() {
        document.querySelector('.formula_list__background').remove();
    }

}