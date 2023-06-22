import ItemProductTable from "../itemProductTable/itemProductTable.js";
import ItemGlassesProductTable from "../itemGlassesProductTable/itemGlassesProductTable.js";

export default class ProductsTable extends Component {
    constructor(context) {
        super(context, 'common-products-table');
    }

    async beforeLoad() {
        const table = this.component.shadowRoot.querySelector('table tbody');
        if (this.context?.bsPrice) {
            this.component.shadowRoot.querySelector('.commo-products__total_payment .bs_price__value').innerText = this.context.bsPrice * this.context.total;
        } else {
            this.component.shadowRoot.querySelector('.bs_price__container').remove()
        }

        this.component.shadowRoot.querySelector('#total-value-global').innerText = this.context.total;
        if (Array.isArrayAndNotEmpty(this.context.ventas_productos)) {
            for (const item of this.context.ventas_productos) {
                const itemTable = await new ItemProductTable({
                    ...item,
                    bsPrice: this.context.bsPrice
                }).loadComponent()
                table.append(itemTable.component.shadowRoot);
            }
        }

        if(Array.isArrayAndNotEmpty(this.context.lentes)) {
            for (const glasses of this.context.lentes) {
                const itemTable = await new ItemGlassesProductTable(glasses).loadComponent()
                table.append(itemTable.component.shadowRoot);
            }
        }
    }
}