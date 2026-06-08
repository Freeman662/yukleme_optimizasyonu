// ========================================
// WEATHER DASHBOARD - MAIN APPLICATION
// ========================================

class WeatherDashboard {
    constructor() {
        this.currentLocation = null;
        this.currentUnit = 'metric';
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.loadDefaultLocation();
        this.updateFavoritesList();
        this.updateRecentList();
    }

    /**
     * Load user preferences
     */
    loadPreferences() {
        const prefs = Storage.getPreferences();
        this.currentUnit = prefs.unit;
        
        // Apply theme
        if (prefs.theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        
        // Set unit buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === this.currentUnit) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput?.addEventListener('input', 
            Utils.debounce((e) => this.handleSearch(e), CONFIG.SEARCH.DEBOUNCE_DELAY)
        );
        searchBtn?.addEventListener('click', () => this.performSearch(searchInput.value));
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch(searchInput.value);
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // GPS button
        document.getElementById('gpsBtn')?.addEventListener('click', () => this.getGPSLocation());
        
        // Unit toggle
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchUnit(e.target.dataset.unit));
        });
    }

    /**
     * Load default location
     */
    async loadDefaultLocation() {
        try {
            const savedLocation = Storage.getCurrentLocation();
            if (savedLocation) {
                await this.loadWeather(savedLocation.lat, savedLocation.lon, savedLocation.name);
            } else {
                const defaultLoc = CONFIG.DEFAULT_LOCATION;
                await this.loadWeather(defaultLoc.lat, defaultLoc.lon, defaultLoc.city);
            }
        } catch (error) {
            this.showError('Hava durumu yüklenemedi. Lütfen API anahtarınızı kontrol edin.');
            console.error(error);
        }
    }

    /**
     * Load weather data
     */
    async loadWeather(lat, lon, cityName) {
        try {
            document.getElementById('loading').style.display = 'flex';
            document.getElementById('errorMessage').style.display = 'none';

            const data = await WeatherAPI.getCompleteWeatherData(lat, lon, this.currentUnit);
            
            this.currentLocation = {
                name: cityName,
                lat: lat,
                lon: lon,
                ...data
            };
            
            Storage.setCurrentLocation({ name: cityName, lat, lon });
            Storage.addRecentSearch({ name: cityName, lat, lon });
            
            this.displayWeather(data);
            this.updateFavoritesList();
            this.updateRecentList();
        } catch (error) {
            this.showError('Veri yükleme başarısız oldu.');
            console.error(error);
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }

    /**
     * Display weather data
     */
    displayWeather(data) {
        const { weather, forecast, pollution } = data;
        
        // Current weather
        this.displayCurrentWeather(weather);
        
        // Hourly forecast (next 24 hours)
        if (forecast?.list) {
            this.displayHourlyForecast(forecast.list.slice(0, 8));
            
            // Daily forecast
            const dailyData = this.groupForecastByDay(forecast.list);
            this.displayDailyForecast(dailyData);
        }
        
        // Air quality
        if (pollution?.list) {
            this.displayAirQuality(pollution.list[0]);
        }
    }

    /**
     * Display current weather
     */
    displayCurrentWeather(weather) {
        const unit = this.currentUnit;
        const section = document.getElementById('currentWeather');
        
        if (!section) return;
        
        // City and date
        document.getElementById('cityName').textContent = 
            `${weather.name}, ${weather.sys?.country}`;
        document.getElementById('dateTime').textContent = 
            Utils.formatDateTime(weather.dt, weather.timezone);
        
        // Temperature and condition
        document.getElementById('temperature').textContent = 
            Utils.formatTemp(weather.main.temp, unit);
        document.getElementById('weatherCondition').textContent = 
            weather.weather[0].description;
        document.getElementById('weatherIcon').src = 
            Utils.getWeatherIconUrl(weather.weather[0].icon);
        
        // Details
        document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
        document.getElementById('windSpeed').textContent = 
            Utils.formatWindSpeed(weather.wind.speed, unit);
        document.getElementById('pressure').textContent = `${weather.main.pressure} hPa`;
        document.getElementById('visibility').textContent = 
            Utils.formatDistance(weather.visibility, unit);
        document.getElementById('feelsLike').textContent = 
            Utils.formatTemp(weather.main.feels_like, unit);
        
        // Favorite button
        const favBtn = document.getElementById('favoriteBtn');
        if (Storage.isFavorite(weather.coord.lat, weather.coord.lon)) {
            favBtn.classList.add('active');
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            favBtn.classList.remove('active');
            favBtn.innerHTML = '<i class="far fa-star"></i>';
        }
        
        favBtn.onclick = () => this.toggleFavorite({
            name: weather.name,
            country: weather.sys?.country,
            lat: weather.coord.lat,
            lon: weather.coord.lon
        });
        
        // Last update
        document.getElementById('lastUpdate').textContent = 
            new Date().toLocaleTimeString('tr-TR');
        
        section.style.display = 'block';
    }

    /**
     * Display hourly forecast
     */
    displayHourlyForecast(hourlyData) {
        const section = document.getElementById('hourlyForecast');
        const list = document.getElementById('hourlyList');
        
        if (!list) return;
        
        list.innerHTML = '';
        
        hourlyData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="time">${Utils.formatHour(item.dt)}</div>
                <div class="icon">
                    <img src="${Utils.getWeatherIconUrl(item.weather[0].icon)}" alt="weather">
                </div>
                <div class="temp">${Utils.formatTemp(item.main.temp, this.currentUnit)}</div>
            `;
            list.appendChild(card);
        });
        
        section.style.display = 'block';
    }

    /**
     * Group forecast data by day
     */
    groupForecastByDay(forecastList) {
        const grouped = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });
        
        return Object.entries(grouped).slice(0, 5).map(([date, items]) => ({
            date: date,
            items: items,
            mainItem: items[Math.floor(items.length / 2)]
        }));
    }

    /**
     * Display daily forecast
     */
    displayDailyForecast(dailyData) {
        const section = document.getElementById('dailyForecast');
        const grid = document.getElementById('dailyList');
        
        if (!grid) return;
        
        grid.innerHTML = '';
        
        dailyData.forEach(day => {
            const temps = day.items.map(item => item.main.temp);
            const maxTemp = Math.max(...temps);
            const minTemp = Math.min(...temps);
            const avgPrecip = day.items.reduce((sum, item) => 
                sum + (item.rain?.['3h'] || 0), 0) / day.items.length;
            
            const card = document.createElement('div');
            card.className = 'daily-card';
            card.innerHTML = `
                <div class="day">${Utils.formatDay(day.mainItem.dt)}</div>
                <div class="icon">
                    <img src="${Utils.getWeatherIconUrl(day.mainItem.weather[0].icon)}" alt="weather">
                </div>
                <div class="temps">
                    <span class="high">${Utils.formatTemp(maxTemp, this.currentUnit)}</span>
                    <span class="low">${Utils.formatTemp(minTemp, this.currentUnit)}</span>
                </div>
                <div class="precipitation">
                    ${Math.round(avgPrecip * 100) / 100} mm
                </div>
            `;
            grid.appendChild(card);
        });
        
        section.style.display = 'block';
    }

    /**
     * Display air quality
     */
    displayAirQuality(aqi) {
        const section = document.getElementById('airQuality');
        if (!section || !aqi.main) return;
        
        const aqiValue = aqi.main.aqi;
        const aqiLabel = CONFIG.AQI_LEVELS[aqiValue] || { label: 'Unknown', color: '#999' };
        
        document.getElementById('aqiValue').textContent = aqiValue;
        document.getElementById('aqiLabel').textContent = aqiLabel.label;
        document.getElementById('pm25').textContent = 
            Math.round(aqi.components.pm2_5);
        document.getElementById('pm10').textContent = 
            Math.round(aqi.components.pm10);
        
        section.style.display = 'block';
    }

    /**
     * Handle search input
     */
    async handleSearch(e) {
        const query = e.target.value.trim();
        const suggestions = document.getElementById('searchSuggestions');
        
        if (query.length < CONFIG.SEARCH.MIN_CHARS) {
            suggestions.innerHTML = '';
            suggestions.classList.remove('active');
            return;
        }
        
        try {
            const results = await WeatherAPI.searchCity(query, CONFIG.SEARCH.MAX_SUGGESTIONS);
            suggestions.innerHTML = '';
            
            results.forEach(city => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`;
                item.onclick = () => {
                    document.getElementById('searchInput').value = item.textContent;
                    suggestions.classList.remove('active');
                    this.performSearch(item.textContent);
                };
                suggestions.appendChild(item);
            });
            
            suggestions.classList.add('active');
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    /**
     * Perform search
     */
    async performSearch(cityName) {
        if (!cityName.trim()) return;
        
        try {
            const results = await WeatherAPI.searchCity(cityName, 1);
            if (results.length > 0) {
                const city = results[0];
                await this.loadWeather(city.lat, city.lon, city.name);
                document.getElementById('searchInput').value = '';
            }
        } catch (error) {
            this.showError('Şehir bulunamadı.');
            console.error(error);
        }
    }

    /**
     * Get GPS location
     */
    async getGPSLocation() {
        if (!navigator.geolocation) {
            this.showError('GPS konumu desteklenmiyor.');
            return;
        }
        
        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const cityData = await WeatherAPI.getCityName(latitude, longitude);
                    const cityName = cityData?.name || 'Mevcut Konum';
                    await this.loadWeather(latitude, longitude, cityName);
                } catch (error) {
                    await this.loadWeather(latitude, longitude, 'Mevcut Konum');
                }
            }, (error) => {
                this.showError('GPS konumu alınamadı.');
            });
        } catch (error) {
            this.showError('GPS hatası.');
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        Storage.updatePreferences({ theme: isDark ? 'dark' : 'light' });
    }

    /**
     * Switch temperature unit
     */
    async switchUnit(unit) {
        if (unit === this.currentUnit) return;
        
        this.currentUnit = unit;
        Storage.updatePreferences({ unit: unit });
        
        // Update UI
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === unit) {
                btn.classList.add('active');
            }
        });
        
        if (this.currentLocation) {
            await this.loadWeather(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.currentLocation.name
            );
        }
    }

    /**
     * Toggle favorite
     */
    toggleFavorite(location) {
        const isFav = Storage.isFavorite(location.lat, location.lon);
        
        if (isFav) {
            const favorites = Storage.getFavorites();
            const toRemove = favorites.find(f => f.lat === location.lat && f.lon === location.lon);
            if (toRemove) Storage.removeFavorite(toRemove.id);
        } else {
            Storage.addFavorite(location);
        }
        
        this.updateFavoritesList();
        this.displayCurrentWeather(this.currentLocation.weather);
    }

    /**
     * Update favorites list
     */
    updateFavoritesList() {
        const list = document.getElementById('favoritesList');
        if (!list) return;
        
        const favorites = Storage.getFavorites();
        list.innerHTML = '';
        
        if (favorites.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary); font-size: 12px;">Henüz favori yok</p>';
            return;
        }
        
        favorites.forEach(fav => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            item.innerHTML = `
                <span>${fav.name}</span>
                <button class="remove-btn" title="Sil"><i class="fas fa-times"></i></button>
            `;
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-btn')) {
                    this.loadWeather(fav.lat, fav.lon, fav.name);
                }
            });
            item.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                Storage.removeFavorite(fav.id);
                this.updateFavoritesList();
            });
            list.appendChild(item);
        });
    }

    /**
     * Update recent searches list
     */
    updateRecentList() {
        const list = document.getElementById('recentList');
        if (!list) return;
        
        const recent = Storage.getRecentSearches();
        list.innerHTML = '';
        
        if (recent.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary); font-size: 12px;">Henüz arama yok</p>';
            return;
        }
        
        recent.slice(0, 5).forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'recent-item';
            itemDiv.textContent = item.name;
            itemDiv.addEventListener('click', () => {
                this.loadWeather(item.lat, item.lon, item.name);
            });
            list.appendChild(itemDiv);
        });
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.style.display = 'flex';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.weatherDashboard = new WeatherDashboard();
});
