export class RenderError {
    constructor(typeError, message) {
        const errorTypes = [
            {
                name: 'No Encontrado',
                type: 404
            }
        ]

        const error = errorTypes.find(err => err.type == typeError);

        this.type = error?.type || typeError;
        this.message = message;
        this.name = error?.name;
    }
}

export class Render {
    static async renderContent(pageModule) {
        const link = document.createElement("link");
    
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", `./app/frontend/css/${pageModule.name}.css`);
        
        document.querySelector("head").appendChild(link);
        
        document.querySelector("body").innerHTML = await pageModule.getContent();
        
        if(pageModule.events) pageModule.events();
    }

    static loadPage(pages) {
        const validPath = pages.some(page => {
            if (page.route == window.location.pathname) {
                Render.renderContent(page.module)
                return true;
            }
        })

        if(!validPath) {
            pages.some(page => {
                if (page.route == '/404') {
                    Render.renderContent(page.module)
                }
            })

            throw new RenderError(404, `No se encontro ninguna pagina para la ruta ${window.location.pathname}`);
        }
    }
}