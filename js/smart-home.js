/**
 * One Stop Service - Smart Home & IoT Integration Module
 * Handles deep-linking to iHITEK and Xiaomi Home (Mi Home) mobile applications,
 * and provides an interactive web IoT simulator.
 */

const SMART_APPS = {
  ihitek: {
    id: 'ihitek',
    name: 'iHITEK Smart Home',
    title: 'เปิดปิดไฟในบ้าน (iHITEK)',
    desc: 'ควบคุมสวิตช์ไฟและอุปกรณ์ไฟฟ้าอัจฉริยะ',
    scheme: 'ihitek://',
    package: 'com.hitekhome.smart',
    appStoreUrl: 'https://apps.apple.com/th/app/ihitek/id1453913076',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hitekhome.smart',
    icon: 'lightbulb',
    color: 'amber',
    toastMsg: 'กำลังเปิดแอปพลิเคชัน iHITEK Smart Home... 💡'
  },
  xiaomi: {
    id: 'xiaomi',
    name: 'Xiaomi Home (Mi Home)',
    title: 'กล้องวงจรปิดในบ้าน (Xiaomi Home)',
    desc: 'ดูกล้องวงจรปิด CCTV 360° และอุปกรณ์เสียวหมี่',
    scheme: 'mihome://',
    package: 'com.xiaomi.smarthome',
    appStoreUrl: 'https://apps.apple.com/th/app/mi-home-xiaomi-smarthome/id883807065',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.xiaomi.smarthome&pcampaignid=web_share',
    icon: 'video',
    color: 'orange',
    toastMsg: 'กำลังเปิดแอปพลิเคชัน Xiaomi Home (กล้องวงจรปิด)... 📹'
  }
};

