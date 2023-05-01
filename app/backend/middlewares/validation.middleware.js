export const userCreate = {
    password: {
        lengthMin: 10,
        required: true,
        type: 'string',
        alphanumeric: true
    },
    correo: {
        isEmail: true,
        required: true
    }
}

export function validator(data, validationSchema, canExtend = false) {
    let errors = {};

    for (const attribSchema in validationSchema) {
        let attribErrors = {};

        if(!data[attribSchema] && !canExtend) {
            attribErrors.noValue = `El atributo ${attribSchema} no está definido`;
        } else {
            /* Validar lengthMin */
            if (validationSchema[attribSchema].lengthMin) {
                if(data[attribSchema].length < validationSchema[attribSchema].lengthMin) attribErrors.lengthMin = `El atributo ${attribSchema} debe tener como mínimo ${validationSchema[attribSchema].lengthMin} caracteres`
            }

            /*Validar alphanumeric */
            if (validationSchema[attribSchema].alphanumeric) {
                if (!data[attribSchema].match(/[a-zA-Z]/) || !data[attribSchema].match(/[0-9]/)) {
                    attribErrors.alphanumeric = `El atributo ${attribSchema} debe tener letras y numeros`;
                }
            }

            /*Validar email */

            if (validationSchema[attribSchema].isEmail) {
                const splitedEmail = data[attribSchema].split('@');
                
                if (!data[attribSchema].includes('@') && splitedEmail.length != 2) {
                    attribErrors.isEmail = `El atributo ${attribSchema} no es un correo valido`;
                } else {
                    const splitedDomain = splitedEmail[1].split('.');
                    if(splitedDomain.length != 2) attribErrors.isEmail = `El atributo ${attribSchema} no es un correo valido`;
                }
            }
        }

        if (Object.keys(attribErrors).length != 0) errors = Object.assign(errors, {[attribSchema]: attribErrors})
    }

    if (Object.keys(errors).length != 0) {
        return {
            validationError: errors
        }
    } else {
        return false;
    }
}