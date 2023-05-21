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

    async constructWhere() {
        
    }

    async #execQuery (query) {
        const data = {
            query
        }
        
        if (query.match(/(INSERT|UPDATE)/)) {
            data.table_name = this.tableName;
            data.primary_key = this.primaryKey.name;
        }
        
        console.log(query);
        return await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());
    }

    /**
     * Limpia el objeto para quitar todas las propiedades que no tengan el nombre de una columna
     * @param data 
     */
    #onlyValidColumns(data) {
        for (const c in data) {
            if(!this.columns.some(column => column.name === c)) delete data[c];
        }

        return data;
    }

    create (data) {
        data = this.#onlyValidColumns(data);
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

    async #setAssociation(include, values) {
        let sourceKey;

        for (const i of include) {
            sourceKey = this.columns.filter(c => c.name.includes(i.primaryKey.name))[0].name;
            
            if (!sourceKey) throw new Error(`La tabla ${i.tableName} no comparte niguna relacion con ${i.tableName}`);
            
            for (const index in values) {
                const id = values[index][sourceKey];
                console.log(i);
                values[index][i.tableName] = await i.findByPk(id);

                delete values[index][sourceKey]
            }
        }

        return values;
    }

    async findAll(options = {}) {
        const values = await this.#execQuery(`SELECT * FROM ${this.tableName}`);

        if (options.include) {
            return this.#setAssociation(options.include, values)
        } else {
            return values;
        }

    }

    delete (id) {
        return this.#execQuery(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey.name} = ${id}`);
    }
}