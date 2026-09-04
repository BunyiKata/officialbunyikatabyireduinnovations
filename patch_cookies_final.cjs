const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regexToReplace = /if \(isNumberModule\) \{\s*let fSize =.*?if \(backContentEl\) backContentEl\.innerHTML = containerHtml;\s*\}/s;

const newNumberLogic = `if (isNumberModule) {
                let fSize = 'clamp(4.5rem, 15vw, 6.5rem)';
                let customStyle = "";
                let formattedContent = item.icon || '❓';
                let isSiriNombor = currentModuleId === 'bilang_siri_nombor';
                
                if (isSiriNombor) {
                    fSize = 'clamp(4.5rem, 15vw, 6.5rem)';
                } else if (item.icon) {
                    let cookieArray = [...item.icon].filter(c => c === '🍪');
                    let cookieCount = cookieArray.length;
                    
                    if (cookieCount > 0) {
                        // Convert cookies to individual spans for clean flex wrapping
                        formattedContent = Array(cookieCount).fill('<span style="display:inline-block; line-height: 1;">🍪</span>').join('');
                        
                        if (cookieCount === 1) {
                            fSize = 'clamp(3.5rem, 12vw, 5rem)';
                            customStyle = 'max-width: 100%;';
                        } else if (cookieCount === 2) {
                            fSize = 'clamp(2.8rem, 10vw, 4rem)';
                            customStyle = 'max-width: 100%;';
                        } else if (cookieCount === 3) {
                            fSize = 'clamp(2.4rem, 8vw, 3.5rem)';
                            customStyle = 'max-width: 100%;';
                        } else if (cookieCount === 4) {
                            fSize = 'clamp(2rem, 7vw, 2.8rem)';
                            customStyle = 'max-width: 2.5em; margin: 0 auto;'; // 2x2 grid
                        } else if (cookieCount === 5 || cookieCount === 6) {
                            fSize = 'clamp(1.8rem, 6vw, 2.5rem)';
                            customStyle = 'max-width: 3.8em; margin: 0 auto;'; // 3 per row (3+2 or 3+3)
                        } else if (cookieCount >= 7 && cookieCount <= 9) {
                            fSize = 'clamp(1.5rem, 5vw, 2.1rem)';
                            customStyle = 'max-width: 3.8em; margin: 0 auto;'; // 3 per row (3+3+1, 3+3+2, 3+3+3)
                        } else if (cookieCount >= 10) {
                            fSize = 'clamp(1.3rem, 4.2vw, 1.8rem)';
                            customStyle = 'max-width: 3.8em; margin: 0 auto;'; // 3 per row (3+3+3+1)
                        }
                    } else {
                        // Non-cookie icons like 0️⃣
                        fSize = 'clamp(4.5rem, 15vw, 6.5rem)';
                    }
                }
                
                let containerHtml = \`<div style="font-size: \${fSize}; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center; width: 100%; height: 100%; max-width: 100%; max-height: 100%; padding: 8px; box-sizing: border-box; gap: 6px; overflow: hidden; \${customStyle}">\${formattedContent}</div>\`;
                
                if (iconEl) iconEl.innerHTML = containerHtml;
                const backContentEl = document.getElementById('sukukata-card-back-content');
                if (backContentEl) backContentEl.innerHTML = containerHtml;
            }`;

if (code.match(regexToReplace)) {
    code = code.replace(regexToReplace, newNumberLogic);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched cookies final logic successfully');
} else {
    console.log('could not match regexToReplace');
}
