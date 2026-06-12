// OpenWeatherMap API - 获取免费 API Key：https://openweathermap.org/api
const API_KEY = '2104c04d9d9ec5169daf652709a3ef5e'; // ⚠️ 需要替换为你的 API Key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM 元素
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const unitSelect = document.getElementById('unitSelect');
const errorMsg = document.getElementById('errorMsg');
const currentWeather = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const favoritesSection = document.getElementById('favoritesSection');
const loadingSpinner = document.getElementById('loadingSpinner');

let currentCity = null;
let currentUnit = 'metric';
let favorites = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    displayFavorites();
    
    // 事件监听
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    geoBtn.addEventListener('click', handleGeoLocation);
    unitSelect.addEventListener('change', (e) => {
        currentUnit = e.target.value;
        if (currentCity) {
            fetchWeather(currentCity);
        }
    });
});

// 搜索城市
function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('请输入城市名称');
        return;
    }
    fetchWeather(city);
}

// 地理定位
function handleGeoLocation() {
    if (!navigator.geolocation) {
        showError('你的浏览器不支持地理定位');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showLoading(false);
            showError('无法获取你的位置：' + error.message);
        }
    );
}

// 根据城市名获取天气
async function fetchWeather(city) {
    showLoading(true);
    clearError();

    try {
        // 获取城市坐标
        const geoResponse = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`
        );

        if (!geoResponse.ok) {
            if (geoResponse.status === 404) {
                throw new Error('找不到该城市，请检查城市名称');
            }
            throw new Error('无法获取天气数据');
        }

        const geoData = await geoResponse.json();
        currentCity = geoData.name;
        const { lat, lon } = geoData.coord;

        // 获取详细天气和预报
        const weatherResponse = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}&lang=zh_cn`
        );
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}&lang=zh_cn`
        );

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(weatherData);
        displayForecast(forecastData);
        searchInput.value = '';

        showLoading(false);
    } catch (error) {
        showLoading(false);
        showError(error.message);
    }
}

// 根据坐标获取天气
async function fetchWeatherByCoords(lat, lon) {
    clearError();

    try {
        const weatherResponse = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}&lang=zh_cn`
        );
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}&lang=zh_cn`
        );

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        currentCity = weatherData.name;
        displayWeather(weatherData);
        displayForecast(forecastData);

        showLoading(false);
    } catch (error) {
        showLoading(false);
        showError(error.message);
    }
}

// 显示当前天气
function displayWeather(data) {
    const {
        name,
        main: { temp, feels_like, humidity, pressure },
        weather: [{ main, description, icon }],
        wind: { speed }
    } = data;

    const unit = currentUnit === 'metric' ? '°C' : '°F';
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

    document.getElementById('cityName').textContent = name;
    document.getElementById('weatherDesc').textContent = description;
    document.getElementById('temp').textContent = Math.round(temp) + unit;
    document.getElementById('feelsLike').textContent = Math.round(feels_like) + unit;
    document.getElementById('humidity').textContent = humidity + '%';
    document.getElementById('windSpeed').textContent = speed + ' ' + windUnit;
    document.getElementById('pressure').textContent = pressure + ' hPa';

    // 根据天气图标显示 emoji
    document.getElementById('weatherIcon').textContent = getWeatherEmoji(icon);

    currentWeather.classList.remove('hidden');

    // 保存按钮
    const saveBtn = document.getElementById('saveBtn');
    const isFavorite = favorites.some(fav => fav.name === name);
    saveBtn.textContent = isFavorite ? '✓ 已收藏' : '⭐ 收藏城市';
    saveBtn.classList.toggle('saved', isFavorite);
    
    saveBtn.onclick = () => toggleFavorite(name, temp, icon);
}

// 显示5天预报
function displayForecast(data) {
    const forecastList = data.list.filter((_, index) => index % 8 === 0); // 每天一条数据
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const desc = item.weather[0].description;

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${getWeatherEmoji(icon)}</div>
            <div class="forecast-temp">${temp}°</div>
            <div class="forecast-desc">${desc}</div>
        `;
        container.appendChild(card);
    });

    forecastSection.classList.remove('hidden');
}

// 收藏/取消收藏城市
function toggleFavorite(cityName, temp, icon) {
    const index = favorites.findIndex(fav => fav.name === cityName);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push({ name: cityName, temp: Math.round(temp), icon });
    }

    saveFavorites();
    displayFavorites();

    const saveBtn = document.getElementById('saveBtn');
    const isFavorite = favorites.some(fav => fav.name === cityName);
    saveBtn.textContent = isFavorite ? '✓ 已收藏' : '⭐ 收藏城市';
    saveBtn.classList.toggle('saved', isFavorite);
}

// 显示收藏的城市
function displayFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';

    if (favorites.length === 0) {
        favoritesSection.classList.add('hidden');
        return;
    }

    favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <button class="remove" onclick="removeFavorite('${fav.name}')">✕</button>
            <div class="name">${fav.name}</div>
            <div style="font-size: 1.5em; margin: 5px 0;">${getWeatherEmoji(fav.icon)}</div>
            <div class="temp">${fav.temp}°</div>
        `;
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove')) {
                fetchWeather(fav.name);
            }
        });
        container.appendChild(card);
    });

    favoritesSection.classList.remove('hidden');
}

// 移除收藏
function removeFavorite(cityName) {
    favorites = favorites.filter(fav => fav.name !== cityName);
    saveFavorites();
    displayFavorites();
}

// 本地存储
function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const saved = localStorage.getItem('weatherFavorites');
    if (saved) {
        favorites = JSON.parse(saved);
    }
}

// 根据天气图标返回 emoji
function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '🌤️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌤️';
}

// 错误处理
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 5000);
}

function clearError() {
    errorMsg.classList.remove('show');
}

// 加载动画
function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}
