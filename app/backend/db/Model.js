export class Association {
    constructor(model, options = {}) {
        const validTypes = ['ONE_TO_ONE', 'ONE_TO_MANY'];

        if(!(model instanceof Model)) throw new Error(`El model no es una instancia de la clase Model`);
        if(options.as) if(typeof options.as !== 'string') throw new Error(`El argumento as debe ser de tipo string`);
        if(options.type) if(!validTypes.includes(options.type)) throw new Error(`El tipo de asociación ${type} no es un tipo de asociación valido, los tipos validos son: ${validTypes}`);

        if (options.include) {
            if(!Array.isArray(options.include)) throw new Error('La opción include debe ser un array');

            for (const m of options.include) {
                if(!(m instanceof Association)) throw new Error('Todos los elementos de la opción include deben ser instancias de la clase Model')
            }
        }

        this.model = model;
        this.weakEntity = false;
        this.type = 'ONE_TO_ONE';

        for (const key in options) {
            if (Object.hasOwnProperty.call(options, key)) {
                this[key] = options[key];
            }
        }
    }
}

/**
 * @param tableName string
 * @param columns Columns[]
 */

export class Model {
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

        let returnOne = false;
        
        if (query.match(/(INSERT|UPDATE)/)) {
            returnOne = true;
            if (Model) {
                data.table_name = Model.tableName;
                data.primary_key = Model.primaryKey.name;
            } else {
                throw new Error('Se intento hacer una insersión o actualización sin definir el modelo');
            }
        }

        let result = await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());

        return returnOne ? result[0] : result;
    }

    #constructWhere(where) {
        where = this.#onlyValidColumns(where);

        let query = 'WHERE ';

        for (const key in where) {
            query += `${key} = ${where[key]} AND`
        }

        return query.substring(0, query.length -4);
    }

    #constructOrder(order) {
        if(!Array.isArray(order.columns)) throw new Error('La opción order debe tener un array en el atributo columns')

        order.columns = this.#onlyValidColumns(order.columns);
        let query = 'ORDER BY ';

        for (let index = 0; index < order.columns.length; index++) {
            if (index === (order.columns.length -1)) {
                query += `${order.columns[index]}`;
            } else {
                query += `${order.columns[index]}, `;
            }
        }

        if(order.desc) {
            query += ' DESC'
        } else {
            query += ' ASC'
        }

        return query;
    }

    async #execQuery (query) {
        const data = {
            query
        }
        let returnOne = false;

        if (query.match(/(INSERT|UPDATE)/)) {
            returnOne = true;

            data.table_name = this.tableName;
            data.primary_key = this.primaryKey.name;
        }
        
        console.log(query);

        const result = await fetch('./app/backend/db/php/exec.php', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(data => data.json());

        for (let i = 0; i < result.length; i++) {
            for (const key in result[i]) {
                const column = this.columns.filter(c => c.name === key);

                switch (column[0].type) {
                    case 'number':
                        result[i][key] = result[i][key].includes('.') ? parseFloat(result[i][key]) : parseInt(result[i][key]); 
                        break;
                    case 'date':
                        result[i][key] = new Date(result[i][key]);
                        break;
                    case 'boolean':
                        result[i][key] = result[i][key] === '1' ? true : false;
                }
            }
        }

        return returnOne ? result[0] : result;
    }

    /**
     * Limpia el objeto para quitar todas las propiedades que no tengan el nombre de una columna
     * @param data 
     */
    #onlyValidColumns(data) {
        for (const c in data) {
            if(!this.columns.some(column => column.name === c || data[c] === column.name)) delete data[c];
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

    async constructAssociation(include, values) {
        let sourceKey;

        for (let i of include) {
            if (!(i instanceof Association)) throw new Error('Las asociaciones deben ser una instancia de la clase Association');

            let sourceKeyProperty = i.weakEntity ? i.model : this;
            
            sourceKey = sourceKeyProperty.columns.filter(c => c.name.includes(i.model.primaryKey.name))[0]?.name;
            
            if (!sourceKey) throw new Error(`La tabla ${this.tableName} no comparte niguna relacion con ${i.model.tableName}`);
            
            for (const index in values) {
                const tableName = i.as ? i.as : i.model.tableName;
                let result;

                switch (i.type) {
                    case 'ONE_TO_ONE':
                        const id = values[index][sourceKey];
                        result = await i.model.findByPk(id);
                        result = result[0]
                        break;
                    case 'ONE_TO_MANY':
                        result = await i.model.findAll({
                            where: {
                                [this.primaryKey.name]: values[index][this.primaryKey.name]
                            }
                        })
                }

                if (i.include) await i.model.constructAssociation(i.include, result);

                values[index][tableName] = result;
                delete values[index][sourceKey]
            }
        }

        return values;
    }

    async findAll(options = {}) {
        let order = '';
        let where = '';
        if(options.order) order = this.#constructOrder(options.order);
        if(options.where) where = this.#constructWhere(options.where);

        let query = `SELECT * FROM ${this.tableName} ${where} ${order}`;
        
        const values = await this.#execQuery(query);

        if (options.include) {
            return this.constructAssociation(options.include, values)
        } else {
            return values;
        }

    }

    delete (id) {
        return this.#execQuery(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey.name} = ${id}`);
    }
}