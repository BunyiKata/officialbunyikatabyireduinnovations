const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

code = code.replace(/triggerSuccessAnimation\(null, onContinue, onRetry, stars\);/, "triggerSuccessAnimation(`Anda berjaya mendapat ${stars} bintang.`, onContinue, onRetry, stars);");

fs.writeFileSync('public/app-logic.js', code);
