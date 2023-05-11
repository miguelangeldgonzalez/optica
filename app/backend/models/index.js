import Model from "../db/Model.js";

function convertToJSType(type) {
    switch (type) {
        case 'int':
        case 'float':
            return 'number';
        case 'tinyint':
            return 'boolean';
        case 'varchar':
            return 'string';
        default:
            return 'unknwon';
    }
}

async function loadColumns(tableName) {
    const query = `SELECT COLUMN_NAME as name, DATA_TYPE as type, COLUMN_KEY from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}';`; 
    const columns = await Model.execQuery(query);

    for(let i = 0; i < columns.length; i++) {
        if (columns[i].COLUMN_KEY === 'PRI') {
            columns[i].primaryKey = true;
        }

        columns[i].type = convertToJSType(columns[i].type);
        delete columns[i].COLUMN_KEY;
    }

    return new Model(tableName, columns);
}

export default async function LoadModels() {
    const storagedModels = localStorage.getItem('models');

    if (!storagedModels || globalThis.env === 'DEV') {
        const tablesName = await Model.execQuery('SHOW TABLES').then(response => response.map(t => t.Tables_in_proyecto));
        const models = {};
    
        await Promise.all(
            tablesName.map(async n => {
                models[n] = await loadColumns(n)
            })
        )
        
        globalThis.models = models;
    } else {
        globalThis.models = storagedModels;
    }

}
