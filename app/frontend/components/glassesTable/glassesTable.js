import Component from "../component.js";
import GlassesRow from "../glassesRow/glassesRow.js";

export default class GlassesTable extends Component {
    constructor(context) {
        super(context, 'glasses-table');
    }

    async beforeLoad() {
        const table = this.component.shadowRoot.querySelector('table');

        for (const pl of this.context.parte_lentes) {
            const gr = await new GlassesRow(pl).loadComponent();

            table.append(gr.component.shadowRoot);
        }
    }
}