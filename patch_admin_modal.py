with open("public/app-logic.js", "r") as f:
    content = f.read()

# Replace showAppModalAlert and showAdminInfo
old_code = """        window.showAppModalAlert = function(title, contentHtml) {
            let overlay = document.getElementById('app-custom-alert-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'app-custom-alert-overlay';
                overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; padding:15px;';
                document.body.appendChild(overlay);
            }
            overlay.innerHTML = `
                <div class="neo-box" style="background:white; max-width:400px; width:100%; padding:20px; border-radius:18px; border:3px solid var(--color-dark); text-align:center; box-shadow:4px 4px 0 var(--color-dark);">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #e2e8f0; padding-bottom:10px; margin-bottom:15px;">
                        <h4 style="margin:0; font-weight:bold; color:var(--color-dark); font-size:1.05rem;"><i class="fa-solid fa-circle-info" style="color:#0284c7;"></i> ${title}</h4>
                        <button id="app-alert-close-x" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:#64748b;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="margin-bottom:20px;">${contentHtml}</div>
                    <button id="app-alert-close" class="neo-btn bg-white" style="width:100%; padding:8px; font-weight:bold; border-radius:10px; border:2px solid var(--color-dark); cursor:pointer;">Tutup</button>
                </div>
            `;
            overlay.style.display = 'flex';
            document.getElementById('app-alert-close-x').onclick = () => { overlay.style.display = 'none'; };
            document.getElementById('app-alert-close').onclick = () => { overlay.style.display = 'none'; };
        };

        window.showAdminInfo = function(type, nama, extra) {
            let title = "";
            let contentHtml = "";
            if (type === 'guru') {
                title = "Maklumat Guru";
                const email = `${nama.toLowerCase().replace(/[^a-z0-9]/g, '')}@moe.edu.my`;
                const code = `KELAS${Math.floor(Math.random() * 900 + 100)}`;
                contentHtml = `
                    <div style="text-align:left; display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Nama Guru:</strong><br/><span style="font-weight:bold; color:var(--color-dark);">${nama}</span></div>
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Emel:</strong><br/><span style="color:#0284c7; font-weight:bold;">${email}</span></div>
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Kata Laluan:</strong><br/><span style="font-family:monospace; background:#e2e8f0; padding:2px 8px; border-radius:6px; font-weight:bold;">••••••••</span></div>
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Kod Kelas:</strong><br/><span style="background:#fef3c7; color:#b45309; border:1px solid #d97706; padding:2px 8px; border-radius:6px; font-weight:bold;">${code}</span></div>
                    </div>
                `;
            } else {
                title = "Maklumat Ibu Bapa";
                const email = `${nama.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
                contentHtml = `
                    <div style="text-align:left; display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Nama Ibu Bapa:</strong><br/><span style="font-weight:bold; color:var(--color-dark);">${nama}</span></div>
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Emel:</strong><br/><span style="color:#0284c7; font-weight:bold;">${email}</span></div>
                        <div><strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase;">Kata Laluan:</strong><br/><span style="font-family:monospace; background:#e2e8f0; padding:2px 8px; border-radius:6px; font-weight:bold;">••••••••</span></div>
                    </div>
                `;
            }
            window.showAppModalAlert(title, contentHtml);
        };"""

new_code = """        window.toggleAdminPasswordVisibility = function() {
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
        };

        window.showAppModalAlert = function(title, contentHtml) {
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
        };

        window.showAdminInfo = function(type, nama, extra) {
            let title = "";
            let contentHtml = "";
            const cleanSlug = nama.toLowerCase().replace(/[^a-z0-9]/g, '');
            const realPass = `${cleanSlug}123`;
            
            if (type === 'guru') {
                title = "Maklumat Guru";
                const email = `${cleanSlug}@moe.edu.my`;
                const code = `KELAS${Math.floor(Math.random() * 900 + 100)}`;
                contentHtml = `
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:0.9rem;">
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">NAMA GURU:</strong><br/>
                            <span style="font-weight:bold; color:var(--color-dark); font-size:1rem;">${nama}</span>
                        </div>
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">EMEL:</strong><br/>
                            <span style="color:#0284c7; font-weight:bold;">${email}</span>
                        </div>
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">KATA LALUAN:</strong><br/>
                            <div style="display:inline-flex; align-items:center; gap:8px; margin-top:4px;">
                                <span id="admin-pass-display" data-real="${realPass}" data-masked="••••••••" style="font-family:monospace; background:#e2e8f0; padding:4px 10px; border-radius:8px; font-weight:bold; font-size:0.95rem; color:#1e293b; border:1.5px solid #cbd5e1;">••••••••</span>
                                <button id="admin-pass-toggle-btn" type="button" onclick="window.toggleAdminPasswordVisibility()" class="neo-btn" style="background:white; border:1.5px solid var(--color-dark); border-radius:8px; padding:4px 10px; font-size:0.8rem; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:1.5px 1.5px 0 var(--color-dark); color:#334155;">
                                    <i id="admin-pass-toggle-icon" class="fa-solid fa-eye"></i> <span id="admin-pass-toggle-text">Papar</span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">KOD KELAS:</strong><br/>
                            <span style="background:#fef3c7; color:#b45309; border:1.5px solid #d97706; padding:3px 10px; border-radius:8px; font-weight:bold; display:inline-block; margin-top:3px;">${code}</span>
                        </div>
                    </div>
                `;
            } else {
                title = "Maklumat Ibu Bapa";
                const email = `${cleanSlug}@gmail.com`;
                contentHtml = `
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:0.9rem;">
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">NAMA IBU BAPA:</strong><br/>
                            <span style="font-weight:bold; color:var(--color-dark); font-size:1rem;">${nama}</span>
                        </div>
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">EMEL:</strong><br/>
                            <span style="color:#0284c7; font-weight:bold;">${email}</span>
                        </div>
                        <div>
                            <strong style="color:#64748b; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px;">KATA LALUAN:</strong><br/>
                            <div style="display:inline-flex; align-items:center; gap:8px; margin-top:4px;">
                                <span id="admin-pass-display" data-real="${realPass}" data-masked="••••••••" style="font-family:monospace; background:#e2e8f0; padding:4px 10px; border-radius:8px; font-weight:bold; font-size:0.95rem; color:#1e293b; border:1.5px solid #cbd5e1;">••••••••</span>
                                <button id="admin-pass-toggle-btn" type="button" onclick="window.toggleAdminPasswordVisibility()" class="neo-btn" style="background:white; border:1.5px solid var(--color-dark); border-radius:8px; padding:4px 10px; font-size:0.8rem; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:1.5px 1.5px 0 var(--color-dark); color:#334155;">
                                    <i id="admin-pass-toggle-icon" class="fa-solid fa-eye"></i> <span id="admin-pass-toggle-text">Papar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }
            window.showAppModalAlert(title, contentHtml);
        };"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Successfully replaced admin modal code")
else:
    print("ERROR: old_code not found")

with open("public/app-logic.js", "w") as f:
    f.write(content)

