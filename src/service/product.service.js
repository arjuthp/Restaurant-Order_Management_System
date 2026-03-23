const Product = require('../models/product.model');
const mongoose = require('mongoose');
const { calculatePagination } = require('../utils/paginationHelper');
const { buildProductFilters } = require('../utils/searchFilterHelper');

class ProductService {

    async getAllProducts(queryParams = {}){
        console.log('getAllProducts called with params:', queryParams);
        console.log('Database:', mongoose.connection.name);
        console.log('Connection state:', mongoose.connection.readyState);
    
        // STEP 1: Build filter from query params
        const filter = buildProductFilters(queryParams);
        console.log('MongoDB filter:', filter);

        // STEP 2: Count total matching items (AFTER filters)
        const totalItems = await Product.countDocuments(filter);

        // STEP 3: Calculate pagination
        const page = queryParams.page || 1; 
        const limit = queryParams.limit || 12;
        const { skip, pagination } = calculatePagination(page, limit, totalItems);
    
        // STEP 4: Query with filters + pagination
        const products = await Product.find(filter)
            .skip(skip)
            .limit(pagination.itemsPerPage)
            .sort({ createdAt: -1 });

        console.log('Found', products.length, 'products out of', totalItems, 'total');
        
        // Return both products and pagination info
        return {
            products,
            pagination
        };
    }

    async getAvailableProducts(){
        const products = await Product.find({
            is_deleted: false,
            is_available: true
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