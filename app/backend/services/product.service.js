export default class ProductService {
    static findAll() {
        return globalThis.models.productos.findAll()
    }
}