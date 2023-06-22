import Header from "../../components/header/header.js";
import UserController from "../../../backend/controllers/user.controller.js";
import ItemBackupTable from "../../components/itemBackupTable/itemBackupTable.js";

export default class Configuration extends Init {
    constructor() {
        super()
    }

    async getBackups() {
        let result = await fetch('./app/backend/db/php/get_backups.php', {
            method: 'GET'
        })
            .then(data => data.json())
            .then(data => Array.from(data).splice(2,data.length));
        
        for (const item of result) {
            const itemTable = await new ItemBackupTable(item).loadComponent();
            this.table.append(itemTable.component.shadowRoot);
        }
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';
        if (this.user.rol !== 'ADMINISTRADOR') window.location = '/';
        this.table = document.querySelector('#backup_table');

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();

        await this.getBackups()

        document.querySelector('#generate_backup').addEventListener('click', async e => {
            const result = await fetch('./app/backend/db/php/respaldo.php', {
                method: 'GET'
            }).then(data => data.text());
            const itemTable = await new ItemBackupTable(result).loadComponent();
            this.table.append(itemTable.component.shadowRoot);

        })

        document.querySelector('#key_button').addEventListener('click', async e => {
            const key = document.querySelector('#key_value').value;
            
            await fetch(`https://v6.exchangerate-api.com/v6/${key}/pair/USD/VES`,{
                method: 'GET'
            })
                .then(data => data.json())
                .catch(err => alert("La llave es incorrecta"))
                .then(async data => {
                    if(data.result == 'success') {
                        const apiKey = await globalThis.models.configuraciones.findAll({
                            where: {
                                name: 'API_KEY'
                            }
                        })
            
                        console.log(apiKey[0].configuracion_id)
                        await globalThis.models.configuraciones.update(apiKey[0].configuracion_id, {
                            value: key
                        });
                    }
                })
        })

        document.querySelector('#generate_report').addEventListener('click', async e => {
            console.log("a")
            const data = {
                start_date: document.querySelector('#start_date').value,
                end_date: document.querySelector('#end_date').value
            }

            window.location = `/app/backend/db/php/generate_pdf.php?start_date=${data.start_date}&end_date=${data.end_date}`;
        })

        document.querySelector('#email_button').addEventListener('click', async e => {
            const data = {
                email_code: document.querySelector('#email_code').value,
                email: document.querySelector('#email').value
            }

            if(data.email) {
                const emailConfig = await globalThis.models.configuraciones.findAll({
                    where: {
                        name: 'EMAIL'
                    }
                })

                await globalThis.models.configuraciones.update(emailConfig[0].configuracion_id, {
                    value: data.email
                })
            }

            if(data.email_code) {
                const emailConfig = await globalThis.models.configuraciones.findAll({
                    where: {
                        name: 'EMAIL_CODE'
                    }
                })

                await globalThis.models.configuraciones.update(emailConfig[0].configuracion_id, {
                    value: data.email_code
                })
            }

            alert('Configuracion guardada')
        })

    }
}