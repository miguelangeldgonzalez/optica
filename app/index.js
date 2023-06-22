import { Render } from "./render.js";

import { Model, Association } from "./backend/db/Model.js";

globalThis.env = 'DEV';
globalThis.Model = Model;
globalThis.Association = Association;

import Users from "./frontend/pages/js/users.js";
import LoadModels from "./backend/models/index.js";
import Clientes from "./frontend/pages/js/clientes.js";
import NotFound from "./frontend/pages/js/notFound.js";
import Registro from "./frontend/pages/js/registro.js";
import DetalleVenta from "./frontend/pages/js/detalleVenta.js";
import Configuration from "./frontend/pages/js/configuration.js";
import DetalleCliente from "./frontend/pages/js/detalleCliente.js";
import PanelPrincipal from "./frontend/pages/js/panelPrincipal.js";
import AgregarVenta from "./frontend/pages/js/agregarVenta/agregarVenta.js";

const pages = [
    {
        route: '/',
        module: new Registro()
    },
    {
        route: '/ventas',
        module: new PanelPrincipal()
    },
    {
        route: '/agregar_venta',
        module: new AgregarVenta()
    },
    {
        route: '/configuracion',
        module: new Configuration()
    },
    {
        route: '/detalle_de_venta',
        module: new DetalleVenta()
    },
    {
        route: '/usuarios',
        module: new Users()
    },
    {
        route: '/404',
        module: new NotFound()
    },
    {
        route: '/clientes',
        module: new Clientes()
    },
    {
        route: '/detalle_cliente',
        module: new DetalleCliente()
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

Object.isEmpty = o => JSON.stringify(o) === '{}' ? true : false;

window.getParameterByName = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.addEventListener('load', async () => {
    await LoadModels();
    console.log('hola');
    Render.loadPage(pages)
});

Array.isArrayAndNotEmpty = (array) => {
    if(!Array.isArray(array)) return false;
    if(array.length < 1) return false;
    return true;
}
