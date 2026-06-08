# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time data from public weather APIs (OpenWeatherMap).

## Features

✨ **Real-time Weather Data**
- Current temperature, humidity, wind speed
- Weather conditions with icons
- Atmospheric pressure and visibility
- UV index and precipitation

🌍 **Multiple Location Support**
- Search by city name
- Search by GPS coordinates
- Favorite locations management
- Recent searches history

📊 **Advanced Features**
- 5-day forecast
- Hourly weather predictions
- Air quality index (AQI)
- Weather alerts and warnings
- Temperature unit toggle (°C / °F)

🎨 **UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark/Light mode
- Smooth animations
- Real-time updates

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla/React)
- **API**: OpenWeatherMap (free tier)
- **Storage**: Local Storage for preferences
- **Visualization**: Chart.js for forecasts

## Project Structure

```
weather-dashboard/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css         # Main styles
│   ├── responsive.css     # Mobile responsive
│   └── themes.css         # Dark/Light themes
├── js/
│   ├── app.js            # Main application
│   ├── weather-api.js    # API integration
│   ├── storage.js        # Local storage management
│   └── utils.js          # Helper functions
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   └── services/        # API services
├── assets/
│   ├── icons/          # Weather icons
│   ├── images/         # Background images
│   └── fonts/          # Custom fonts
└── docs/
    ├── API_SETUP.md    # API configuration
    ├── USER_GUIDE.md   # User documentation
    └── DEV_GUIDE.md    # Developer guide
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free: https://openweathermap.org/api)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Freeman662/weather-dashboard.git
cd weather-dashboard
```

2. **Get API Key**
   - Visit https://openweathermap.org/api
   - Sign up for free account
   - Generate API key
   - Add to `config.js` or `.env`

3. **Start development server**
```bash
# Using Python (built-in)
python -m http.server 8000

# Or using Node.js
npx http-server
```

4. **Open in browser**
```
http://localhost:8000
```

## Usage

### Basic Search
1. Enter city name in search bar
2. Press Enter or click search button
3. View current weather and forecast

### Add to Favorites
1. Click ⭐ heart icon
2. City appears in favorites section
3. Click favorite to instantly switch locations

### Change Settings
- **Temperature**: Toggle between °C and °F
- **Theme**: Switch between light and dark modes
- **Location**: Enable GPS for automatic location

### View Details
- Click on forecast cards for detailed info
- Hover over weather icons for descriptions
- Scroll for hourly forecast

## API Configuration

### OpenWeatherMap (Free Plan)
```javascript
// config.js
const API_CONFIG = {
  KEY: 'your_api_key_here',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  ENDPOINTS: {
    WEATHER: '/weather',
    FORECAST: '/forecast',
    AQI: '/air_pollution',
    GEO: '/geo/1.0/direct'
  }
};
```

### Rate Limits (Free)
- 60 calls/minute
- 1,000,000 calls/month

## Features Breakdown

### 1. Current Weather Widget
- Large temperature display
- Weather condition icon
- "Feels like" temperature
- Humidity and wind speed
- Pressure and visibility

### 2. 5-Day Forecast
- Daily weather predictions
- High/Low temperatures
- Precipitation chance
- Wind speed forecast

### 3. Hourly Breakdown
- Hourly temperature changes
- Precipitation probability
- Wind direction and speed

### 4. Air Quality Index (AQI)
- PM2.5 and PM10 levels
- Air quality rating
- Health recommendations

### 5. Weather Alerts
- Severe weather warnings
- Weather advisories
- Active alerts display

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Touch-friendly buttons
- Full-screen search
- Bottom navigation

### Tablet (768px - 1024px)
- 2-column layout
- Optimized spacing
- Card-based design

### Desktop (> 1024px)
- Multi-column layout
- Sidebar navigation
- Detailed information panels

## Dark Mode

```css
/* Light Mode (Default) */
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --accent: #4a90e2;
}

/* Dark Mode */
body.dark-mode {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --accent: #64b5f6;
}
```

## Error Handling

- Invalid city names
- API rate limiting
- Network connectivity issues
- GPS permission denied
- Browser storage errors

## Performance Optimization

- API result caching (30 minutes)
- Lazy loading of forecasts
- Image optimization
- Minified assets
- Service worker for offline support

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## Screenshots

[Placeholder for screenshots]
- Dashboard home
- Search interface
- Forecast details
- Mobile view
- Dark mode

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Troubleshooting

### API Key Not Working
- Verify key is correct
- Check rate limits
- Ensure API is activated

### Location Not Found
- Check spelling
- Try city with country code (London, UK)
- Use coordinates instead

### Forecast Not Loading
- Refresh page
- Clear browser cache
- Check internet connection

## License

MIT License - see LICENSE file

## Support

- 📧 Email: support@weatherdashboard.com
- 💬 Discord: [Discord Server]
- 🐛 Issues: GitHub Issues

## Credits

- Weather data: OpenWeatherMap
- Icons: Weather Icons Font
- Framework: Vanilla JavaScript
- Inspiration: [Weather apps]

---

**Last Updated**: June 2026
**Version**: 1.0.0
**Status**: Active Development
