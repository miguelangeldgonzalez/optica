import ItemProductTable from "../itemProductTable/itemProductTable.js";

export default class CommonProductsTable extends Component {
    constructor(context) {
        super(context, 'common-products-table');
    }

    async beforeLoad() {
        const table = this.component.shadowRoot.querySelector('table');
        
        for (const item of this.context) {
            const itemTable = await new ItemProductTable(item).loadComponent()
            table.append(itemTable.component.shadowRoot);
        }
    }
}