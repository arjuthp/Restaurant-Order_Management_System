/**
 * Build MongoDB query filters for products
 * Handles: search (text), category, availability
 */
const buildProductFilters = (queryParams) => {
    const filter = {
        is_deleted: false // Always exclude deleted products
    };
    
    // TEXT SEARCH - Search in name and description
    if (queryParams.search && queryParams.search.trim() !== '') {
        filter.$or = [
            { name: { $regex: queryParams.search.trim(), $options: 'i' } },
            { description: { $regex: queryParams.search.trim(), $options: 'i' } }
        ];
    }
    
    // CATEGORY FILTER - Exact match
    if (queryParams.category && queryParams.category !== 'all') {
        filter.category = queryParams.category;
    }
    
    // AVAILABILITY FILTER - Boolean
    if (queryParams.available !== undefined) {
        filter.is_available = queryParams.available === 'true';
    }
    
    return filter;
};

/**
 * Build MongoDB query filters for orders
 * Handles: status, date range
 */
const buildOrderFilters = (queryParams) => {
    const filter = {};
    
    // STATUS FILTER
    if (queryParams.status) {
        filter.status = queryParams.status;
    }
    
    // DATE RANGE FILTER
    if (queryParams.startDate || queryParams.endDate) {
        filter.createdAt = {};
        
        if (queryParams.startDate) {
            filter.createdAt.$gte = new Date(queryParams.startDate);
        }
        
        if (queryParams.endDate) {
            const endDate = new Date(queryParams.endDate);
            endDate.setHours(23, 59, 59, 999); // Include entire end date
            filter.createdAt.$lte = endDate;
        }
    }
    
    return filter;
};

/**
 * Build MongoDB query filters for reservations
 * Handles: date (exact), status
 */
const buildReservationFilters = (queryParams) => {
    const filter = {};
    
    // EXACT DATE FILTER
    if (queryParams.date) {
        const targetDate = new Date(queryParams.date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        filter.date = {
            $gte: targetDate,
            $lt: nextDay
        };
    }
    
    // STATUS FILTER
    if (queryParams.status) {
        filter.status = queryParams.status;
    }
    
    return filter;
};

module.exports = {
    buildProductFilters,
    buildOrderFilters,
    buildReservationFilters
};

/**Self notes
 * $regex = Pattern matching (like SQL LIKE '%search%')
 * $options: 'i' = Case-insensitive
 * $or = Match ANY condition (name OR description)
 *$gte / $lte = Greater/Less than or equal (for dates)
 */


