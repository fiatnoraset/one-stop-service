/**
 * One Stop Service - Main Services & Category Data
 * Contains comprehensive registry of Thai digital services, emergency hotlines, and utilities.
 */

const categories = [
  { id: 'all', name: 'ทั้งหมด', nameEn: 'All Services', icon: 'grid', color: 'teal' },
  { id: 'emergency', name: 'แจ้งเหตุฉุกเฉิน', nameEn: 'Emergency & SOS', icon: 'shield-alert', color: 'red' },
  { id: 'smarthome', name: 'เปิดปิดไฟบ้าน', nameEn: 'Smart Home Lighting', icon: 'lightbulb', color: 'amber' },
  { id: 'transport', name: 'เดินทาง / เรียกรถ', nameEn: 'Ride & Transport', icon: 'car', color: 'emerald' },
  { id: 'food', name: 'สั่งอาหาร', nameEn: 'Food Delivery', icon: 'utensils', color: 'orange' },
  { id: 'shopping', name: 'สั่งสินค้าออนไลน์', nameEn: 'Online Shopping', icon: 'shopping-bag', color: 'blue' },
  { id: 'news', name: 'ข่าวสาร', nameEn: 'News & Media', icon: 'newspaper', color: 'cyan' },
  { id: 'utility', name: 'จ่ายค่าไฟ / บิล', nameEn: 'Bills & Utilities', icon: 'zap', color: 'purple' },
  { id: 'finance', name: 'ตลาดหุ้น / การเงิน', nameEn: 'Stock & Finance', icon: 'trending-up', color: 'green' },
];

const emergencyNumbers = [
  {
    number: '191',
    tel: 'tel:191',
    name: 'เหตุด่วนเหตุร้าย / ตำรวจ',
    nameEn: 'Police Emergency Hotline',
    dept: 'สำนักงานตำรวจแห่งชาติ',
    icon: 'shield',
    color: 'red',
    badge: 'สายด่วนหลัก 24 ชม.'
  },
  {
    number: '1669',
    tel: 'tel:1669',
    name: 'เจ็บป่วยฉุกเฉิน / รถพยาบาลกู้ชีพ',
    nameEn: 'EMS Medical Emergency',
    dept: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)',
    icon: 'activity',
    color: 'rose',
    badge: 'ฟรีทั่วประเทศ 24 ชม.'
  },
  {
    number: '199',
    tel: 'tel:199',
    name: 'ดับเพลิงและกู้ภัย / สัตว์มีพิษเข้าบ้าน',
    nameEn: 'Fire & Rescue Department',
    dept: 'สำนักป้องกันและบรรเทาสาธารณภัย',
    icon: 'flame',
    color: 'amber',
    badge: 'ไฟไหม้ สัตว์เลื้อยคลาน'
  },
  {
    number: '1155',
    tel: 'tel:1155',
    name: 'ตำรวจท่องเที่ยว (Tourist Police)',
    nameEn: 'Tourist Police Thailand',
    dept: 'กองบัญชาการตำรวจท่องเที่ยว',
    icon: 'compass',
    color: 'blue',
    badge: 'รองรับหลายภาษา'
  },
  {
    number: '1193',
    tel: 'tel:1193',
    name: 'ตำรวจทางหลวง / อุบัติเหตุบนทางหลวง',
    nameEn: 'Highway Police Patrol',
    dept: 'กองบังคับการตำรวจทางหลวง',
    icon: 'navigation',
    color: 'indigo',
    badge: 'ช่วยเหลือนอกเขตเมือง'
  },
  {
    number: '1197',
    tel: 'tel:1197',
    name: 'ศูนย์ควบคุมและสั่งการจราจร (บก.02)',
    nameEn: 'Traffic Control Center',
    dept: 'กองบังคับการตำรวจจราจร',
    icon: 'traffic-cone',
    color: 'orange',
    badge: 'สอบถามเส้นทาง/รถติด'
  },
  {
    number: '1137',
    tel: 'tel:1137',
    name: 'วิทยุ จส.100 (JS100 Radio)',
    nameEn: 'JS100 Traffic Radio',
    dept: 'ศูนย์ประสานงานจราจรอุบัติเหตุ',
    icon: 'radio',
    color: 'emerald',
    badge: 'ของหาย อุบัติเหตุ จราจร'
  },
  {
    number: '1644',
    tel: 'tel:1644',
    name: 'สถานีวิทยุ สวพ.FM91',
    nameEn: 'FM91 Traffic Pro Police',
    dept: 'กองบัญชาการตำรวจตระเวนชายแดน',
    icon: 'mic',
    color: 'teal',
    badge: 'แจ้งเหตุคนหาย รถหาย'
  },
  {
    number: '1599',
    tel: 'tel:1599',
    name: 'ศูนย์รับเรื่องร้องเรียน ตร.',
    nameEn: 'Royal Thai Police Call Center',
    dept: 'สำนักงานตำรวจแห่งชาติ',
    icon: 'file-text',
    color: 'gray',
    badge: 'แจ้งเบาะแสอาชญากรรม'
  },
  {
    number: '1441',
    tel: 'tel:1441',
    name: 'ศูนย์ปราบปรามอาชญากรรมไซเบอร์ (AOC 1441)',
    nameEn: 'Anti-Online Scam Call Center',
    dept: 'กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',
    icon: 'lock',
    color: 'red',
    badge: 'ระงับบัญชีมิจฉาชีพด่วน'
  },
  {
    number: '1166',
    tel: 'tel:1166',
    name: 'สคบ. คุ้มครองผู้บริโภค',
    nameEn: 'Consumer Protection Board',
    dept: 'สำนักงานคณะกรรมการคุ้มครองผู้บริโภค',
    icon: 'badge-check',
    color: 'cyan',
    badge: 'โดนโกง สินค้าไม่ได้มาตรฐาน'
  },
  {
    number: '1323',
    tel: 'tel:1323',
    name: 'สายด่วนสุขภาพจิต กรมสุขภาพจิต',
    nameEn: 'Mental Health Hotline',
    dept: 'กรมสุขภาพจิต กระทรวงสาธารณสุข',
    icon: 'heart',
    color: 'pink',
    badge: 'ปรึกษาคลายเครียด 24 ชม.'
  }
];

