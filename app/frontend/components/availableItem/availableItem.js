import Component from "../component.js";

export default class AvailableItem extends Component {
    constructor(context) {
        super(context, 'availale-item');
    }

    beforeLoad() {
        this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('available_id', this.context.id);
        this.component.shadowRoot.querySelector("input[type='checkbox']").setAttribute('available_type', this.context.type);
        this.component.shadowRoot.querySelector(".available_name").innerText = this.context.description;
    }

    afterLoad() {}
}