/**
 * One Stop Service - Parcel Tracking Controller (js/tracking.js)
 * Handles courier selection, tracking number URL composition, history, and clipboard paste.
 */

const COURIERS = {
  thailandpost: {
    id: 'thailandpost',
    name: 'ไปรษณีย์ไทย (Thailand Post)',
    shortName: 'Thailand Post',
    color: '#ed1c24',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-900',
    text: 'text-red-600 dark:text-red-400',
    badge: 'รัฐวิสาหกิจ',
    icon: 'mail',
    placeholder: 'เช่น EF123456789TH, PD123456789TH',
    urlPattern: 'https://track.thailandpost.co.th/?trackNumber={TRACK_NO}',
    website: 'https://www.thailandpost.co.th/'
  },
  flash: {
    id: 'flash',
    name: 'Flash Express (แฟลช เอ็กซ์เพรส)',
    shortName: 'Flash Express',
    color: '#ffcc00',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-900',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'ส่งด่วน 365 วัน',
    icon: 'zap',
    placeholder: 'เช่น TH0123456789A, TH01015ABCD',
    urlPattern: 'https://www.flashexpress.co.th/tracking/?se={TRACK_NO}',
    website: 'https://www.flashexpress.co.th/'
  },
  jtexpress: {
    id: 'jtexpress',
    name: 'J&T Express (เจแอนด์ที เอ็กซ์เพรส)',
    shortName: 'J&T Express',
    color: '#e60012',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-900',
    text: 'text-rose-600 dark:text-rose-400',
    badge: 'ครอบคลุมทั่วไทย',
    icon: 'truck',
    placeholder: 'เช่น 821234567890, 830123456789',
    urlPattern: 'https://www.jtexpress.co.th/service/track?bills={TRACK_NO}',
    website: 'https://www.jtexpress.co.th/'
  },
  kerry: {
    id: 'kerry',
    name: 'Kerry Express / KEX (เคอรี่ เอ็กซ์เพรส)',
    shortName: 'Kerry / KEX',
    color: '#ff6600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-900',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'KEX ด่วนทั่วไทย',
    icon: 'package-check',
    placeholder: 'เช่น KEX1234567890, SHP123456789',
    urlPattern: 'https://th.kerexpress.com/th/track/?track={TRACK_NO}',
    website: 'https://th.kerexpress.com/'
  },
  spx: {
    id: 'spx',
    name: 'SPX Express (Shopee Xpress)',
    shortName: 'SPX Express',
    color: '#ee4d2d',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-900',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'Shopee Official',
    icon: 'shopping-bag',
    placeholder: 'เช่น TH241234567890, SPXTH123456',
    urlPattern: 'https://spx.co.th/m/track?tracking_number={TRACK_NO}',
    website: 'https://spx.co.th/'
  },
  ninjavan: {
    id: 'ninjavan',
    name: 'Ninja Van (นินจาแวน ประเทศไทย)',
    shortName: 'Ninja Van',
    color: '#c41230',
    bgLight: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-900',
    text: 'text-red-700 dark:text-red-400',
    badge: 'นินจาแวน',
    icon: 'send',
    placeholder: 'เช่น SHP123456789, NVTH123456',
    urlPattern: 'https://www.ninjavan.co/th-th/tracking?id={TRACK_NO}',
    website: 'https://www.ninjavan.co/th-th'
  },
  bestexpress: {
    id: 'bestexpress',
    name: 'Best Express (เบสท์ เอ็กซ์เพรส)',
    shortName: 'Best Express',
    color: '#005bac',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-900',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'เบสท์ เอ็กซ์เพรส',
    icon: 'box',
    placeholder: 'เช่น 220123456789, 710123456789',
    urlPattern: 'https://www.best-inc.co.th/track?bills={TRACK_NO}',
    website: 'https://www.best-inc.co.th/'
  },
  dhl: {
    id: 'dhl',
    name: 'DHL Express Thailand (ดีเอชแอล)',
    shortName: 'DHL Express',
    color: '#d40511',
    bgLight: 'bg-yellow-50 dark:bg-yellow-950/40',
    border: 'border-yellow-200 dark:border-yellow-900',
    text: 'text-yellow-700 dark:text-yellow-400',
    badge: 'สากล/ทั่วโลก',
    icon: 'globe',
    placeholder: 'เช่น 1234567890 (10 หลัก)',
    urlPattern: 'https://www.dhl.com/th-th/home/tracking.html?tracking-id={TRACK_NO}',
    website: 'https://www.dhl.com/th-th/home.html'
  }
};

