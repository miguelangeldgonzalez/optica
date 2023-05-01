/**
 * @param tableName string
 * @param columns Columns[]
 */

export default class Model {
    constructor (tableName, columns) {
        if(!Array.isArray(columns)) throw new Error("El parametro columns debe ser un array")

        this.columns = columns;
        this.tableName = tableName;
        this.primaryKey = columns.find(column => column.primaryKey);

        if(!this.primaryKey) {
            let primaryKeyName = tableName.at(-1) == 's' ? 
                tableName.substring(0, columns.length + 1) + '_id' :
                tableName;

            this.primaryKey = {
                name: primaryKeyName,
                type: 'number',
                primaryKey: true
            }
            
            this.columns.push({
                ...this.primaryKey
            })
        }
    }

    static async execQuery (query, Model=undefined) {
        const data = {
            query
        }
        
        if (query.match(/(INSERT|UPDATE)/)) {
            if (Model) {
                data.table_name = Model.tableName;
                data.primary_key = Model.primaryKey.name;
            } else {
                throw new Error('Se intento hacer una insersión o actualización sin definir el modelo');
            }
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
            data.primary_key = this.primaryKey.name;
        }

        return await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());
    }

    create (data) {
        if(!data) throw new Error("Fallo al crear en el modelo"); 

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
        return this.#execQuery(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey.name} = ${id}`);
    }

    findAll() {
        return this.#execQuery(`SELECT * FROM ${this.tableName}`);
    }

    delete (id) {
        return this.#execQuery(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey.name} = ${id}`);
    }
}