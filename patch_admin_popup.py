with open("public/app-logic.js", "r") as f:
    content = f.read()

# 1. Update toggleAdminPasswordVisibility
old_toggle = """        window.toggleAdminPasswordVisibility = function() {
            const disp = document.getElementById('admin-pass-display');
            const icon = document.getElementById('admin-pass-toggle-icon');
            const text = document.getElementById('admin-pass-toggle-text');
            if (!disp) return;
            const realPass = disp.getAttribute('data-real') || '';
            const maskedPass = disp.getAttribute('data-masked') || '••••••••';
            const isMasked = disp.innerText === maskedPass;
            if (isMasked) {
                disp.innerText = realPass;
                if (icon) icon.className = 'fa-solid fa-eye-slash';
                if (text) text.innerText = 'Sembunyi';
            } else {
                disp.innerText = maskedPass;
                if (icon) icon.className = 'fa-solid fa-eye';
                if (text) text.innerText = 'Papar';
            }
        };"""

new_toggle = """        window.toggleAdminPasswordVisibility = function() {
            const disp = document.getElementById('admin-pass-display');
            const icon = document.getElementById('admin-pass-toggle-icon');
            if (!disp) return;
            const realPass = disp.getAttribute('data-real') || '';
            const maskedPass = disp.getAttribute('data-masked') || '••••••••';
            const isMasked = disp.innerText === maskedPass;
            if (isMasked) {
                disp.innerText = realPass;
                if (icon) icon.className = 'fa-solid fa-eye-slash';
            } else {
                disp.innerText = maskedPass;
                if (icon) icon.className = 'fa-solid fa-eye';
            }
        };"""

if old_toggle in content:
    content = content.replace(old_toggle, new_toggle)
    print("Updated toggleAdminPasswordVisibility")

# 2. Update showAppModalAlert
old_alert = """        window.showAppModalAlert = function(title, contentHtml) {
            let overlay = document.getElementById('app-custom-alert-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'app-custom-alert-overlay';
                overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; padding:15px;';
                document.body.appendChild(overlay);
            }
            overlay.innerHTML = `
                <div class="neo-box" style="background-color:#fffdf0; background-image:radial-gradient(#cbd5e1 1.5px, transparent 1.5px); background-size:14px 14px; max-width:400px; width:100%; border-radius:18px; border:3px solid var(--color-dark); text-align:center; box-shadow:4px 4px 0 var(--color-dark); overflow:hidden;">
                    <div style="background-color:#168f81; color:white; padding:12px 18px; display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid var(--color-dark);">
                        <h4 style="margin:0; font-weight:bold; color:white; font-size:1.1rem; display:flex; align-items:center; gap:8px;"><i class="fa-solid fa-circle-info" style="color:white; font-size:1.15rem;"></i> ${title}</h4>
                        <button id="app-alert-close-x" style="background:none; border:none; font-size:1.3rem; cursor:pointer; color:white; display:flex; align-items:center; justify-content:center; padding:0; line-height:1;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="padding:20px; text-align:left;">
                        <div style="margin-bottom:20px;">${contentHtml}</div>
                        <button id="app-alert-close" class="neo-btn" style="width:100%; padding:10px; font-weight:bold; border-radius:12px; border:2.5px solid var(--color-dark); background-color:#168f81; color:white; cursor:pointer; box-shadow:2.5px 2.5px 0 var(--color-dark); font-size:0.95rem;">Tutup</button>
                    </div>
                </div>
            `;
            overlay.style.display = 'flex';
            document.getElementById('app-alert-close-x').onclick = () => { overlay.style.display = 'none'; };
            document.getElementById('app-alert-close').onclick = () => { overlay.style.display = 'none'; };
        };"""

new_alert = """        window.showAppModalAlert = function(title, contentHtml) {
            let overlay = document.getElementById('app-custom-alert-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'app-custom-alert-overlay';
                overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; padding:15px;';
                document.body.appendChild(overlay);
            }
            overlay.innerHTML = `
                <div class="neo-box" style="background-color:#fef9ec; background-image:radial-gradient(circle, rgba(16, 24, 47, .12) 1.5px, transparent 1.5px); background-size:15px 15px; max-width:380px; width:90%; padding:28px 20px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:center; box-shadow:4px 4px 0 var(--color-dark); position:relative;">
                    <button id="app-alert-close-x" class="neo-btn bg-red" style="position:absolute; top:10px; right:10px; width:36px; height:36px; min-width:36px; min-height:36px; padding:0; display:flex; align-items:center; justify-content:center; z-index:10; cursor:pointer; border-radius:10px;" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
                    
                    <div style="text-align:center; margin-bottom:18px;">
                        <div class="neo-btn" style="background-color:#168f81; color:white; font-size:clamp(1.05rem, 4vw, 1.25rem); margin:0 auto; white-space:normal; display:inline-block; pointer-events:none; padding:8px 22px; line-height:1.2; font-weight:bold;">${title}</div>
                    </div>

                    <div style="text-align:left; margin-bottom:20px;">${contentHtml}</div>

                    <button id="app-alert-close" class="neo-btn" style="width:100%; padding:10px; font-weight:bold; border-radius:12px; border:2.5px solid var(--color-dark); background-color:#168f81; color:white; cursor:pointer; box-shadow:2.5px 2.5px 0 var(--color-dark); font-size:0.95rem;">Tutup</button>
                </div>
            `;
            overlay.style.display = 'flex';
            document.getElementById('app-alert-close-x').onclick = () => { overlay.style.display = 'none'; };
            document.getElementById('app-alert-close').onclick = () => { overlay.style.display = 'none'; };
        };"""

if old_alert in content:
    content = content.replace(old_alert, new_alert)
    print("Updated showAppModalAlert")

# 3. Update showAdminInfo password toggle buttons
old_toggle_btn = """                                <button id="admin-pass-toggle-btn" type="button" onclick="window.toggleAdminPasswordVisibility()" class="neo-btn" style="background:white; border:1.5px solid var(--color-dark); border-radius:8px; padding:4px 10px; font-size:0.8rem; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:1.5px 1.5px 0 var(--color-dark); color:#334155;">
                                    <i id="admin-pass-toggle-icon" class="fa-solid fa-eye"></i> <span id="admin-pass-toggle-text">Papar</span>
                                </button>"""

new_toggle_btn = """                                <button id="admin-pass-toggle-btn" type="button" onclick="window.toggleAdminPasswordVisibility()" class="neo-btn bg-white" style="border:2px solid var(--color-dark); border-radius:8px; width:34px; height:34px; min-width:34px; min-height:34px; padding:0; font-size:0.9rem; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; box-shadow:1.5px 1.5px 0 var(--color-dark); color:#334155;" title="Papar / Sembunyi Kata Laluan">
                                    <i id="admin-pass-toggle-icon" class="fa-solid fa-eye"></i>
                                </button>"""

if old_toggle_btn in content:
    content = content.replace(old_toggle_btn, new_toggle_btn)
    print("Updated showAdminInfo toggle buttons")

with open("public/app-logic.js", "w") as f:
    f.write(content)

