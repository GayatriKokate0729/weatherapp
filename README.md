# 🌤️ Weather App

A clean, modern, and responsive weather application built with vanilla JavaScript. Get current weather conditions and 5-day forecasts for any city worldwide.

![Weather App](https://img.shields.io/badge/Weather-App-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Features

### Core Features
- 🔍 **City Search** - Search for weather in any city worldwide
- 🌡️ **Current Weather** - Temperature, conditions, humidity, wind speed, and pressure
- ⏳ **Loading States** - Smooth loading indicators during API calls
- ❌ **Error Handling** - Beautiful "City Not Found" page for invalid cities
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### Bonus Features
- 📅 **5-Day Forecast** - Extended weather forecast with daily high/low temperatures
- 💾 **Local Storage** - Remembers your last searched city
- 🔄 **Live Updates** - Temperature updates every 30 seconds (demo mode)
- 🎨 **Modern UI** - Beautiful gradient backgrounds and smooth animations
- 🌍 **Demo Mode** - Works immediately without API key

## 🚀 Quick Start

### Option 1: Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/weather-app.git
cd weather-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Option 2: Use Demo Mode
1. Open `index.html` in your browser
2. Search for any city (e.g., "London", "Tokyo", "New York")
3. Enjoy the weather data with demo mode!

## 🔧 Setup for Real API

1. **Get API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the "API Keys" section

2. **Configure the App**
   - Open `config.js`
   - Replace `'demo'` with your actual API key:
   ```javascript
   const CONFIG = {
       API_KEY: 'your-actual-api-key-here',
       // ... rest of config
   };
   ```

3. **Refresh and Enjoy**
   - Save the file and refresh your browser
   - Now you'll get real weather data!

## 📱 How to Use

1. **Enter City Name** - Type any city name in the search bar
2. **Search** - Press Enter or click the search button
3. **View Results** - See current weather and 5-day forecast
4. **Live Updates** - Temperatures update automatically in demo mode

## 🛠️ Technical Details

### Built With
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **OpenWeatherMap API** - Real weather data
- **Local Storage** - Data persistence

### File Structure
```
weather-app/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── app.js             # JavaScript application logic
├── config.js          # Configuration file
├── package.json       # Dependencies and scripts
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
└── README.md          # This file
```

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 API Information

This app uses the [OpenWeatherMap API](https://openweathermap.org/api):
- **Current Weather API**: `/weather`
- **5-Day Forecast API**: `/forecast`
- **Free tier**: 1000 calls/day, 60 calls/minute

## 📸 Screenshots

### Desktop View
- Clean, modern interface with gradient background
- Current weather display with temperature and conditions
- 5-day forecast with high/low temperatures

### Mobile View
- Fully responsive design
- Touch-friendly interface
- Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ by [Your Name]**

⭐ Star this repository if you found it helpful!