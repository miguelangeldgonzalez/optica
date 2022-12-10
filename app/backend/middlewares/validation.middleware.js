import { ErrorRouter } from "../routes/router.js";

export function validator(validationSchema) {
    return (req, res) => {
        /*
            Escribe el código aquí
        */
       

        //Si esta mal entonces retornar una isntancia de la clase ErrorRouter
        //return new ErrorRouter(400, "Error en la validacion" true);
    };
}
const userCreateSchema = {
    name: "string",
    apellido: "string",
    edad: "number"
}


const userCreated = {
    name: "Juan",
    apellido: "Peralta",
    edad: 43
}


const exec = validator(userCreateSchema);
const result = exec(userCreated, {});
console.log(result);