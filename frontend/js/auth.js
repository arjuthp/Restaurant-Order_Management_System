// Authentication Management

// Get stored tokens
function getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

function getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

function getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

// Store tokens and user
function setAuthData(accessToken, refreshToken, user) {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

// Clear auth data
function clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getAccessToken();
}

// Check if user is admin
function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

// Update UI based on auth status
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const ordersLink = document.getElementById('ordersLink');
    const adminLink = document.getElementById('adminLink');

    if (isAuthenticated()) {
        const user = getUser();
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        userName.textContent = user.name;
        ordersLink.style.display = 'block';

        if (isAdmin()) {
            adminLink.style.display = 'block';
        }
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userMenu.style.display = 'none';
        ordersLink.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setAuthData(data.accessToken, data.refreshToken, data.user);
            closeModal('registerModal');
            updateAuthUI();
            showToast('Registration successful!', 'success');
            showSection('home');
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setAuthData(data.accessToken, data.refreshToken, data.user);
            closeModal('loginModal');
            updateAuthUI();
            showToast('Login successful!', 'success');
            showSection('home');
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
}

// Handle Logout
async function handleLogout() {
    const refreshToken = getRefreshToken();

    try {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    clearAuthData();
    updateAuthUI();
    showToast('Logged out successfully', 'info');
    showSection('home');
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    
    // Setup event listeners
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});
