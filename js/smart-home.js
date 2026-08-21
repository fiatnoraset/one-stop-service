/**
 * One Stop Service - Smart Home & iHITEK Integration Module
 * Handles deep-linking to the iHITEK mobile application and provides an interactive web IoT simulator.
 */

const SmartHomeManager = {
  // Initial state for simulated lights
  state: {
    livingRoom: { on: true, brightness: 85, color: '#fef08a', mode: 'warm', name: 'ไฟห้องนั่งเล่น' },
    bedroom: { on: false, brightness: 50, color: '#e0e7ff', mode: 'cool', name: 'ไฟห้องนอนใหญ่' },
    kitchen: { on: true, brightness: 100, color: '#ffffff', mode: 'daylight', name: 'ไฟห้องครัว' },
    balcony: { on: false, brightness: 70, color: '#fef9c3', mode: 'warm', name: 'ไฟระเบียง & สวน' },
    study: { on: true, brightness: 90, color: '#ecfdf5', mode: 'focus', name: 'ไฟห้องทำงาน' }
  },

  // Launch iHITEK App with smart device detection
  launchApp: function() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroid = /android/i.test(userAgent);

    const appSchemeUrl = 'ihitek://';
    const appStoreUrl = 'https://apps.apple.com/th/app/ihitek/id1453913076';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.ihitek.smartlife';

    // Notify user
    this.showToast('กำลังเชื่อมต่อไปยังแอป iHITEK...');

    const startTime = Date.now();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = appSchemeUrl;
    document.body.appendChild(iframe);

    // Fallback if app not installed or running on desktop browser
    setTimeout(() => {
      document.body.removeChild(iframe);
      const elapsed = Date.now() - startTime;
      
      // If still within 2.5 seconds, the app was likely not opened
      if (elapsed < 2500) {
        if (isIOS) {
          window.location.href = appStoreUrl;
        } else if (isAndroid) {
          window.location.href = playStoreUrl;
        } else {
          // On Desktop or if app is not installed, open modal & store selection
          this.openSmartHomeModal();
        }
      }
    }, 1500);
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

  applyScene: function(scene) {
    switch (scene) {
      case 'relax':
        this.state.livingRoom = { on: true, brightness: 40, color: '#fde68a', mode: 'warm', name: 'ไฟห้องนั่งเล่น' };
        this.state.bedroom = { on: true, brightness: 30, color: '#fef08a', mode: 'warm', name: 'ไฟห้องนอนใหญ่' };
        this.state.kitchen = { on: false, brightness: 0, color: '#ffffff', mode: 'off', name: 'ไฟห้องครัว' };
        this.state.study = { on: false, brightness: 0, color: '#ffffff', mode: 'off', name: 'ไฟห้องทำงาน' };
        this.showToast('เปิดโหมดผ่อนคลาย (Relaxing Mood) 🛋️');
        break;
      case 'focus':
        this.state.study = { on: true, brightness: 100, color: '#f8fafc', mode: 'focus', name: 'ไฟห้องทำงาน' };
        this.state.livingRoom = { on: false, brightness: 0, color: '#fef08a', mode: 'off', name: 'ไฟห้องนั่งเล่น' };
        this.showToast('เปิดโหมดสมาธิ/ทำงาน (Focus Mode) 📚');
        break;
      case 'movie':
        this.state.livingRoom = { on: true, brightness: 15, color: '#818cf8', mode: 'cinema', name: 'ไฟห้องนั่งเล่น' };
        this.state.bedroom = { on: false, brightness: 0, color: '#fef08a', mode: 'off', name: 'ไฟห้องนอนใหญ่' };
        this.state.kitchen = { on: false, brightness: 0, color: '#ffffff', mode: 'off', name: 'ไฟห้องครัว' };
        this.showToast('เปิดโหมดดูหนัง (Cinema Night) 🍿');
        break;
      case 'party':
        this.state.livingRoom = { on: true, brightness: 90, color: '#ec4899', mode: 'party', name: 'ไฟห้องนั่งเล่น' };
        this.state.kitchen = { on: true, brightness: 80, color: '#a855f7', mode: 'party', name: 'ไฟห้องครัว' };
        this.showToast('เปิดโหมดปาร์ตี้ (Party Glow) 🎉');
        break;
    }
    this.render();
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
    if (badgeEl) {
      badgeEl.textContent = `${activeCount}/${totalCount} เปิดอยู่`;
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
