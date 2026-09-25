/**
 * One Stop Service - Core Application Controller
 * Handles UI interactions, multi-device layouts, search filtering, favorites, and theme switching.
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentCategory: 'all',
  searchQuery: '',
  favorites: [],
  deferredPrompt: null,

  init: function() {
    this.loadFavorites();
    this.initTheme();
    this.initDateTime();
    this.initCategories();
    this.renderFavorites();
    this.renderServices();
    this.renderEmergencyHotlines();
    this.initEventListeners();
    this.initPWA();
    if (window.FinancialManager) FinancialManager.init();
    if (window.ParcelTracker) ParcelTracker.init();
    if (window.lucide) lucide.createIcons();
  },

  // Date & Time in Thai
  initDateTime: function() {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const thaiDate = now.toLocaleDateString('th-TH', options);
      const thaiTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const dateEl = document.getElementById('current-date');
      const timeEl = document.getElementById('current-time');
      if (dateEl) dateEl.textContent = thaiDate;
      if (timeEl) timeEl.textContent = `${thaiTime} น.`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  },

  // Dark / Light Theme
  initTheme: function() {
    const savedTheme = localStorage.getItem('oss_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  },

  setTheme: function(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('oss_theme', 'dark');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.setAttribute('data-lucide', 'sun');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('oss_theme', 'light');
      const icon = document.getElementById('theme-icon');
      if (icon) icon.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) lucide.createIcons();
  },

  toggleTheme: function() {
    const isDark = document.documentElement.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
    this.showToast(isDark ? 'เปลี่ยนเป็นธีมสว่างแล้ว ☀️' : 'เปลี่ยนเป็นธีมมืดแล้ว 🌙');
  },

  // Favorites
  loadFavorites: function() {
    try {
      const saved = localStorage.getItem('oss_favorites');
      this.favorites = saved ? JSON.parse(saved) : ['news-hub', 'food-delivery-hub', 'yasocc-hub', 'ihitek', 'emergency-hub'];
    } catch (e) {
      this.favorites = ['news-hub', 'food-delivery-hub', 'yasocc-hub', 'ihitek', 'emergency-hub'];
    }
  },

  toggleFavorite: function(serviceId, event) {
    if (event) event.stopPropagation();
    const index = this.favorites.indexOf(serviceId);
    const service = services.find(s => s.id === serviceId);
    const serviceName = service ? service.name : 'บริการ';

    if (index > -1) {
      this.favorites.splice(index, 1);
      this.showToast(`นำ "${serviceName}" ออกจากรายการโปรดแล้ว`);
    } else {
      this.favorites.push(serviceId);
      this.showToast(`ปักหมุด "${serviceName}" ในรายการโปรดแล้ว ⭐`);
    }
    localStorage.setItem('oss_favorites', JSON.stringify(this.favorites));
    this.renderFavorites();
    this.renderServices();
    if (window.lucide) lucide.createIcons();
  },

  // Reusable Compact Card Component (Clean Modern Dashboard Design)
  renderCard: function(item) {
    const isFav = this.favorites.includes(item.id);
    const favIconFill = isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400';
    const favTitle = isFav ? 'คลิกเพื่อนำออกจากรายการโปรด' : 'คลิกเพื่อปักหมุดบริการโปรด';
    const hasSubServices = item.subServices && item.subServices.length > 0;
    
    let clickAction = '';
    if (item.isSmartHome) {
      clickAction = `onclick="SmartHomeManager.openSmartHomeModal()"`;
    } else if (item.isEmergencyHub) {
      clickAction = `onclick="EmergencyManager.openEmergencyModal()"`;
    } else if (item.id === 'parcel-tracking-hub') {
      clickAction = `onclick="ParcelTracker.openTrackingModal()"`;
    } else if (hasSubServices) {
      clickAction = `onclick="App.openSubServicesModal('${item.id}')"`;
    } else {
      clickAction = `onclick="App.launchExternalUrl('${item.url}')"`;
    }

    return `
      <div class="service-card group relative bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-400/40 transition-all duration-200 flex flex-col justify-between cursor-pointer" ${clickAction}>
        
        <div>
          <!-- Top Header in Card -->
          <div class="flex items-start justify-between gap-2.5 mb-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <i data-lucide="${item.icon}" class="w-5 h-5"></i>
            </div>

            <div class="flex items-center gap-1">
              ${item.badge ? `
                <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                  ${item.badge}
                </span>
              ` : ''}
              <button type="button" onclick="App.toggleFavorite('${item.id}', event)" class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors" title="${favTitle}">
                <i data-lucide="star" class="w-4 h-4 ${favIconFill}"></i>
              </button>
            </div>
          </div>

          <!-- Title & Description -->
          <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
            ${item.name}
          </h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1.5 truncate">${item.nameEn}</p>
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            ${item.description}
          </p>
        </div>

        <!-- Bottom Action Buttons -->
        <div class="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
          <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            ${hasSubServices ? 'เลือกบริการ' : (item.isSmartHome ? 'ควบคุมไฟ' : 'เข้าใช้งาน')}
            <i data-lucide="${hasSubServices ? 'chevron-right' : 'external-link'}" class="w-3.5 h-3.5"></i>
          </span>

          ${hasSubServices ? `
            <div class="flex -space-x-1.5 overflow-hidden">
              ${item.subServices.slice(0, 3).map(sub => `
                <span class="inline-block w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 border border-white dark:border-slate-800" title="${sub.name}">
                  ${sub.name.charAt(0)}
                </span>
              `).join('')}
              ${item.subServices.length > 3 ? `<span class="inline-block w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[9px] flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-300 border border-white dark:border-slate-800">+${item.subServices.length - 3}</span>` : ''}
            </div>
          ` : ''}
        </div>

      </div>
    `;
  },

  // Render Favorites Cards Section
  renderFavorites: function() {
    const grid = document.getElementById('favorites-grid');
    const badge = document.getElementById('favorites-count-badge');
    if (!grid || !services) return;

    let favItems = services.filter(s => this.favorites.includes(s.id));

    // If searching, filter favorites matching query as well
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      favItems = favItems.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.nameEn.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        (s.subServices && s.subServices.some(sub => sub.name.toLowerCase().includes(q) || sub.desc.toLowerCase().includes(q)))
      );
    }

    if (badge) {
      const totalFavs = this.favorites.length;
      badge.textContent = `${totalFavs} รายการ`;
    }

    if (favItems.length === 0) {
      if (this.favorites.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full p-4 sm:p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-center space-y-1">
            <div class="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
              <i data-lucide="star" class="w-4 h-4"></i>
            </div>
            <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-200">ยังไม่มีบริการโปรดที่ปักหมุดไว้</h4>
            <p class="text-[11px] text-slate-400">กดไอคอนรูปดาว ⭐ บนการ์ดบริการเพื่อปักหมุดไว้ที่นี่</p>
          </div>
        `;
      } else {
        grid.innerHTML = `
          <div class="col-span-full p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
            ไม่พบบริการโปรดที่ตรงกับคำค้นหา "${this.searchQuery}"
          </div>
        `;
      }
      return;
    }

    grid.innerHTML = favItems.map(item => this.renderCard(item)).join('');
  },

  // Category Tabs (Scrollable Horizontal Pill Tabs)
  initCategories: function() {
    const container = document.getElementById('category-pills');
    if (!container || !categories) return;

    container.innerHTML = categories.map(cat => {
      const isActive = cat.id === this.currentCategory;
      const activeClass = isActive 
        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/25 active-pill font-bold' 
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700';

      return `
        <button onclick="App.selectCategory('${cat.id}')" 
                class="category-pill flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 whitespace-nowrap ${activeClass}">
          <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
          <span>${cat.name}</span>
        </button>
      `;
    }).join('');
  },

  selectCategory: function(catId) {
    this.currentCategory = catId;
    this.initCategories();
    this.renderServices();
    if (window.lucide) lucide.createIcons();

    // Scroll smoothly to services section on mobile
    if (window.innerWidth < 768) {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  // Render Services Cards
  renderServices: function() {
    const grid = document.getElementById('services-grid');
    if (!grid || !services) return;

    let filtered = services;

    // Filter by category
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(s => s.categoryId === this.currentCategory);
    }

    // Filter by search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.nameEn.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        (s.subServices && s.subServices.some(sub => sub.name.toLowerCase().includes(q) || sub.desc.toLowerCase().includes(q)))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-10 text-center">
          <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <i data-lucide="search-x" class="w-6 h-6"></i>
          </div>
          <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">ไม่พบรายการที่ค้นหา</h3>
          <p class="text-xs text-slate-400 mt-0.5">ลองพิมพ์คำค้นหาใหม่อีกครั้ง เช่น ข่าว, grab, ค่าไฟ, รัฐบาล</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = filtered.map(item => this.renderCard(item)).join('');
    if (window.lucide) lucide.createIcons();
  },

  // Emergency Hotlines rendering (Used in Emergency Modal & Section)
  renderEmergencyHotlines: function() {
    const listEl = document.getElementById('emergency-hotlines-list');
    if (!listEl || !emergencyNumbers) return;

    listEl.innerHTML = emergencyNumbers.map(item => `
      <div class="bg-white dark:bg-slate-800/90 rounded-xl p-3 sm:p-3.5 border border-red-100 dark:border-red-950/50 hover:border-red-400 dark:hover:border-red-500 shadow-sm transition-all flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-bold text-red-600 dark:text-red-400 font-mono">${item.number}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium truncate">${item.badge}</span>
            </div>
            <h4 class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">${item.name}</h4>
            <p class="text-[10px] text-slate-400 truncate">${item.dept}</p>
          </div>
        </div>

        <button onclick="EmergencyManager.callNumber('${item.number}', '${item.name}')" 
                class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shrink-0 transition-transform">
          <i data-lucide="phone-call" class="w-3 h-3"></i>
          <span>โทร</span>
        </button>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  },

  // Open Subservices Modal
  openSubServicesModal: function(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.subServices) return;

    const modal = document.getElementById('sub-services-modal');
    const titleEl = document.getElementById('sub-modal-title');
    const descEl = document.getElementById('sub-modal-desc');
    const listEl = document.getElementById('sub-modal-list');

    if (titleEl) titleEl.textContent = service.name;
    if (descEl) descEl.textContent = service.description;

    if (listEl) {
      listEl.innerHTML = service.subServices.map(sub => {
        let action = '';
        if (sub.isInteractiveModal && sub.url === '#bill-calc-modal') {
          action = `onclick="App.closeSubServicesModal(); App.openBillCalcModal();"`;
        } else if (sub.isInteractiveModal && sub.url === '#parcel-tracking-modal') {
          action = `onclick="App.closeSubServicesModal(); ParcelTracker.openTrackingModal();"`;
        } else {
          action = `onclick="App.launchExternalUrl('${sub.url}')"`;
        }

        return `
          <div ${action} class="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all duration-150 cursor-pointer flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <i data-lucide="${sub.icon || 'external-link'}" class="w-4 h-4"></i>
              </div>
              <div class="min-w-0">
                <h4 class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  ${sub.name}
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${sub.desc}</p>
              </div>
            </div>
            <div class="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <i data-lucide="${sub.isInteractiveModal ? 'calculator' : 'external-link'}" class="w-3.5 h-3.5"></i>
            </div>
          </div>
        `;
      }).join('');
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (window.lucide) lucide.createIcons();
    }
  },

  closeSubServicesModal: function() {
    const modal = document.getElementById('sub-services-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  },

  // Bill Calculator Modal
  openBillCalcModal: function() {
    const modal = document.getElementById('bill-calc-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      this.calculateBill();
      if (window.lucide) lucide.createIcons();
    }
  },

  closeBillCalcModal: function() {
    const modal = document.getElementById('bill-calc-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  },

  calculateBill: function() {
    const input = document.getElementById('bill-units-input');
    const units = input ? parseFloat(input.value) || 0 : 0;
    
    if (typeof calculateElectricityBill === 'function') {
      const res = calculateElectricityBill(units, 'pea');
      const baseEl = document.getElementById('calc-base-amount');
      const ftEl = document.getElementById('calc-ft-amount');
      const serviceEl = document.getElementById('calc-service-fee');
      const vatEl = document.getElementById('calc-vat-amount');
      const totalEl = document.getElementById('calc-total-amount');

      if (baseEl) baseEl.textContent = `฿${res.baseAmount.toFixed(2)}`;
      if (ftEl) ftEl.textContent = `฿${res.ftAmount.toFixed(2)}`;
      if (serviceEl) serviceEl.textContent = `฿${res.serviceFee.toFixed(2)}`;
      if (vatEl) vatEl.textContent = `฿${res.vat.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `฿${res.total.toFixed(2)}`;
    }
  },

  launchExternalUrl: function(url) {
    if (!url) return;
    if (url.startsWith('#')) {
      if (url === '#emergency-section') {
        this.scrollToEmergency();
        return;
      }
      if (url === '#parcel-tracking-section' && window.ParcelTracker) {
        ParcelTracker.openTrackingModal();
        return;
      }
      const target = document.querySelector(url);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  scrollToEmergency: function() {
    if (window.EmergencyManager && typeof EmergencyManager.openEmergencyModal === 'function') {
      EmergencyManager.openEmergencyModal();
      return;
    }
    const el = document.getElementById('emergency-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('ring-4', 'ring-red-400');
      setTimeout(() => el.classList.remove('ring-4', 'ring-red-400'), 2000);
    }
  },

  // Event Listeners
  initEventListeners: function() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderFavorites();
        this.renderServices();
      });
    }

    const billUnitsInput = document.getElementById('bill-units-input');
    if (billUnitsInput) {
      billUnitsInput.addEventListener('input', () => this.calculateBill());
    }

    // Keyboard shortcut (Ctrl+K or /) to focus search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT')) {
        e.preventDefault();
        const s = document.getElementById('global-search-input');
        if (s) {
          s.focus();
          s.select();
        }
      }
    });

    // Close modals on clicking backdrop
    window.addEventListener('click', (e) => {
      const subModal = document.getElementById('sub-services-modal');
      const smartModal = document.getElementById('smart-home-modal');
      const billModal = document.getElementById('bill-calc-modal');
      const trackModal = document.getElementById('parcel-tracking-modal');
      const emergencyModal = document.getElementById('emergency-modal');

      if (e.target === subModal) this.closeSubServicesModal();
      if (e.target === smartModal && window.SmartHomeManager) SmartHomeManager.closeSmartHomeModal();
      if (e.target === billModal) this.closeBillCalcModal();
      if (e.target === trackModal && window.ParcelTracker) ParcelTracker.closeTrackingModal();
      if (e.target === emergencyModal && window.EmergencyManager) EmergencyManager.closeEmergencyModal();
    });

    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSubServicesModal();
        if (window.SmartHomeManager) SmartHomeManager.closeSmartHomeModal();
        this.closeBillCalcModal();
        if (window.ParcelTracker) ParcelTracker.closeTrackingModal();
        if (window.EmergencyManager) EmergencyManager.closeEmergencyModal();
      }
    });
  },

  // Toast Notification
  showToast: function(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 transform transition-all duration-200 translate-y-2 opacity-0';
    toast.innerHTML = `
      <i data-lucide="info" class="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  },

  // PWA Support
  initPWA: function() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('PWA ServiceWorker registered:', reg.scope))
          .catch(err => console.log('ServiceWorker registration error:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner) installBanner.classList.remove('hidden');
    });
  },

  installPWA: function() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          this.showToast('กำลังติดตั้ง One Stop Service ลงบนอุปกรณ์ 🎉');
        }
        this.deferredPrompt = null;
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.add('hidden');
      });
    } else {
      alert('เพื่อติดตั้ง One Stop Service:\n• บน iOS (Safari): กดปุ่มแชร์ (Share) แล้วเลือก "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)\n• บน Android (Chrome): กดเมนู 3 จุด แล้วเลือก "ติดตั้งแอป" (Install App)');
    }
  }
};

window.App = App;
window.showAppToast = (msg) => App.showToast(msg);
