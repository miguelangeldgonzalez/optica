import FormulaSelectorItem from "../formulaSelectorItem/formulaSelectorItem.js";

export default class FormulaSelector extends Component {
    constructor(context) {
        super(context, 'formula-selector');

        this.loadComponentOld = this.loadComponent;

        this.context = {
            "nombres": "Marco Peralta",
            "sexo": "M",
            "fecha_nacimiento": "2023-06-04 00:00:00",
            "cedula": 24252627,
            "telefono": 123456789,
            "fecha": "2023-06-14 00:06:00",
            "formulas": [
                {
                    "formula_id": 1,
                    "cliente_id": 14,
                    "parte_id": 0,
                    "esferico_ojo_derecho": 12,
                    "esferico_ojo_izquierdo": 2,
                    "cilindro_ojo_derecho": 12,
                    "cilindro_ojo_izquierdo": 2,
                    "eje_ojo_derecho": 1,
                    "eje_ojo_izquierdo": 2,
                    "adicion_ojo_derecho": 2,
                    "adicion_ojo_izquierdo": 2,
                    "distancia_pupilar": 2,
                    "es_progresivo": false,
                    fecha: "2023-06-14 00:06:00"
                }
            ]
        }

        this.loadComponent = async function () {
            await this.loadComponentOld();

            const height = document.querySelector('html').getBoundingClientRect().height;
            this.component.shadowRoot.querySelector('.formula_list__background').style.height = height + 'px';
            
    
            
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