const ParcelTracker = {
  selectedCourier: 'thailandpost',
  history: [],

  init: function() {
    this.loadHistory();
    this.renderCourierButtons();
    this.renderHistory();
    this.initEventListeners();
  },

  loadHistory: function() {
    try {
      const saved = localStorage.getItem('oss_tracking_history');
      this.history = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.history = [];
    }
  },

  saveHistory: function(trackingNo, courierId) {
    if (!trackingNo) return;
    const cleanNo = trackingNo.trim().toUpperCase();
    
    // Remove if already in history, then prepend
    this.history = this.history.filter(item => item.trackingNo !== cleanNo);
    this.history.unshift({
      trackingNo: cleanNo,
      courierId: courierId,
      time: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    });

    // Keep maximum 8 recent items
    if (this.history.length > 8) {
      this.history = this.history.slice(0, 8);
    }

    localStorage.setItem('oss_tracking_history', JSON.stringify(this.history));
    this.renderHistory();
  },

  clearHistory: function() {
    this.history = [];
    localStorage.removeItem('oss_tracking_history');
    this.renderHistory();
    if (window.showAppToast) window.showAppToast('ล้างประวัติการค้นหาพัสดุแล้ว');
  },

  getTrackingUrl: function(courierId, trackingNumber) {
    const courier = COURIERS[courierId] || COURIERS.thailandpost;
    const cleanNo = encodeURIComponent(trackingNumber.trim());
    return courier.urlPattern.replace('{TRACK_NO}', cleanNo);
  },

  selectCourier: function(courierId, context = 'section') {
    if (!COURIERS[courierId]) return;
    this.selectedCourier = courierId;

    // Update section elements
    const selectEl = document.getElementById('tracking-courier-select');
    const inputEl = document.getElementById('tracking-number-input');
    if (selectEl) selectEl.value = courierId;
    if (inputEl) {
      inputEl.placeholder = `กรอกเลขพัสดุ ${COURIERS[courierId].placeholder}`;
    }

    // Update modal elements if present
    const modalSelectEl = document.getElementById('modal-tracking-courier-select');
    const modalInputEl = document.getElementById('modal-tracking-number-input');
    if (modalSelectEl) modalSelectEl.value = courierId;
    if (modalInputEl) {
      modalInputEl.placeholder = `กรอกเลขพัสดุ ${COURIERS[courierId].placeholder}`;
    }

    this.updatePillStates();
  },

  updatePillStates: function() {
    const pills = document.querySelectorAll('.courier-pill-btn');
    pills.forEach(pill => {
      const cid = pill.getAttribute('data-courier');
      if (cid === this.selectedCourier) {
        pill.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600', 'shadow-md');
        pill.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      } else {
        pill.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600', 'shadow-md');
        pill.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      }
    });
  },

  renderCourierButtons: function() {
    const container = document.getElementById('courier-quick-pills');
    if (!container) return;

    const primaryCouriers = ['thailandpost', 'flash', 'jtexpress', 'kerry', 'spx'];
    container.innerHTML = primaryCouriers.map(cid => {
      const c = COURIERS[cid];
      const isActive = cid === this.selectedCourier;
      const activeClass = isActive 
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700';

      return `
        <button type="button" 
                data-courier="${cid}"
                onclick="ParcelTracker.selectCourier('${cid}')" 
                class="courier-pill-btn px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${activeClass}">
          <i data-lucide="${c.icon}" class="w-3.5 h-3.5"></i>
          <span>${c.shortName}</span>
        </button>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  renderHistory: function() {
    const sectionContainer = document.getElementById('tracking-history-chips');
    const modalContainer = document.getElementById('modal-tracking-history-chips');

    const renderChips = (el) => {
      if (!el) return;
      if (this.history.length === 0) {
        el.innerHTML = `
          <span class="text-[11px] text-slate-400 dark:text-slate-500 italic">ยังไม่มีประวัติการค้นหาล่าสุด</span>
        `;
        return;
      }

      el.innerHTML = `
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <i data-lucide="history" class="w-3 h-3"></i> ล่าสุด:
          </span>
          ${this.history.map(item => {
            const courier = COURIERS[item.courierId] || COURIERS.thailandpost;
            return `
              <button type="button" 
                      onclick="ParcelTracker.quickTrack('${item.trackingNo}', '${item.courierId}')"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-mono border border-slate-200 dark:border-slate-700 transition-colors"
                      title="กดเพื่อติดตามพัสดุ ${courier.shortName} ทันที">
                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${courier.color};"></span>
                <span>${item.trackingNo}</span>
                <span class="text-[10px] text-slate-400 font-sans font-normal">(${courier.shortName})</span>
              </button>
            `;
          }).join('')}
          <button type="button" onclick="ParcelTracker.clearHistory()" class="text-[10px] text-slate-400 hover:text-red-500 underline ml-1" title="ล้างประวัติ">
            ล้างประวัติ
          </button>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
    };

    renderChips(sectionContainer);
    renderChips(modalContainer);
  },

  track: function(context = 'section') {
    let inputId = context === 'modal' ? 'modal-tracking-number-input' : 'tracking-number-input';
    let selectId = context === 'modal' ? 'modal-tracking-courier-select' : 'tracking-courier-select';

    const input = document.getElementById(inputId);
    const select = document.getElementById(selectId);

    const trackingNumber = input ? input.value.trim() : '';
    const courierId = select ? select.value : this.selectedCourier;

    if (!trackingNumber) {
      if (window.showAppToast) {
        window.showAppToast('⚠️ กรุณากรอกหมายเลขพัสดุที่ต้องการตรวจสอบ');
      } else {
        alert('กรุณากรอกหมายเลขพัสดุ');
      }
      if (input) input.focus();
      return;
    }

    const courier = COURIERS[courierId] || COURIERS.thailandpost;
    const finalUrl = this.getTrackingUrl(courierId, trackingNumber);

    // Save to search history
    this.saveHistory(trackingNumber, courierId);

    if (window.showAppToast) {
      window.showAppToast(`กำลังเปิดระบบติดตามพัสดุของ ${courier.name} 📦`);
    }

    // Open carrier tracking page in new tab
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  },

  quickTrack: function(trackingNo, courierId) {
    if (!trackingNo || !courierId) return;
    this.selectCourier(courierId);
    
    // Fill input
    const input = document.getElementById('tracking-number-input');
    if (input) input.value = trackingNo;
    const modalInput = document.getElementById('modal-tracking-number-input');
    if (modalInput) modalInput.value = trackingNo;

    const courier = COURIERS[courierId] || COURIERS.thailandpost;
    const finalUrl = this.getTrackingUrl(courierId, trackingNo);
    
    this.saveHistory(trackingNo, courierId);
    
    if (window.showAppToast) {
      window.showAppToast(`กำลังเปิดระบบติดตามพัสดุ: ${trackingNo} (${courier.shortName}) 📦`);
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  },

  pasteFromClipboard: async function(context = 'section') {
    const inputId = context === 'modal' ? 'modal-tracking-number-input' : 'tracking-number-input';
    const input = document.getElementById(inputId);
    if (!input) return;

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          input.value = text.trim();
          this.autoDetectCourier(text.trim());
          if (window.showAppToast) window.showAppToast('วางหมายเลขพัสดุจากคลิปบอร์ดแล้ว 📋');
          input.focus();
        }
      } else {
        input.focus();
        if (window.showAppToast) window.showAppToast('กรุณากด Ctrl+V หรือ Paste เพื่อวางหมายเลขพัสดุ');
      }
    } catch (err) {
      input.focus();
      if (window.showAppToast) window.showAppToast('กรุณาวางหมายเลขพัสดุลงในช่องกรอก');
    }
  },

  autoDetectCourier: function(trackingNo) {
    if (!trackingNo) return;
    const no = trackingNo.toUpperCase().trim();

    // Heuristics for courier format auto-selection
    if (/^[EPRCO][A-Z]\d{9}TH$/.test(no)) {
      this.selectCourier('thailandpost');
    } else if (/^TH\d{9,14}[A-Z0-9]?$/i.test(no) || no.startsWith('TH01') || no.startsWith('TH02')) {
      this.selectCourier('flash');
    } else if (/^8\d{11,13}$/.test(no)) {
      this.selectCourier('jtexpress');
    } else if (no.startsWith('KEX') || no.startsWith('SHP') || no.startsWith('KRY')) {
      this.selectCourier('kerry');
    } else if (no.startsWith('SPXTH') || no.startsWith('TH24') || no.startsWith('TH25')) {
      this.selectCourier('spx');
    } else if (no.startsWith('NVTH')) {
      this.selectCourier('ninjavan');
    }
  },

  fillSample: function(sampleNo, courierId) {
    this.selectCourier(courierId);
    const input = document.getElementById('tracking-number-input');
    if (input) {
      input.value = sampleNo;
      input.focus();
    }
    const modalInput = document.getElementById('modal-tracking-number-input');
    if (modalInput) {
      modalInput.value = sampleNo;
    }
    if (window.showAppToast) window.showAppToast(`ใส่เลขตัวอย่าง ${sampleNo} (${COURIERS[courierId].shortName}) เรียบร้อย`);
  },

  openTrackingModal: function(defaultCourier = null, defaultTrackNo = '') {
    const modal = document.getElementById('parcel-tracking-modal');
    if (defaultCourier && COURIERS[defaultCourier]) {
      this.selectCourier(defaultCourier, 'modal');
    }
    const modalInput = document.getElementById('modal-tracking-number-input');
    if (modalInput && defaultTrackNo) {
      modalInput.value = defaultTrackNo;
    }
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (modalInput) setTimeout(() => modalInput.focus(), 100);
      if (window.lucide) lucide.createIcons();
    }
  },

  closeTrackingModal: function() {
    const modal = document.getElementById('parcel-tracking-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  },

  initEventListeners: function() {
    // Listen for Enter key on inputs
    const input = document.getElementById('tracking-number-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.track('section');
        }
      });
      input.addEventListener('input', (e) => {
        this.autoDetectCourier(e.target.value);
      });
    }

    const modalInput = document.getElementById('modal-tracking-number-input');
    if (modalInput) {
      modalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.track('modal');
        }
      });
      modalInput.addEventListener('input', (e) => {
        this.autoDetectCourier(e.target.value);
      });
    }

    const select = document.getElementById('tracking-courier-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.selectCourier(e.target.value);
      });
    }

    const modalSelect = document.getElementById('modal-tracking-courier-select');
    if (modalSelect) {
      modalSelect.addEventListener('change', (e) => {
        this.selectCourier(e.target.value, 'modal');
      });
    }
  }
};

// Expose to window and Node.js module
if (typeof window !== 'undefined') {
  window.COURIERS = COURIERS;
  window.ParcelTracker = ParcelTracker;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COURIERS, ParcelTracker };
}
