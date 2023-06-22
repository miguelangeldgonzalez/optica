import { stepEvents } from "./utils.js";

// Controllers
import UserController from "../../../../backend/controllers/user.controller.js";
import VentasController from "../../../../backend/controllers/ventas.controller.js";

// Components  
import Header from "../../../components/header/header.js";

// Steps
import firstStep from "./steps/firstStep.js";
import secondStep from "./steps/scondStep.js";
import thirdStep from "./steps/thirdStep.js";
import fourthStep from "./steps/fourthStep.js";
import fifthStep from "./steps/fifthStep.js";

import FormulaSelector from "../../../components/formulaSelector/formulaSelector.js";

class AgregarVenta extends Init {
    // Si se añaden elementos com stepNames[this.firstStep] como firstStep es añadido
    // por el prototype entonces no tendra los atributos de la clase
    stepNames = ['firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep'];
    step = 1;
    maxStep = 5;
    total = 0;

    glassesId = 0;
    commonItemId = 0;
    formFormulaId = 0;

    clientData = {};

    commonItem = {};
    formFormula = [];
    glassesItem = {};

    commonProductsWithFormula = []

    constructor() {
        super();
    }

    /* Form Formula Handlers */
    setFormFormula(id, data) {
        this.formFormula[id] = data;
    }

    unsetFormFormula(id) {
        console.log(id);
        this.formFormula.splice(id, 1);
    }

    async loadHeader() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();
    }

    previousAction() {
        document.querySelectorAll('.previous.action_button').forEach(b => {
            b.addEventListener('click', e => {
                if(this.step == 4 && this.skipThirdStep) this.step--; 
                this.step--;
                document.querySelector('.slider').style.right = `calc(100% * ${this.step - 1})`;
                this.hiderOrShowBigSteps();
            })
        })
    }

    hiderOrShowBigSteps() {
        const previousClientData = document.querySelectorAll('.show_client_data');

        console.log(this.step);
        switch (this.step) {
            case 3: 
                this.thirdStepContainer.classList.remove('display_none')
                break;
            case 5:
                if (previousClientData.length !== 0) previousClientData.forEach(cD => cD.classList.remove('display_none'));
                break;
            default:
                if (previousClientData.length !== 0) previousClientData.forEach(cD => cD.classList.add('display_none'));
                this.thirdStepContainer.classList.add('display_none')
        }
    }

    async loadCurrentStep() {
        await this.stepNames[this.step - 1].beforeStep();
    }

    async nextAction(pass=true) {
        if (!(this.step >= this.maxStep) && pass) {
            document.querySelector('.slider').style.right = `calc(100% * ${this.step})`;
            this.step ++;

            await this[this.stepNames[this.step - 1]](stepEvents.ON_STEP)
            if(this.step != this.stepNames.length) await this[this.stepNames[this.step]](stepEvents.PRELOAD_STEP);
        }

        this.hiderOrShowBigSteps()
    }

    async loadChangeStepActions() {
        await this[this.stepNames[0]](stepEvents.ON_STEP);
        
        document.querySelectorAll(".form_step").forEach(formStep => {
            const stepId = parseInt(formStep.getAttribute("step_id"));

            const form = formStep.querySelector('form');
            
            // El quinto paso no es un formulario
            if(form) form.addEventListener('submit', e => {
                e.preventDefault();
                this[this.stepNames[stepId - 1]](stepEvents.BEFORE_NEXT_STEP);
            });  
        })

        // Precargar el segundo
        await this[this.stepNames[1]](stepEvents.PRELOAD_STEP);
    }
    

    async load() {
        await this.loadHeader()
        await this.loadChangeStepActions();
        await this.previousAction();
        
        this.thirdStepContainer = document.querySelector('#third_step');
    }
}

AgregarVenta.prototype.firstStep = firstStep;
AgregarVenta.prototype.secondStep = secondStep;
AgregarVenta.prototype.thirdStep = thirdStep;
AgregarVenta.prototype.fourthStep = fourthStep;
AgregarVenta.prototype.fifthStep = fifthStep;   


export default AgregarVenta;