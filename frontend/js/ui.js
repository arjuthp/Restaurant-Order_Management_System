// UI Helper Functions

// Show/Hide Sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Load section data if needed
    loadSectionData(sectionId);
}

// Load section-specific data
async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'menu':
            await loadMenu();
            break;
        case 'cart':
            await loadCart();
            break;
        case 'orders':
            if (isAuthenticated()) {
                await loadOrders();
            } else {
                showToast('Please login to view orders', 'info');
                openModal('loginModal');
            }
            break;
        case 'admin':
            if (isAdmin()) {
                await loadAdminData('users');
            } else {
                showToast('Admin access required', 'error');
                showSection('home');
            }
            break;
    }
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function switchToLogin() {
    closeModal('registerModal');
    openModal('loginModal');
}

function switchToRegister() {
    closeModal('loginModal');
    openModal('registerModal');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Load Menu Items
async function loadMenu() {
    const menuContainer = document.getElementById('menuItems');
    
    try {
        const products = await ProductAPI.getAll();
        
        if (products.length === 0) {
            menuContainer.innerHTML = '<p class="empty-message">Menu coming soon! We are preparing delicious items for you.</p>';
            return;
        }

        menuContainer.innerHTML = products.map(product => `
            <div class="menu-item">
                <img src="${product.image_url || 'https://via.placeholder.com/300x200?text=Food'}" 
                     alt="${product.name}" 
                     class="menu-item-image">
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${product.name}</h3>
                    <p class="menu-item-description">${product.description || 'Delicious food item'}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">$${product.price.toFixed(2)}</span>
                        <button class="btn btn-primary" onclick="addToCart('${product._id}')">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        menuContainer.innerHTML = '<p class="empty-message">Menu coming soon! We are preparing delicious items for you.</p>';
    }
}

// Load Cart
async function loadCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    try {
        const cart = await CartAPI.get();
        
        if (!cart.items || cart.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-message">Your cart is empty</p>';
            cartSummary.style.display = 'none';
            updateCartCount(0);
            return;
        }

        let total = 0;
        cartContainer.innerHTML = cart.items.map(item => {
            const itemTotal = item.unit_price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.product_id.name}</h3>
                        <p class="cart-item-price">$${item.unit_price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateCartQuantity('${item.product_id._id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity('${item.product_id._id}', ${item.quantity + 1})">+</button>
                        </div>
                        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                        <button class="btn btn-danger" onclick="removeFromCart('${item.product_id._id}')">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        cartSummary.style.display = 'block';
        updateCartCount(cart.items.length);
    } catch (error) {
        cartContainer.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        updateCartCount(0);
    }
}

// Load Orders
async function loadOrders() {
    const ordersContainer = document.getElementById('ordersList');
    
    try {
        const orders = await OrderAPI.getMyOrders();
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p class="empty-message">No orders yet</p>';
            return;
        }

        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #${order._id.slice(-8)}</span>
                    <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.product_id.name} x ${item.quantity}</span>
                            <span>$${(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total: $${order.total_price.toFixed(2)}
                </div>
                ${order.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="cancelOrder('${order._id}')">Cancel Order</button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        ordersContainer.innerHTML = '<p class="empty-message">No orders yet</p>';
    }
}

// Load Admin Data
async function loadAdminData(tab) {
    const adminContent = document.getElementById('adminContent');
    
    try {
        if (tab === 'users') {
            const users = await UserAPI.getAllUsers();
            adminContent.innerHTML = `
                <h3>All Users</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border);">
                            <th style="padding: 1rem; text-align: left;">Name</th>
                            <th style="padding: 1rem; text-align: left;">Email</th>
                            <th style="padding: 1rem; text-align: left;">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;">${user.name}</td>
                                <td style="padding: 1rem;">${user.email}</td>
                                <td style="padding: 1rem;">
                                    <span class="order-status status-${user.role === 'admin' ? 'confirmed' : 'pending'}">
                                        ${user.role}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            adminContent.innerHTML = '<p class="empty-message">Feature coming soon</p>';
        }
    } catch (error) {
        adminContent.innerHTML = '<p class="empty-message">Error loading data</p>';
        showToast('Failed to load admin data', 'error');
    }
}

function showAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadAdminData(tab);
}

// Update cart count badge
function updateCartCount(count) {
    document.getElementById('cartCount').textContent = count;
}

// Setup navigation
document.addEventListener('DOMContentLoaded', () => {
    // Setup nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});
