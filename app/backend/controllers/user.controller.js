import UserService from "../services/user.service.js";
import { validator, userCreate } from "../middlewares/validation.middleware.js"; 

export default class UserController {
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
        if(user[0]?.password == data.password) {
            await UserService.startSession(user[0]);
            return true;
        }
        return false;
    }

    static closeSession() {
        UserService.closeSession();
    }

    static recoverSession() {
        return UserService.recoverSession();
    }
}