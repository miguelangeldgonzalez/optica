import Model from './../db/Model.js';

class User extends Model {
    constructor() {
        const columns = [
            {
                name: 'username',
                type: 'VARCHAR'
            },
            {
                name: 'password',
                type: 'VARCHAR'
            },
            {
                name: 'role',
                type: 'VARCHAR'
            },
            {
                name: 'name',
                type: 'VARCHAR'
            },
            {
                name: 'last_name',
                type: 'VARCHAR',
            }
        ];
       super('users', columns);
    }
}

export default new User();