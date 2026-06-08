// ========================================
// WEATHER DASHBOARD - CONFIGURATION
// ========================================

const CONFIG = {
    // API Configuration
    API: {
        KEY: '57fdd08bb1fdab618d53ebe53f765a3d', // API Key with access
        BASE_URL: 'https://api.openweathermap.org/data/2.5',
        GEO_URL: 'https://api.openweathermap.org/geo/1.0',
        
        ENDPOINTS: {
            WEATHER: '/weather',
            FORECAST: '/forecast',
            AIR_POLLUTION: '/air_pollution',
            REVERSE_GEO: '/reverse',
            DIRECT_GEO: '/direct'
        },
        
        // Rate limits (Free plan)
        RATE_LIMIT: {
            CALLS_PER_MINUTE: 60,
            CALLS_PER_MONTH: 1000000
        }
    },
    
    // Default Location
    DEFAULT_LOCATION: {
        city: 'Istanbul',
        country: 'TR',
        lat: 41.0082,
        lon: 28.9784
    },
    
    // Cache Settings
    CACHE: {
        DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
        KEY_PREFIX: 'weather_'
    },
    
    // Unit Settings
    UNITS: {
        METRIC: 'metric',      // Celsius, m/s
        IMPERIAL: 'imperial'   // Fahrenheit, mph
    },
    
    // Localization
    LOCALE: {
        LANGUAGE: 'en',
        TIMEZONE: 'auto' // 'auto' or specific timezone
    },
    
    // UI Settings
    UI: {
        THEME: 'light', // 'light' or 'dark'
        AUTO_THEME: true,
        ANIMATION_ENABLED: true
    },
    
    // Weather Icon Mapping
    WEATHER_ICONS: {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'stormy': '⛈️',
        'snowy': '❄️',
        'windy': '💨',
        'clear': '🌙',
        'mist': '🌫️'
    },
    
    // Air Quality Index (AQI) Levels
    AQI_LEVELS: {
        1: { label: 'Good', color: '#51cf66' },
        2: { label: 'Fair', color: '#ffd43b' },
        3: { label: 'Moderate', color: '#ff922b' },
        4: { label: 'Poor', color: '#ff8787' },
        5: { label: 'Very Poor', color: '#8b0000' }
    },
    
    // Update Intervals
    UPDATE_INTERVALS: {
        AUTO_REFRESH: 10 * 60 * 1000, // 10 minutes
        LOCATION_REFRESH: 30 * 60 * 1000 // 30 minutes
    },
    
    // Search Settings
    SEARCH: {
        MIN_CHARS: 2,
        DEBOUNCE_DELAY: 300,
        MAX_SUGGESTIONS: 5
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
