export default class Init {
    constructor(name) {
        this.name = name;
    }
    
    async getContent() {
        return await fetch(`./app/frontend/pages/html/${this.name}.html`).then(res => res.text());
    }
}