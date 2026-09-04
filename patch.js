const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');
code = code.replace(/<div style={{\s*fontSize: "1\.75rem",\s*fontWeight: "900",\s*color: "#16a34a",\s*letterSpacing: "1px",\s*textTransform: "lowercase"\s*}}>/g, '<div className="font-black text-green-600 tracking-wide lowercase text-2xl md:text-[1.75rem]">');
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
