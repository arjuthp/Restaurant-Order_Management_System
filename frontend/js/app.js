// Main Application Logic

const API_BASE = 'http://localhost:5000/api';

// Storage keys
const STORAGE = {
    TOKEN: 'accessToken',
    REFRESH: 'refreshToken',
    USER: 'user'
};

// Get stored data
function getToken() {
    return localStorage.getItem(STORAGE.TOKEN);
}

function getUser() {
    const user = localStorage.getItem(STORAGE.USER);
    return user ? JSON.parse(user) : null;
}

function saveAuth(accessToken, refreshToken, user) {
    localStorage.setItem(STORAGE.TOKEN, accessToken);
    localStorage.setItem(STORAGE.REFRESH, refreshToken);
    localStorage.setItem(STORAGE.USER, JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem(STORAGE.TOKEN);
    localStorage.removeItem(STORAGE.REFRESH);
    localStorage.removeItem(STORAGE.USER);
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    const form = document.getElementById(modalId).querySelector('form');
    if (form) form.reset();
}

function showLogin() {
    openModal('loginModal');
}

function showRegister() {
    openModal('registerModal');
}

function switchToLogin() {
    closeModal('registerModal');
    openModal('loginModal');
}

function switchToRegister() {
    closeModal('loginModal');
    openModal('registerModal');
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            closeModal('registerModal');
            showToast('Registration successful! Please login.', 'success');
            
            // Pre-fill login form with registered email
            document.getElementById('loginEmail').value = email;
            
            // Open login modal
            setTimeout(() => {
                openModal('loginModal');
            }, 500);
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showToast('Connection error. Please try again.', 'error');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Login attempt:', { email });

    try {
        // Try regular login first
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', { status: response.status, data });

        if (response.ok) {
            saveAuth(data.accessToken, data.refreshToken, data.user);
            closeModal('loginModal');
            showToast(`Welcome back, ${data.user.name}!`, 'success');
            
            // Redirect based on actual user role from backend
            console.log('User role:', data.user.role);
            if (data.user.role === 'admin') {
                loadAdminDashboard();
            } else {
                loadUserProfile();
            }
        } else {
            console.error('Login failed:', data);
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Connection error. Please try again.', 'error');
    }
}

// Logout
async function logout() {
    const refreshToken = localStorage.getItem(STORAGE.REFRESH);
    
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    clearAuth();
    showToast('Logged out successfully', 'info');
    showPage('homePage');
}

// Load User Profile
async function loadUserProfile() {
    const user = getUser();
    const token = getToken();
    
    if (!user || !token) {
        showPage('homePage');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const profile = await response.json();

        if (response.ok) {
            document.getElementById('userNameDisplay').textContent = profile.name;
            document.getElementById('profileName').textContent = profile.name;
            document.getElementById('profileEmail').textContent = profile.email;
            document.getElementById('profileRole').textContent = profile.role;
            document.getElementById('profilePhone').textContent = profile.phone || 'Not set';
            document.getElementById('profileAddress').textContent = profile.address || 'Not set';
            
            showPage('userProfilePage');
        } else {
            showToast('Failed to load profile', 'error');
            clearAuth();
            showPage('homePage');
        }
    } catch (error) {
        console.error('Load profile error:', error);
        showToast('Connection error', 'error');
    }
}

// Load Admin Dashboard
async function loadAdminDashboard() {
    const user = getUser();
    const token = getToken();
    
    if (!user || !token || user.role !== 'admin') {
        showToast('Admin access required', 'error');
        showPage('homePage');
        return;
    }

    try {
        // Load users
        const usersResponse = await fetch(`${API_BASE}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await usersResponse.json();

        // Load restaurant info
        const restaurantResponse = await fetch(`${API_BASE}/restaurant`);
        const restaurant = await restaurantResponse.json();

        if (usersResponse.ok) {
            document.getElementById('adminNameDisplay').textContent = user.name;
            document.getElementById('totalUsers').textContent = users.length;
            
            const usersTable = document.getElementById('usersTable');
            usersTable.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr>
                                <td>${u.name}</td>
                                <td>${u.email}</td>
                                <td><span class="badge badge-${u.role}">${u.role}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Populate restaurant form
            if (restaurantResponse.ok) {
                document.getElementById('adminRestaurantName').value = restaurant.name;
                document.getElementById('adminRestaurantDescription').value = restaurant.description || '';
                document.getElementById('adminRestaurantAddress').value = restaurant.address;
                document.getElementById('adminRestaurantPhone').value = restaurant.phone;
                document.getElementById('adminRestaurantHours').value = restaurant.opening_hours || '';
            }
            
            showPage('adminDashboardPage');
        } else {
            showToast('Failed to load dashboard', 'error');
        }
    } catch (error) {
        console.error('Load dashboard error:', error);
        showToast('Connection error', 'error');
    }
}

// Show Edit Profile Modal
function showEditProfile() {
    const user = getUser();
    if (user) {
        document.getElementById('editName').value = user.name || '';
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editAddress').value = user.address || '';
    }
    openModal('editProfileModal');
}

// Handle Update Profile
async function handleUpdateProfile(event) {
    event.preventDefault();
    
    const token = getToken();
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const address = document.getElementById('editAddress').value;

    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone, address })
        });

        const data = await response.json();

        if (response.ok) {
            // Update stored user with ALL returned data
            const user = getUser();
            user.name = data.name;
            user.email = data.email;
            user.role = data.role;
            localStorage.setItem(STORAGE.USER, JSON.stringify(user));
            
            // Update UI immediately with new data
            document.getElementById('userNameDisplay').textContent = data.name;
            document.getElementById('profileName').textContent = data.name;
            document.getElementById('profileEmail').textContent = data.email;
            document.getElementById('profileRole').textContent = data.role;
            document.getElementById('profilePhone').textContent = phone || 'Not set';
            document.getElementById('profileAddress').textContent = address || 'Not set';
            
            closeModal('editProfileModal');
            showToast('Profile updated successfully!', 'success');
        } else {
            showToast(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Update profile error:', error);
        showToast('Connection error', 'error');
    }
}

// Delete Account
async function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }

    const token = getToken();

    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            showToast('Account deleted successfully', 'info');
            clearAuth();
            showPage('homePage');
        } else {
            showToast('Failed to delete account', 'error');
        }
    } catch (error) {
        console.error('Delete account error:', error);
        showToast('Connection error', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Restaurant App Initialized');
    
    // Check if user is already logged in
    const user = getUser();
    if (user) {
        if (user.role === 'admin') {
            loadAdminDashboard();
        } else {
            loadUserProfile();
        }
    } else {
        showPage('homePage');
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});


// Load Restaurant Info
async function loadRestaurantInfo() {
    try {
        const response = await fetch(`${API_BASE}/restaurant`);
        const restaurant = await response.json();

        if (response.ok) {
            document.getElementById('restaurantName').textContent = `🍽️ ${restaurant.name}`;
            document.getElementById('restaurantDescription').textContent = restaurant.description || 'Welcome to our restaurant';
            
            const details = `
                <p>📍 ${restaurant.address}</p>
                <p>📞 ${restaurant.phone}</p>
                <p>🕒 ${restaurant.opening_hours || 'Open daily'}</p>
            `;
            document.getElementById('restaurantDetails').innerHTML = details;
        }
    } catch (error) {
        console.error('Failed to load restaurant info:', error);
    }
}

// Handle Update Restaurant (Admin)
async function handleUpdateRestaurant(event) {
    event.preventDefault();
    
    const token = getToken();
    const data = {
        name: document.getElementById('adminRestaurantName').value,
        description: document.getElementById('adminRestaurantDescription').value,
        address: document.getElementById('adminRestaurantAddress').value,
        phone: document.getElementById('adminRestaurantPhone').value,
        opening_hours: document.getElementById('adminRestaurantHours').value
    };

    try {
        const response = await fetch(`${API_BASE}/restaurant`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const restaurant = await response.json();

        if (response.ok) {
            showToast('Restaurant info updated!', 'success');
            loadRestaurantInfo();
        } else {
            showToast(restaurant.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Update restaurant error:', error);
        showToast('Connection error', 'error');
    }
}

// Call loadRestaurantInfo on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRestaurantInfo);
} else {
    loadRestaurantInfo();
}
