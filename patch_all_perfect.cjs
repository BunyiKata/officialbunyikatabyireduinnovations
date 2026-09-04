const fs = require('fs');

let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// 1. Clean up Burung Patuk Ayat unused button listeners
logic = logic.replace(/const upBtn = document\.getElementById\('bpa-btn-up'\);[\s\S]*?downBtn\.onpointerdown = function \(e\) \{ e\.preventDefault\(\); diveBird\(\); \};[\s\S]*?\}/, '');

// 2. Patch Lastik Burung:
// A. Target array with pop state
logic = logic.replace(
    /let targets = \[\s*\{\s*text:\s*choices\[0\],\s*x:\s*260,\s*y:\s*65,\s*w:\s*72,\s*h:\s*36,\s*hit:\s*false\s*\},[\s\S]*?\{\s*text:\s*choices\[2\],\s*x:\s*260,\s*y:\s*185,\s*w:\s*72,\s*h:\s*36,\s*hit:\s*false\s*\}\s*\];/,
    `let targets = [
        { text: choices[0], x: 260, y: 65, w: 72, h: 36, hit: false, popScale: 1.0, popGlow: 0, isPopping: false },
        { text: choices[1], x: 260, y: 125, w: 72, h: 36, hit: false, popScale: 1.0, popGlow: 0, isPopping: false },
        { text: choices[2], x: 260, y: 185, w: 72, h: 36, hit: false, popScale: 1.0, popGlow: 0, isPopping: false }
    ];
    let lbParticles = [];

    function spawnLbPopParticles(px, py, isCorrect) {
        const colors = isCorrect ? ['#10b981', '#34d399', '#fbbf24', '#ffffff'] : ['#f87171', '#ef4444', '#f59e0b'];
        for (let i = 0; i < 14; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 2.0 + Math.random() * 4.0;
            lbParticles.push({
                x: px,
                y: py,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                r: 2.5 + Math.random() * 3.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 22
            });
        }
    }`
);

// B. Lastik Burung Collision with Pop effect
logic = logic.replace(
    /if \(!t\.hit && bird\.x \+ bird\.r > t\.x - t\.w\/2 &&[\s\S]*?t\.hit = true;\s*bird\.isFlying = false;/,
    `if (!t.hit && bird.x + bird.r > t.x - t.w/2 && bird.x - bird.r < t.x + t.w/2 &&
                    bird.y + bird.r > t.y - t.h/2 && bird.y - bird.r < t.y + t.h/2) {
                    t.hit = true;
                    t.isPopping = true;
                    t.popScale = 1.36;
                    bird.isFlying = false;

                    const isCorrect = t.text.toLowerCase() === q.target.toLowerCase();
                    spawnLbPopParticles(t.x, t.y, isCorrect);
                    if (isCorrect) t.popGlow = 1;`
);

// C. Reset target isPopping on wrong hit reset
logic = logic.replace(
    /bird\.vy = 0;\s*t\.hit = false;\s*\}\s*\}, 700\);/,
    `bird.vy = 0;
                                t.hit = false;
                                t.isPopping = false;
                                t.popScale = 1.0;
                            }
                        }, 700);`
);

// D. Lastik Burung Target Drawing: Pop animation & particles
logic = logic.replace(
    /\/\/ Draw Target Crates\s*targets\.forEach\(t => \{[\s\S]*?ctx\.restore\(\);\s*\}\);/,
    `// Draw Target Crates with Pop Animation Effect
        targets.forEach(t => {
            ctx.save();
            if (t.isPopping) {
                t.popScale += (1.1 - t.popScale) * 0.15;
            } else {
                t.popScale += (1.0 - t.popScale) * 0.2;
            }

            ctx.translate(t.x, t.y);
            ctx.scale(t.popScale, t.popScale);

            if (t.isPopping && t.popGlow > 0) {
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 16;
            }

            ctx.fillStyle = t.hit ? (t.popGlow > 0 ? '#dcfce7' : '#fecaca') : '#fed7aa';
            ctx.beginPath();
            ctx.roundRect(-t.w / 2, -t.h / 2, t.w, t.h, 10);
            ctx.fill();
            ctx.strokeStyle = t.hit ? (t.popGlow > 0 ? '#10b981' : '#ef4444') : '#1e293b';
            ctx.lineWidth = t.hit ? 3 : 2.5;
            ctx.stroke();

            ctx.font = '900 13px "AtlantaRoundedBlack", "AtlantaRounded", sans-serif';
            ctx.fillStyle = t.hit ? (t.popGlow > 0 ? '#065f46' : '#991b1b') : '#1e293b';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(t.text, 0, 1);
            ctx.restore();
        });

        // Draw Pop Particles
        if (typeof lbParticles !== 'undefined') {
            lbParticles = lbParticles.filter(p => p.life > 0);
            lbParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15;
                p.life--;
                ctx.save();
                ctx.globalAlpha = p.life / 22;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }`
);

