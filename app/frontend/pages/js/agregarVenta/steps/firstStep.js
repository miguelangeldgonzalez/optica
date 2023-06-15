import { stepEvents } from "../utils.js";

export default async function firstStep(event) {
    this.loadSearhClient = function() {
        document.querySelector('#search_dni').addEventListener('click', async e => {
            const client = await globalThis.models.clientes.findAll({
                where: {
                    cedula: document.querySelector(`input[name="cedula"]`).value,
                    include: [
                        new globalThis.Association(
                            globalThis.models.formulas,
                            {
                                hasForeighKey: true,
                                type: 'ONE_TO_MANY'
                            }
                        )
                    ]
                }
            })
            
            if (client.length != 0) {
                this.clientAlreadyExists = client[0];

                document.querySelectorAll('#first_step input.information_button').forEach(i => {
                    const name = i.getAttribute('name');

                    i.value = this.clientAlreadyExists[name];
                })
            }
        })
    }
    
    switch(event) {
        case stepEvents.ON_STEP:
            this.loadSearhClient();
            break;
        case stepEvents.BEFORE_NEXT_STEP:
            let pass = true;
            const cedula = document.querySelector(`input[name="cedula"]`).value;

            if (this.clientAlreadyExists) {
                if(this.clientAlreadyExists.cedula != cedula) {
                    pass = confirm("Ha buscado un cliente pero cambió su cedula, por lo tanto se creará un nuevo cliente")

                    if(pass) delete this.clientAlreadyExists;
                }
            } else {
                const client = await globalThis.models.clientes.findAll({
                    where: { cedula }
                })
                
                if (client.length != 0) {
                    pass = false;

                    alert('Ya existe un cliente con esa cedula, presione el icono de lupa para cargar su información')
                }
            }


            if (pass) {
                this.clientData = FormData.extractFromElement('#first_step');
                console.log(this);
                this.nextAction();
            }
            break;
    }
}