const Product = require('../models/product.model');

class ProductService {

    async getAllProducts(){
        const products = await Product.find({is_available: true});
        return products;
    }

    async getProductById(productId){
        const product = await Product.findById(productId);
        if(!product){
            throw {status: 404, message: 'Product not found'};
        }
        return product;
    }

    async createProduct(productData){
        const {name, price, category} = productData;
        
        if(!name || !price || !category){
            throw {status: 400, message: 'Name, price, and category are required'};
        }

        const product = await Product.create(productData);
        return product;
    }

    async updateProduct(productId, updateData){
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            {new: true, runValidators: true}
        );
        if(!product){
            throw {status: 404, message: 'Product not Found'};
        }
        return product;
    }

    async deleteProduct(productId){
        const product = await Product.findByIdAndDelete(productId);
        if(!product){
             throw {status: 404, message: 'Product not Found'};
        }
        return {message: 'Product deleted successfully'};
    }
}

module.exports = ProductService;