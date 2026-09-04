const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const oldCss = `.bs-scene {
    margin: 0;
    width: 100%;
    max-width: 250px;
    height: 250px;
    flex-shrink: 0;
}`;

const newCss = `.bs-scene {
    margin: 0;
    width: 100%;
    max-width: 250px;
    height: 250px;
    flex-shrink: 0;
}
.bs-scene .card__face {
    box-shadow: 0 6px 0 var(--color-dark);
}`;

if (code.includes(oldCss)) {
    code = code.replace(oldCss, newCss);
    fs.writeFileSync('src/index.css', code);
    console.log('patched bs-scene shadow');
} else {
    console.log('could not find bs-scene block');
}
