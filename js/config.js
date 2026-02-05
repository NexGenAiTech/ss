// config.js - Configuration file
window.AppConfig = {
    // App settings
    appName: 'Sankalp Shiksha',
    appVersion: '1.0.0',
    
    // API endpoints (for future backend integration)
    apiBaseUrl: 'http://localhost:3000/api',
    endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        exams: '/exams',
        questions: '/questions',
        results: '/results'
    },
    
    // Default settings
    defaultSettings: {
        itemsPerPage: 10,
        autoSaveInterval: 30000, // 30 seconds
        maxFileSize: 5242880, // 5MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf']
    },
    
    // Initialize app
    init: function() {
        console.log(`${this.appName} v${this.appVersion} initialized`);
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Set default values if not set
        this.setDefaults();
    },
    
    // Load settings from localStorage
    loadSettings: function() {
        const savedSettings = localStorage.getItem('sankalp_settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        } else {
            this.settings = this.defaultSettings;
        }
    },
    
    // Save settings to localStorage
    saveSettings: function() {
        localStorage.setItem('sankalp_settings', JSON.stringify(this.settings));
    },
    
    // Set default values
    setDefaults: function() {
        // Set default date for exam date pickers
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        this.defaultDates = {
            today: today.toISOString().split('T')[0],
            tomorrow: tomorrow.toISOString().split('T')[0]
        };
    }
};

// Initialize config when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AppConfig.init();
});
