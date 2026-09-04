const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `            // Update 3D Stars state & animations
            [1, 2, 3].forEach((starNum, index) => {
                const starEl = document.querySelector(\`.ganjaran-star-\${starNum}\`);
                if (starEl) {
                    const active = starNum <= numStars;
                    const pathMain = starEl.querySelector('.star-path-main');
                    if (pathMain) {
                        pathMain.setAttribute('fill', active ? \`url(#starGold_gc_\${starNum})\` : \`url(#starGray_gc_\${starNum})\`);
                    }
                    starEl.style.filter = active
                        ? 'drop-shadow(0px 7px 0px #b45309) drop-shadow(0px 10px 16px rgba(245, 158, 11, 0.45))'
                        : 'drop-shadow(0px 5px 0px #475569) drop-shadow(0px 5px 8px rgba(0,0,0,0.15))';
                    starEl.style.animation = 'none';
                    void starEl.offsetWidth;
                    starEl.style.animation = \`starDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) \${index * 0.15 + 0.1}s both\`;
                }
            });`;

const replacement = `            // Update 3D Stars state & animations
            const starCountEl = document.getElementById('ganjaran-celebration-star-count');
            if (starCountEl) {
                starCountEl.innerText = numStars.toString();
            }
            const starIconEl = document.querySelector('.ganjaran-star-single');
            if (starIconEl) {
                starIconEl.style.animation = 'none';
                void starIconEl.offsetWidth;
                starIconEl.style.animation = 'starDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both';
            }`;

code = code.replace(target, replacement);
fs.writeFileSync('public/app-logic.js', code);
