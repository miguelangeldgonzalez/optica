import ItemProductTable from "../itemProductTable/itemProductTable.js";

export default class ItemGlassesProductTable extends Component {
    constructor(context) {
        super(context, 'glasses-row');
    }

    async beforeLoad() {
        console.log(this.context);
        for(const item of this.context.parte_lentes) {
            const itemTable =  await new ItemProductTable({
                isGlassesItem: true,
                ...item
            }).loadComponent();
            this.component.shadowRoot.append(itemTable.component.shadowRoot);
        }
    }
}