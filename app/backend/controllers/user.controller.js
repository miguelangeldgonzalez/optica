import UserService from "../services/user.service.js";
import { validator, userCreate } from "../middlewares/validation.middleware.js"; 

export default class UserController {
    static async getAllUsers() {
        return globalThis.models.usuarios.findAll();
    }
    
    static async createAndStartUser(data) {
        const validation = validator(data, userCreate);
        if(validation) return validation;
        
        const user = await UserService.create(data);
        await UserService.startSession(user)
        return user
    }

    static async startSession(data) {
        const user = await UserService.searchByEmail(data.nombre_usuario);
        console.log(user);

        
        if(user.length == 0) return false


        const valid = await UserService.verifyPassword(data.password, user[0]?.password)
        
        if(!valid) return false;

        await UserService.startSession(user[0]);
        return true;
    }

    static async delete(id) {
        await UserService.delete(id);
    }

    static closeSession() {
        UserService.closeSession();
    }

    static recoverSession() {
        return UserService.recoverSession();
    }

    static async changeRol(id) {
        let user = await globalThis.models.usuarios.findByPk(id);
        user = user[0];

        const newRol = user.rol === 'ADMINISTRADOR' ? 'USUARIO' : 'ADMINISTRADOR';

        if (newRol === 'USUARIO') {
            const admins = await globalThis.models.usuarios.findAll({
                where: {
                    rol: 'ADMINISTRADOR'
                }
            })

            if (admins.length === 1) {
                alert('No puede cambiar el rol de este usuario porque solo queda un administrador. Designe a otro administrador e intentelo otra vez');
                return
            }
        }

        await globalThis.models.usuarios.update(id, {
            rol: newRol
        })
    }
}