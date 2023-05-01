import { loadRestrictions } from "./restrictions.js";

export default class DOMLoader {
    constructor() {
        switch (this.__proto__.__proto__?.constructor?.name) {
            
            case 'Init':
                this.temporalLoad = this.load;
                this.load = () => {
                    loadRestrictions();
                    return this.temporalLoad();
                }
                break;
            case 'Component':
                if (this.afterLoad) {
                    this.temporalLoad = this.afterLoad;
                    this.afterLoad = () => {
                        loadRestrictions();
                        return this.temporalLoad();
                    }
                }
        }
    }
}