import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCartStore.getState().clearCart();
  });

  it('initializes with empty cart', () => {
    const { getTotalItems, getTotalPrice } = useCartStore.getState();
    expect(useCartStore.getState().items).toEqual([]);
    expect(getTotalItems()).toBe(0);
    expect(getTotalPrice()).toBe(0);
  });

  it('adds item to cart', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
      image_url: '/pizza.jpg',
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
    });
  });

  it('increases quantity when adding existing item', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
    });

    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 2,
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('removes item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
    });

    removeItem('1');

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates item quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
    });

    updateQuantity('1', 5);

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it('calculates total price correctly', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 2,
    });

    addItem({
      productId: '2',
      name: 'Burger',
      price: 8.50,
      quantity: 1,
    });

    const total = useCartStore.getState().getTotalPrice();
    expect(total).toBe(12.99 * 2 + 8.50);
  });

  it('calculates total items correctly', () => {
    const { addItem } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 2,
    });

    addItem({
      productId: '2',
      name: 'Burger',
      price: 8.50,
      quantity: 3,
    });

    const totalItems = useCartStore.getState().getTotalItems();
    expect(totalItems).toBe(5);
  });

  it('clears cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    
    addItem({
      productId: '1',
      name: 'Pizza',
      price: 12.99,
      quantity: 1,
    });

    clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().getTotalItems()).toBe(0);
    expect(useCartStore.getState().getTotalPrice()).toBe(0);
  });
});

  describe('updateFromBackend', () => {
    it('updates local cart with backend data', () => {
      const { updateFromBackend } = useCartStore.getState();
      
      const backendItems = [
        {
          product_id: {
            _id: '123',
            name: 'Pizza',
            price: 12.99,
            image_url: '/pizza.jpg',
          },
          quantity: 2,
        },
        {
          product_id: {
            _id: '456',
            name: 'Burger',
            price: 8.50,
            image_url: null,
          },
          quantity: 1,
        },
      ];

      updateFromBackend(backendItems);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        productId: '123',
        name: 'Pizza',
        price: 12.99,
        quantity: 2,
        image_url: '/pizza.jpg',
      });
      expect(items[1]).toMatchObject({
        productId: '456',
        name: 'Burger',
        price: 8.50,
        quantity: 1,
        image_url: null,
      });
    });

    it('replaces existing cart items with backend data', () => {
      const { addItem, updateFromBackend } = useCartStore.getState();
      
      // Add some local items
      addItem({
        productId: '999',
        name: 'Local Item',
        price: 5.00,
        quantity: 1,
      });

      // Update with backend data
      const backendItems = [
        {
          product_id: {
            _id: '123',
            name: 'Backend Item',
            price: 10.00,
            image_url: null,
          },
          quantity: 3,
        },
      ];

      updateFromBackend(backendItems);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('123');
      expect(items[0].name).toBe('Backend Item');
    });

    it('handles empty backend cart', () => {
      const { addItem, updateFromBackend } = useCartStore.getState();
      
      // Add some local items
      addItem({
        productId: '999',
        name: 'Local Item',
        price: 5.00,
        quantity: 1,
      });

      // Update with empty backend cart
      updateFromBackend([]);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });
