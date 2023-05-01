import Model from "../db/Model.js";

async function loadColumns(tableName) {
    const query = `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY from INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}';`; 
    const result = await Model.execQuery(query);

    console.log(result);
}

export default async function LoadModels() {
    const tablesName = await Model.execQuery('SHOW TABLES').then(response => response.map(t => t.Tables_in_proyecto));
    const tables = await Promise.all(
        tablesName.map(async n => await loadColumns(n))
    )

    console.log(tables);
}
