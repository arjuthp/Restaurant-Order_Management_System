const Category = require('../models/category.model');
const Product = require('../models/product.model');

class CategoryService {
    async getAllCategories(includeInactive = false) {
        const filter = { is_deleted: false };
        if (!includeInactive) {
            filter.is_active = true;
        }
        const categories = await Category.find(filter).sort({ name: 1 });
        return categories;
    }

    async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        if (!category || category.is_deleted) {
            throw { status: 404, message: 'Category not found' };
        }
        return category;
    }

    async createCategory(categoryData) {
        const { name } = categoryData;

        if (!name) {
            throw { status: 400, message: 'Category name is required' };
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            is_deleted: false 
        });

        if (existingCategory) {
            throw { status: 400, message: 'Category already exists' };
        }

        const category = await Category.create(categoryData);
        return category;
    }

    async updateCategory(categoryId, updateData) {
        const category = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            throw { status: 404, message: 'Category not found' };
        }

        return category;
    }

    async toggleCategoryStatus(categoryId) {
        const category = await Category.findById(categoryId);

        if (!category || category.is_deleted) {
            throw { status: 404, message: 'Category not found' };
        }

        category.is_active = !category.is_active;
        await category.save();

        return category;
    }

    async deleteCategory(categoryId) {
        // Check if any products use this category
        const productsCount = await Product.countDocuments({ 
            category: categoryId,
            is_deleted: false 
        });

        if (productsCount > 0) {
            throw { 
                status: 400, 
                message: `Cannot delete category. ${productsCount} products are using it.` 
            };
        }

        const category = await Category.findByIdAndUpdate(
            categoryId,
            {
                is_deleted: true,
                is_active: false,
                deleted_at: new Date()
            },
            { new: true }
        );

        if (!category) {
            throw { status: 404, message: 'Category not found' };
        }

        return { message: 'Category deleted successfully' };
    }

    async getCategoryProducts(categoryId) {
        // Verify category exists
        const category = await Category.findById(categoryId);
        if (!category || category.is_deleted) {
            throw { status: 404, message: 'Category not found' };
        }

        // Get all products in this category
        const products = await Product.find({ 
            category: categoryId,
            is_deleted: false 
        })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });

        return {
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                description: category.description
            },
            products,
            count: products.length
        };
    }
}

module.exports = CategoryService;
