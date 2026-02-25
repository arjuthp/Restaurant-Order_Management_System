// API Base URL
const API_URL = 'http://localhost:5000/api';

// State
let allProducts = [];
let cart = [];
let currentCategory = 'all';
let selectedProduct = null;

// Category Icons
const categoryIcons = {
    'Nepali': '🍜',
    'Fusion': '🌮',
    'Western': '🍕',
    'Snacks': '🍟',
    'Desserts': '🍰',
    'Drinks': '🥤'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
});

// Load Products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
        document.getElementById('productsGrid').innerHTML = `
            <div class="loading-state">
                <p style="color: white;">❌ Failed to load products. Please try again later.</p>
            </div>
        `;
    }
}

// Display Products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="loading-state">
                <p style="color: white;">No products found</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal('${product._id}')">
            <div class="product-image">
                <div class="product-icon">${categoryIcons[product.category] || '🍽️'}</div>
                <span class="product-badge">${product.category}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'Delicious item from our menu'}</p>
                <div class="product-footer">
                    <div class="product-price">Rs. ${product.price}</div>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); quickAddToCart('${product._id}')">
                        Add +
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by Category
function filterCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter products
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allProducts;
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
}

// Open Product Modal
function openProductModal(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;
    
    selectedProduct = product;
    
    document.getElementById('modalIcon').textContent = categoryIcons[product.category] || '🍽️';
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalDescription').textContent = product.description || 'Delicious item from our menu';
    document.getElementById('modalPrice').textContent = `Rs. ${product.price}`;
    document.getElementById('modalQuantity').value = 1;
    document.getElementById('modalTotalPrice').textContent = `Rs. ${product.price}`;
    
    document.getElementById('productModal').classList.add('show');
}

// Close Product Modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    selectedProduct = null;
}

// Quantity Controls
function increaseQuantity() {
    const input = document.getElementById('modalQuantity');
    input.value = parseInt(input.value) + 1;
    updateModalTotal();
}

function decreaseQuantity() {
    const input = document.getElementById('modalQuantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateModalTotal();
    }
}

function updateModalTotal() {
    if (!selectedProduct) return;
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    const total = selectedProduct.price * quantity;
    document.getElementById('modalTotalPrice').textContent = `Rs. ${total}`;
}

// Add to Cart from Modal
function addToCartFromModal() {
    if (!selectedProduct) return;
    
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    addToCart(selectedProduct, quantity);
    closeProductModal();
}

// Quick Add to Cart
function quickAddToCart(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (product) {
        addToCart(product, 1);
    }
}

// Add to Cart
function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product: product,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

// Update Cart UI
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = 'Rs. 0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">Rs. ${item.product.price} × ${item.quantity}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart('${item.product._id}')" style="margin-left: auto; color: red;">🗑️</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `Rs. ${total}`;
}

// Update Cart Quantity
function updateCartQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.product._id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product._id !== productId);
    saveCart();
    updateCartUI();
    showToast('Item removed from cart', 'success');
}

// View Cart
function viewCart() {
    document.getElementById('cartSidebar').classList.add('open');
}

// Close Cart
function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
        showToast('Please login to checkout', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    showToast('Proceeding to checkout...', 'success');
    // TODO: Implement checkout flow
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Handle Auth
function handleAuth() {
    const token = localStorage.getItem('accessToken');
    if (token) {
        // User is logged in, go to profile
        window.location.href = 'index.html';
    } else {
        // User not logged in, go to login
        window.location.href = 'index.html';
    }
}

// Show Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductModal();
    }
}
