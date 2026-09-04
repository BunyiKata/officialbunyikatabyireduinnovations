import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

# 1. Add modal helper functions at top
modal_helpers = """
        window.showAppModalConfirm = function(message, onConfirm) {
            let overlay = document.getElementById('app-custom-confirm-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'app-custom-confirm-overlay';
                overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; display:flex; align-items:center; justify-content:center; padding:15px;';
                document.body.appendChild(overlay);
            }
            overlay.innerHTML = `
                <div class="neo-box" style="background:white; max-width:400px; width:100%; padding:20px; border-radius:18px; border:3px solid var(--color-dark); text-align:center; box-shadow:4px 4px 0 var(--color-dark);">
                    <div style="font-size:2.5rem; color:#ef4444; margin-bottom:10px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div style="font-weight:bold; font-size:0.95rem; color:var(--color-dark); margin-bottom:20px; line-height:1.4;">${message}</div>
                    <div style="display:flex; justify-content:center; gap:12px;">
                        <button id="app-confirm-cancel" class="neo-btn bg-white" style="padding:8px 18px; font-weight:bold; border-radius:10px; border:2px solid var(--color-dark); cursor:pointer;">Batal</button>
                        <button id="app-confirm-yes" class="neo-btn bg-red" style="padding:8px 18px; font-weight:bold; border-radius:10px; border:2px solid var(--color-dark); color:white; cursor:pointer;">Ya, Teruskan</button>
                    </div>
                </div>
            `;
            overlay.style.display = 'flex';
            document.getElementById('app-confirm-cancel').onclick = () => { overlay.style.display = 'none'; };
            document.getElementById('app-confirm-yes').onclick = () => {
                overlay.style.display = 'none';
                if (typeof onConfirm === 'function') onConfirm();
            };
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
"""

# Replace showAdminInfo
show_admin_old = """        window.showAdminInfo = function(type, nama, extra) {
            let info = "";
            if (type === 'guru') {
                info = `Maklumat Guru:\\n\\nNama: ${nama}\\nEmel: ${nama.toLowerCase().replace(/\\s/g, '')}@moe.edu.my\\nKata Laluan: ********\\nKod Kelas: KELAS${Math.floor(Math.random() * 900 + 100)}`;
            } else {
                info = `Maklumat Ibu Bapa:\\n\\nNama: ${nama}\\nEmel: ${nama.toLowerCase().replace(/\\s/g, '')}@gmail.com\\nKata Laluan: ********`;
            }
            alert(info);
        };"""

