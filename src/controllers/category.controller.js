const CategoryService = require('../service/category.service');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const categoryService = new CategoryService();

async function getAllCategories(req, res) {
    try {
        const includeInactive = req.query.includeInactive === 'true';
        const categories = await categoryService.getAllCategories(includeInactive);
        res.status(200).json(successResponse(categories));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getCategoryById(req, res) {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(successResponse(category));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function createCategory(req, res) {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(successResponse(category, 'Category created successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function updateCategory(req, res) {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(successResponse(category, 'Category updated successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function toggleCategoryStatus(req, res) {
    try {
        const category = await categoryService.toggleCategoryStatus(req.params.id);
        res.status(200).json(successResponse(category, 'Category status toggled successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function deleteCategory(req, res) {
    try {
        const result = await categoryService.deleteCategory(req.params.id);
        res.status(200).json(successResponse(result, 'Category deleted successfully'));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

async function getCategoryProducts(req, res) {
    try {
        const result = await categoryService.getCategoryProducts(req.params.id);
        res.status(200).json(successResponse(result));
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json(errorResponse(error.message, status));
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    getCategoryProducts
};
