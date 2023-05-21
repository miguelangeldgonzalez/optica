import DOMLoader from "./DOMLoader.js";

export default class Init extends DOMLoader {
    constructor() {
        super();
        const name = this.constructor.name;
        this.name = name[0].toLowerCase() + name.substring(1);
    }
    
    getContent() {
        return fetch(`./app/frontend/pages/html/${this.name}.html`).then(res => res.text());
    }

    /**
     * 
     * @param {string} parentNode string
     * @param {Component} ComponentClass Component 
     * @param position: string = 'inner-bottom'
     */
    async addComponent(parentNode, ComponentClass, position = 'inner-bottom') {
        try {
            const component = new ComponentClass(this);
    
            const content = new DOMParser().parseFromString(await component.getContent(), 'text/xml').childNodes[0];
            
            switch (position) {
                case 'outer-top':
                    document.querySelector(parentNode).before(content);
                    break;
                default:
                    document.querySelector(parentNode).appendChild(content);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async load() {}
}