const services = [
  // --- เมนูข่าว (News) ---
  {
    id: 'news-hub',
    categoryId: 'news',
    name: 'ข่าวสาร & ข่าวเด่นวันนี้ (News Hub)',
    nameEn: 'Thailand Live News Hub',
    description: 'รวมสำนักข่าวยอดนิยมอันดับ 1 ของไทย อัปเดตสถานการณ์สด 24 ชั่วโมง ทั้ง Sanook และ Thairath',
    url: 'https://www.sanook.com/',
    icon: 'newspaper',
    color: 'cyan',
    badge: 'ข่าวด่วน 24 ชม.',
    subServices: [
      {
        name: 'Sanook (สนุกดอทคอม)',
        url: 'https://www.sanook.com/',
        desc: 'วาไรตี้ ข่าวเด่น บันเทิง ดูดวง กีฬา ผลสลากกินแบ่ง',
        icon: 'newspaper',
        color: '#ff3366'
      },
      {
        name: 'Thairath (ไทยรัฐออนไลน์)',
        url: 'https://www.thairath.co.th/home',
        desc: 'หนังสือพิมพ์และสื่อออนไลน์อันดับ 1 ข่าวจริง เจาะลึก ทันกระแส',
        icon: 'tv',
        color: '#009944'
      },
      {
        name: 'Dailynews (เดลินิวส์)',
        url: 'https://www.dailynews.co.th/',
        desc: 'ข่าวการเมือง เศรษฐกิจ อาชญากรรม ทั่วไทย',
        icon: 'globe',
        color: '#e60000'
      },
      {
        name: 'Khaosod (ข่าวสด)',
        url: 'https://www.khaosod.co.th/',
        desc: 'ครบทุกรส สดทุกเรื่อง เกาะติดข่าวร้อนฉับไว',
        icon: 'flame',
        color: '#ff6600'
      }
    ]
  },
  {
    id: 'sanook',
    categoryId: 'news',
    name: 'Sanook News (สนุกดอทคอม)',
    nameEn: 'Sanook Online Portal',
    description: 'เว็บท่าอันดับ 1 ของไทย รวมข่าวสาร บันเทิง ตรวจหวย ดูดวง ผลบอล และไลฟ์สไตล์',
    url: 'https://www.sanook.com/',
    icon: 'globe',
    color: 'rose',
    badge: 'ยอดนิยม'
  },
  {
    id: 'thairath',
    categoryId: 'news',
    name: 'ไทยรัฐออนไลน์ (Thairath)',
    nameEn: 'Thairath News Portal',
    description: 'สำนักข่าวชั้นนำ ข่าวการเมือง เศรษฐกิจ ข่าวต่างประเทศ บันเทิง และรายการสด',
    url: 'https://www.thairath.co.th/home',
    icon: 'tv',
    color: 'emerald',
    badge: 'ทันกระแส'
  },

  // --- เมนูสั่งอาหาร (Food Delivery) ---
  {
    id: 'food-delivery-hub',
    categoryId: 'food',
    name: 'สั่งอาหารออนไลน์ (Food Delivery Hub)',
    nameEn: 'Food Delivery Portal',
    description: 'เลือกร้านโปรดจากแอปเดลิเวอรี่ชั้นนำ GrabFood, ShopeeFood, LINE MAN ครบจบในที่เดียว',
    url: 'https://www.grab.com/th/food/',
    icon: 'utensils',
    color: 'orange',
    badge: 'โปรโมชั่นเด็ด',
    subServices: [
      {
        name: 'GrabFood (แกร็บฟู้ด)',
        url: 'https://www.grab.com/th/food/',
        desc: 'ร้านอาหารชั้นนำ โค้ดส่วนลดคุ้ม สั่งไว ส่งตรงถึงบ้าน',
        icon: 'utensils',
        color: '#00b14f'
      },
      {
        name: 'ShopeeFood (ช้อปปี้ฟู้ด)',
        url: 'https://shopee.co.th/m/ShopeeFoodMainDEC',
        desc: 'รวมดีลอาหารสุดคุ้ม ส่งฟรี โค้ดลดรายวันใน Shopee',
        icon: 'shopping-bag',
        color: '#ee4d2d'
      },
      {
        name: 'LINE MAN Food (ไลน์แมน)',
        url: 'https://lineman.line.me/food/',
        desc: 'ร้านสตรีทฟู้ดเยอะที่สุด ส่งตรงจากร้านดังทั่วกรุงเทพฯ และไทย',
        icon: 'message-circle',
        color: '#06c755'
      },
      {
        name: 'Foodpanda (ฟู้ดแพนด้า)',
        url: 'https://www.foodpanda.co.th/',
        desc: 'ส่งอาหารและของสดของใช้ แพนด้ามาร์ท ครอบคลุมทั่วประเทศ',
        icon: 'gift',
        color: '#d70f64'
      }
    ]
  },
  {
    id: 'grabfood',
    categoryId: 'food',
    name: 'GrabFood (แกร็บฟู้ด)',
    nameEn: 'GrabFood Delivery',
    description: 'สั่งอาหาร สตรีทฟู้ด คาเฟ่ ร้านมิชลิน ส่งตรงรวดเร็ว พร้อมส่วนลดพิเศษมากมาย',
    url: 'https://www.grab.com/th/food/',
    icon: 'utensils',
    color: 'emerald',
    badge: 'ร้านเยอะที่สุด'
  },
  {
    id: 'shopeefood',
    categoryId: 'food',
    name: 'ShopeeFood (ช้อปปี้ฟู้ด)',
    nameEn: 'ShopeeFood Portal',
    description: 'ศูนย์รวมโปรโมชั่นอาหาร ส่วนลดค่าส่ง และดีลพิเศษสุดคุ้มจาก Shopee',
    url: 'https://shopee.co.th/m/ShopeeFoodMainDEC',
    icon: 'shopping-bag',
    color: 'orange',
    badge: 'โค้ดลดคุ้ม'
  },

  // --- เมนูเดินทาง / เรียกรถ (Transport) ---
  {
    id: 'ride-transport-hub',
    categoryId: 'transport',
    name: 'เดินทาง & เรียกรถ (Ride & Transport Hub)',
    nameEn: 'Mobility & Taxi Booking',
    description: 'เปรียบเทียบและเรียกรถรับส่ง Grab Car, Bolt, LINE MAN Taxi และตรวจสอบเส้นทางรถไฟฟ้า',
    url: 'https://www.grab.com/th/transport/',
    icon: 'car',
    color: 'emerald',
    badge: 'เดินทางสะดวก',
    subServices: [
      {
        name: 'Grab Car (แกร็บคาร์ / แท็กซี่)',
        url: 'https://www.grab.com/th/transport/',
        desc: 'เรียกรถยนต์ส่วนตัว แท็กซี่ รถตู้ ปลอดภัย มาตรฐานระดับสากล',
        icon: 'car',
        color: '#00b14f'
      },
      {
        name: 'Bolt (โบลท์ ประเทศไทย)',
        url: 'https://bolt.eu/en-th/?utm_source=google&utm_medium=ads&utm_campaign=15136697510&gad_source=1&gad_campaignid=22759326399&gbraid=0AAAAADj1riZ222O15U2BY5t4gor1XSWQw&gclid=CjwKCAjw7p_UBhBlEiwAhpIs7365Q884vlhkkNjU_7K_USfiQmOvhQBHmxDuM0XCZDc5JR5zkuKDCRoC0rEQAvD_BwE',
        desc: 'เรียกรถราคาสุดประหยัด รวดเร็ว มีบริการทั้งรถยนต์และมอเตอร์ไซค์',
        icon: 'zap',
        color: '#34d186'
      },
      {
        name: 'LINE MAN Taxi (ไลน์แมนแท็กซี่)',
        url: 'https://lineman.line.me/taxi/',
        desc: 'เรียกแท็กซี่มิเตอร์ถูกกฎหมาย ผ่านระบบ LINE MAN สะดวกรวดเร็ว',
        icon: 'map-pin',
        color: '#06c755'
      },
      {
        name: 'BTS / MRT แผนที่และค่าโดยสาร',
        url: 'https://www.bemplc.co.th/Route-Map',
        desc: 'ตรวจสอบแผนที่เส้นทางรถไฟฟ้า BTS, MRT สายสีน้ำเงิน สีม่วง สีเหลือง สีชมพู',
        icon: 'train',
        color: '#0088cc'
      }
    ]
  },
  {
    id: 'grabcar',
    categoryId: 'transport',
    name: 'Grab Car (แกร็บคาร์ & ทรานสปอร์ต)',
    nameEn: 'Grab Transport Booking',
    description: 'เรียกรถสะดวก รวดเร็ว มีตัวเลือกทั้ง JustGrab, GrabCar, GrabTaxi และรถรับส่งสนามบิน',
    url: 'https://www.grab.com/th/transport/',
    icon: 'car',
    color: 'emerald',
    badge: 'ปลอดภัยสูงสุด'
  },
  {
    id: 'bolt',
    categoryId: 'transport',
    name: 'Bolt (โบลท์ ประเทศไทย)',
    nameEn: 'Bolt Ride Hailing',
    description: 'บริการเรียกรถราคาสบายกระเป๋า ปลายทางถึงที่หมายอย่างรวดเร็วและปลอดภัย',
    url: 'https://bolt.eu/en-th/?utm_source=google&utm_medium=ads&utm_campaign=15136697510&gad_source=1&gad_campaignid=22759326399&gbraid=0AAAAADj1riZ222O15U2BY5t4gor1XSWQw&gclid=CjwKCAjw7p_UBhBlEiwAhpIs7365Q884vlhkkNjU_7K_USfiQmOvhQBHmxDuM0XCZDc5JR5zkuKDCRoC0rEQAvD_BwE',
    icon: 'zap',
    color: 'teal',
    badge: 'ราคาประหยัด'
  },

  // --- เมนูจ่ายค่าไฟ (Utility Bills) ---
  {
    id: 'utility-bills-hub',
    categoryId: 'utility',
    name: 'จ่ายค่าไฟ & สาธารณูปโภค (Utility Bills Hub)',
    nameEn: 'Electricity & Utility Bills',
    description: 'ชำระค่าไฟฟ้าส่วนภูมิภาค (PEA) การไฟฟ้านครหลวง (MEA) ค่าน้ำประปา และคำนวณค่าไฟ',
    url: 'https://eservice.pea.co.th/Account/Login?ReturnUrl=%2f',
    icon: 'zap',
    color: 'purple',
    badge: 'ชำระออนไลน์',
    subServices: [
      {
        name: 'PEA e-Service (การไฟฟ้าส่วนภูมิภาค)',
        url: 'https://eservice.pea.co.th/Account/Login?ReturnUrl=%2f',
        desc: 'ตรวจสอบยอดค่าไฟ พิมพ์ใบเสร็จ ชำระเงินออนไลน์สำหรับผู้ใช้ไฟต่างจังหวัด',
        icon: 'zap',
        color: '#6b21a8'
      },
      {
        name: 'MEA Smart Life (การไฟฟ้านครหลวง)',
        url: 'https://eservice.mea.or.th/',
        desc: 'ชำระค่าไฟ กทม. นนทบุรี สมุทรปราการ และตรวจสอบประวัติการใช้ไฟฟ้า',
        icon: 'power',
        color: '#ea580c'
      },
      {
        name: 'เครื่องคำนวณค่าไฟฟ้าตามหน่วยจริง',
        url: '#bill-calc-modal',
        desc: 'จำลองคำนวณค่าไฟรายเดือนตามหน่วย (Units) พร้อมสูตร FT และ VAT 7%',
        icon: 'calculator',
        color: '#0284c7',
        isInteractiveModal: true
      }
    ]
  },
  {
    id: 'pea-bill',
    categoryId: 'utility',
    name: 'PEA e-Service (การไฟฟ้าส่วนภูมิภาค)',
    nameEn: 'PEA Electricity e-Service',
    description: 'ระบบบริการออนไลน์ PEA e-Service เช็คค่าไฟ ชำระเงิน และขอใช้ไฟฟ้าออนไลน์',
    url: 'https://eservice.pea.co.th/Account/Login?ReturnUrl=%2f',
    icon: 'zap',
    color: 'purple',
    badge: 'บริการหลัก'
  },

  // --- เมนูสั่งสินค้าออนไลน์ (Online Shopping) ---
  {
    id: 'shopping-hub',
    categoryId: 'shopping',
    name: 'สั่งสินค้าออนไลน์ (Shopping Hub)',
    nameEn: 'E-Commerce Shopping Portal',
    description: 'ช้อปปิ้งสินค้าออนไลน์ แฟชั่น เครื่องใช้ไฟฟ้า ไอที จาก Lazada, Shopee และ TikTok Shop',
    url: 'https://shopee.co.th/',
    icon: 'shopping-bag',
    color: 'blue',
    badge: 'ลดกระหน่ำ',
    subServices: [
      {
        name: 'Shopee Thailand (ช้อปปี้)',
        url: 'https://shopee.co.th/',
        desc: 'ช้อปคุ้มส่งฟรี โค้ดส่วนลด Flash Sale และสินค้าแบรนด์ดังใน Shopee Mall',
        icon: 'shopping-bag',
        color: '#ee4d2d'
      },
      {
        name: 'Lazada Thailand (ลาซาด้า)',
        url: 'https://pages.lazada.co.th/',
        desc: 'LazMall ของแท้ 100% คูปองส่วนลด ดีลเด็ด LazFlash ส่งเร็วทันใจ',
        icon: 'shopping-cart',
        color: '#0f146d'
      },
      {
        name: 'TikTok Shop (ติ๊กต็อกช็อป)',
        url: 'https://shop.tiktok.com/',
        desc: 'ช้อปสินค้าผ่านวิดีโอสั้นและไลฟ์สตรีม ส่วนลดพิเศษและส่งฟรีทุกวัน',
        icon: 'video',
        color: '#000000'
      },
      {
        name: 'Central Online (เซ็นทรัล)',
        url: 'https://www.central.co.th/',
        desc: 'ห้างสรรพสินค้าออนไลน์ สินค้าเคาน์เตอร์แบรนด์ บิวตี้ แฟชั่นพรีเมียม',
        icon: 'award',
        color: '#d91b24'
      }
    ]
  },
  {
    id: 'lazada',
    categoryId: 'shopping',
    name: 'Lazada Thailand (ลาซาด้า)',
    nameEn: 'Lazada Official Portal',
    description: 'แพลตฟอร์มอีคอมเมิร์ซชั้นนำ รวมร้านค้าแบรนด์ LazMall ส่วนลดบัตรเครดิต และคูปองส่งฟรี',
    url: 'https://pages.lazada.co.th/',
    icon: 'shopping-cart',
    color: 'indigo',
    badge: 'LazMall'
  },
  {
    id: 'shopee',
    categoryId: 'shopping',
    name: 'Shopee Thailand (ช้อปปี้)',
    nameEn: 'Shopee Official Portal',
    description: 'แหล่งช้อปปิ้งออนไลน์ยอดนิยม โค้ดส่งฟรี Flash Sale 9.9 11.11 และชำระเงินผ่าน SPayLater',
    url: 'https://shopee.co.th/',
    icon: 'shopping-bag',
    color: 'orange',
    badge: 'ส่งฟรีทั่วไทย'
  },

  // --- เมนูตลาดหุ้น & การเงิน (Stock Market & Finance) ---
  {
    id: 'stock-market-hub',
    categoryId: 'finance',
    name: 'ตลาดหุ้น & การเงิน (Stock Market & Finance)',
    nameEn: 'SET Market & Financial Hub',
    description: 'ติดตามดัชนีตลาดหลักทรัพย์แห่งประเทศไทย (SET Overview), SET50, ราคาทองคำ, ราคาน้ำมัน และค่าเงิน',
    url: 'https://www.set.or.th/th/market/index/set/overview',
    icon: 'trending-up',
    color: 'emerald',
    badge: 'ข้อมูลเรียลไทม์',
    subServices: [
      {
        name: 'SET Market Overview (ตลาดหลักทรัพย์แห่งประเทศไทย)',
        url: 'https://www.set.or.th/th/market/index/set/overview',
        desc: 'ภาพรวมดัชนี SET, SET50, mai, มูลค่าการซื้อขายตามกลุ่มนักลงทุน',
        icon: 'bar-chart-2',
        color: '#008060'
      },
      {
        name: 'TradingView (กราฟเทคนิคัลหุ้นไทย)',
        url: 'https://th.tradingview.com/symbols/SET-SET/',
        desc: 'กราฟวิเคราะห์ทางเทคนิค อินดิเคเตอร์ Realtime สำหรับนักลงทุน',
        icon: 'activity',
        color: '#2962ff'
      },
      {
        name: 'สมาคมค้าทองคำ (ราคาทองวันนี้)',
        url: 'https://www.goldtraders.or.th/',
        desc: 'เช็คราคาทองคำแท่ง ทองรูปพรรณ 96.5% อัปเดตตามเวลาจริง',
        icon: 'award',
        color: '#d97706'
      },
      {
        name: 'ราคาน้ำมันขายปลีก ปตท. (PTT Oil)',
        url: 'https://www.pttor.com/th/oil_price',
        desc: 'ตรวจสอบราคาน้ำมันเบนซิน แก๊สโซฮอล์ ดีเซล พรีเมียมวันนี้',
        icon: 'droplet',
        color: '#0284c7'
      }
    ]
  },
  {
    id: 'set-stock',
    categoryId: 'finance',
    name: 'SET Overview (ดัชนีตลาดหลักทรัพย์)',
    nameEn: 'Stock Exchange of Thailand',
    description: 'ข้อมูลภาพรวมตลาดหุ้นไทย ดัชนี SET Index, ข่าวสารบริษัทจดทะเบียน และงบการเงิน',
    url: 'https://www.set.or.th/th/market/index/set/overview',
    icon: 'trending-up',
    color: 'emerald',
    badge: 'SET Index'
  },

  // --- เมนูเปิดปิดไฟในบ้าน (Smart Home - iHITEK) ---
  {
    id: 'ihitek',
    categoryId: 'smarthome',
    name: 'เปิดปิดไฟในบ้าน (iHITEK Smart Home)',
    nameEn: 'iHITEK Smart Light & Home IoT',
    description: 'เปิดแอปพลิเคชัน iHITEK สำหรับสั่งงานเปิด-ปิดไฟ สวิตช์อัจฉริยะ และควบคุมไฟในบ้านบนเว็บจำลอง',
    url: 'ihitek://',
    appStoreUrl: 'https://apps.apple.com/th/app/ihitek/id1453913076',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.hitekhome.smart',
    icon: 'lightbulb',
    color: 'amber',
    badge: 'เชื่อมต่อด่วน',
    isSmartHome: true
  },

  // --- เมนูแจ้งเหตุด่วนเหตุร้าย (Emergency) ---
  {
    id: 'emergency-hub',
    categoryId: 'emergency',
    name: 'แจ้งเหตุด่วนเหตุร้าย & สายด่วนฉุกเฉินไทย',
    nameEn: 'Thailand Emergency SOS Hub',
    description: 'รวบรวมเบอร์โทรฉุกเฉินทุกสังกัดในประเทศไทย กดโทรออกได้ทันที 191, 1669, 199 พร้อมระบบส่งสัญญาณ SOS',
    url: '#emergency-section',
    icon: 'shield-alert',
    color: 'red',
    badge: 'โทรฟรี 24 ชม.',
    isEmergencyHub: true
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { categories, services, emergencyNumbers };
}
