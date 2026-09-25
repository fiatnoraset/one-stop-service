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

// 5. Test Bill Calculator Logic
const billCalc = require('../js/bill-calc.js');
assert.ok(typeof billCalc.calculateElectricityBill === 'function', 'calculateElectricityBill must be a function');

const testUnits50 = billCalc.calculateElectricityBill(50, 'pea');
assert.ok(testUnits50.total > 0, 'Bill for 50 units should be greater than 0');
assert.ok(testUnits50.vat > 0, 'VAT should be computed');
assert.strictEqual(testUnits50.units, 50, 'Units must match input');

const testUnits200 = billCalc.calculateElectricityBill(200, 'mea');
assert.ok(testUnits200.total > testUnits50.total, 'Bill for 200 units must be greater than 50 units');
console.log(`✅ Electricity Bill Calculator tested: 50 units = ฿${testUnits50.total.toFixed(2)}, 200 units = ฿${testUnits200.total.toFixed(2)}`);

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

console.log('\n🎉 All test cases passed successfully!');

