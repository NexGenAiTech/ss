// auth.js - Authentication System
window.AuthSystem = {
    currentUser: null,
    
    // User roles
    roles: {
        student: 'student',
        teacher: 'teacher',
        admin: 'admin',
        super_admin: 'super_admin'
    },
    
    // Initialize
    init: function() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.checkAuthStatus();
    },
    
    // Load user from localStorage
    loadCurrentUser: function() {
        try {
            const userData = localStorage.getItem('sankalp_current_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                console.log('User loaded:', this.currentUser);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            this.currentUser = null;
        }
    },
    
    // Save user to localStorage
    saveCurrentUser: function(user) {
        try {
            this.currentUser = user;
            localStorage.setItem('sankalp_current_user', JSON.stringify(user));
            console.log('User saved:', user);
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    },
    
    // Login function
    login: function(email, password, role) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // Mock users for demonstration
                const mockUsers = {
                    'student@test.com': {
                        id: 'STU001',
                        email: 'student@test.com',
                        name: 'Rahul Sharma',
                        role: this.roles.student,
                        mobile: '9876543210',
                        class: '10',
                        avatar: 'RS'
                    },
                    'teacher@test.com': {
                        id: 'TEA001',
                        email: 'teacher@test.com',
                        name: 'Priya Singh',
                        role: this.roles.teacher,
                        mobile: '9876543211',
                        subject: 'Mathematics',
                        avatar: 'PS'
                    },
                    'admin@test.com': {
                        id: 'ADM001',
                        email: 'admin@test.com',
                        name: 'Admin User',
                        role: this.roles.admin,
                        mobile: '9876543212',
                        avatar: 'AU'
                    }
                };
                
                if (mockUsers[email] && password === 'password123') {
                    const user = mockUsers[email];
                    if (role && user.role !== role) {
                        reject(new Error('Invalid role for this user'));
                        return;
                    }
                    
                    this.saveCurrentUser(user);
                    
                    // Log login activity
                    this.logActivity('login', `User ${user.name} logged in`);
                    
                    resolve(user);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    },
    
    // Register function
    register: function(userData) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // Generate user ID
                const userId = userData.role === 'student' ? 'STU' + Date.now().toString().slice(-6) :
                              userData.role === 'teacher' ? 'TEA' + Date.now().toString().slice(-6) :
                              'USR' + Date.now().toString().slice(-6);
                
                const newUser = {
                    id: userId,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    mobile: userData.mobile,
                    createdAt: new Date().toISOString(),
                    avatar: userData.name.split(' ').map(n => n[0]).join('')
                };
                
                // Add role-specific data
                if (userData.role === 'student') {
                    newUser.class = userData.class || '10';
                } else if (userData.role === 'teacher') {
                    newUser.subject = userData.subject || 'General';
                }
                
                // Save to localStorage
                const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('User already exists'));
                    return;
                }
                
                users.push(newUser);
                localStorage.setItem('sankalp_users', JSON.stringify(users));
                
                this.saveCurrentUser(newUser);
                this.logActivity('register', `New user registered: ${newUser.name}`);
                
                resolve(newUser);
            }, 1500);
        });
    },
    
    // Logout function
    logout: function() {
        if (this.currentUser) {
            this.logActivity('logout', `User ${this.currentUser.name} logged out`);
        }
        
        this.currentUser = null;
        localStorage.removeItem('sankalp_current_user');
        window.location.href = 'login.html';
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return this.currentUser !== null;
    },
    
    // Check if user has specific role
    hasRole: function(role) {
        return this.isAuthenticated() && this.currentUser.role === role;
    },
    
    // Check if user has any of the roles
    hasAnyRole: function(roles) {
        return this.isAuthenticated() && roles.includes(this.currentUser.role);
    },
    
    // Redirect based on role
    redirectBasedOnRole: function() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        switch (this.currentUser.role) {
            case this.roles.student:
                window.location.href = 'student-dashboard.html';
                break;
            case this.roles.teacher:
                window.location.href = 'teacher-dashboard.html';
                break;
            case this.roles.admin:
            case this.roles.super_admin:
                window.location.href = 'admin-dashboard.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Login form submit
        const loginForm = document.getElementById('loginFormFields');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const role = document.querySelector('.role-option.selected')?.dataset.role;
                
                try {
                    const loginBtn = loginForm.querySelector('button[type="submit"]');
                    const originalText = loginBtn.innerHTML;
                    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                    loginBtn.disabled = true;
                    
                    const user = await this.login(email, password, role);
                    alert(`Welcome ${user.name}!`);
                    
                    this.redirectBasedOnRole();
                } catch (error) {
                    alert('Login failed: ' + error.message);
                    
                    const loginBtn = loginForm.querySelector('button[type="submit"]');
                    loginBtn.innerHTML = originalText;
                    loginBtn.disabled = false;
                }
            });
        }
        
        // Register form submit
        const registerForm = document.getElementById('registerFormFields');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const userData = {
                    name: document.getElementById('registerName').value,
                    email: document.getElementById('registerEmail').value,
                    mobile: document.getElementById('registerMobile').value,
                    password: document.getElementById('registerPassword').value,
                    role: document.getElementById('registerRole').value
                };
                
                // Validate password
                if (userData.password !== document.getElementById('registerConfirmPassword').value) {
                    alert('Passwords do not match!');
                    return;
                }
                
                try {
                    const registerBtn = registerForm.querySelector('button[type="submit"]');
                    const originalText = registerBtn.innerHTML;
                    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
                    registerBtn.disabled = true;
                    
                    const user = await this.register(userData);
                    alert(`Account created successfully! Welcome ${user.name}`);
                    
                    this.redirectBasedOnRole();
                } catch (error) {
                    alert('Registration failed: ' + error.message);
                    
                    const registerBtn = registerForm.querySelector('button[type="submit"]');
                    registerBtn.innerHTML = originalText;
                    registerBtn.disabled = false;
                }
            });
        }
        
        // Forgot password form
        const forgotPasswordForm = document.getElementById('forgotPasswordFields');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('forgotEmail').value;
                
                try {
                    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    submitBtn.disabled = true;
                    
                    // Simulate email sending
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    alert('Password reset link has been sent to your email!');
                    window.location.href = 'login.html';
                } catch (error) {
                    alert('Error: ' + error.message);
                    
                    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
        
        // OTP verification
        const verifyOtpBtn = document.getElementById('verifyOtpBtn');
        if (verifyOtpBtn) {
            verifyOtpBtn.addEventListener('click', () => {
                const otpInputs = document.querySelectorAll('.otp-input');
                const otp = Array.from(otpInputs).map(input => input.value).join('');
                
                if (otp.length === 6) {
                    // Simulate OTP verification
                    verifyOtpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                    verifyOtpBtn.disabled = true;
                    
                    setTimeout(() => {
                        verifyOtpBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verified!';
                        setTimeout(() => {
                            window.location.href = 'student-dashboard.html';
                        }, 1000);
                    }, 1500);
                } else {
                    alert('Please enter complete 6-digit OTP');
                }
            });
        }
        
        // Logout buttons
        document.querySelectorAll('[data-logout]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    this.logout();
                }
            });
        });
    },
    
    // Log activity
    logActivity: function(action, details) {
        try {
            const activities = JSON.parse(localStorage.getItem('sankalp_activities') || '[]');
            activities.push({
                action,
                details,
                timestamp: new Date().toISOString(),
                user: this.currentUser?.id || 'anonymous'
            });
            
            // Keep only last 100 activities
            if (activities.length > 100) {
                activities.splice(0, activities.length - 100);
            }
            
            localStorage.setItem('sankalp_activities', JSON.stringify(activities));
        } catch (error) {
            console.error('Error logging activity:', error);
        }
    },
    
    // Get user activities
    getUserActivities: function(userId) {
        try {
            const activities = JSON.parse(localStorage.getItem('sankalp_activities') || '[]');
            return activities.filter(activity => activity.user === userId);
        } catch (error) {
            console.error('Error getting activities:', error);
            return [];
        }
    },
    
    // Update user profile
    updateProfile: function(updates) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.currentUser) {
                    reject(new Error('No user logged in'));
                    return;
                }
                
                // Update current user
                Object.assign(this.currentUser, updates);
                this.saveCurrentUser(this.currentUser);
                
                // Update in users list
                const users = JSON.parse(localStorage.getItem('sankalp_users') || '[]');
                const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = this.currentUser;
                    localStorage.setItem('sankalp_users', JSON.stringify(users));
                }
                
                this.logActivity('profile_update', 'User updated profile');
                resolve(this.currentUser);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    // Check authentication status and redirect if needed
    checkAuthStatus: function() {
        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = ['index.html', 'login.html', 'register.html'];
        
        // If not on public page and not authenticated, redirect to login
        if (!publicPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        // If on login page but already authenticated, redirect based on role
        if ((currentPage === 'login.html' || currentPage === 'register.html') && this.isAuthenticated()) {
            this.redirectBasedOnRole();
        }
        
        // Update UI based on authentication status
        this.updateAuthUI();
    },
    
    // Update UI elements based on auth status
    updateAuthUI: function() {
        // Update user info in navigation
        const userElements = document.querySelectorAll('[data-user-info]');
        userElements.forEach(element => {
            const infoType = element.dataset.userInfo;
            if (this.currentUser && this.currentUser[infoType]) {
                element.textContent = this.currentUser[infoType];
                element.style.display = 'block';
            } else if (element.hasAttribute('data-hide-if-empty')) {
                element.style.display = 'none';
            }
        });
        
        // Show/hide elements based on role
        document.querySelectorAll('[data-show-role]').forEach(element => {
            const requiredRoles = element.dataset.showRole.split(',');
            if (this.hasAnyRole(requiredRoles)) {
                element.style.display = element.dataset.displayType || 'block';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Show/hide auth buttons
        const authButtons = document.querySelectorAll('[data-auth-action]');
        authButtons.forEach(button => {
            const action = button.dataset.authAction;
            
            if (action === 'login' && this.isAuthenticated()) {
                button.style.display = 'none';
            } else if (action === 'logout' && !this.isAuthenticated()) {
                button.style.display = 'none';
            } else if (action === 'profile' && this.isAuthenticated()) {
                button.style.display = 'block';
            }
        });
    }
};

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AuthSystem.init();
});
