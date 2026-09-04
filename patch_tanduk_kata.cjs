const fs = require('fs');
let content = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf8');

content = content.replace(
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', padding: \'20px\' }}>',
  '<div style={{ width: \'100%\', maxWidth: \'1200px\', margin: \'0 auto\', paddingTop: \'15px\' }}>'
);

content = content.replace(
  '<button className="neo-btn bg-orange back-icon-btn"',
  '<button className="neo-btn bg-purple back-icon-btn"'
);

// We need to also change the title button from bg-white to bg-purple?
// Wait, user said "tajuk cabaran KV dan butang back...". Butang back oren ubah jadi purple.
// "butang oren pada sebelah tajuk cabaran suku kata asas juga tukar dari oren kepada warna purple" -> Wait, what button next to the title?
// Is there another orange button? Let's check CabaranSukuKataGame.tsx

fs.writeFileSync('src/components/TandukKataGame.tsx', content);
