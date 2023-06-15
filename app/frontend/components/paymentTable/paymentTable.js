import ItemPaymentTable from "../itemPaymentTable/itemPaymentTable.js";

export default class PaymentTable extends Component {
    constructor(context) {
        super(context, 'payment-table');
    }

    async beforeLoad() {
        const table = this.component.shadowRoot.querySelector('table');
        
        for (const item of this.context) {
            const itemTable = await new ItemPaymentTable(item).loadComponent()
            table.append(itemTable.component.shadowRoot);
        }

        let addPaymentCreated = false;

        const total = parseInt(document.querySelector('#total').innerText);
        const totalPayment = this.context.reduce((a, b) => b.cantidad + a, 0);

        if(totalPayment < total) {
            this.component.shadowRoot.querySelector('button').addEventListener('click', async e => {
                if(!addPaymentCreated) {
                    const itemTable = await new ItemPaymentTable({insertMode: true}).loadComponent()
                    table.append(itemTable.component.shadowRoot);
        
                    document.querySelector('#add_payment').innerText = 'Aceptar';
                    document.querySelector('#add_payment').onclick = async e => {
                        const cantidad = parseInt(document.querySelector(`input[name="cantidad"]`).value);
                        if((cantidad + totalPayment) > total) {
                            alert('La cantidad que desea ingresar más los pagos anteriores es mayor que el total. Disminuya la cantidad')
                        } else if(!cantidad) {
                            alert('Ingrese la cantidad que ha pagado');
                        } else {
                            const inputs = Array.from(
                                document.querySelectorAll('.insert_mode select, .insert_mode input')
                            ).map(i => {
                                return {
                                    [i.getAttribute('name')]: i.value
                                }
                            })
    
                            const payment = {
                                venta_id: this.context[0].venta_id
                            };
    
                            for (const i of inputs) {
                                payment[Object.keys(i)[0]] = i[Object.keys(i)[0]]
                            }
    
                            if(payment.fecha == '') delete payment.fecha;
                            await globalThis.models.pagos.create(payment);
    
                            location.reload()
                        }
                    }
    
                    addPaymentCreated = true;
                }
            })
        } else {
            this.component.shadowRoot.querySelector('button').remove();
        }
        
    }
}