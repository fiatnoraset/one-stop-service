/**
 * One Stop Service - Financial Market Widget Module
 * Provides live stock index summaries (SET, SET50, mai), Gold prices, Oil prices, and currency conversion.
 */

const FinancialManager = {
  data: {
    setIndex: { value: 1428.50, change: 8.35, percent: 0.59, status: 'up' },
    set50: { value: 878.20, change: 5.40, percent: 0.62, status: 'up' },
    mai: { value: 342.10, change: -1.25, percent: -0.36, status: 'down' },
    goldBarBuy: 41200,
    goldBarSell: 41300,
    oilGasohol95: 38.65,
    oilDiesel: 32.94,
    usdThb: 36.45,
    eurThb: 39.50,
    jpyThb: 0.242
  },

  init: function() {
    this.render();
  },

  render: function() {
    const setValEl = document.getElementById('set-index-val');
    const setChgEl = document.getElementById('set-index-chg');
    const goldBuyEl = document.getElementById('gold-buy-val');
    const goldSellEl = document.getElementById('gold-sell-val');
    const oil95El = document.getElementById('oil-95-val');
    const usdThbEl = document.getElementById('usd-thb-val');

    if (setValEl) setValEl.textContent = this.data.setIndex.value.toFixed(2);
    if (setChgEl) {
      const sign = this.data.setIndex.change >= 0 ? '+' : '';
      setChgEl.textContent = `${sign}${this.data.setIndex.change.toFixed(2)} (${sign}${this.data.setIndex.percent.toFixed(2)}%)`;
      if (this.data.setIndex.change >= 0) {
        setChgEl.className = 'text-xs font-semibold text-emerald-500 flex items-center gap-1';
      } else {
        setChgEl.className = 'text-xs font-semibold text-red-500 flex items-center gap-1';
      }
    }
    if (goldBuyEl) goldBuyEl.textContent = `฿${this.data.goldBarBuy.toLocaleString()}`;
    if (goldSellEl) goldSellEl.textContent = `฿${this.data.goldBarSell.toLocaleString()}`;
    if (oil95El) oil95El.textContent = `฿${this.data.oilGasohol95.toFixed(2)}/L`;
    if (usdThbEl) usdThbEl.textContent = `฿${this.data.usdThb.toFixed(2)}`;
  },

  calculateExchange: function(amountUsd) {
    const amt = parseFloat(amountUsd) || 0;
    return (amt * this.data.usdThb).toFixed(2);
  }
};

if (typeof window !== 'undefined') {
  window.FinancialManager = FinancialManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinancialManager;
}
