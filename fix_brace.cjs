const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (code.indexOf('  100% {\n    left: 200%;\n  }\n.shiny-reveal') !== -1) {
    code = code.replace('  100% {\n    left: 200%;\n  }\n.shiny-reveal', '  100% {\n    left: 200%;\n  }\n}\n.shiny-reveal');
    fs.writeFileSync('src/index.css', code);
    console.log("Fixed brace!");
} else {
    console.log("Could not find the pattern.");
}
