export default function loadPage(pages) {
    for (const page of pages) {
        if (page.route == window.location.pathname) {
            import(`./frontend/pages/js/${page.name}.js`).then(async (module) => {
                const link = document.createElement("link");

                link.setAttribute("rel", "stylesheet");
                link.setAttribute("href", `./app/frontend/css/${page.name}.css`);
                
                document.querySelector("head").appendChild(link);
                
                const pageModule = await new module.default();
                document.querySelector("body").innerHTML = await pageModule.getContent();
                
                pageModule.events();
            });
        }
    }
}