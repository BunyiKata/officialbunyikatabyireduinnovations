const fs = require('fs');

// 1. App.tsx - update mobile nav buttons
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  "onClick={(e) => { paparSkrin('murid-menu-belajar') }}",
  "onClick={(e) => { paparSkrin('main-menu-screen'); setTimeout(() => (window as any).bukaModalPilihPeta('belajar'), 50); }}"
);
appContent = appContent.replace(
  "onClick={(e) => { paparSkrin('murid-menu-latihan') }}",
  "onClick={(e) => { paparSkrin('main-menu-screen'); setTimeout(() => (window as any).bukaModalPilihPeta('latihan'), 50); }}"
);
fs.writeFileSync('src/App.tsx', appContent);

// 2. CabaranSukuKataGame.tsx - remove extra padding
let cabaranContent = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');
cabaranContent = cabaranContent.replace(
  '<div className="map-top-bar" style={{ paddingTop: "15px" }}>',
  '<div className="map-top-bar" style={{ margin: 0 }}>'
);
// Make sure back button is purple (it already is, but let's just make sure)
cabaranContent = cabaranContent.replace(
  '<button className="neo-btn bg-orange back-icon-btn"',
  '<button className="neo-btn bg-purple back-icon-btn"'
);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaranContent);

// 3. TandukKataGame.tsx - remove extra padding and make back button purple
let tandukContent = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf8');
tandukContent = tandukContent.replace(
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', paddingTop: \'15px\' }}>',
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', padding: \'10px 20px 0 20px\' }}>'
);
tandukContent = tandukContent.replace(
  '<button className="neo-btn bg-orange back-icon-btn"',
  '<button className="neo-btn bg-purple back-icon-btn"'
);
tandukContent = tandukContent.replace(
  '<div className="neo-btn bg-white page-title"',
  '<div className="neo-btn bg-purple page-title"'
);
fs.writeFileSync('src/components/TandukKataGame.tsx', tandukContent);

