class QueryResult {
    constructor(data) {
        this.result = data.result;
        this.query = data.query;

        return this;
    }
}

class ColumnProperties {
    #properties = {
        name: 'string',
        type: ['VARCHAR', 'INTEGER'],
        length: 'number',
        primaryKey: 'boolean',
        autoIncrement: 'boolean'
    }

    length = 15;
    primaryKey = false;
    auto_increment = false;

    constructor (data) {
        this.data = data;

        this.#validatorTyping();
        this.#init();

        if(this.name === undefined) throw new Error('El nombre del campo es requerido');
        if(this.type === undefined) throw new Error('El tipo del campo no es requerido');

        return this;
    }

    #init() {
        for(const property in this.data) {
            this[property] = this.data[property];
        }
    }

    #validatorTyping() {
        const propertyNames = Object.keys(this.#properties);
        for(const property in this.data) {
            const validator = this.#properties[property];
            const value = this.data[property];

            if(!propertyNames.includes(property)) throw new Error(`La propiedad ${property} no es parte de la column`);

            if(Array.isArray(validator)) {
                if(!validator.includes(this.data[property])) throw new Error(`El atributo ${property} tiene un valor no admitido`);
            } else {
                if(!(typeof value === validator)) throw new Error(`La propiedad ${property} no tiene un tipado correcto`);
            }
        }

        if(this.data.name === undefined) throw new Error("La columna no contiene nombre");
        if(this.data.type === undefined) throw new Error(`La columna ${this.data.name} debe tener un tipo`);
    
    }
}

export default class Model {
    tableName;
    primaryKey;
    columns = new Array();
    columnsNames = new Array();
    associations = new Array();

    #logicOp = ['AND', 'OR'];

    constructor(tableName, columns, createTable = false) {
        this.tableName = tableName;

        this.#initColumns(columns);

        if(createTable) {
            this.#initTable();
        }
    }

    #initColumns(columns) {
        for(const column of columns) {
            this.columns.push(new ColumnProperties(column));
            this.columnsNames.push(column.name);
            if(column.primaryKey) this.primaryKey = column; 
        }

        if(this.primaryKey === undefined) {
            const newPrimaryKey = new ColumnProperties({
                name: 'id',
                primaryKey: true,
                autoIncrement: true,
                type: 'VARCHAR'
            })

            this.columnsNames.push('id');
            this.columns.push(newPrimaryKey);

            this.primaryKey = newPrimaryKey;
        }
    }

    #initTable() {
        let query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (`;

        for(const column in this.columns) {
            query += `${column.name} ${column.type} (${column.length})`;

            if(column.autoIncrement) {
                query += ' AUTO_INCREMENT ';
            } else {
                query += ', ';
            }
        }

        query = query.substring(0, query.length - 2);
        query += `, PRIMARY KEY (${this.primaryKey.name})`;
        
        Model.execQuery(query);
    }

    static async execQuery(query, tableName = '', primaryKey = '', where = '') {
        const dataForm = new FormData();
        dataForm.append('query', query);

        if(tableName !== '') dataForm.append('table_name', tableName);
        if(primaryKey !== '') dataForm.append('primary_key', primaryKey);
        if(where !== '') dataForm.append('where', where);
        
        const data = {
            method: 'POST',
            body: dataForm
        }

        const execResult = await fetch('./backend/db/php/exec.php', data).then(data => data.json());
        

        return new QueryResult({result: execResult, query});
    }

    #stringWhere(value, where) {
        let formatedWhere = '';
        let valueFormated;

        if(Array.isArray(where[value])){
            if(typeof where[value][1] == 'number') {
                valueFormated = where[value][1]
            } else {
                valueFormated = `'${where[value][1]}'`
            }

            formatedWhere += `\`${value}\` ${where[value][0]} ${valueFormated}`;
        } else {
            if(typeof where[value] == 'number') {
                valueFormated = where[value]
            } else {
                valueFormated = `'${where[value]}'`
            }
            
            formatedWhere += `\`${value}\` = ${valueFormated}`;
        }

        return formatedWhere;
    }

    #formatWhere(where) {
        let formatedWhere = '';
        
        if(typeof where === 'number') {
            return `\`${this.primaryKey.name}\` = ${where}`;
        }

        for(const value in where) {
            if(this.#logicOp.includes(value)) {
                const temporalWhere = where[value];

                for(const temporalValue in temporalWhere) {
                    console.log(temporalWhere[temporalValue]);
                    formatedWhere += this.#stringWhere(temporalValue, temporalWhere);
                    formatedWhere += ` ${value} `;
                }

            formatedWhere = formatedWhere.substring(0, formatedWhere.length - value.length - 1);

            }else if (this.columnsNames.includes(value)) {
                formatedWhere += this.#stringWhere(value, where);
            }
        }

        return formatedWhere;
    }

    async create(data) {
        let query = `INSERT INTO ${this.tableName} (`

        for(const key in data) {
            if(this.columnsNames.includes(key)) {
                query += `\`${key}\`, `
            } else {
                throw new Error(`El atributo ${key} no es parte del modelo`);
            }
        }

        query = query.substring(0, query.length - 2) + ') VALUES (';

        for(const value of Object.values(data)) {
            query += `'${value}', `;
        }

        query = query.substring(0, query.length - 2) + ')';

        return await Model.execQuery(query, this.tableName, this.primaryKey.name);
    }

    async update(where, data) {
        let query = `UPDATE ${this.tableName} SET `;

        for(const value in data) {
            if(this.columnsNames.includes(value)) {
                query += `\`${value}\` = '${data[value]}', `;
            }
        }

        query = query.substring(0, query.length - 2) + ' WHERE ';
        where = this.#formatWhere(where);

        query += where; 

        return await Model.execQuery(query, this.tableName, this.primaryKey.name, where);
    }

    async destroy(where) {
        where = this.#formatWhere(where);
        let query = `DELETE FROM ${this.tableName} WHERE ${where}`;
        return await Model.execQuery(query, this.tableName, this.primaryKey.name);
    }

    hasOne(model, alias) {
        this.associations.push({
            model,
            alias
        })
    }
}