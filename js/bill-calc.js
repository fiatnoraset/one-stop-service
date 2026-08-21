/**
 * Electricity Bill Calculator (PEA & MEA Rates for Thailand)
 * Calculates estimated electricity bill based on progressive unit tiers, FT rate, and VAT 7%.
 */

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateElectricityBill };
}
