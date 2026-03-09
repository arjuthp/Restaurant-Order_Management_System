const Product = require('../models/product.model');
const mongoose = require('mongoose');

class ProductService {

    async getAllProducts(){
        console.log('🔍 getAllProducts called');
        console.log('🔍 Database:', mongoose.connection.name);
        console.log('🔍 Connection state:', mongoose.connection.readyState);
        
        const products = await Product.find({});
        console.log('📦 Products found:', products.length);
        console.log('📦 First product:', products[0]);
        
        return products;
    }

    async getAvailableProducts(){
        const products = await Product.find({
            is_deleted: false,
            is_availble: true
        });
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
        const product = await Product.findByIdAndUpdate(productId,
            {
                is_deleted: true,
                is_available: false,
                deleted_at: new Date()
            },
            {new: true}
        );
        if(!product){
             throw {status: 404, message: 'Product not Found'};
        }
        return {message: 'Product deleted successfully'};
    }
}

module.exports = ProductService;