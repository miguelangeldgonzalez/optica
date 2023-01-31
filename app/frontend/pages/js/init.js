export default class Init {
    constructor() {
        const name = this.constructor.name;
        this.name = name[0].toLowerCase() + name.substring(1);
    }
    
    async getContent() {
        return await fetch(`./app/frontend/pages/html/${this.name}.html`).then(res => res.text());
    }
}