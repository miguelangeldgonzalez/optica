import Component from "../component.js";

export default class StateCircle extends Component {
    constructor(context) {
        super(context, 'state-circle');
    }

    async beforeLoad() {
        this.component.shadowRoot.querySelector('.circle').style.backgroundColor = '#' + this.context.color;
        this.component.shadowRoot.querySelector('.circle__title').innerText = this.context.nombre_estado;
    }
}