/**
 * One Stop Service - Emergency & SOS Manager
 * Handles rapid calling, Siren alarm sound synthesis with Web Audio API, and GPS coordinate sharing.
 */

const EmergencyManager = {
  audioCtx: null,
  oscillator: null,
  gainNode: null,
  isSirenPlaying: false,

  // Direct Call method
  callNumber: function(number, title) {
    if (window.showAppToast) {
      window.showAppToast(`กำลังโทรออกสายด่วน ${number} (${title})...`);
    }
    // Trigger tel: URI
    window.location.href = `tel:${number}`;
  },

  // Toggle SOS Siren with browser Web Audio API (no external sound file needed)
  toggleSiren: function() {
    if (this.isSirenPlaying) {
      this.stopSiren();
    } else {
      this.startSiren();
    }
  },

  startSiren: function() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

      // Create Siren Frequency Modulation (alternating high and low pitch)
      const now = this.audioCtx.currentTime;
      for (let i = 0; i < 30; i++) {
        this.oscillator.frequency.linearRampToValueAtTime(950, now + i * 0.8);
        this.oscillator.frequency.linearRampToValueAtTime(650, now + i * 0.8 + 0.4);
      }

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isSirenPlaying = true;

      const btn = document.getElementById('btn-sos-siren');
      if (btn) {
        btn.classList.add('animate-pulse', 'bg-red-600', 'text-white', 'ring-4', 'ring-red-400');
        btn.innerHTML = '<i data-lucide="volume-x" class="w-5 h-5 inline-block mr-1"></i> หยุดเสียงไซเรน SOS';
        if (window.lucide) lucide.createIcons();
      }

      if (window.showAppToast) {
        window.showAppToast('เปิดเสียงไซเรนฉุกเฉินแล้ว 🚨');
      }
    } catch (err) {
      console.error('AudioContext error:', err);
      alert('ไม่สามารถเล่นเสียงไซเรนบนอุปกรณ์นี้ได้');
    }
  },

  stopSiren: function() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch (e) {}
      this.oscillator = null;
    }
    this.isSirenPlaying = false;

    const btn = document.getElementById('btn-sos-siren');
    if (btn) {
      btn.classList.remove('animate-pulse', 'bg-red-600', 'text-white', 'ring-4', 'ring-red-400');
      btn.innerHTML = '<i data-lucide="bell-ring" class="w-5 h-5 inline-block mr-1"></i> ส่งเสียงไซเรนฉุกเฉิน SOS';
      if (window.lucide) lucide.createIcons();
    }

    if (window.showAppToast) {
      window.showAppToast('หยุดเสียงไซเรนฉุกเฉินแล้ว');
    }
  },

  // Share GPS Location
  shareLocation: function() {
    if (!navigator.geolocation) {
      alert('อุปกรณ์ของคุณไม่รองรับการระบุตำแหน่ง GPS');
      return;
    }

    if (window.showAppToast) {
      window.showAppToast('กำลังระบุพิกัดตำแหน่งของคุณ...');
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        const message = `[แจ้งเหตุด่วน] ขณะนี้ฉันอยู่ที่พิกัด: ${lat}, ${lng} แผนที่: ${mapsUrl}`;

        if (navigator.share) {
          navigator.share({
            title: 'พิกัดขอความช่วยเหลือฉุกเฉิน',
            text: message,
            url: mapsUrl
          }).catch(() => {});
        } else {
          // Copy to clipboard
          navigator.clipboard.writeText(message).then(() => {
            alert(`คัดลอกพิกัดฉุกเฉินแล้ว:\n${message}\n\nคุณสามารถนำไปวางใน LINE หรือ SMS เพื่อขอความช่วยเหลือได้ทันที`);
          });
        }
      },
      (err) => {
        alert('กรุณาเปิดการเข้าถึงตำแหน่ง (GPS Location) เพื่อแชร์พิกัดฉุกเฉิน');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }
};

if (typeof window !== 'undefined') {
  window.EmergencyManager = EmergencyManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmergencyManager;
}
