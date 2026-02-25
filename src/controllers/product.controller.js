const ProductService = require('../service/product.service');

const productService = new ProductService();

async function getAllProducts(req, res) {
    try{
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    }catch(error){
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
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    }catch(error){
        const status = error.status || 500;
        res.status(status).json({message: error.message});
    }
}

async function updateProduct(req, res){
    try{
        const product = await productService.updateProduct(req.params.id, req.body);
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