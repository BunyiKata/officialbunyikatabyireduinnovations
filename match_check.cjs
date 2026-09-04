const fs = require('fs');
let code = fs.readFileSync('/tmp/TandukKataGame.tsx.bak', 'utf-8');
const mobileBtnRegex = /<button[\s\S]*?onPointerDown=\{\(e\) => \{[\s\S]*?jump\(\);[\s\S]*?\}[\s\S]*?<\/button>/;
const match = code.match(mobileBtnRegex);
if (match) {
    console.log("Matched length:", match[0].length);
    console.log("Match:\n" + match[0]);
}
