with open("public/app.js", "r") as f:
    js = f.read()

import re

old_render = r"""            Object\.entries\(badgeNames\)\.forEach\(\(\[key, info\]\) => \{
                const hasBadge = \(data\.badges \|\| \[\]\)\.includes\(key\);
                
                if \(!hasBadge\) \{
                    htmlIncomplete \+= `<div class="neo-box" style="padding: 12px 18px; display: flex; align-items: center; gap: 15px; background: white; border: 2px solid var\(--color-dark\); box-shadow: 2px 3px 0 var\(--color-dark\); margin-bottom: 10px;">
                        <div style="font-size: 1\.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 50%; color: var\(--color-dark\);"><i class="fa-solid \$\{info\[1\]\}"></i></div>
                        <div style="flex: 1; text-align: left;">
                            <h4 style="margin: 0; font-size: 1rem; color: var\(--color-dark\);">\$\{info\[0\]\}</h4>
                            <div style="font-size: 0\.85rem; color: #64748b;">\$\{info\[3\]\}</div>
                        </div>
                        <div style="color: #ef4444; font-size: 1\.2rem;"><i class="fa-solid fa-circle-xmark"></i></div>
                    </div>`;
                \} else \{
                    earnedCount\+\+;
                \}

                const bgClass = hasBadge \? info\[2\] : 'bg-gray';
                const opacityClass = hasBadge \? '' : 'opacity: 0\.6; filter: grayscale\(100%\);';
                const lockIcon = hasBadge \? '' : '<div style="position: absolute; top: 10px; right: 10px; font-size: 1\.5rem; color: var\(--color-dark\);"><i class="fa-solid fa-lock"></i></div>';
                
                htmlBadges \+= `<div class="neo-box badge-board-card \$\{bgClass\}" style="position: relative; \$\{opacityClass\}">
                            \$\{lockIcon\}
                            <i class="fa-solid \$\{info\[1\]\}"></i>
                            <h3>\$\{info\[0\]\}</h3>
                            <p>\$\{info\[3\]\}</p>
                        </div>`;
            \}\);"""

new_render = """            Object.entries(badgeNames).forEach(([key, info]) => {
                const hasBadge = (data.badges || []).includes(key);
                let markah = (data.scores && data.scores[key]) ? data.scores[key] : 0;
                
                let starsEarned = 0;
                if(hasBadge) starsEarned = 3;
                else if (markah >= 50) starsEarned = 2;
                else if (markah > 0) starsEarned = 1;
                
                let starsHTML = `<div style="display:flex; gap:2px; font-size:0.75rem; color:#cbd5e1;">`;
                for(let i=0; i<3; i++) {
                    starsHTML += `<i class="fa-solid fa-star ${i < starsEarned ? 'earned' : ''}" style="${i < starsEarned ? 'color:#ffc107; filter:drop-shadow(0 0 2px rgba(255,193,7,0.5));' : ''}"></i>`;
                }
                starsHTML += `</div>`;
                
                let markahHTML = `<div style="font-size:0.75rem; font-weight:bold; color:var(--color-dark); display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-coins" style="color:gold;"></i> ${markah}</div>`;
                
                if (!hasBadge) {
                    htmlIncomplete += `<div class="neo-box" style="padding: 10px 12px; display: flex; align-items: center; gap: 8px; background: white; border: 2px solid var(--color-dark); box-shadow: 2px 2px 0 var(--color-dark);">
                        <div style="font-size: 1.2rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 50%; color: var(--color-dark); flex-shrink:0;"><i class="fa-solid ${info[1]}"></i></div>
                        <div style="flex: 1; text-align: left; overflow:hidden;">
                            <h4 style="margin: 0; font-size: 0.85rem; color: var(--color-dark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${info[0]}</h4>
                            <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                                ${starsHTML}
                                ${markahHTML}
                            </div>
                        </div>
                        <div style="color: #ef4444; font-size: 1.1rem; flex-shrink:0;"><i class="fa-solid fa-circle-xmark"></i></div>
                    </div>`;
                } else {
                    earnedCount++;
                }

                const bgClass = hasBadge ? info[2] : 'bg-gray';
                const opacityClass = hasBadge ? '' : 'opacity: 0.6; filter: grayscale(100%);';
                const lockIcon = hasBadge ? '' : '<div style="position: absolute; top: 10px; right: 10px; font-size: 1.5rem; color: var(--color-dark);"><i class="fa-solid fa-lock"></i></div>';
                
                htmlBadges += `<div class="neo-box badge-board-card ${bgClass}" style="position: relative; ${opacityClass}">
                            ${lockIcon}
                            <i class="fa-solid ${info[1]}"></i>
                            <h3>${info[0]}</h3>
                            <p>${info[3]}</p>
                            <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px; background:rgba(255,255,255,0.2); padding:4px 8px; border-radius:12px;">
                                ${starsHTML}
                                ${markahHTML}
                            </div>
                        </div>`;
            });"""

if re.search(old_render, js):
    js = re.sub(old_render, new_render, js)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched app.js successfully via regex")
else:
    print("Could not find old_render via regex. Searching without regex...")
    
