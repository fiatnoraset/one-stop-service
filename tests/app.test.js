/**
 * Automated Test Suite for One Stop Service
 * Tests verify all service links, emergency numbers, data integrity, and utility calculators.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting One Stop Service Test Suite...\n');

// 1. Check services-data.js exists and exports valid data
const dataFilePath = path.join(__dirname, '../js/services-data.js');
assert.ok(fs.existsSync(dataFilePath), 'services-data.js must exist');

// Load services data
const servicesData = require(dataFilePath);
assert.ok(servicesData.categories, 'Categories array must exist');
assert.ok(servicesData.services, 'Services array must exist');
assert.ok(servicesData.emergencyNumbers, 'Emergency numbers array must exist');

console.log(`✅ Loaded ${servicesData.services.length} services across ${servicesData.categories.length} categories.`);
console.log(`✅ Loaded ${servicesData.emergencyNumbers.length} emergency hotlines.`);

// 2. Validate mandatory requested URLs
const requiredLinks = {
  'Sanook': 'https://www.sanook.com/',
  'Thairath': 'https://www.thairath.co.th/home',
  'GrabFood': 'https://www.grab.com/th/food/',
  'ShopeeFood': 'https://shopee.co.th/m/ShopeeFoodMainDEC',
  'Grab Car': 'https://www.grab.com/th/transport/',
  'Bolt': 'https://bolt.eu/en-th/',
  'PEA': 'https://eservice.pea.co.th/Account/Login?ReturnUrl=%2f',
  'Lazada': 'https://pages.lazada.co.th/',
  'Shopee': 'https://shopee.co.th/',
  'SET': 'https://www.set.or.th/th/market/index/set/overview',
  'Yasothon Community College': 'https://www.yasocc.ac.th/',
  'ICCS Student SSO': 'https://iccs-sso.iccs.ac.th/oAuthBcca?client_id=6&redirect_uri=https%3A%2F%2Ficcs-portal.iccs.ac.th%2FcallbackResponseCode&response_type=code&scope=',
  'แอปทางรัฐ': 'https://www.ทางรัฐ.com/',
  'ThaID': 'https://www.bora.dopa.go.th/app-thaid/',
  'สปสช.': 'https://eservices.nhso.go.th/eServices/mobile/login.xhtml',
  'ประกันสังคม SSO': 'https://www.sso.go.th/wpr/main/login',
  'DLT Smart Queue': 'https://gecc.dlt.go.th/',
  'LandsMaps': 'https://landsmaps.dol.go.th/'
};

for (const [name, targetUrl] of Object.entries(requiredLinks)) {
  const match = servicesData.services.find(s => 
    s.name.toLowerCase().includes(name.toLowerCase()) || 
    (s.url && s.url.toLowerCase().includes(targetUrl.toLowerCase())) ||
    (s.subServices && s.subServices.some(sub => sub.url.includes(targetUrl) || sub.name.includes(name)))
  );
  assert.ok(match, `Required service "${name}" must exist in services list`);
  console.log(`  ✓ Verified required service link: ${name}`);
}

// 3. Validate Emergency Numbers
const mandatoryHotlines = ['191', '1669', '199', '1155', '1193', '1599'];
mandatoryHotlines.forEach(num => {
  const found = servicesData.emergencyNumbers.find(e => e.number === num);
  assert.ok(found, `Mandatory emergency hotline ${num} must exist`);
  assert.ok(found.tel.startsWith('tel:'), `Emergency hotline ${num} must have valid tel: URI`);
});
console.log('✅ All mandatory emergency numbers verified with valid tel: protocol');

// 4. Validate iHITEK integration details
const ihitekService = servicesData.services.find(s => s.id === 'ihitek' || s.name.toLowerCase().includes('ihitek') || s.name.includes('เปิดปิดไฟ'));
assert.ok(ihitekService, 'iHITEK Smart Home service must exist');
assert.strictEqual(ihitekService.playStoreUrl, 'https://play.google.com/store/apps/details?id=com.hitekhome.smart', 'playStoreUrl must match updated link');
console.log('✅ Verified iHITEK Smart Home integration data and Google Play URL');

// 5. Test Utility Calculators Logic (Electricity & Loan Installments)
const billCalc = require('../js/bill-calc.js');
assert.ok(typeof billCalc.calculateElectricityBill === 'function', 'calculateElectricityBill must be a function');
assert.ok(typeof billCalc.calculateLoanInstallment === 'function', 'calculateLoanInstallment must be a function');

// 5.1 Electricity Bill
const testUnits50 = billCalc.calculateElectricityBill(50, 'pea');
assert.ok(testUnits50.total > 0, 'Bill for 50 units should be greater than 0');
assert.ok(testUnits50.vat > 0, 'VAT should be computed');
assert.strictEqual(testUnits50.units, 50, 'Units must match input');

const testUnits200 = billCalc.calculateElectricityBill(200, 'mea');
assert.ok(testUnits200.total > testUnits50.total, 'Bill for 200 units must be greater than 50 units');
console.log(`✅ Electricity Bill Calculator tested: 50 units = ฿${testUnits50.total.toFixed(2)}, 200 units = ฿${testUnits200.total.toFixed(2)}`);

// 5.2 Car Loan (Flat Rate): 800,000 THB, 20% down, 2.5% per year, 48 months
const carLoan = billCalc.calculateLoanInstallment({
  price: 800000,
  downPercent: 20,
  interestRate: 2.5,
  months: 48,
  type: 'flat'
});
assert.strictEqual(carLoan.downAmount, 160000, 'Down amount must be 20% of 800,000 (160,000)');
assert.strictEqual(carLoan.loanPrincipal, 640000, 'Loan principal must be 640,000');
assert.strictEqual(carLoan.totalInterest, 64000, 'Total interest for 4 years at 2.5% must be 64,000');
assert.strictEqual(carLoan.totalPayable, 704000, 'Total payable must be 704,000');
assert.strictEqual(carLoan.monthlyPayment, 14666.67, 'Monthly payment must be 14,666.67');
console.log(`✅ Car Loan (Flat Rate) tested: 800k (20% down, 2.5% 48m) = ฿${carLoan.monthlyPayment.toFixed(2)}/mo, Interest = ฿${carLoan.totalInterest.toFixed(2)}`);

// 5.3 Home Mortgage (Effective Rate): 3,000,000 THB, 10% down, 3.5% per year, 360 months (30 years)
const homeLoan = billCalc.calculateLoanInstallment({
  price: 3000000,
  downPercent: 10,
  interestRate: 3.5,
  months: 360,
  type: 'effective'
});
assert.strictEqual(homeLoan.downAmount, 300000, 'Down amount must be 300,000');
assert.strictEqual(homeLoan.loanPrincipal, 2700000, 'Principal must be 2,700,000');
assert.ok(homeLoan.monthlyPayment >= 12100 && homeLoan.monthlyPayment <= 12200, 'Home loan monthly payment should be approx 12,124.21');
assert.ok(homeLoan.totalInterest > 1600000, 'Total interest should exceed 1.6M');
console.log(`✅ Home Mortgage (Effective Rate) tested: 3M (10% down, 3.5% 30y) = ฿${homeLoan.monthlyPayment.toFixed(2)}/mo, Interest = ฿${homeLoan.totalInterest.toFixed(2)}`);

// 6. Test Files Existence
const requiredFiles = [
  '../index.html',
  '../manifest.webmanifest',
  '../sw.js',
  '../css/style.css',
  '../css/animations.css',
  '../js/app.js',
  '../js/smart-home.js',
  '../js/emergency.js',
  '../js/financial.js',
  '../js/tracking.js',
  '../js/weather.js',
  '../README.md'
];

requiredFiles.forEach(file => {
  const fp = path.join(__dirname, file);
  assert.ok(fs.existsSync(fp), `File ${file} must exist`);
});

// 7. Test Favorites Section and Elements in index.html
const indexHtmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert.ok(indexHtmlContent.includes('id="favorites-section"'), 'index.html must contain #favorites-section');
assert.ok(indexHtmlContent.includes('id="favorites-grid"'), 'index.html must contain #favorites-grid');
assert.ok(indexHtmlContent.includes('id="favorites-count-badge"'), 'index.html must contain #favorites-count-badge');
console.log('✅ Favorites section (#favorites-section, #favorites-grid) verified in index.html');

// 8. Test Quick Parcel Tracking Controller & Carriers
const { COURIERS, ParcelTracker } = require('../js/tracking.js');
assert.ok(COURIERS, 'COURIERS dictionary must exist in js/tracking.js');
assert.ok(ParcelTracker, 'ParcelTracker controller must exist');

// Validate mandatory 4 couriers
const expectedCouriers = {
  thailandpost: 'https://track.thailandpost.co.th/?trackNumber=',
  flash: 'https://www.flashexpress.co.th/tracking/?se=',
  jtexpress: 'https://www.jtexpress.co.th/service/track?bills=',
  kerry: 'https://th.kerexpress.com/th/track/?track='
};

for (const [courierKey, baseTrackUrl] of Object.entries(expectedCouriers)) {
  const courier = COURIERS[courierKey];
  assert.ok(courier, `Courier ${courierKey} must be defined in COURIERS`);
  
  const testTrackNo = 'TEST123456TH';
  const generatedUrl = ParcelTracker.getTrackingUrl(courierKey, testTrackNo);
  assert.ok(generatedUrl.includes(testTrackNo), `Generated URL must include tracking number for ${courierKey}`);
  assert.ok(generatedUrl.startsWith(baseTrackUrl), `Generated URL for ${courierKey} must start with ${baseTrackUrl}`);
  console.log(`  ✓ Verified courier ${courier.name}: ${generatedUrl}`);
}

// 9. Test Parcel Tracking Elements in index.html
assert.ok(indexHtmlContent.includes('id="parcel-tracking-section"'), 'index.html must contain #parcel-tracking-section');
assert.ok(indexHtmlContent.includes('id="tracking-courier-select"'), 'index.html must contain #tracking-courier-select');
assert.ok(indexHtmlContent.includes('id="tracking-number-input"'), 'index.html must contain #tracking-number-input');
assert.ok(indexHtmlContent.includes('id="btn-track-parcel"'), 'index.html must contain #btn-track-parcel');
assert.ok(indexHtmlContent.includes('id="parcel-tracking-modal"'), 'index.html must contain #parcel-tracking-modal');
assert.ok(indexHtmlContent.includes('id="modal-tracking-courier-select"'), 'index.html must contain #modal-tracking-courier-select');
assert.ok(indexHtmlContent.includes('id="modal-tracking-number-input"'), 'index.html must contain #modal-tracking-number-input');
assert.ok(indexHtmlContent.includes('js/tracking.js'), 'index.html must load js/tracking.js');
console.log('✅ Quick Parcel Tracking section and modal elements verified in index.html');

// 11. Test Utility Calculators Modal Elements in index.html
assert.ok(indexHtmlContent.includes('id="bill-calc-modal"'), 'index.html must contain #bill-calc-modal');
assert.ok(indexHtmlContent.includes('id="calc-tab-electricity-btn"'), 'index.html must contain #calc-tab-electricity-btn');
assert.ok(indexHtmlContent.includes('id="calc-tab-loan-btn"'), 'index.html must contain #calc-tab-loan-btn');
assert.ok(indexHtmlContent.includes('id="calc-panel-electricity"'), 'index.html must contain #calc-panel-electricity');
assert.ok(indexHtmlContent.includes('id="calc-panel-loan"'), 'index.html must contain #calc-panel-loan');
assert.ok(indexHtmlContent.includes('id="loan-price-input"'), 'index.html must contain #loan-price-input');
assert.ok(indexHtmlContent.includes('id="loan-down-input"'), 'index.html must contain #loan-down-input');
assert.ok(indexHtmlContent.includes('id="loan-rate-input"'), 'index.html must contain #loan-rate-input');
assert.ok(indexHtmlContent.includes('id="loan-months-select"'), 'index.html must contain #loan-months-select');
assert.ok(indexHtmlContent.includes('id="loan-monthly-val"'), 'index.html must contain #loan-monthly-val');
assert.ok(indexHtmlContent.includes('id="loan-interest-val"'), 'index.html must contain #loan-interest-val');
// 12. Test Weather & PM 2.5 Open-Meteo Integration
const { WeatherManager, CITIES } = require('../js/weather.js');
assert.ok(WeatherManager, 'WeatherManager controller must exist');
assert.ok(CITIES, 'CITIES dictionary must exist');
assert.ok(CITIES.bangkok, 'Bangkok coordinates must exist');
assert.ok(CITIES.yasothon, 'Yasothon coordinates must exist');

// 12.1 Weather code mapping
const clearSky = WeatherManager.getWeatherInfo(0);
assert.strictEqual(clearSky.text, 'ท้องฟ้าแจ่มใส', 'WMO 0 must map to ท้องฟ้าแจ่มใส');
assert.strictEqual(clearSky.icon, 'sun', 'WMO 0 icon must be sun');

const rain = WeatherManager.getWeatherInfo(61);
assert.strictEqual(rain.text, 'ฝนตกปานกลาง', 'WMO 61 must map to ฝนตกปานกลาง');

// 12.2 PM 2.5 5-tier standard
const pmVeryGood = WeatherManager.getPM25Level(10.0);
assert.strictEqual(pmVeryGood.level, 1, 'PM 10.0 must be Level 1');
assert.strictEqual(pmVeryGood.shortLabel, 'ดีมาก');

const pmModerate = WeatherManager.getPM25Level(35.0);
assert.strictEqual(pmModerate.level, 3, 'PM 35.0 must be Level 3');
assert.strictEqual(pmModerate.shortLabel, 'ปานกลาง');

const pmHazardous = WeatherManager.getPM25Level(80.0);
assert.strictEqual(pmHazardous.level, 5, 'PM 80.0 must be Level 5');
assert.strictEqual(pmHazardous.shortLabel, 'อันตราย');
console.log('✅ WeatherManager WMO mapping & 5-tier Thai PM 2.5 standards verified');

// 12.3 Test Weather and PM 2.5 Elements in index.html
assert.ok(indexHtmlContent.includes('id="weather-pm25-widget"'), 'index.html must contain #weather-pm25-widget');
assert.ok(indexHtmlContent.includes('id="weather-city-pills"'), 'index.html must contain #weather-city-pills');
assert.ok(indexHtmlContent.includes('id="weather-city-name"'), 'index.html must contain #weather-city-name');
assert.ok(indexHtmlContent.includes('id="weather-temp-val"'), 'index.html must contain #weather-temp-val');
assert.ok(indexHtmlContent.includes('id="weather-pm25-val"'), 'index.html must contain #weather-pm25-val');
assert.ok(indexHtmlContent.includes('id="weather-pm25-badge"'), 'index.html must contain #weather-pm25-badge');
assert.ok(indexHtmlContent.includes('id="weather-pm25-bar"'), 'index.html must contain #weather-pm25-bar');
assert.ok(indexHtmlContent.includes('id="ticker-weather-city"'), 'index.html must contain #ticker-weather-city in Ticker');
assert.ok(indexHtmlContent.includes('id="ticker-temp-val"'), 'index.html must contain #ticker-temp-val in Ticker');
assert.ok(indexHtmlContent.includes('id="ticker-pm25-badge"'), 'index.html must contain #ticker-pm25-badge in Ticker');
assert.ok(indexHtmlContent.includes('js/weather.js'), 'index.html must load js/weather.js');
console.log('✅ Weather & PM 2.5 widget and ticker elements verified in index.html');

console.log('\n🎉 All test cases passed successfully!');


