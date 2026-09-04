const fs = require('fs');

const content = fs.readFileSync('public/app-logic.js', 'utf8');
const match = content.match(/window\.moduleContentData\s*=\s*(\{[\s\S]*?\}|.*);/);
if (match) {
    console.log("Found moduleContentData!");
} else {
    console.log("Not found.");
}
