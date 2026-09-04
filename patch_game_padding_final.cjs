const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(
  '<div className="map-top-bar" style={{ margin: 0 }}>',
  '<div className="map-top-bar" style={{ paddingTop: "15px", marginBottom: "0" }}>'
);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);

let tanduk = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf8');
tanduk = tanduk.replace(
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', padding: \'10px 20px 0 20px\' }}>',
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', paddingTop: \'15px\' }}>'
);
fs.writeFileSync('src/components/TandukKataGame.tsx', tanduk);

