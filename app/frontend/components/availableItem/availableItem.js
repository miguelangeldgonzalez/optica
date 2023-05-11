import Component from "../component.js";

export default class AvailableItem extends Component {
    constructor(context) {
        super(context, 'availale-item');
    }

    beforeLoad() {
        this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('available_id', this.context.id);
        this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('available_type', this.context.type);
        this.component.shadowRoot.querySelector(".available_name").innerText = this.context.description;

        if (this.context.commonId) {
            this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('common_id', this.context.commonId)
        } else {
            this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('glasses_id', this.context.glassesId)
            this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('item_id', this.context.itemId)
        }
    }

}