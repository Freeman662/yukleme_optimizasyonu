// ========================================
// WEATHER DASHBOARD - UTILITY FUNCTIONS
// ========================================

const Utils = {
    /**
     * Format temperature
     */
    formatTemp: (temp, unit = 'metric') => {
        const value = Math.round(temp);
        const symbol = unit === 'metric' ? '°C' : '°F';
        return `${value}${symbol}`;
    },

    /**
     * Format wind speed
     */
    formatWindSpeed: (speed, unit = 'metric') => {
        const value = Math.round(speed * 10) / 10;
        const symbol = unit === 'metric' ? 'm/s' : 'mph';
        return `${value} ${symbol}`;
    },

    /**
     * Format distance (visibility)
     */
    formatDistance: (distance, unit = 'metric') => {
        if (unit === 'metric') {
            const km = Math.round(distance / 1000 * 10) / 10;
            return `${km} km`;
        } else {
            const miles = Math.round(distance / 1609 * 10) / 10;
            return `${miles} mi`;
        }
    },

    /**
     * Format date and time
     */
    formatDateTime: (timestamp, timezone = 0) => {
        const date = new Date((timestamp + timezone) * 1000);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('tr-TR', options);
    },

    /**
     * Format day name
     */
    formatDay: (timestamp) => {
        const date = new Date(timestamp * 1000);
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return days[date.getDay()];
    },

    /**
     * Format hour
     */
    formatHour: (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.getHours().toString().padStart(2, '0') + ':00';
    },

    /**
     * Get weather icon URL from OpenWeatherMap
     */
    getWeatherIconUrl: (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    },

    /**
     * Convert temperature between units
     */
    convertTemp: (temp, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return temp;
        
        if (fromUnit === 'metric' && toUnit === 'imperial') {
            return (temp * 9/5) + 32;
        } else if (fromUnit === 'imperial' && toUnit === 'metric') {
            return (temp - 32) * 5/9;
        }
        return temp;
    },

    /**
     * Get wind direction from degrees
     */
    getWindDirection: (degrees) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    },

    /**
     * Debounce function
     */
    debounce: (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    },

    /**
     * Throttle function
     */
    throttle: (func, delay) => {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        };
    },

    /**
     * Get local storage item
     */
    getFromStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    },

    /**
     * Set local storage item
     */
    setToStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Remove from storage
     */
    removeFromStorage: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    /**
     * Show notification
     */
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    },

    /**
     * Check if element is in viewport
     */
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Copy to clipboard
     */
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Copy error:', error);
            return false;
        }
    },

    /**
     * Generate random ID
     */
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};
