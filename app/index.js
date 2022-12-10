import loadPage from "./render.js";

const pages = [
    {
        name: 'login',
        route: '/'
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

window.addEventListener('load', () => loadPage(pages));