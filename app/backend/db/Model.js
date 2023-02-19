export default class Model {
    static async execQuery (query, Model) {
        const data = {
            query
        }
        
        if (query.match(/(INSERT|UPDATE)/)) {
            data.table_name = Model.tableName;
            data.primary_key = Model.primaryKey;
        }

        return await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());
    }

    async #execQuery (query) {
        const data = {
            query
        }
        
        if (query.match(/(INSERT|UPDATE)/)) {
            data.table_name = this.tableName;
            data.primary_key = this.primaryKey;
        }

        return await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());
    }

    create (data) {
        let columns = '(';
        let values = '('

        for (const columnName in data) {
            columns += `${columnName},`;
            values += `'${data[columnName]}',`;
        }
        
        columns = columns.substring(0, columns.length -1) + ')';
        values = values.substring(0, values.length -1) + ')';

        let query =  `INSERT INTO ${this.tableName} ${columns} VALUES ${values}`;
        return this.#execQuery(query);
    }

    findByPk(id) {
        return this.#execQuery(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
    }

    delete (id) {
        return this.#execQuery(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
    }
}