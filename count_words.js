const fs = require('fs');
const content = fs.readFileSync('public/app-logic.js', 'utf8');

// we'll mock some things to eval it
const script = content.substring(content.indexOf('var moduleContentData = {'), content.indexOf('window.moduleContentData = moduleContentData;'));
const evalContent = `
var Array = global.Array;
var String = global.String;
${script};
console.log(Object.keys(moduleContentData).filter(k => k.startsWith('suku_kata_')).map(k => k + ': ' + moduleContentData[k].flashcards.length).join('\\n'));
`
fs.writeFileSync('temp.js', evalContent);
