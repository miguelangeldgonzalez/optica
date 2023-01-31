import { Render } from "./render.js";

import Login from "./frontend/pages/js/login.js";
import NotFound from "./frontend/pages/js/notFound.js";
import Registro from "./frontend/pages/js/registro.js";

const pages = [
    {
        route: '/registro',
        module: new Registro()
    },
    {
        route: '/',
        module: new Login()
    },
    {
        route: '/404',
        module: new NotFound()
    }
]


FormData.extract = selector => {
    const object = {};
    const element = document.querySelector(selector);
    const formData = new FormData(element);

    for(const entri of formData.entries()) {
        object[entri[0]] = entri[1];
    }

    return object;
}

window.addEventListener('load', () => Render.loadPage(pages));