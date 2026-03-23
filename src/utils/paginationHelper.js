
const calculatePagination = (page, limit, totalItems) => {
    // Convert to numbers (query params come as strings)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    
    // Ensure positive numbers
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(100, limit)); // Max 100 items per page
    
    // Calculate skip value for database query
    const skip = (page - 1) * limit;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
        skip,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: limit
        }
    };
};

module.exports = {
    calculatePagination
};