const SmartHomeManager = {
  SMART_APPS: SMART_APPS,

  // Initial state for simulated lights
  state: {
    livingRoom: { on: true, brightness: 85, color: '#fef08a', mode: 'warm', name: 'ไฟห้องนั่งเล่น' },
    bedroom: { on: false, brightness: 50, color: '#e0e7ff', mode: 'cool', name: 'ไฟห้องนอนใหญ่' },
    kitchen: { on: true, brightness: 100, color: '#ffffff', mode: 'daylight', name: 'ไฟห้องครัว' },
    balcony: { on: false, brightness: 70, color: '#fef9c3', mode: 'warm', name: 'ไฟระเบียง & สวน' },
    study: { on: true, brightness: 90, color: '#ecfdf5', mode: 'focus', name: 'ไฟห้องทำงาน' }
  },

  // Launch Smart Home App (iHITEK or Xiaomi Home) with platform detection
  launchApp: function(appType = 'ihitek') {
    const app = SMART_APPS[appType] || SMART_APPS.ihitek;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    // Notify user
    this.showToast(app.toastMsg);

    if (isAndroid) {
      // Android Chrome intent URL: opens app if installed, or falls back to Play Store automatically
      const schemeName = app.scheme.replace('://', '');
      const fallbackUrl = encodeURIComponent(app.playStoreUrl);
      const androidIntentUrl = `intent://#Intent;scheme=${schemeName};package=${app.package};S.browser_fallback_url=${fallbackUrl};end`;
      window.location.href = androidIntentUrl;
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = app.playStoreUrl;
        }
      }, 1800);
    } else if (isIOS) {
      // iOS: try custom scheme first, fallback to App Store if app is not installed
      const startTime = Date.now();
      window.location.href = app.scheme;
      setTimeout(() => {
        if (!document.hidden && Date.now() - startTime < 2500) {
          window.location.href = app.appStoreUrl;
        }
      }, 1500);
    } else {
      // Desktop / PC / Mac: Try app scheme or open Play Store in new tab
      try {
        window.location.href = app.scheme;
      } catch (e) {}
      setTimeout(() => {
        window.open(app.playStoreUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    }
  },

  launchIHITEK: function() {
    this.launchApp('ihitek');
  },

  launchXiaomiHome: function() {
    this.launchApp('xiaomi');
  },

  // Open Smart Home Simulator Modal
  openSmartHomeModal: function() {
    const modal = document.getElementById('smart-home-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      this.render();
    }
  },

  closeSmartHomeModal: function() {
    const modal = document.getElementById('smart-home-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  },

  toggleLight: function(roomKey) {
    if (this.state[roomKey]) {
      this.state[roomKey].on = !this.state[roomKey].on;
      this.render();
      const statusText = this.state[roomKey].on ? 'เปิด' : 'ปิด';
      this.showToast(`${statusText} ${this.state[roomKey].name} แล้ว`);
    }
  },

  setAllLights: function(turnOn) {
    Object.keys(this.state).forEach(key => {
      this.state[key].on = turnOn;
    });
    this.render();
    this.showToast(turnOn ? 'เปิดไฟทุกดวงในบ้านแล้ว' : 'ปิดไฟทุกดวงในบ้านแล้ว');
  },

  setBrightness: function(roomKey, val) {
    if (this.state[roomKey]) {
      this.state[roomKey].brightness = parseInt(val, 10);
      if (this.state[roomKey].brightness > 0 && !this.state[roomKey].on) {
        this.state[roomKey].on = true;
      }
      this.renderLightBulb(roomKey);
    }
  },

  setColor: function(roomKey, hexColor) {
    if (this.state[roomKey]) {
      this.state[roomKey].color = hexColor;
      this.renderLightBulb(roomKey);
    }
  },

  renderLightBulb: function(roomKey) {
    const light = this.state[roomKey];
    const bulbEl = document.getElementById(`bulb-icon-${roomKey}`);
    const cardEl = document.getElementById(`light-card-${roomKey}`);
    const sliderEl = document.getElementById(`brightness-${roomKey}`);
    const switchEl = document.getElementById(`switch-${roomKey}`);

    if (bulbEl) {
      if (light.on) {
        bulbEl.style.color = light.color;
        bulbEl.style.filter = `drop-shadow(0 0 ${Math.max(4, light.brightness / 6)}px ${light.color})`;
        bulbEl.style.opacity = (light.brightness / 100).toFixed(2);
      } else {
        bulbEl.style.color = '#9ca3af';
        bulbEl.style.filter = 'none';
        bulbEl.style.opacity = '0.4';
      }
    }

    if (cardEl) {
      if (light.on) {
        cardEl.classList.add('border-amber-400/50', 'bg-amber-500/5');
        cardEl.classList.remove('border-slate-200', 'dark:border-slate-800');
      } else {
        cardEl.classList.remove('border-amber-400/50', 'bg-amber-500/5');
        cardEl.classList.add('border-slate-200', 'dark:border-slate-800');
      }
    }

    if (switchEl) {
      switchEl.checked = light.on;
    }
    if (sliderEl) {
      sliderEl.value = light.brightness;
    }
  },

  render: function() {
    Object.keys(this.state).forEach(key => this.renderLightBulb(key));
    this.updateActiveCount();
  },

  updateActiveCount: function() {
    const activeCount = Object.values(this.state).filter(l => l.on).length;
    const totalCount = Object.keys(this.state).length;
    const badgeEl = document.getElementById('active-lights-count');
    const summaryBadgeEl = document.getElementById('summary-lights-badge');
    if (badgeEl) {
      badgeEl.textContent = `${activeCount}/${totalCount} เปิดอยู่`;
    }
    if (summaryBadgeEl) {
      summaryBadgeEl.textContent = `💡 ${activeCount}/${totalCount} ไฟเปิดอยู่`;
    }
  },

  showToast: function(msg) {
    if (window.showAppToast) {
      window.showAppToast(msg);
    }
  }
};

if (typeof window !== 'undefined') {
  window.SmartHomeManager = SmartHomeManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartHomeManager;
}
