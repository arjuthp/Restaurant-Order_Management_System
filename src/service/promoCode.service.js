async validatePromoCode(code, userId, orderAmount) {
    // Step 1: Find promo
    const promoCode = await PromoCode.findOne({ 
        code: code.toUpperCase() 
    });

    // Step 2: Check exists
    if (!promoCode) {
        return {
            valid: false,
            discountAmount: 0,
            message: "Invalid promo code"
        };
    }

    // Step 3: Check active
    if (!promoCode.isActive) {
        return {
            valid: false,
            discountAmount: 0,
            message: "This promo code is no longer active"
        };
    }

    // Step 4: Check expiry
    const currentDate = new Date();
    if (currentDate < promoCode.validFrom || currentDate > promoCode.validTo) {
        return {
            valid: false,
            discountAmount: 0,
            message: "This promo code has expired"
        };
    }

    // Step 5: Check minimum order amount
    if (orderAmount < promoCode.minOrderAmount) {
        return {
            valid: false,
            discountAmount: 0,
            message: `Minimum order amount is $${promoCode.minOrderAmount}`
        };
    }

    // Step 6: Check global usage limit
    if (promoCode.usageLimit !== null && 
        promoCode.usedCount >= promoCode.usageLimit) {
        return {
            valid: false,
            discountAmount: 0,
            message: "This promo code has reached its usage limit"
        };
    }

    // Step 7: Check per-user limit
    const userUsageCount = await this.getUserPromoUsage(userId, code);
    if (userUsageCount >= promoCode.perUserLimit) {
        return {
            valid: false,
            discountAmount: 0,
            message: "You have already used this promo code"
        };
    }

    // Step 8: Calculate discount
    const discountAmount = this.calculateDiscount(promoCode, orderAmount);

    // Step 9: Return success
    return {
        valid: true,
        discountAmount: discountAmount,
        message: "Promo code applied successfully"
    };

    
}
