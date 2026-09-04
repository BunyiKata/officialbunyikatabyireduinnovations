const fs = require('fs');
const code = fs.readFileSync('/tmp/TandukKataGame.tsx.bak', 'utf-8');
const match = code.match(/const ENVIRONMENT_DECORATIONS = \{[\s\S]*?\}\s*};\n/);
if (match) {
    console.log("Matched length:", match[0].length);
    console.log("Starts at:", match.index);
    console.log("Ends at:", match.index + match[0].length);
    console.log("Last 100 chars of match:\n", match[0].substring(match[0].length - 100));
} else {
    console.log("No match");
}
