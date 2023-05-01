import ProductService from "../services/product.service.js";

export default class ProductController {
    static getAll() {
        return ProductService.findAll();
    }
}