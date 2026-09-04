const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.cabaran-padan-image \{[\s\S]*?\.cabaran-susun-image/g, '.cabaran-padan-image {\n        font-size: 5rem !important;\n    }\n    .cabaran-bacaan-image {\n        font-size: 2.5rem !important;\n    }\n    .cabaran-susun-image');

fs.writeFileSync('src/index.css', css);
