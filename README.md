# 🌤️ 天气预报应用

一个简单、美观的天气预报应用，用 HTML + CSS + JavaScript 开发。适合初学者学习前端开发。

## ✨ 功能特性

- 🔍 **搜索城市** - 输入城市名称查询天气
- 📍 **地理定位** - 点击按钮查询当前位置天气
- 📅 **5天预报** - 显示未来5天的天气预报
- ⭐ **收藏城市** - 保存喜欢的城市（本地存储）
- 🌡️ **温度单位** - 支持摄氏度和华氏度切换
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🎨 **漂亮UI** - 动画效果和现代化设计

## 🚀 快速开始

### 1️⃣ 获取 API Key

1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 点击 **Sign Up** 注册账号（免费）
3. 登录后进入 API 页面
4. 找到 **Current Weather Data** API，获取你的 API Key

### 2️⃣ 配置项目

打开 `app.js` 文件，找到这一行：

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

替换为你的实际 API Key：

```javascript
const API_KEY = 'abc123def456...'; // 你的 API Key
```

### 3️⃣ 运行应用

#### 方式一：用 VS Code Live Server（推荐）
1. 在 VS Code 中打开项目
2. 右键点击 `index.html`
3. 选择 **Open with Live Server**
4. 浏览器自动打开应用

#### 方式二：直接打开
1. 右键点击 `index.html`
2. 选择 **用浏览器打开**
3. 或者直接拖拽 `index.html` 到浏览器

#### 方式三：启动本地服务器（Python）
```bash
# Python 3
python -m http.server 8000

# 然后访问：http://localhost:8000
```

## 📚 学习要点

### HTML（结构）
- 语义化 HTML5 标签
- 表单输入元素
- 数据属性

### CSS（样式）
- Flexbox 布局
- Grid 布局
- CSS 动画和过渡
- 响应式设计（Media Queries）
- CSS 变量

### JavaScript（逻辑）
- DOM 操作和事件监听
- Fetch API 和异步编程
- JSON 数据处理
- LocalStorage 本地存储
- 地理定位 API
- 错误处理

## 🎯 进阶任务

完成基础版本后，尝试这些扩展功能：

1. **天气告警** - 显示天气预警信息
2. **历史记录** - 保存搜索历史
3. **多语言** - 支持中英文切换
4. **主题切换** - 浅色/深色模式
5. **PWA** - 支持离线使用
6. **图表** - 用 Chart.js 展示气温变化
7. **分享功能** - 分享天气信息到社交媒体
8. **自动更新** - 定时自动刷新天气数据

## 🔧 项目结构

```
weather-app/
├── index.html      # HTML 结构
├── style.css       # CSS 样式
├── app.js          # JavaScript 逻辑
└── README.md       # 项目说明
```

## 📖 关键代码解析

### 获取天气数据
```javascript
async function fetchWeather(city) {
    const response = await fetch(
        `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
}
```

### 本地存储收藏
```javascript
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
}
```

### 地理定位
```javascript
navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    fetchWeatherByCoords(latitude, longitude);
});
```

## 🐛 常见问题

### 问题：无法加载天气数据
**解决方案：**
- 检查 API Key 是否正确
- 确保网络连接正常
- 检查浏览器控制台错误（F12）

### 问题：地理定位不工作
**解决方案：**
- 确保网站用 HTTPS 访问（或本地 localhost）
- 检查浏览器位置权限设置
- 某些浏览器可能需要用户同意

### 问题：收藏功能不保存
**解决方案：**
- 检查浏览器是否允许 LocalStorage
- 查看隐私模式是否开启
- 检查浏览器存储限制

## 🌐 API 文档

- [OpenWeatherMap API 文档](https://openweathermap.org/api)
- [Weather API 端点](https://openweathermap.org/current)
- [Forecast API](https://openweathermap.org/forecast5)

## 📄 许可证

MIT License - 随意使用和修改

## 💡 提示

- 免费 API Key 有调用限制（60 calls/minute）
- 天气数据每 10 分钟更新一次
- 建议在生产环境中使用环境变量存储 API Key
- 可以使用代理服务器避免 CORS 问题

---

**祝你学习愉快！🎉**
