const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(
  '<div className="map-top-bar" style={{ margin: 0 }}>',
  '<div className="map-top-bar" style={{ paddingTop: "15px" }}>'
);

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);
