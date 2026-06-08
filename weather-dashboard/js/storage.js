// ========================================
// WEATHER DASHBOARD - LOCAL STORAGE
// ========================================

const Storage = {
    /**
     * Get all favorites
     */
    getFavorites: () => {
        return Utils.getFromStorage('weather_favorites', []);
    },

    /**
     * Add to favorites
     */
    addFavorite: (location) => {
        const favorites = Storage.getFavorites();
        const exists = favorites.some(fav => 
            fav.lat === location.lat && fav.lon === location.lon
        );
        
        if (!exists) {
            favorites.push({
                id: Utils.generateId(),
                name: location.name,
                country: location.country,
                lat: location.lat,
                lon: location.lon,
                addedAt: Date.now()
            });
            Utils.setToStorage('weather_favorites', favorites);
            return true;
        }
        return false;
    },

    /**
     * Remove from favorites
     */
    removeFavorite: (id) => {
        const favorites = Storage.getFavorites();
        const filtered = favorites.filter(fav => fav.id !== id);
        Utils.setToStorage('weather_favorites', filtered);
        return true;
    },

    /**
     * Check if location is favorite
     */
    isFavorite: (lat, lon) => {
        const favorites = Storage.getFavorites();
        return favorites.some(fav => fav.lat === lat && fav.lon === lon);
    },

    /**
     * Get recent searches
     */
    getRecentSearches: () => {
        return Utils.getFromStorage('weather_recent_searches', []);
    },

    /**
     * Add recent search
     */
    addRecentSearch: (location) => {
        const recent = Storage.getRecentSearches();
        
        // Remove if already exists
        const filtered = recent.filter(item => item.name !== location.name);
        
        // Add to beginning
        filtered.unshift({
            name: location.name,
            lat: location.lat,
            lon: location.lon,
            searchedAt: Date.now()
        });
        
        // Keep only last 10
        filtered.splice(10);
        
        Utils.setToStorage('weather_recent_searches', filtered);
    },

    /**
     * Clear recent searches
     */
    clearRecentSearches: () => {
        Utils.removeFromStorage('weather_recent_searches');
    },

    /**
     * Get cached weather data
     */
    getCachedWeather: (cacheKey) => {
        const cached = Utils.getFromStorage(`${CONFIG.CACHE.KEY_PREFIX}${cacheKey}`);
        
        if (cached && cached.timestamp) {
            const age = Date.now() - cached.timestamp;
            if (age < CONFIG.CACHE.DURATION) {
                return cached.data;
            } else {
                Utils.removeFromStorage(`${CONFIG.CACHE.KEY_PREFIX}${cacheKey}`);
            }
        }
        
        return null;
    },

    /**
     * Set cached weather data
     */
    setCachedWeather: (cacheKey, data) => {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        Utils.setToStorage(`${CONFIG.CACHE.KEY_PREFIX}${cacheKey}`, cacheData);
    },

    /**
     * Get user preferences
     */
    getPreferences: () => {
        return Utils.getFromStorage('weather_preferences', {
            unit: 'metric',
            theme: 'light',
            autoRefresh: true,
            gpsEnabled: false
        });
    },

    /**
     * Update user preferences
     */
    updatePreferences: (preferences) => {
        const current = Storage.getPreferences();
        const updated = { ...current, ...preferences };
        Utils.setToStorage('weather_preferences', updated);
        return updated;
    },

    /**
     * Get current location
     */
    getCurrentLocation: () => {
        return Utils.getFromStorage('weather_current_location', null);
    },

    /**
     * Set current location
     */
    setCurrentLocation: (location) => {
        Utils.setToStorage('weather_current_location', location);
    },

    /**
     * Clear all data
     */
    clearAll: () => {
        const keys = [
            'weather_favorites',
            'weather_recent_searches',
            'weather_preferences',
            'weather_current_location'
        ];
        
        keys.forEach(key => Utils.removeFromStorage(key));
        
        // Clear all cached weather data
        const pattern = new RegExp(`^${CONFIG.CACHE.KEY_PREFIX}`);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (pattern.test(key)) {
                localStorage.removeItem(key);
            }
        }
    }
};
