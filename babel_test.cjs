const parser = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');
try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });
  console.log("No syntax errors found.");
} catch (e) {
  console.error("Syntax Error:", e.message, "at line", e.loc.line, "col", e.loc.column);
}
