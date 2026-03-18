const ProductService = require('../service/product.service');

const productService = new ProductService();

async function getAllProducts(req, res) {
    console.log(' Controller: getAllProducts called');
    console.log(' Request URL:', req.url);
    console.log(' Request method:', req.method);
    try{
        const products = await productService.getAllProducts();
        console.log('Sending response with', products.length, 'products');
        res.status(200).json(products);
    }catch(error){
        console.error(' Error in getAllProducts:', error);
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function getProductById(req, res){
    try{
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function createProduct(req, res){
    try{
        const productData = req.body;
        
        // If file was uploaded, add the image URL to product data
        if (req.file) {
            productData.image_url = `/uploads/products/${req.file.filename}`;
        }
        
        const product = await productService.createProduct(productData);
        res.status(201).json(product);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function updateProduct(req, res){
    try{
        const updateData = req.body;
        
        // If file was uploaded, add the image URL to update data
        if (req.file) {
            updateData.image_url = `/uploads/products/${req.file.filename}`;
        }
        
        const product = await productService.updateProduct(req.params.id, updateData);
        res.status(200).json(product);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function deleteProduct(req, res){
    try{
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json(result);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

module.exports = { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}