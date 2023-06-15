import { stepEvents } from "../utils.js";

export default async function fourthStep(event) {
    switch (event) {
        case stepEvents.BEFORE_NEXT_STEP: 
            this.paymentData = FormData.extractFromElement('#fourth_step');

            if(this.paymentData.cantidad > this.total) {
                alert("El precio de pago es mayor al precio total")
            } else {
                this.nextAction();
            }
            break;
    }
}