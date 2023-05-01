import productModel from '../models/products.model.js';

export default class ProductService {
    static findAll() {
        return productModel.findAll()
    }
}