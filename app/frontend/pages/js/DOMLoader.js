import { loadRestrictions } from "./restrictions.js";

export default class DOMLoader {
    constructor() {
        switch (true) {
            case this instanceof Init:
                this.temporalLoad = this.load;
                this.load = () => {
                    loadRestrictions();
                    return this.temporalLoad();
                }
                break;
            case this instanceof Component:
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