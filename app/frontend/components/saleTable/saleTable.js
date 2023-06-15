import ItemSaleTable from "../itemSaleTable/itemSaleTable.js";

export default class SaleTable extends Component {
    constructor(context) {
        super(context, 'sale-table');
    }

    async beforeLoad() {
        const table = this.component.shadowRoot.querySelector('table');
        
        for (const item of this.context) {
            const itemTable = await new ItemSaleTable(item).loadComponent()
            table.append(itemTable.component.shadowRoot);
        }
    }
}