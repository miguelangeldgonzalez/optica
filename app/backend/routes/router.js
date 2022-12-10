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

    execRoute(route, request, first = true) {
        const splitedRoute = first ? route.split("/") : route;
        
        if(splitedRoute[0] == this.route) {
            if(splitedRoute.length == 1 && splitedRoute[0] == this.route) {
                return this.exec(request);
            } else {
                splitedRoute.shift();

                // Busca la siguiente ruta
                const nextRouter = this.routes.filter(route => {
                    if(route.route == splitedRoute[0]) return route;
                });

                return nextRouter[0].execRoute(splitedRoute, request, false);
            }
        } else {
            return new ErrorRouter(404, "Ruta no encontrada");
        }
    }

    exec(request) {
        let response = {};

        if (this.middlewares.length > 0) {
            for(middleware of this.middlewares){
                const middlewareResponse = middleware(request, response);
    
                if (middlewareResponse != undefined) {
                    response = middlewareResponse;
    
                    if (middlewareResponse instanceof ErrorRouter && middlewareResponse.blockExec) break;
                }
            }
        } 

        if (response.blockExec) {
            return response;
        } else {
            if(this.routeFunction !== undefined) {
                return this.routeFunction(request, response);
            } else {
                return new ErrorRouter(404, "Esta ruta no tiene una función");
            }
        }
    }
}