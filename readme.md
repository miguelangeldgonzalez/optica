# Documentación del Proyecto

## Renderizar Paginas

Dentro del archivo **app\index.js** hay una constante llamada ```pages```. Dentro de esa constante deben ir las instancias de el contenido de las páginas junto con sus rutas. Por ejemplo, suponiendo que se quiere cargar una página para la ruta ```/usuarios```, lo que se hace es agregar un objeto más al array ```pages```, con un atributo route que será igual a la ruta en el explorador y un atributo ```module``` que será igual a una instancia de una clase que controlará en contenido de esa página.

```
const pages = [{
    route: '/usuarios',
    module: new Usuarios()   
}]
```

Las clases que controlen las páginas deben heredar de la clase ```Init``` que se encuentra en el archivo **app\frontend\pages\js\init.js**, además la clase debe contener un método ```events``` que estará encargado de contener toda la lógica de la página, cargar eventos, etc.

Según estás indicaciones la clase ```Usuario``` debería ser así:

```
import Init from "./init.js";

export default class Usuario extends Init {
    constructor() {
        super()
    } 

    events() {

    }
}
```

Para cargar el html de la página debe crear un archivo ```.html``` en la carpeta **app\frontend\pages\html** con el mismo nombre de la clase pero sin la primera letra mayúscula, lo mismo para crear un archivo ```.css``` en la carpeta **app\frontend\css**, por ejemplo, para la clase ```Usuario``` crear un archivo llamado **usuario.html** y otro llamado **usuario.css**. No es necesario cargar los scripts ni las hojas de estilo en el archivo ```.html``` el programa lo hará automáticamente.

### Assets

Todas las fuentes, imáges e iconos deben estar contenidos dentro de la carpeta **app\frontend\assets**. Dentro de esa carpeta hay una subcarpeta para cada tipo de asset correspondiente.

## ¿Cómo escribir correctamente un mensaje para un commit?

Sencillo tiene solo 3 parametros ```[<lugar_del_proyecto>] <tipo_de_cambio> <mensaje_del_commit>```

El lugar del proyecto se refiere a solo dos, si fue frontend backend.

El tipo de cambio puede ser ```ADD | FIX | CHG```
* ```ADD``` Si añadiste un archivos o funcionalidades
* ```FIX``` Si reparaste un bug
* ```CHG``` Si cambiaste algo que no necesariamente es un bug, algo como cambiar la lógica o mejorar algo

Y por último el mensaje explicando muy brevemente lo que hiciste. Por ejemplo, si habia un bug que hacía que una página no cargar entonces escribir:

 ```[frontend] FIX Pagina de usuarios no cargaba```