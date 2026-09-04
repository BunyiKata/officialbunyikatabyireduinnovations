import re

with open("public/app.js", "r") as f:
    js = f.read()

old_code = r"""                let starsHTML = `<div style="display:flex; gap:2px; font-size:0\.75rem; color:#cbd5e1;">`;
                for\(let i=0; i<3; i\+\+\) \{
                    starsHTML \+= `<i class="fa-solid fa-star \$\{i < starsEarned \? 'earned' : ''\}" style="\$\{i < starsEarned \? 'color:#ffc107; filter:drop-shadow\(0 0 2px rgba\(255,193,7,0\.5\)\);' : ''\}"></i>`;
                \}
                starsHTML \+= `</div>`;
                
                let markahHTML = `<div style="font-size:0\.75rem; font-weight:bold; color:var\(--color-dark\); display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-coins" style="color:gold;"></i> \$\{markah\}</div>`;
                
                if \(!hasBadge\) \{
                    htmlIncomplete \+= `<div class="neo-box" style="padding: 10px 12px; display: flex; align-items: center; gap: 8px; background: white; border: 2px solid var\(--color-dark\); box-shadow: 2px 2px 0 var\(--color-dark\);">
                        <div style="font-size: 1\.2rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 50%; color: var\(--color-dark\); flex-shrink:0;"><i class="fa-solid \$\{info\[1\]\}"></i></div>
                        <div style="flex: 1; text-align: left; overflow:hidden;">
                            <h4 style="margin: 0; font-size: 0\.85rem; color: var\(--color-dark\); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\$\{info\[0\]\}</h4>
                            <div style="display:flex; align-items:center; gap:8px; margin-top:2px;">
                                \$\{starsHTML\}
                                \$\{markahHTML\}
                            </div>
                        </div>
                        <div style="color: #ef4444; font-size: 1\.1rem; flex-shrink:0;"><i class="fa-solid fa-circle-xmark"></i></div>
                    </div>`;"""

new_code = """                let starsHTML = `<div style="display:flex; gap:2px; font-size:0.65rem; color:#cbd5e1;">`;
                for(let i=0; i<3; i++) {
                    starsHTML += `<i class="fa-solid fa-star ${i < starsEarned ? 'earned' : ''}" style="${i < starsEarned ? 'color:#ffc107; filter:drop-shadow(0 0 2px rgba(255,193,7,0.5));' : ''}"></i>`;
                }
                starsHTML += `</div>`;
                
                let markahHTML = `<div style="font-size:0.7rem; font-weight:bold; color:var(--color-dark); display:flex; align-items:center; gap:3px;"><i class="fa-solid fa-coins" style="color:gold;"></i> ${markah}</div>`;
                
                if (!hasBadge) {
                    htmlIncomplete += `<div class="neo-box" style="padding: 8px 10px; display: flex; align-items: center; gap: 6px; background: white; border: 2px solid var(--color-dark); box-shadow: 1px 2px 0 var(--color-dark);">
                        <div style="font-size: 1rem; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: #e2e8f0; border-radius: 50%; color: var(--color-dark); flex-shrink:0;"><i class="fa-solid ${info[1]}"></i></div>
                        <div style="flex: 1; text-align: left; overflow:hidden;">
                            <h4 style="margin: 0; font-size: 0.75rem; color: var(--color-dark); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${info[0]}">${info[0]}</h4>
                            <div style="display:flex; align-items:center; gap:6px; margin-top:2px; flex-wrap: wrap;">
                                ${starsHTML}
                                ${markahHTML}
                            </div>
                        </div>
                        <div style="color: #ef4444; font-size: 1rem; flex-shrink:0;"><i class="fa-solid fa-circle-xmark"></i></div>
                    </div>`;"""

if re.search(old_code, js):
    js = re.sub(old_code, new_code, js)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched inc card successfully")
else:
    print("Failed to patch inc card - pattern not found")
