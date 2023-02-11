export class ErrorRouter {
    errorTypes = [
        {
            code: 404,
            name: 'Not Found'
        }
    ]

    constructor (type, message, blockExec = true) {
        this.type = type;
        this.message = message;
        this.blockExec = blockExec;
        this.#searchErrorName();
        return this;
    }

    #searchErrorName() {
        for(const error of this.errorTypes) {
            if(error.code == this.type) {
                this.name = error.name
                break;
            }
        }
    }
}

export class Router {
    middlewares = [];
    request = {};
    routes = [];

    constructor (route, ...startMiddlewares) {
        this.route = route;

        if(startMiddlewares.length == 0) {
            this.routeFunction = undefined
        } else {
            this.routeFunction = startMiddlewares.at(-1);
            startMiddlewares.pop();

            this.middlewares = startMiddlewares;
        }
    }

    addMiddleware (middlwareFunction) {
        this.middlewares.push(middlwareFunction);
    }

    addRoute (newRoute) {
        this.routes.push(newRoute);
    }

    async execRoute(route, request, first = true) {
        this.request = request;
        await this.#execMiddlewares();
        const splitedRoute = first ? route.split("/") : route;

        if(splitedRoute[0] == this.route) {
            if(splitedRoute.length == 1 && splitedRoute[0] == this.route) {
                return await this.#exec();
            } else {
                splitedRoute.shift();

                // Busca la siguiente ruta
                const nextRouter = this.routes.filter(route => {
                    if(route.route == splitedRoute[0]) return route;
                });

                return await nextRouter[0].execRoute(splitedRoute, this.request, false);
            }
        } else {
            return new ErrorRouter(404, `No se encontro la ruta ${route}`);
        }
    }

    async #execMiddlewares() {
        if (this.middlewares.length > 0) {
            for(const middleware of this.middlewares){
                const middlewareResponse = middleware(this.request);
    
                if (middlewareResponse != undefined && middlewareResponse.editRequest) {
                    this.request = middlewareResponse;
                }
            }
        }
    }

    async #exec() {
        if(this.routeFunction !== undefined) {
            return await this.routeFunction(this.request);
        } else {
            return new ErrorRouter(404, "Esta ruta no tiene una función");
        }
    }
}