show_admin_new = """        window.showAdminInfo = function(type, nama, extra) {
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

if show_admin_old in content:
    content = content.replace(show_admin_old, show_admin_new)
    print("Replaced showAdminInfo")

# Prepend modal helpers to file
content = modal_helpers + content

# Sync window variables at initialization
sync_old = """var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));"""
sync_new = """var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));
        window.studentNames = studentNames;
        window.parentChildNames = parentChildNames;
        window.studentData = studentData;"""

if sync_old in content:
    content = content.replace(sync_old, sync_new)
    print("Added global window vars sync")

# Replace resetProgresMurid
reset_old = """        window.resetProgresMurid = function(nama) {
            if(confirm('Adakah anda pasti ingin menetapkan semula progres (markah & lencana) untuk murid: ' + nama + '?')) {
                if(studentData[nama]) {
                    studentData[nama] = {
                        belajar: { kad: false, cerita: false, surih: false, kotak: false },
                        latihan: {
                            surihHuruf: false, padanan: false, dragdrop: false,
                            belon: false, puzzle: false, carikata: false,
                            tarikgaris: false, kuizaudio: false, susunkata: false
                        },
                        scores: {
                            surihHuruf: 0, padanan: 0, dragdrop: 0,
                            belon: 0, puzzle: 0, carikata: 0,
                            tarikgaris: 0, kuizaudio: 0, susunkata: 0
                        },
                        badges: []
                    };
                    saveStudentData();
                    renderTeacherTable();
                    alert('Progres murid ' + nama + ' telah di-reset.');
                }
            }
        };"""

reset_new = """        window.resetProgresMurid = function(nama) {
            if (!nama) return;
            window.showAppModalConfirm(
                `Adakah anda pasti untuk reset progres (markah & lencana) untuk murid "${nama}"?`,
                function() {
                    if (studentData[nama]) {
                        studentData[nama] = {
                            ...studentData[nama],
                            belajar: { kad: false, cerita: false, surih: false, kotak: false, perpustakaan: false },
                            latihan: {
                                surihHuruf: false, padanan: false, dragdrop: false,
                                belon: false, puzzle: false, carikata: false,
                                tarikgaris: false, kuizaudio: false, susunkata: false,
                                tandukKata: false
                            },
                            scores: {
                                kad: 0, cerita: 0, surih: 0, kotak: 0, perpustakaan: 0,
                                surihHuruf: 0, padanan: 0, dragdrop: 0,
                                belon: 0, puzzle: 0, carikata: 0,
                                tarikgaris: 0, kuizaudio: 0, susunkata: 0,
                                tandukKata: 0, bonusHarian: 0
                            },
                            badges: [],
                            history: []
                        };
                        if (window.studentData) window.studentData[nama] = studentData[nama];
                        saveStudentData();
                        if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
                    }
                }
            );
        };"""

if reset_old in content:
    content = content.replace(reset_old, reset_new)
    print("Replaced resetProgresMurid")

# Replace padamMurid
padam_m_old = """        window.padamMurid = function(nama) {
            if (!confirm(`Adakah anda pasti untuk memadam murid "${nama}" daripada senarai?`)) return;
            studentNames = studentNames.filter(n => n !== nama);
            delete studentData[nama];
            saveStudentData();
            renderSenaraiMuridUrus();
            updateStudentDropdown();
            if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
        };"""

padam_m_new = """        window.padamMurid = function(nama) {
            if (!nama) return;
            window.showAppModalConfirm(
                `Adakah anda pasti untuk memadam data murid "${nama}" daripada senarai?`,
                function() {
                    studentNames = studentNames.filter(n => n !== nama);
                    window.studentNames = studentNames;
                    if (studentData[nama]) delete studentData[nama];
                    if (window.studentData && window.studentData[nama]) delete window.studentData[nama];
                    saveStudentData();
                    renderSenaraiMuridUrus();
                    updateStudentDropdown();
                    if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
                }
            );
        };"""

if padam_m_old in content:
    content = content.replace(padam_m_old, padam_m_new)
    print("Replaced padamMurid")

# Replace padamProfilAnakIbuBapa
padam_p_old = """        window.padamProfilAnakIbuBapa = function(namaAnak) {
            const childName = namaAnak || window.anakTerpilih;
            if (!childName || childName === 'Murid') return;
            
            if (confirm(`Adakah anda pasti untuk memadam profil anak "` + childName + `"?`)) {
                if (window.parentChildNames) {
                    window.parentChildNames = window.parentChildNames.filter(n => n !== childName);
                    localStorage.setItem('bunyiKataParentChildNames', JSON.stringify(window.parentChildNames));
                }
                if (window.studentData && window.studentData[childName]) {
                    delete window.studentData[childName];
                    localStorage.setItem('bunyiKataStudentData', JSON.stringify(window.studentData));
                }
                
                // set to first available or empty if currently selected is deleted
                if (window.anakTerpilih === childName) {
                    const names = window.parentChildNames || [];
                    window.anakTerpilih = names.length > 0 ? names[0] : '';
                    localStorage.setItem('ibubapaAnakTerpilih', window.anakTerpilih);
                    if (window.renderParentDashboard) window.renderParentDashboard();
                }
                
                // Also update the modal if it's open
                const modal = document.getElementById('modal-pilih-anak');
                if (modal && modal.style.display !== 'none' && window.bukaModalPilihAnak) {
                    window.bukaModalPilihAnak(window.__isTukarDashboardTemp);
                }
            }
        };"""

padam_p_new = """        window.padamProfilAnakIbuBapa = function(namaAnak) {
            const childName = namaAnak || window.anakTerpilih;
            if (!childName || childName === 'Murid') return;
            
            window.showAppModalConfirm(
                `Adakah anda pasti untuk memadam profil anak "${childName}"?`,
                function() {
                    parentChildNames = parentChildNames.filter(n => n !== childName);
                    window.parentChildNames = parentChildNames;
                    if (studentData[childName]) delete studentData[childName];
                    if (window.studentData && window.studentData[childName]) delete window.studentData[childName];
                    saveStudentData();
                    
                    if (window.anakTerpilih === childName) {
                        window.anakTerpilih = parentChildNames.length > 0 ? parentChildNames[0] : '';
                        localStorage.setItem('ibubapaAnakTerpilih', window.anakTerpilih);
                        if (window.renderParentDashboard) window.renderParentDashboard();
                    }
                    
                    const modal = document.getElementById('modal-pilih-anak');
                    if (modal && modal.style.display !== 'none' && window.bukaModalPilihAnak) {
                        window.bukaModalPilihAnak(window.__isTukarDashboardTemp);
                    }
                }
            );
        };"""

if padam_p_old in content:
    content = content.replace(padam_p_old, padam_p_new)
    print("Replaced padamProfilAnakIbuBapa")

with open("public/app-logic.js", "w") as f:
    f.write(content)

