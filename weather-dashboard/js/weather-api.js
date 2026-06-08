// ========================================
// WEATHER DASHBOARD - API SERVICE
// ========================================

const WeatherAPI = {
    /**
     * Check if API key is configured
     */
    isConfigured: () => {
        return CONFIG.API.KEY && CONFIG.API.KEY !== 'YOUR_API_KEY_HERE';
    },

    /**
     * Get current weather by coordinates
     */
    getCurrentWeather: async (lat, lon, unit = 'metric') => {
        if (!WeatherAPI.isConfigured()) {
            throw new Error('API key not configured');
        }

        const cacheKey = `weather_${lat}_${lon}_${unit}`;
        const cached = Storage.getCachedWeather(cacheKey);
        if (cached) return cached;

        try {
            const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.WEATHER}`;
            const params = new URLSearchParams({
                lat: lat,
                lon: lon,
                units: unit,
                appid: CONFIG.API.KEY,
                lang: 'tr'
            });

            const response = await fetch(`${url}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            Storage.setCachedWeather(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Weather API error:', error);
            throw error;
        }
    },

    /**
     * Get 5-day forecast by coordinates
     */
    getForecast: async (lat, lon, unit = 'metric') => {
        if (!WeatherAPI.isConfigured()) {
            throw new Error('API key not configured');
        }

        const cacheKey = `forecast_${lat}_${lon}_${unit}`;
        const cached = Storage.getCachedWeather(cacheKey);
        if (cached) return cached;

        try {
            const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.FORECAST}`;
            const params = new URLSearchParams({
                lat: lat,
                lon: lon,
                units: unit,
                appid: CONFIG.API.KEY,
                lang: 'tr'
            });

            const response = await fetch(`${url}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            Storage.setCachedWeather(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Forecast API error:', error);
            throw error;
        }
    },

    /**
     * Get air pollution data
     */
    getAirPollution: async (lat, lon) => {
        if (!WeatherAPI.isConfigured()) {
            throw new Error('API key not configured');
        }

        const cacheKey = `pollution_${lat}_${lon}`;
        const cached = Storage.getCachedWeather(cacheKey);
        if (cached) return cached;

        try {
            const url = `${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.AIR_POLLUTION}`;
            const params = new URLSearchParams({
                lat: lat,
                lon: lon,
                appid: CONFIG.API.KEY
            });

            const response = await fetch(`${url}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            Storage.setCachedWeather(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Air Pollution API error:', error);
            throw error;
        }
    },

    /**
     * Search city by name
     */
    searchCity: async (cityName, limit = 5) => {
        if (!WeatherAPI.isConfigured()) {
            throw new Error('API key not configured');
        }

        try {
            const url = `${CONFIG.API.GEO_URL}${CONFIG.API.ENDPOINTS.DIRECT_GEO}`;
            const params = new URLSearchParams({
                q: cityName,
                limit: limit,
                appid: CONFIG.API.KEY
            });

            const response = await fetch(`${url}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Search API error:', error);
            throw error;
        }
    },

    /**
     * Get city name by coordinates (reverse geocoding)
     */
    getCityName: async (lat, lon) => {
        if (!WeatherAPI.isConfigured()) {
            throw new Error('API key not configured');
        }

        try {
            const url = `${CONFIG.API.GEO_URL}${CONFIG.API.ENDPOINTS.REVERSE_GEO}`;
            const params = new URLSearchParams({
                lat: lat,
                lon: lon,
                limit: 1,
                appid: CONFIG.API.KEY
            });

            const response = await fetch(`${url}?${params}`);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('Reverse Geocode API error:', error);
            throw error;
        }
    },

    /**
     * Get all weather data for a location
     */
    getCompleteWeatherData: async (lat, lon, unit = 'metric') => {
        try {
            const [weather, forecast, pollution] = await Promise.all([
                WeatherAPI.getCurrentWeather(lat, lon, unit),
                WeatherAPI.getForecast(lat, lon, unit),
                WeatherAPI.getAirPollution(lat, lon)
            ]);

            return {
                weather,
                forecast,
                pollution,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Complete weather data error:', error);
            throw error;
        }
    }
};
