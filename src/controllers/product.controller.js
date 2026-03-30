const ProductService = require('../service/product.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const productService = new ProductService();

async function getAllProducts(req, res) {
    console.log('Controller: getAllProducts called');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    try{
        
        console.log('Query params: ', req.query);

        const result = await productService.getAllProducts(req.query);
        res.status(200).json(successResponse(result.products, null, result.pagination));
    }catch(error){
        console.error('Error in getAllProducts:', error);
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getProductById(req, res){
    try{
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(successResponse(product));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function createProduct(req, res){
    try{
        const productData = req.body;
        
        // Handle multiple file uploads
        if (req.files && req.files.length > 0) {
            productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
            // Set the first image as the main image_url for backward compatibility
            productData.image_url = productData.images[0];
        } else if (req.file) {
            // Single file upload (backward compatibility)
            productData.image_url = `/uploads/products/${req.file.filename}`;
            productData.images = [productData.image_url];
        }
        
        const product = await productService.createProduct(productData);
        res.status(201).json(successResponse(product, 'Product created successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateProduct(req, res){
    try{
        const updateData = req.body;
        
        // Handle multiple file uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            
            // If there are existing images, append new ones
            const existingProduct = await productService.getProductById(req.params.id);
            updateData.images = [...(existingProduct.images || []), ...newImages];
            
            // Update main image_url if it's not set or if this is the first image
            if (!existingProduct.image_url || existingProduct.images.length === 0) {
                updateData.image_url = newImages[0];
            }
        } else if (req.file) {
            // Single file upload (backward compatibility)
            const newImageUrl = `/uploads/products/${req.file.filename}`;
            
            const existingProduct = await productService.getProductById(req.params.id);
            updateData.images = [...(existingProduct.images || []), newImageUrl];
            
            if (!existingProduct.image_url) {
                updateData.image_url = newImageUrl;
            }
        }
        
        const product = await productService.updateProduct(req.params.id, updateData);
        res.status(200).json(successResponse(product, 'Product updated successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function deleteProduct(req, res){
    try{
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json(successResponse(result, 'Product deleted successfully'));
    }catch(error){
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateProductStock(req, res){
    try {
        const { quantity, operation } = req.body;
        const product = await productService.updateStock(
            req.params.id,
            quantity,
            operation
        );
        res.status(200).json(successResponse(product, 'Stock updated successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
}