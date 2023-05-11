import DOMLoader from "../pages/js/DOMLoader.js";

export default class Component extends DOMLoader {
    constructor (context, componentName='') {
        super();
        this.context = context;
        const name = this.constructor.name;
        this.name = name[0].toLowerCase() + name.substring(1);

        this.componentName = !!componentName ? componentName : this.name ;
        
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `./app/frontend/components/${this.name}/${this.name}.css`);

        document.querySelector('head').append(link)
    }
    
    async loadComponent() {
        if(!customElements.get(this.componentName)) {
            const contentText = await fetch(`./app/frontend/components/${this.name}/${this.name}.html`).then(res => res.text());
            const cheetCSS = await fetch(`./app/frontend/components/${this.name}/${this.name}.css`).then(res => res.text());
            
            const template = document.createElement('template');
            template.innerHTML = contentText;
            
            customElements.define(this.componentName, class extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: 'open'});
                    this.shadowRoot.appendChild(template.content.cloneNode(true));
                    
                    let sheet = new CSSStyleSheet;
                    sheet.replaceSync(cheetCSS);
                    this.shadowRoot.adoptedStyleSheets = [sheet];
                }
            });
        }

        this.component = document.createElement(this.componentName);
        this.DOMComponent = this.component.shadowRoot;
        if (this.beforeLoad) await this.beforeLoad();

        return this;
    }

    afterLoad() {
        console.warn("Metodo after load llamado vacio para el componente", this)
    }
}