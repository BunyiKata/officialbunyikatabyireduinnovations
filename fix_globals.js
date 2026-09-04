const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// replace global const/let with var
const lines = code.split('\n');
for(let i=0; i<lines.length; i++) {
    const trimmed = lines[i].trim();
    if(trimmed.startsWith('const ') || trimmed.startsWith('let ')) {
        // if indentation is 0 or 8 spaces (because some globals are indented)
        // wait, let's just find the global ones by checking if they are not inside {}
        // actually just replacing all `        const ` to `        var ` for the first 100 lines might fix it? No.
    }
}
