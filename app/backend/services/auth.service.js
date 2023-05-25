import { Model } from '../db/Model.js'; 

export default class AuthService {
    static async startSessionWithId(id) {
        const query = `SELECT permiso.permiso, permiso_usuario.solo_vista FROM permiso INNER JOIN permiso_usuario ON permiso_usuario.permiso_id = permiso.permiso_id WHERE permiso_usuario.usuario_id = ${id}`;

        const result = Model.execQuery(query);
        console.log(result);

        return await Model.execQuery(query);
    }
}