const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<div
            className="neo-btn bg-pink page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fa-solid fa-camera mr-2"></i> AR Suku Kata
          </div>`;

const replacement = `<div
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fa-solid fa-camera mr-2"></i> AR Suku Kata
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
