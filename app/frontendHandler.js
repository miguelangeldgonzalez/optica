const DOT = 46;
const HYPHEN = 45;
const WHITE_SPACE = 32;
const LETTER_GN = [209, 241];
const ACCENTS = [160, 130, 161, 162, 163, 181, 144, 214, 224, 223]

const onlyIntegerNumbers = (e => (e.charCode >= 48 && e.charCode <= 57));
const onlyIntegersAndDecimalNumbers = e => (onlyIntegerNumbers(e) || e.charCode == DOT);
const onlyDecimalAndPositiveNumbers = e => (onlyIntegersAndDecimalNumbers(e) && e.charCode != HYPHEN);

const onlyLetters = e => ((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || ACCENTS.concat(WHITE_SPACE, LETTER_GN).includes(e.charCode));

const restrictors = {
    ONLY_INTEGERS_AND_DECIMAL_NUMBERS: {
        name: 'only_integers_and_decimal_numbers',
        function: onlyIntegersAndDecimalNumbers
    },
    ONLY_INTEGER_NUMBERS: {
        name: 'only_integer_numbers',
        function: onlyIntegerNumbers
    },
    ONLY_DECIMAL_AND_POSITIVE_NUMBERS: {
        name: 'only_decimal_and_positive_numbers',
        function: onlyDecimalAndPositiveNumbers
    },
    ONLY_LETTERS: {
        name: 'only_letters',
        function: onlyLetters
    }
}

function loadRestrictions() {
    let query = '';
    const last = Object.entries(restrictors).at(-1)[0];

    for (const r in restrictors){
        if (r == last) {
            query += `.${restrictors[r].name}`
        } else {
            query += `.${restrictors[r].name}, `
        }
    }

    document.querySelectorAll(query).forEach(i => {
        for (const r in restrictors) {
            if (i.classList.contains(restrictors[r].name)) {
                i.onkeypress = restrictors[r].function;
            }
        }
    })
}


class DOMLoader {
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

class Component extends DOMLoader {
    constructor (context, componentName='', options={}) {
        super();
        this.context = context;
        const name = this.constructor.name;
        this.name = name[0].toLowerCase() + name.substring(1);

        this.componentName = !!componentName ? componentName : this.name ;
        const href = `./app/frontend/components/${this.name}/${this.name}.css`;
        
        const link = document.querySelector(`link[href='${href}']`);

        if (!link && !options.dontLink) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', href);
    
            document.querySelector('head').append(link)
        }
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

                render() {
                    console.log('cargado');
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

class Init extends DOMLoader {
    constructor(changeName = '') {
        super();

        if (!changeName) {
            const name = this.constructor.name;
            this.name = name[0].toLowerCase() + name.substring(1);
        } else {
            this.name = changeName;
        }
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