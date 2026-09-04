const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace(
    /<div className="modal-content neo-box" style={{ width: '90%', maxWidth: '800px', display: 'flex', flexDirection: 'column', position: 'relative', padding: '50px 20px 20px', borderRadius: 'var\(--radius-lg\)', backgroundImage: 'radial-gradient\(circle, rgba\(16, 24, 47, .11\) 1.5px, transparent 1.5px\), linear-gradient\(rgba\(255, 255, 255, 1\), rgba\(255, 255, 255, 1\)\)', backgroundColor: 'white' }}>/,
    '<div className="modal-content" style={{ display: "flex", flexDirection: "column", position: "relative", padding: "50px 20px 20px", width: "90%" }}>'
);

fs.writeFileSync('src/App.tsx', app);
console.log('cleaned video modal inline styles');
