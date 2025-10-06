// Weather App - Clean and Simple Implementation
class WeatherApp {
    constructor() {
        this.apiKey = CONFIG.API_KEY;
        this.baseUrl = CONFIG.API_BASE_URL;
        this.currentWeatherData = null;
        this.forecastData = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadLastSearchedCity();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchForm = document.getElementById('searchForm');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        this.forecastContainer = document.getElementById('forecastContainer');
        this.errorMessage = document.getElementById('errorMessage');
    }

    bindEvents() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchWeather();
        });
        
        this.searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.searchWeather();
        });
        
        this.cityInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchWeather();
            }
        });
    }

    async searchWeather() {
        const cityName = this.cityInput.value.trim();
        
        if (!cityName) {
            this.showError('Please enter a city name');
            return;
        }

        this.clearError();
        this.showLoading();
        this.hideWeather();

        try {
            const [currentWeather, forecast] = await Promise.all([
                this.fetchCurrentWeather(cityName),
                this.fetchForecast(cityName)
            ]);

            this.currentWeatherData = currentWeather;
            this.forecastData = forecast;

            this.displayCurrentWeather(currentWeather);
            this.displayForecast(forecast);
            this.saveLastSearchedCity(cityName);
            
        } catch (error) {
            if (error.message !== 'CITY_NOT_FOUND') {
                this.showError(error.message);
            }
        } finally {
            this.hideLoading();
        }
    }

    async fetchCurrentWeather(cityName) {
        if (this.apiKey === 'demo') {
            return this.getDemoWeatherData(cityName);
        }

        const response = await fetch(
            `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${CONFIG.UNITS}&lang=${CONFIG.LANGUAGE}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                this.showCityNotFound(cityName);
                throw new Error('CITY_NOT_FOUND');
            } else if (response.status === 401) {
                throw new Error('API key invalid. Please check your OpenWeatherMap API key in config.js');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }

        return await response.json();
    }

    async fetchForecast(cityName) {
        if (this.apiKey === 'demo') {
            return this.getDemoForecastData(cityName);
        }

        const response = await fetch(
            `${this.baseUrl}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=${CONFIG.UNITS}&lang=${CONFIG.LANGUAGE}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            } else if (response.status === 401) {
                throw new Error('API key invalid. Please check your OpenWeatherMap API key in config.js');
            }
            throw new Error('Failed to fetch forecast data.');
        }

        return await response.json();
    }

    displayCurrentWeather(data) {
        const weatherIcon = this.getWeatherIcon(data.weather[0].icon);
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const countryDisplay = data.sys.country ? `, ${data.sys.country}` : '';
        
        const weatherHTML = `
            <div class="weather-header">
                <h2 class="city-name">${data.name}${countryDisplay}</h2>
                <p class="current-date">${currentDate}</p>
            </div>
            
            <div class="weather-main">
                <div class="weather-icon-container">
                    <div class="weather-icon">${weatherIcon}</div>
                    <p class="weather-condition">${data.weather[0].description}</p>
                </div>
                
                <div class="weather-temp">
                    <div class="temperature">
                        ${Math.round(data.main.temp)}
                        <span class="temp-unit">°C</span>
                    </div>
                </div>
            </div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${data.main.humidity}%</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-wind"></i>
                    </div>
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${data.wind.speed} m/s</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-compress-arrows-alt"></i>
                    </div>
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${data.main.pressure} hPa</div>
                </div>
            </div>
        `;

        this.weatherDisplay.innerHTML = weatherHTML;
        this.showWeather();
    }

    displayForecast(data) {
        const dailyForecasts = this.processForecastData(data.list);
        
        const forecastHTML = `
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-grid">
                ${dailyForecasts.map(day => `
                    <div class="forecast-day">
                        <div class="forecast-date">${day.date}</div>
                        <div class="forecast-icon">${this.getWeatherIcon(day.icon)}</div>
                        <div class="forecast-temp">
                            <span class="temp-max">${Math.round(day.tempMax)}°</span>
                            <span class="temp-separator">/</span>
                            <span class="temp-min">${Math.round(day.tempMin)}°</span>
                        </div>
                        <div class="forecast-condition">${day.condition}</div>
                        <div class="forecast-details">
                            <small>H: ${Math.round(day.tempMax)}° L: ${Math.round(day.tempMin)}°</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.forecastContainer.innerHTML = forecastHTML;
        this.showForecast();
    }

    processForecastData(forecastList) {
        const dailyData = {};
        
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                    tempMax: item.main.temp_max,
                    tempMin: item.main.temp_min,
                    icon: item.weather[0].icon,
                    condition: item.weather[0].description
                };
            } else {
                dailyData[dateKey].tempMax = Math.max(dailyData[dateKey].tempMax, item.main.temp_max);
                dailyData[dateKey].tempMin = Math.min(dailyData[dateKey].tempMin, item.main.temp_min);
            }
        });
        
        const today = new Date().toDateString();
        return Object.values(dailyData)
            .filter((_, index) => index > 0)
            .slice(0, 5);
    }

    getWeatherIcon(iconCode) {
        const iconMap = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return iconMap[iconCode] || '🌤️';
    }

    showCityNotFound(cityName) {
        this.hideWeather();
        this.hideForecast();
        
        const notFoundHTML = `
            <div class="city-not-found">
                <div class="not-found-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <h2>City Not Found</h2>
                <p class="not-found-city">"${cityName}"</p>
                <p class="not-found-message">
                    Sorry, we couldn't find the city you're looking for.<br>
                    Please check the spelling and try again.
                </p>
                <div class="suggestions">
                    <h4>Suggestions:</h4>
                    <ul>
                        <li>Check the spelling of the city name</li>
                        <li>Try using the country name (e.g., "London, UK")</li>
                        <li>Use the full city name</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.weatherDisplay.innerHTML = notFoundHTML;
        this.showWeather();
    }

    getDemoWeatherData(cityName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const demoData = {
                    name: cityName,
                    sys: { country: '' },
                    weather: [
                        {
                            description: 'partly cloudy',
                            icon: '02d'
                        }
                    ],
                    main: {
                        temp: Math.round(Math.random() * 30 + 10),
                        feels_like: Math.round(Math.random() * 30 + 10),
                        humidity: Math.round(Math.random() * 40 + 40),
                        pressure: Math.round(Math.random() * 200 + 1000)
                    },
                    wind: {
                        speed: Math.round(Math.random() * 10 + 2)
                    }
                };
                resolve(demoData);
            }, 1000);
        });
    }

    getDemoForecastData(cityName) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const demoForecast = {
                    list: []
                };
                
                const baseTemp = 22;
                const weatherConditions = [
                    { desc: 'sunny', icon: '01d', tempVariation: 8 },
                    { desc: 'partly cloudy', icon: '02d', tempVariation: 6 },
                    { desc: 'cloudy', icon: '03d', tempVariation: 4 },
                    { desc: 'light rain', icon: '10d', tempVariation: 2 },
                    { desc: 'overcast', icon: '04d', tempVariation: 3 }
                ];
                
                for (let i = 1; i <= 5; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    
                    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
                    
                    const dayTemp = baseTemp + (Math.random() - 0.5) * 10;
                    const tempMax = Math.round(dayTemp + weather.tempVariation + Math.random() * 3);
                    const tempMin = Math.round(dayTemp - weather.tempVariation - Math.random() * 3);
                    
                    for (let j = 0; j < 8; j++) {
                        const hourTemp = tempMin + (tempMax - tempMin) * (0.3 + 0.4 * Math.sin(j * Math.PI / 7));
                        
                        demoForecast.list.push({
                            dt: Math.floor(date.getTime() / 1000) + (j * 3 * 3600),
                            main: {
                                temp_max: tempMax,
                                temp_min: tempMin,
                                temp: Math.round(hourTemp)
                            },
                            weather: [
                                {
                                    description: weather.desc,
                                    icon: weather.icon
                                }
                            ]
                        });
                    }
                }
                
                resolve(demoForecast);
            }, 500);
        });
    }

    showLoading() {
        this.loadingIndicator.classList.add('show');
    }

    hideLoading() {
        this.loadingIndicator.classList.remove('show');
    }

    showWeather() {
        this.weatherDisplay.classList.add('show');
    }

    hideWeather() {
        this.weatherDisplay.classList.remove('show');
    }

    showForecast() {
        this.forecastContainer.classList.add('show');
    }

    hideForecast() {
        this.forecastContainer.classList.remove('show');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        setTimeout(() => {
            this.errorMessage.classList.remove('show');
        }, 5000);
    }

    clearError() {
        this.errorMessage.classList.remove('show');
    }

    saveLastSearchedCity(cityName) {
        try {
            localStorage.setItem('lastSearchedCity', cityName);
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadLastSearchedCity() {
        try {
            const lastCity = localStorage.getItem('lastSearchedCity');
            if (lastCity) {
                this.cityInput.value = lastCity;
            } else if (CONFIG.DEFAULT_CITY) {
                this.cityInput.value = CONFIG.DEFAULT_CITY;
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }
}

// Live temperature updates for demo mode
let liveUpdateInterval;

function startLiveTemperatureUpdates() {
    liveUpdateInterval = setInterval(() => {
        updateLiveTemperatures();
    }, 30000);
}

function updateLiveTemperatures() {
    const forecastCards = document.querySelectorAll('.forecast-day');
    
    forecastCards.forEach(card => {
        const tempMaxEl = card.querySelector('.temp-max');
        const tempMinEl = card.querySelector('.temp-min');
        const detailsEl = card.querySelector('.forecast-details small');
        
        if (tempMaxEl && tempMinEl && detailsEl) {
            const currentMax = parseInt(tempMaxEl.textContent);
            const currentMin = parseInt(tempMinEl.textContent);
            
            const newMax = Math.max(10, Math.min(40, currentMax + (Math.random() - 0.5) * 2));
            const newMin = Math.max(5, Math.min(35, currentMin + (Math.random() - 0.5) * 2));
            
            tempMaxEl.style.transition = 'color 0.3s ease';
            tempMinEl.style.transition = 'color 0.3s ease';
            
            tempMaxEl.style.color = '#ff6b6b';
            tempMinEl.style.color = '#4dabf7';
            
            setTimeout(() => {
                tempMaxEl.textContent = Math.round(newMax) + '°';
                tempMinEl.textContent = Math.round(newMin) + '°';
                detailsEl.textContent = `H: ${Math.round(newMax)}° L: ${Math.round(newMin)}°`;
                
                setTimeout(() => {
                    tempMaxEl.style.color = '#e74c3c';
                    tempMinEl.style.color = '#3498db';
                }, 300);
            }, 150);
        }
    });
    
    const currentTemp = document.querySelector('.temperature');
    if (currentTemp) {
        const currentValue = parseInt(currentTemp.textContent);
        const newValue = Math.max(10, Math.min(40, currentValue + (Math.random() - 0.5) * 2));
        
        currentTemp.style.transition = 'color 0.3s ease';
        currentTemp.style.color = '#ff6b6b';
        
        setTimeout(() => {
            currentTemp.textContent = Math.round(newValue);
            setTimeout(() => {
                currentTemp.style.color = '#333';
            }, 300);
        }, 150);
    }
}

function stopLiveTemperatureUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
        liveUpdateInterval = null;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const weatherApp = new WeatherApp();
        
        if (CONFIG.API_KEY === 'demo') {
            startLiveTemperatureUpdates();
        }
    }, 100);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}