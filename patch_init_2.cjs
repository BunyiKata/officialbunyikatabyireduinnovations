const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const regex = /else if \(id === 'suku_kata_kvk_kv_kvk'\) typeText = "KVK \+ KV \+ KVK";\s*typeEl\.innerText = typeText;\s*\}\s*if \(data && data\.flashcards\) \{/g;

const newInit = `else if (id === 'suku_kata_kvk_kv_kvk') typeText = "KVK + KV + KVK";
                
                const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
                if (isNumberModule) {
                    typeText = "NOMBOR";
                }
                typeEl.innerText = typeText;
            }
            
            const leftTitleEl = document.getElementById('sukukata-left-title');
            if (leftTitleEl) {
                const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
                leftTitleEl.innerText = isNumberModule ? "BILANGAN" : "Suku Kata";
            }
            
            if (data && data.flashcards) {`;

code = code.replace(regex, newInit);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched init');
