import Component from "../component.js";

export default class TrashButton extends Component {
    constructor(context) {
        super(context, 'trahs-button');
    }

    beforeLoad() {
        if (this.context.onclick) {
            this.DOMComponent.querySelector('a').addEventListener('click', this.context.onclick);
        }
    }
}