/**
 * Utility Calculators (ศูนย์เครื่องคำนวณอรรถประโยชน์)
 * 1. Electricity Bill Calculator (PEA & MEA Progressive Tier Rates)
 * 2. Loan & Installment Calculator (Flat Rate for Car/Vehicle & Effective Rate for Home/Mortgage)
 */

// 1. Electricity Bill Calculator Logic
function calculateElectricityBill(units, authority = 'pea') {
  const numUnits = parseFloat(units) || 0;
  if (numUnits <= 0) {
    return {
      units: 0,
      baseAmount: 0,
      serviceFee: 0,
      ftRate: 0.3972,
      ftAmount: 0,
      subtotal: 0,
      vat: 0,
      total: 0
    };
  }

  // Progressive tier rates for residential users (Type 1.1.2 / 1.2 > 150 units/month)
  let baseAmount = 0;
  let remainingUnits = numUnits;

  const tiers = [
    { max: 150, rate: 3.2484 },
    { max: 250, rate: 4.2218 },
    { max: Infinity, rate: 4.4217 }
  ];

  let prevMax = 0;
  for (const tier of tiers) {
    const tierCapacity = tier.max - prevMax;
    const unitsInThisTier = Math.min(remainingUnits, tierCapacity);

    if (unitsInThisTier > 0) {
      baseAmount += unitsInThisTier * tier.rate;
      remainingUnits -= unitsInThisTier;
    }
    prevMax = tier.max;
    if (remainingUnits <= 0) break;
  }

  // Standard residential service charge (บาท/เดือน)
  const serviceFee = 24.62;

  // FT rate (ค่าไฟฟ้าผันแปร ประมาณการ 0.3972 บาท/หน่วย)
  const ftRate = 0.3972;
  const ftAmount = numUnits * ftRate;

  // Subtotal before VAT
  const subtotal = baseAmount + serviceFee + ftAmount;

  // VAT 7%
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return {
    units: numUnits,
    baseAmount: Math.round(baseAmount * 100) / 100,
    serviceFee,
    ftRate,
    ftAmount: Math.round(ftAmount * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}

// 2. Loan & Installment Calculator Logic (Flat Rate & Effective Rate)
function calculateLoanInstallment({ price, downPercent = 0, interestRate = 0, months = 48, type = 'flat' }) {
  const assetPrice = Math.max(0, parseFloat(price) || 0);
  const downPct = Math.max(0, Math.min(100, parseFloat(downPercent) || 0));
  const ratePct = Math.max(0, parseFloat(interestRate) || 0);
  const termMonths = Math.max(1, parseInt(months, 10) || 1);

  const downAmount = (assetPrice * downPct) / 100;
  const loanPrincipal = Math.max(0, assetPrice - downAmount);

  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalPayable = 0;

  if (loanPrincipal <= 0) {
    return {
      price: assetPrice,
      downPercent: downPct,
      downAmount: 0,
      loanPrincipal: 0,
      interestRate: ratePct,
      months: termMonths,
      type,
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayable: 0
    };
  }

  if (type === 'flat') {
    // ดอกเบี้ยคงที่ (Flat Rate - ผ่อนรถยนต์ / มอเตอร์ไซค์)
    const years = termMonths / 12;
    totalInterest = loanPrincipal * (ratePct / 100) * years;
    totalPayable = loanPrincipal + totalInterest;
    monthlyPayment = totalPayable / termMonths;
  } else {
    // ลดต้นลดดอก (Effective Rate / Amortization - ผ่อนบ้าน / คอนโด / สินเชื่อ)
    const r = (ratePct / 100) / 12;
    if (r === 0) {
      monthlyPayment = loanPrincipal / termMonths;
      totalPayable = loanPrincipal;
      totalInterest = 0;
    } else {
      const pow = Math.pow(1 + r, termMonths);
      monthlyPayment = loanPrincipal * (r * pow) / (pow - 1);
      totalPayable = monthlyPayment * termMonths;
      totalInterest = totalPayable - loanPrincipal;
    }
  }

  return {
    price: assetPrice,
    downPercent: downPct,
    downAmount: Math.round(downAmount * 100) / 100,
    loanPrincipal: Math.round(loanPrincipal * 100) / 100,
    interestRate: ratePct,
    months: termMonths,
    type,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100
  };
}

// 3. UI Controller for Utility Calculators
const UtilityCalculator = {
  currentTab: 'electricity', // 'electricity' | 'loan'
  loanType: 'flat', // 'flat' (car) | 'effective' (home)

  init: function() {
    this.bindEvents();
    this.calculateElectricity();
    this.calculateLoan();
  },

  switchTab: function(tabName) {
    this.currentTab = tabName;
    const tabElElectricity = document.getElementById('calc-tab-electricity-btn');
    const tabElLoan = document.getElementById('calc-tab-loan-btn');
    const panelElectricity = document.getElementById('calc-panel-electricity');
    const panelLoan = document.getElementById('calc-panel-loan');

    if (tabName === 'electricity') {
      if (tabElElectricity) {
        tabElElectricity.classList.add('active-pill', 'font-bold');
        tabElElectricity.classList.remove('text-slate-400');
      }
      if (tabElLoan) {
        tabElLoan.classList.remove('active-pill', 'font-bold');
        tabElLoan.classList.add('text-slate-400');
      }
      if (panelElectricity) panelElectricity.classList.remove('hidden');
      if (panelLoan) panelLoan.classList.add('hidden');
      this.calculateElectricity();
    } else {
      if (tabElLoan) {
        tabElLoan.classList.add('active-pill', 'font-bold');
        tabElLoan.classList.remove('text-slate-400');
      }
      if (tabElElectricity) {
        tabElElectricity.classList.remove('active-pill', 'font-bold');
        tabElElectricity.classList.add('text-slate-400');
      }
      if (panelElectricity) panelElectricity.classList.add('hidden');
      if (panelLoan) panelLoan.classList.remove('hidden');
      this.calculateLoan();
    }

    if (window.lucide) lucide.createIcons();
  },

  setLoanType: function(type) {
    this.loanType = type;
    const btnFlat = document.getElementById('loan-type-flat-btn');
    const btnEffective = document.getElementById('loan-type-effective-btn');

    if (type === 'flat') {
      if (btnFlat) {
        btnFlat.className = 'px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-500/25 border border-blue-400/40 transition-all';
      }
      if (btnEffective) {
        btnEffective.className = 'px-3 py-1.5 rounded-xl bg-white/5 dark:bg-white/[0.04] text-slate-400 hover:text-white font-medium text-xs border border-white/10 transition-all';
      }
    } else {
      if (btnEffective) {
        btnEffective.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm shadow-indigo-500/25 border border-indigo-400/40 transition-all';
      }
      if (btnFlat) {
        btnFlat.className = 'px-3 py-1.5 rounded-xl bg-white/5 dark:bg-white/[0.04] text-slate-400 hover:text-white font-medium text-xs border border-white/10 transition-all';
      }
    }
    this.calculateLoan();
  },

  setLoanPreset: function(preset) {
    const priceInput = document.getElementById('loan-price-input');
    const downInput = document.getElementById('loan-down-input');
    const rateInput = document.getElementById('loan-rate-input');
    const monthsSelect = document.getElementById('loan-months-select');

    if (preset === 'car-eco') {
      this.setLoanType('flat');
      if (priceInput) priceInput.value = '600000';
      if (downInput) downInput.value = '20';
      if (rateInput) rateInput.value = '2.49';
      if (monthsSelect) monthsSelect.value = '48';
    } else if (preset === 'car-suv') {
      this.setLoanType('flat');
      if (priceInput) priceInput.value = '1200000';
      if (downInput) downInput.value = '25';
      if (rateInput) rateInput.value = '2.29';
      if (monthsSelect) monthsSelect.value = '60';
    } else if (preset === 'home-condo') {
      this.setLoanType('effective');
      if (priceInput) priceInput.value = '2500000';
      if (downInput) downInput.value = '10';
      if (rateInput) rateInput.value = '3.50';
      if (monthsSelect) monthsSelect.value = '360';
    } else if (preset === 'home-house') {
      this.setLoanType('effective');
      if (priceInput) priceInput.value = '4500000';
      if (downInput) downInput.value = '15';
      if (rateInput) rateInput.value = '3.75';
      if (monthsSelect) monthsSelect.value = '360';
    }
    this.calculateLoan();
  },

  calculateElectricity: function() {
    const input = document.getElementById('bill-units-input');
    const units = input ? parseFloat(input.value) || 0 : 0;
    const res = calculateElectricityBill(units, 'pea');

    const baseEl = document.getElementById('calc-base-amount');
    const ftEl = document.getElementById('calc-ft-amount');
    const serviceEl = document.getElementById('calc-service-fee');
    const vatEl = document.getElementById('calc-vat-amount');
    const totalEl = document.getElementById('calc-total-amount');

    if (baseEl) baseEl.textContent = `฿${res.baseAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (ftEl) ftEl.textContent = `฿${res.ftAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (serviceEl) serviceEl.textContent = `฿${res.serviceFee.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (vatEl) vatEl.textContent = `฿${res.vat.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (totalEl) totalEl.textContent = `฿${res.total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  calculateLoan: function() {
    const priceInput = document.getElementById('loan-price-input');
    const downInput = document.getElementById('loan-down-input');
    const rateInput = document.getElementById('loan-rate-input');
    const monthsSelect = document.getElementById('loan-months-select');

    const price = priceInput ? parseFloat(priceInput.value) || 0 : 0;
    const downPercent = downInput ? parseFloat(downInput.value) || 0 : 0;
    const interestRate = rateInput ? parseFloat(rateInput.value) || 0 : 0;
    const months = monthsSelect ? parseInt(monthsSelect.value, 10) || 48 : 48;

    const res = calculateLoanInstallment({
      price,
      downPercent,
      interestRate,
      months,
      type: this.loanType
    });

    const monthlyEl = document.getElementById('loan-monthly-val');
    const interestEl = document.getElementById('loan-interest-val');
    const principalEl = document.getElementById('loan-principal-val');
    const totalPayableEl = document.getElementById('loan-total-payable-val');
    const downAmountBadge = document.getElementById('loan-down-amount-badge');

    if (downAmountBadge) {
      downAmountBadge.textContent = `= ฿${res.downAmount.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (monthlyEl) {
      monthlyEl.textContent = `฿${res.monthlyPayment.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (interestEl) {
      interestEl.textContent = `฿${res.totalInterest.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (principalEl) {
      principalEl.textContent = `฿${res.loanPrincipal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (totalPayableEl) {
      totalPayableEl.textContent = `฿${res.totalPayable.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  },

  bindEvents: function() {
    const unitsInput = document.getElementById('bill-units-input');
    if (unitsInput) {
      unitsInput.addEventListener('input', () => this.calculateElectricity());
    }

    ['loan-price-input', 'loan-down-input', 'loan-rate-input'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.calculateLoan());
      }
    });

    const monthsSelect = document.getElementById('loan-months-select');
    if (monthsSelect) {
      monthsSelect.addEventListener('change', () => this.calculateLoan());
    }
  }
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    UtilityCalculator.init();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateElectricityBill, calculateLoanInstallment, UtilityCalculator };
}
