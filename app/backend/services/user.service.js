import usersModel from "../models/users.model.js";
import Model from "../db/Model.js";

export default class UserService {
    static async create(data) {
        const user = await usersModel.create(data);

        if (Array.isArray(user)) return user[0]
        else return user;
    }

    static startSession(user) {
        fetch('./app/backend/services/php/session.php', {
            method: 'POST',
            body: JSON.stringify({...user})
        })/*.then(data => data.text());*/
    }

    static recoverSession() {
        return fetch('./app/backend/services/php/recover_session.php', {
            method: 'GET'
        }).then(data => data.json());
    }

    static closeSession() {
        fetch('./app/backend/services/php/close_session.php', {
            method: 'GET'
        })
    }
    
    static searchByEmail(email) {
        const query = `SELECT * FROM usuarios WHERE correo = '${email}'`;
        return globalThis.Model.execQuery(query, usersModel)
    }
}