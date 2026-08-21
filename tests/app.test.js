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
  'SET': 'https://www.set.or.th/th/market/index/set/overview'
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
console.log('✅ Verified iHITEK Smart Home integration data');

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
  '../README.md'
];

requiredFiles.forEach(file => {
  const fp = path.join(__dirname, file);
  assert.ok(fs.existsSync(fp), `File ${file} must exist`);
});
console.log('✅ All core web and PWA files verified');

console.log('\n🎉 All test cases passed successfully!');
