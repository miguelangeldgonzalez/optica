

export default class GlassesRow extends Component {
    constructor(context) {
        super(context, 'glasses-row');
    }

    loadEdit() {
        
    }

    beforeLoad() {
        console.log(this.context);
        this.component.shadowRoot.querySelector(`td[name='nombre']`).innerText = this.context.producto.nombre;
        this.component.shadowRoot.querySelector(`input[name='precio']`).value = this.context.precio;

        if (this.context.producto.pertenece_lente) this.component.shadowRoot.querySelector('#delete_button').remove();

        this.loadEdit();
    }
}