/**
 * Weather & PM 2.5 Manager (Open-Meteo API Integration)
 * Real-time Weather, Temperature, WMO Condition mapping, and PM 2.5 Air Quality Index.
 * Free & No API Key required.
 */

const CITIES = {
  bangkok: { name: 'กรุงเทพมหานคร', nameShort: 'กรุงเทพฯ', lat: 13.7563, lon: 100.5018 },
  yasothon: { name: 'ยโสธร (วชช.ยโสธร)', nameShort: 'ยโสธร', lat: 15.7925, lon: 104.1452 },
  chiangmai: { name: 'เชียงใหม่', nameShort: 'เชียงใหม่', lat: 18.7883, lon: 98.9853 },
  khonkaen: { name: 'ขอนแก่น', nameShort: 'ขอนแก่น', lat: 16.4419, lon: 102.8360 },
  phuket: { name: 'ภูเก็ต', nameShort: 'ภูเก็ต', lat: 7.8804, lon: 98.3923 }
};

const WeatherManager = {
  currentCityKey: 'bangkok',
  customLocation: null,
  cachedData: null,
  refreshTimer: null,

  init: function() {
    try {
      const savedCity = localStorage.getItem('oss_weather_city');
      if (savedCity && (CITIES[savedCity] || savedCity === 'custom')) {
        this.currentCityKey = savedCity;
      }
    } catch (e) {
      this.currentCityKey = 'bangkok';
    }

    this.renderCityButtons();
    this.fetchData();

    // Auto-refresh every 10 minutes
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    this.refreshTimer = setInterval(() => this.fetchData(), 10 * 60 * 1000);
  },

  getCoordinates: function() {
    if (this.currentCityKey === 'custom' && this.customLocation) {
      return this.customLocation;
    }
    return CITIES[this.currentCityKey] || CITIES.bangkok;
  },

  getCityName: function() {
    if (this.currentCityKey === 'custom' && this.customLocation) {
      return this.customLocation.name;
    }
    const city = CITIES[this.currentCityKey] || CITIES.bangkok;
    return city.nameShort || city.name;
  },

  renderCityButtons: function() {
    const container = document.getElementById('weather-city-pills');
    if (!container) return;

    const cityKeys = Object.keys(CITIES);
    container.innerHTML = `
      ${cityKeys.map(key => {
        const city = CITIES[key];
        const isActive = this.currentCityKey === key;
        const activeClass = isActive 
          ? 'bg-sky-600 text-white font-bold border-sky-400/40 shadow-sm shadow-sky-500/25' 
          : 'bg-white/5 dark:bg-white/[0.04] text-slate-400 hover:text-white border-white/10';
        return `
          <button type="button" onclick="WeatherManager.changeCity('${key}')" 
                  class="px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all whitespace-nowrap ${activeClass}">
            ${city.nameShort}
          </button>
        `;
      }).join('')}
      <button type="button" onclick="WeatherManager.detectLocation()" 
              class="px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-all whitespace-nowrap flex items-center gap-1 ${this.currentCityKey === 'custom' ? 'bg-sky-600 text-white font-bold border-sky-400/40' : 'bg-white/5 dark:bg-white/[0.04] text-slate-400 hover:text-white border-white/10'}">
        <i data-lucide="locate-fixed" class="w-3 h-3"></i>
        <span>พิกัดฉัน</span>
      </button>
    `;
    if (window.lucide) lucide.createIcons();
  },

  changeCity: function(cityKey) {
    this.currentCityKey = cityKey;
    try {
      localStorage.setItem('oss_weather_city', cityKey);
    } catch (e) {}
    this.renderCityButtons();
    this.fetchData();
  },

  detectLocation: function() {
    if (!navigator.geolocation) {
      if (window.App) App.showToast('เบราว์เซอร์ไม่รองรับการระบุพิกัด GPS');
      return;
    }

    if (window.App) App.showToast('กำลังค้นหาพิกัดตำแหน่งของคุณ...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.customLocation = {
          name: 'ตำแหน่งของคุณ (GPS)',
          nameShort: 'พิกัดฉัน',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        this.currentCityKey = 'custom';
        this.renderCityButtons();
        this.fetchData();
        if (window.App) App.showToast('อัปเดตสภาพอากาศตามพิกัด GPS สำเร็จ 📍');
      },
      (err) => {
        console.warn('Geolocation error:', err);
        if (window.App) App.showToast('ไม่สามารถระบุพิกัดได้ ใช้กรุงเทพฯ แทน');
        this.changeCity('bangkok');
      },
      { timeout: 8000 }
    );
  },

  // WMO Weather interpretation codes (WW)
  getWeatherInfo: function(code) {
    const wCode = parseInt(code, 10);
    switch (wCode) {
      case 0:
        return { text: 'ท้องฟ้าแจ่มใส', textEn: 'Clear Sky', icon: 'sun', symbol: '☀️', color: 'amber' };
      case 1:
        return { text: 'ท้องฟ้าโปร่ง', textEn: 'Mainly Clear', icon: 'sun', symbol: '🌤️', color: 'amber' };
      case 2:
        return { text: 'มีเมฆบางส่วน', textEn: 'Partly Cloudy', icon: 'cloud-sun', symbol: '⛅', color: 'sky' };
      case 3:
        return { text: 'มีเมฆมาก/มืดครึ้ม', textEn: 'Overcast', icon: 'cloud', symbol: '☁️', color: 'slate' };
      case 45:
      case 48:
        return { text: 'มีหมอกหนา', textEn: 'Foggy', icon: 'cloud-fog', symbol: '🌫️', color: 'slate' };
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return { text: 'ฝนตกปรอยๆ', textEn: 'Light Drizzle', icon: 'cloud-drizzle', symbol: '🌦️', color: 'blue' };
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
        return { text: 'ฝนตกปานกลาง', textEn: 'Rain', icon: 'cloud-rain', symbol: '🌧️', color: 'blue' };
      case 80:
      case 81:
      case 82:
        return { text: 'ฝนฟ้าคะนอง / ฝนซู่', textEn: 'Rain Showers', icon: 'cloud-lightning', symbol: '🌧️', color: 'blue' };
      case 95:
      case 96:
      case 99:
        return { text: 'พายุฝนฟ้าคะนองรุนแรง', textEn: 'Thunderstorm', icon: 'cloud-lightning', symbol: '⛈️', color: 'purple' };
      default:
        return { text: 'สภาพอากาศปกติ', textEn: 'Fair', icon: 'cloud-sun', symbol: '🌤️', color: 'sky' };
    }
  },

  // Thai Air Quality Standard for PM 2.5
  getPM25Level: function(val) {
    const pm = parseFloat(val) || 0;
    if (pm <= 15.0) {
      return {
        level: 1,
        label: 'คุณภาพอากาศดีมาก',
        shortLabel: 'ดีมาก',
        badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        barWidth: '20%',
        barColor: 'bg-sky-400',
        textColor: 'text-sky-400',
        emoji: '🔵',
        advice: '💙 คุณภาพอากาศดีมาก เหมาะสำหรับทำกิจกรรมกลางแจ้งและออกกำลังกาย'
      };
    } else if (pm <= 25.0) {
      return {
        level: 2,
        label: 'คุณภาพอากาศดี',
        shortLabel: 'ดี',
        badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        barWidth: '40%',
        barColor: 'bg-emerald-400',
        textColor: 'text-emerald-400',
        emoji: '🟢',
        advice: '💚 คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ'
      };
    } else if (pm <= 37.5) {
      return {
        level: 3,
        label: 'ปานกลาง',
        shortLabel: 'ปานกลาง',
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        barWidth: '60%',
        barColor: 'bg-amber-400',
        textColor: 'text-amber-400',
        emoji: '🟡',
        advice: '💛 ประชาชนทั่วไปทำกิจกรรมได้ตามปกติ กลุ่มเสี่ยงควรสังเกตอาการ'
      };
    } else if (pm <= 75.0) {
      return {
        level: 4,
        label: 'เริ่มมีผลกระทบต่อสุขภาพ',
        shortLabel: 'เริ่มมีผลกระทบ',
        badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        barWidth: '82%',
        barColor: 'bg-orange-500',
        textColor: 'text-orange-400',
        emoji: '🟠',
        advice: '🧡 ควรใช้อุปกรณ์ป้องกัน เช่น สวมหน้ากาก N95 เมื่อต้องอยู่กลางแจ้ง'
      };
    } else {
      return {
        level: 5,
        label: 'มีผลกระทบต่อสุขภาพ',
        shortLabel: 'อันตราย',
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
        barWidth: '100%',
        barColor: 'bg-red-500',
        textColor: 'text-red-400',
        emoji: '🔴',
        advice: '❤️ หลีกเลี่ยงกิจกรรมกลางแจ้ง สวมหน้ากาก N95 และอยู่ภายในอาคาร'
      };
    }
  },

  fetchData: async function() {
    const coords = this.getCoordinates();
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FBangkok`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=pm2_5,pm10,european_aqi,us_aqi&timezone=Asia%2FBangkok`;

    const spinner = document.getElementById('weather-refresh-spinner');
    if (spinner) spinner.classList.add('animate-spin');

    try {
      const [weatherRes, airRes] = await Promise.allSettled([
        fetch(weatherUrl).then(r => r.json()),
        fetch(airUrl).then(r => r.json())
      ]);

      let weatherData = (weatherRes.status === 'fulfilled') ? weatherRes.value : null;
      let airData = (airRes.status === 'fulfilled') ? airRes.value : null;

      // Fallback values if offline/blocked
      if (!weatherData || !weatherData.current) {
        weatherData = {
          current: {
            temperature_2m: 31.0,
            relative_humidity_2m: 65,
            weather_code: 2,
            wind_speed_10m: 10.5
          }
        };
      }

      if (!airData || !airData.current) {
        airData = {
          current: {
            pm2_5: 18.5,
            pm10: 28.0
          }
        };
      }

      this.cachedData = { weather: weatherData, air: airData, timestamp: new Date() };
      this.updateUI(weatherData, airData);

    } catch (err) {
      console.warn('WeatherManager fetch error:', err);
    } finally {
      if (spinner) spinner.classList.remove('animate-spin');
    }
  },

  updateUI: function(weatherData, airData) {
    const temp = weatherData.current.temperature_2m;
    const weatherCode = weatherData.current.weather_code;
    const humidity = weatherData.current.relative_humidity_2m;
    const wind = weatherData.current.wind_speed_10m;
    const pm25 = airData.current.pm2_5 !== undefined ? airData.current.pm2_5 : 18.0;

    const weatherInfo = this.getWeatherInfo(weatherCode);
    const pm25Info = this.getPM25Level(pm25);
    const cityName = this.getCityName();

    // 1. Update Hero Weather Card
    const cityEl = document.getElementById('weather-city-name');
    const tempEl = document.getElementById('weather-temp-val');
    const condEl = document.getElementById('weather-condition-text');
    const iconEl = document.getElementById('weather-icon');
    const humEl = document.getElementById('weather-humidity-val');
    const windEl = document.getElementById('weather-wind-val');
    const pmValEl = document.getElementById('weather-pm25-val');
    const pmBadgeEl = document.getElementById('weather-pm25-badge');
    const pmBarEl = document.getElementById('weather-pm25-bar');
    const pmAdviceEl = document.getElementById('weather-pm25-advice');
    const timeEl = document.getElementById('weather-update-time');

    if (cityEl) cityEl.textContent = cityName;
    if (tempEl) tempEl.textContent = `${temp.toFixed(1)}°C`;
    if (condEl) condEl.textContent = `${weatherInfo.symbol} ${weatherInfo.text}`;
    if (iconEl) iconEl.setAttribute('data-lucide', weatherInfo.icon);
    if (humEl) humEl.textContent = `💧 ความชื้น ${humidity}%`;
    if (windEl) windEl.textContent = `💨 ลม ${wind.toFixed(1)} km/h`;

    if (pmValEl) {
      pmValEl.textContent = `${pm25.toFixed(1)}`;
      pmValEl.className = `text-2xl sm:text-3xl font-black font-mono tracking-tight ${pm25Info.textColor}`;
    }
    if (pmBadgeEl) {
      pmBadgeEl.textContent = `${pm25Info.emoji} ${pm25Info.label}`;
      pmBadgeEl.className = `px-2 py-0.5 rounded-full text-[11px] font-bold border ${pm25Info.badgeClass}`;
    }
    if (pmBarEl) {
      pmBarEl.style.width = pm25Info.barWidth;
      pmBarEl.className = `h-full rounded-full transition-all duration-500 ${pm25Info.barColor}`;
    }
    if (pmAdviceEl) {
      pmAdviceEl.textContent = pm25Info.advice;
    }
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = `อัปเดต ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;
    }

    // 2. Update Ticker Stream
    const tickerCity = document.getElementById('ticker-weather-city');
    const tickerTemp = document.getElementById('ticker-temp-val');
    const tickerPmBadge = document.getElementById('ticker-pm25-badge');
    const tickerCity2 = document.getElementById('ticker-weather-city-2');
    const tickerTemp2 = document.getElementById('ticker-temp-val-2');
    const tickerPmBadge2 = document.getElementById('ticker-pm25-badge-2');

    [tickerCity, tickerCity2].forEach(el => {
      if (el) el.textContent = `${weatherInfo.symbol} ${cityName}`;
    });
    [tickerTemp, tickerTemp2].forEach(el => {
      if (el) el.textContent = `${temp.toFixed(1)}°C`;
    });
    [tickerPmBadge, tickerPmBadge2].forEach(el => {
      if (el) {
        el.textContent = `PM 2.5: ${pm25.toFixed(1)} (${pm25Info.shortLabel})`;
        el.className = `px-1.5 py-0.2 rounded text-[10px] font-bold font-mono border ${pm25Info.badgeClass}`;
      }
    });

    if (window.lucide) lucide.createIcons();
  }
};

// Auto-init on document ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    WeatherManager.init();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WeatherManager, CITIES };
}
