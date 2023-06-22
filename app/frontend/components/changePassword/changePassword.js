
export default class ChangePassword extends Component {
    constructor(context) {
        super(context, 'formula-selector');

        this.loadComponentOld = this.loadComponent;

        this.loadComponent = async function () {
            await this.loadComponentOld();

            const height = document.querySelector('html').getBoundingClientRect().height;
            this.component.shadowRoot.querySelector('.formula_list__background').style.height = height + 'px';
            
    
            const usuario_id = this.context.usuario_id;
            return new Promise(async (resolve, reject) => {
                this.component.shadowRoot.querySelector('#submit').addEventListener('click', async e => {
                    const password = document.querySelector(".formula_selector__container [type='password']").value;
                    let passwordCrypted = await fetch('./app/backend/services/php/crypt.php', {
                        method: 'POST',
                        body: JSON.stringify({
                            password
                        })
                    }) 
                    .then(data => data.text())

                    await globalThis.models.usuarios.update(this.context, {
                        password: passwordCrypted
                    })
                    this.close();
                    resolve(true);
                })


                document.querySelector('html').append(this.component.shadowRoot);
            })
        }
    }

    close() {
        document.querySelector('.formula_list__background').remove();
    }

}