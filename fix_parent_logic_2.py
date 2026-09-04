import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Update window.bukaModalPilihAnak to use parentChildNames and limit to 3 children
old_buka = """        window.bukaModalPilihAnak = function() {
            const modal = document.getElementById('modal-pilih-anak');
            if (!modal) return;
            const container = document.getElementById('ibubapa-profiles-container');
            if (container) {
                container.innerHTML = '';
                
                const baseNames = window.studentNames || defaultStudentNames || [];
                const childNames = baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak");
                
                // Add "Profil Ibu Bapa" button
                const btnIbuBapa = document.createElement('button');
                btnIbuBapa.className = 'neo-btn bg-white';
                btnIbuBapa.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                btnIbuBapa.innerHTML = '<div style="font-size: 2rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center;">Profil<br/>Ibu Bapa</span>';
                btnIbuBapa.onclick = () => {
                    window.tutupModalPilihAnak();
                    window.masukModIbuBapa("Profil Ibu Bapa");
                };
                container.appendChild(btnIbuBapa);

                // Add child buttons
                childNames.forEach(name => {
                    const btnAnak = document.createElement('button');
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnAnak.innerHTML = `<div style="font-size: 2rem; color: #f59e0b; margin-bottom: 8px;"><i class="fa-solid fa-child"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word;">${name}</span>`;
                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        window.masukModMurid(name);
                    };
                    container.appendChild(btnAnak);
                });

                // Add "+ Tambah Profil Anak" button
                const btnTambah = document.createElement('button');
                btnTambah.className = 'neo-btn bg-white';
                btnTambah.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1; border: 2px dashed #0284c7; box-shadow: none;';
                btnTambah.innerHTML = '<div style="font-size: 1.5rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-plus"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; color: #0284c7;">Tambah<br/>Anak</span>';
                btnTambah.onclick = () => {
                    const newName = prompt("Sila masukkan nama profil anak baharu:");
                    if (newName && newName.trim()) {
                        const finalName = newName.trim();
                        if (window.studentNames && !window.studentNames.includes(finalName)) {
                            window.studentNames.push(finalName);
                        } else if (!window.studentNames) {
                            window.studentNames = [finalName];
                        }
                        
                        if (typeof studentData !== 'undefined') {
                            if(!studentData[finalName]) {
                                studentData[finalName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png' };
                            }
                        }
                        if (typeof saveStudentData === 'function') saveStudentData();
                        
                        window.bukaModalPilihAnak();
                    } else {
                        alert("Nama profil tidak sah.");
                    }
                };
                container.appendChild(btnTambah);
            }
            modal.style.display = 'flex';
        };"""

new_buka = """        window.bukaModalPilihAnak = function() {
            const modal = document.getElementById('modal-pilih-anak');
            if (!modal) return;
            const container = document.getElementById('ibubapa-profiles-container');
            if (container) {
                container.innerHTML = '';
                
                const childNames = window.parentChildNames || defaultParentChildNames || [];
                
                // Add "Profil Ibu Bapa" button
                const btnIbuBapa = document.createElement('button');
                btnIbuBapa.className = 'neo-btn bg-white';
                btnIbuBapa.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                btnIbuBapa.innerHTML = '<div style="font-size: 2rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center;">Profil<br/>Ibu Bapa</span>';
                btnIbuBapa.onclick = () => {
                    window.tutupModalPilihAnak();
                    window.masukModIbuBapa("Profil Ibu Bapa");
                };
                container.appendChild(btnIbuBapa);

                // Add child buttons
                childNames.forEach(name => {
                    const btnAnak = document.createElement('button');
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnAnak.innerHTML = `<div style="font-size: 2rem; color: #f59e0b; margin-bottom: 8px;"><i class="fa-solid fa-child"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word;">${name}</span>`;
                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        window.masukModMurid(name);
                    };
                    container.appendChild(btnAnak);
                });

                // Add "+ Tambah Profil Anak" button ONLY IF < 3 children
                if (childNames.length < 3) {
                    const btnTambah = document.createElement('button');
                    btnTambah.className = 'neo-btn bg-white';
                    btnTambah.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1; border: 2px dashed #0284c7; box-shadow: none;';
                    btnTambah.innerHTML = '<div style="font-size: 1.5rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-plus"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; color: #0284c7;">Tambah<br/>Anak</span>';
                    btnTambah.onclick = () => {
                        const newName = prompt("Sila masukkan nama profil anak baharu:");
                        if (newName && newName.trim()) {
                            const finalName = newName.trim();
                            if (window.parentChildNames && !window.parentChildNames.includes(finalName)) {
                                window.parentChildNames.push(finalName);
                            } else if (!window.parentChildNames) {
                                window.parentChildNames = [finalName];
                            }
                            
                            if (typeof studentData !== 'undefined') {
                                if(!studentData[finalName]) {
                                    studentData[finalName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png' };
                                }
                            }
                            if (typeof saveStudentData === 'function') saveStudentData();
                            
                            window.bukaModalPilihAnak();
                        } else {
                            alert("Nama profil tidak sah.");
                        }
                    };
                    container.appendChild(btnTambah);
                }
            }
            modal.style.display = 'flex';
        };"""

content = content.replace(old_buka, new_buka)


old_ibu_masuk = """        window.masukModIbuBapa = function(namaAnak) {
            const baseNames = window.studentNames || defaultStudentNames || [];
            const childNames = baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak");
            
            if (namaAnak === "Profil Ibu Bapa") {
                window.anakTerpilih = childNames.length > 0 ? childNames[0] : '';
            } else {
                window.anakTerpilih = namaAnak || (childNames.length > 0 ? childNames[0] : '');
            }"""

new_ibu_masuk = """        window.masukModIbuBapa = function(namaAnak) {
            const childNames = window.parentChildNames || defaultParentChildNames || [];
            
            if (namaAnak === "Profil Ibu Bapa") {
                window.anakTerpilih = childNames.length > 0 ? childNames[0] : '';
            } else {
                window.anakTerpilih = namaAnak || (childNames.length > 0 ? childNames[0] : '');
            }"""

content = content.replace(old_ibu_masuk, new_ibu_masuk)


old_render_parent = """        window.renderParentDashboard = function() {
            const baseNames = window.studentNames || defaultStudentNames || [];
            const childNames = baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak");
            
            if (!window.anakTerpilih && childNames.length > 0) {
                window.anakTerpilih = childNames[0];
            }"""

new_render_parent = """        window.renderParentDashboard = function() {
            const childNames = window.parentChildNames || defaultParentChildNames || [];
            
            if (!window.anakTerpilih && childNames.length > 0) {
                window.anakTerpilih = childNames[0];
            }"""

content = content.replace(old_render_parent, new_render_parent)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
