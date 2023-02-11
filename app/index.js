import { Render } from "./render.js";

import Login from "./frontend/pages/js/login.js";
import NotFound from "./frontend/pages/js/notFound.js";
import Registro from "./frontend/pages/js/registro.js";

const pages = [
    {
        route: '/',
        module: new Registro()
    },
    {
        route: '/404',
        module: new NotFound()
    }
]

FormData.extractFromElement = selector => {
    const object = {};
    const element = document.querySelector(selector);
    const formData = new FormData(element);

    for(const entri of formData.entries()) {
        object[entri[0]] = entri[1];
    }

    return object;
}

FormData.extractFromObject = data => {
    const object = {};

    for(const entri of data.entries()) {
        object[entri[0]] = entri[1];
    }

    return object;
}

window.addEventListener('load', () => Render.loadPage(pages));