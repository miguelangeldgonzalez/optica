import { Render } from "./render.js";

import NotFound from "./frontend/pages/js/notFound.js";
import Registro from "./frontend/pages/js/registro.js";
import AgregarVenta from "./frontend/pages/js/agregarVenta.js";
import PanelPrincipal from "./frontend/pages/js/panelPrincipal.js";
import LoadModels from "./backend/models/index.js";

LoadModels();

const pages = [
    {
        route: '/',
        module: new Registro()
    },
    {
        route: '/panel_principal',
        module: new PanelPrincipal()
    },
    {
        route: '/agregar_venta',
        module: new AgregarVenta()
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

Object.isEmpty = o => JSON.stringify(o) == '{}' ? true : false;


window.addEventListener('load', () => Render.loadPage(pages));