import { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, isAdmin } = useAuth();

    const fetchCart = async () => {
        if (!isAuthenticated || isAdmin) {
            setCart(null);
            return;
        }
        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated, isAdmin]);

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    const value = {
        cart,
        setCart,
        cartCount,
        fetchCart,
        loading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
