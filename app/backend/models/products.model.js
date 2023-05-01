import Model from "../db/Model.js";

class Products extends Model {
    constructor() {
        const columns = [
            {
                name: 'nombres',
                type: 'string'
            }
        ]

        super('productos', columns)
    }
}

export default new Products();