// 3. Patch Meriam Kata:
// A. Remove blue button and add demo cursor
logic = logic.replace(
    /<!-- Canvas Game Wrap -->\s*<div style="position:relative; width:100%; max-width:340px; margin:0 auto 6px auto;">\s*<canvas id="mk-canvas"[\s\S]*?<!-- Fire Button -->\s*<button type="button" onclick="window\.mkFireCannon\(\)"[\s\S]*?<\/button>\s*<\/div>/,
    `<!-- Canvas Game Wrap with Animated Hand Cursor Demo (No blue button) -->
        <div style="position:relative; width:100%; max-width:340px; margin:0 auto 6px auto;">
            <style>
                @keyframes mkAimAndTap {
                    0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 0; }
                    15% { transform: translate(-50%, -50%) translate(0px, 0px) scale(0.92); opacity: 1; }
                    50% { transform: translate(-50%, -50%) translate(-40px, -70px) scale(0.92); opacity: 1; }
                    65% { transform: translate(-50%, -50%) translate(-40px, -70px) scale(0.78); opacity: 1; }
                    80% { transform: translate(-50%, -50%) translate(-40px, -70px) scale(1); opacity: 0; }
                    100% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 0; }
                }
            </style>
            <canvas id="mk-canvas" width="340" height="260" style="width:100%; max-width:340px; aspect-ratio:340/260; border-radius:18px; border:3px solid #1e293b; box-shadow:0 4px 0 #1e293b; background:#cffafe; display:block; margin:0 auto; user-select:none; touch-action:none; cursor:crosshair;"></canvas>
            
            <!-- Animated Hand Cursor (Exact Same Design as Lastik Burung) -->
            <div id="mk-cursor-demo" style="position:absolute; inset:0; pointer-events:none; z-index:20;">
                <div style="position:absolute; left:170px; top:220px; animation:mkAimAndTap 2.4s infinite ease-in-out;">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style="display:block; filter:drop-shadow(0 3px 5px rgba(16,24,47,0.35));">
                        <circle cx="8" cy="5" r="3.5" stroke="#0284c7" stroke-width="2" opacity="0.85" />
                        <circle cx="8" cy="5" r="5.5" stroke="#38bdf8" stroke-width="1.5" opacity="0.55" />
                        <path d="M9 11V4.5C9 3.67 8.33 3 7.5 3C6.67 3 6 3.67 6 4.5V12.5L4.85 11.27C4.33 10.74 3.49 10.74 2.97 11.27C2.45 11.8 2.45 12.64 2.97 13.17L7.6 17.8C8.5 18.7 9.7 19.2 11 19.2H14.5C16.99 19.2 19 17.19 19 14.7V10.5C19 9.67 18.33 9 17.5 9C17.3 9 17.1 9.04 16.92 9.12C16.66 8.46 16.03 8 15.28 8C15.05 8 14.83 8.05 14.63 8.15C14.33 7.46 13.65 7 12.85 7C12.65 7 12.45 7.04 12.27 7.12C12.01 6.46 11.38 6 10.63 6C9.73 6 9 6.73 9 7.63V11Z" fill="#ffffff" stroke="#10182f" stroke-width="1.8" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    </div>`
);

// B. AimAt hides cursor demo
logic = logic.replace(
    /function aimAt\(pos\) \{\s*cannon\.angle = Math\.atan2\(pos\.y - cannon\.y, pos\.x - cannon\.x\);/,
    `function aimAt(pos) {
        const demo = document.getElementById('mk-cursor-demo');
        if (demo) demo.style.display = 'none';
        cannon.angle = Math.atan2(pos.y - cannon.y, pos.x - cannon.x);`
);

// C. Remove audio on answer hit
logic = logic.replace(
    /if \(window\.triggerConfettiEffect\) window\.triggerConfettiEffect\(\);\s*sebutTeksPermainan\(q\.audio\);/g,
    'if (window.triggerConfettiEffect) window.triggerConfettiEffect();'
);

fs.writeFileSync('public/app-logic.js', logic);
console.log('public/app-logic.js fully updated!');
