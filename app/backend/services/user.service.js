export default class UserService {
    static async create(data) {
        const result = await globalThis.Model.execQuery(`SELECT COUNT(usuario_id) as count from usuarios`);
        if(result[0].count == 0) {
            data.rol = 'ADMINISTRADOR'
        }

        const password = await fetch('./app/backend/services/php/crypt.php', {
            method: 'POST',
            body: JSON.stringify({
                password: data.password
            })
        }).then(data => data.text());

        data.password = password;
        const user = await globalThis.models.usuarios.create(data);

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
        return globalThis.Model.execQuery(query, globalThis.models.usuarios)
    }

    static verifyPassword(password, passwordCrypted) {
        return fetch('./app/backend/services/php/verify_password.php', {
            method: 'POST',
            body: JSON.stringify({
                password: password,
                password_crypted: passwordCrypted
            })
        }).then(data => data.text());
    }
}