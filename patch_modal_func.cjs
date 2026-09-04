const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const newFunc = `window.bukaModalSenaraiSukuKata = function() {
            const grid = document.getElementById('senarai-sukukata-grid');
            if(!grid) return;
            grid.innerHTML = '';
            
            const isNumberModule = ['bilang_0_10', 'bilang_siri_nombor', 'konsep_tambah', 'konsep_penolakan'].includes(currentModuleId);
            
            const titleEl = document.getElementById('senarai-sukukata-title');
            if (titleEl) {
                titleEl.innerText = isNumberModule ? "Senarai Nombor" : "Senarai Perkataan";
            }
            
            activeFlashcards.forEach((item, index) => {
                const btn = document.createElement('div');
                btn.className = 'neo-box';
                btn.style.cssText = 'background: #e0f2fe; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; text-align: center; gap: 10px; transition: transform 0.2s; border-radius: 15px; border: 3px solid var(--color-dark); box-shadow: 4px 4px 0px rgba(0,0,0,0.1);';
                btn.onclick = () => {
                    currentFlashcardIndex = index;
                    renderBelajarSukuKata();
                    tutupModalSenaraiSukuKata();
                };
                btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
                btn.onmouseout = () => btn.style.transform = 'scale(1)';
                
                if (isNumberModule) {
                    const textEl = document.createElement('div');
                    textEl.style.fontWeight = '900';
                    textEl.style.fontSize = '3.5rem';
                    textEl.style.color = 'var(--color-dark)';
                    textEl.style.lineHeight = '1';
                    textEl.innerText = item.back || item.front;
                    btn.appendChild(textEl);
                } else {
                    const iconEl = document.createElement('div');
                    iconEl.style.fontSize = '3rem';
                    iconEl.style.lineHeight = '1';
                    iconEl.innerHTML = item.icon ? item.icon : '<img referrerpolicy="no-referrer" src="https://i.postimg.cc/TPbGvTHW/Copy-of-BUNYI-KATA-APPS.png" style="width: 50px; height: 50px; object-fit: contain;" alt="Icon"/>';
                    
                    const textEl = document.createElement('div');
                    textEl.style.fontWeight = 'bold';
                    textEl.style.fontSize = '1.2rem';
                    textEl.style.color = 'var(--color-dark)';
                    textEl.innerText = item.front;
                    
                    btn.appendChild(iconEl);
                    btn.appendChild(textEl);
                }
                grid.appendChild(btn);
            });
            
            const modal = document.getElementById('modal-senarai-sukukata');
            if(modal) modal.style.display = 'flex';
        };`;

const oldRegex = /window\.bukaModalSenaraiSukuKata = function\(\) \{[\s\S]*?if\(modal\) modal\.style\.display = 'flex';\s*\};/m;

if(code.match(oldRegex)) {
    code = code.replace(oldRegex, newFunc);
    fs.writeFileSync('public/app-logic.js', code);
    console.log('patched modal function');
} else {
    console.log('not found');
}
