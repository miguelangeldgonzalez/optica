export default class ItemBackupTable extends Component {
    constructor(context) {
        super(context, 'item-paymenttable');
    }

    async click() {
        const data = {
            file: this.context
        }
        await fetch(`./app/backend/db/php/restore_backup.php`, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.text());
    }

    async beforeLoad() {
        this.component.shadowRoot.querySelector('#file_name').innerText = this.context;
        this.component.shadowRoot.querySelector('#load').addEventListener('click', async e => {
            if(confirm('Esta seguro que desea cargar esta versión de la base de datos?')) {
                await this.click()
                alert(`Se ha completado la carga de la version ${this.context}`);
            }
        })
    }
}