const fs = require('fs');
let tandukContent = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf8');
tandukContent = tandukContent.replace(
  "<span style={{ color: 'var(--color-dark)', fontWeight: 'bold' }}>{selectedCategory}</span>",
  "<span style={{ color: 'white', fontWeight: 'bold' }}>{selectedCategory}</span>"
);
fs.writeFileSync('src/components/TandukKataGame.tsx', tandukContent);
