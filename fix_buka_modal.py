import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_buka = """        window.bukaModalPilihAnak = function() {
            const modal = document.getElementById('modal-pilih-anak');
            if (!modal) return;
            const select = document.getElementById('ibubapa-child-select');
            if (select) {
                select.innerHTML = '';
                const baseNames = window.studentNames || defaultStudentNames || [];
                const names = ["Profil Ibu Bapa", ...baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak"), "+ Tambah Profil Anak"];
                names.forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (window.anakTerpilih && name === window.anakTerpilih) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });
                if (!window.anakTerpilih && names.length > 0) {
                    window.anakTerpilih = names[0];
                }
            }
            modal.style.display = 'flex';
        };"""

new_buka = """        window.bukaModalPilihAnak = function() {
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
                        window.bukaModalPilihAnak();
                    } else {
                        alert("Nama profil tidak sah.");
                    }
                };
                container.appendChild(btnTambah);
            }
            modal.style.display = 'flex';
        };"""

content = content.replace(old_buka, new_buka)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
