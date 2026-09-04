const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const targetStr = `}
  25% {
    transform: scale(1.05) rotate(-2deg);
  }
  75% {
    transform: scale(1.05) rotate(2deg);
  }
}`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, "");
    fs.writeFileSync('src/index.css', code);
    console.log("Replaced");
} else {
    console.log("Not found");
}
