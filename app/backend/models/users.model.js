import Model from './../db/Model.js';

class User extends Model {
    constructor() {
        const columns = [
            {
                name: 'nombres',
                type: 'string'
            },
            {
                name: 'rol',
                type: 'string'
            },
            {
                name: 'password',
                type: 'string'
            },
            {
                name: 'nombre_usuario',
                type: 'string'
            },
            {
                name: 'correo',
                type: 'string'
            },
            {
                name: 'rol',
                type: 'string'
            }
        ];
       super('usuarios', columns);
    }
}

export default new User();