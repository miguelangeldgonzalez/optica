import { stepEvents } from "../utils.js";

import ProductButton from "../../../../components/productButton/productButton.js";
import ProductController from "../../../../../backend/controllers/product.controller.js";

export default async function secondStep(event) {
    if (!this.secondStepData) this.secondStepData = {}

    /* Glasses and common Item handlers */
    this.getCommonItemID = function() {
        const currentId = this.commonItemId;
        this.commonItemId++;

        return currentId;
    }

    this.setCommonItem = function(id, data) {
        console.log(data);
        this.commonItem[id] = data
        this.updateTotal();
    }

    this.unsetCommonItem = function(id) {
        delete this.commonItem[id]
        this.updateTotal();
    }

    this.getGlassItemID = function() {
        const currentId = this.glassesId;
        this.glassesId++;

        return currentId;
    }

    this.unsetGlassesItem = function(id) {
        delete this.glassesItem[id]
        this.updateTotal();
    }

    this.setGlassesItem = function(id, data) {
        this.glassesItem[id] = {
            ...data
        }
        this.updateTotal();
    }

    this.updateTotal = function() {
        let total = 0;
        for (const i in this.commonItem) {
            if (this.commonItem[i]?.precio) total += this.commonItem[i].precio
        }

        for (const g in this.glassesItem) {
            for (const i in this.glassesItem[g]) {
                if(this.glassesItem[g][i]?.precio) total += this.glassesItem[g][i]?.precio
            }
        }
        
        this.total = total;
        document.querySelector('#total_value').innerText = this.total;
    }

    this.preloadSecondStep = async function() {
        this.products = await ProductController.getAll();
        const container = document.querySelector('.products_button__container')
       
        for(const p of this.products) {
            const productButton = await new ProductButton({button: p, parentContext: this}).loadComponent();
            container.append(productButton.component);
        }
    }

    this.validateSecondStep = async function() {
        this.products = [];

        const productIds = document.querySelectorAll("input[name='producto_id']");
        const productPrices = document.querySelectorAll("input[name='precio']");
        let products = new Array();

        for (let i = 0; i < productIds.length; i++) {
            products.push({
                producto_id: productIds[i],
                precio: productPrices[i]
            })
        }

        this.products = products;

        document.querySelector('#total_value').innerText = this.total;

        if (!Object.isEmpty(this.glassesItem) || !Object.isEmpty(this.commonItem)) {
            let commonProductsWithFormula = [];

            for (const i in this.commonItem) {
                if(this.commonItem[i].necesita_formula) commonProductsWithFormula.push(this.commonItem[i]);
            }

            if (commonProductsWithFormula.length != 0) {
                this.commonProductsWithFormula = commonProductsWithFormula;
            }
        } else {
            alert('No ha seleccionado ningún producto')
        }
        
        await this.nextAction();
    }
    
    switch(event) {
       case stepEvents.PRELOAD_STEP:
            if(!this.secondStepData.preloaded) await this.preloadSecondStep();
            this.secondStepData.preloaded = true;
            break;
        case stepEvents.BEFORE_NEXT_STEP:
            await this.validateSecondStep();
    }

}