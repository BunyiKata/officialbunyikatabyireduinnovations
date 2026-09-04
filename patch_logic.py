import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

# 1. Update `bukaModalPilihAnak` to add delete button to child buttons
child_loop_old = """                childNames.forEach(name => {
                    const btnAnak = document.createElement('button');
                    const childData = (typeof studentData !== 'undefined' && studentData[name]) ? studentData[name] : null;
                    const avatarSrc = (childData && childData.avatar) ? childData.avatar : 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                    
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 85px; height: 85px; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" /></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;
                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        if (isTukarDashboard) {
                            if (window.tukarAnakIbuBapa) window.tukarAnakIbuBapa(name);
                        } else {
                            window.masukModMurid(name);
                        }
                    };
                    container.appendChild(btnAnak);
                });"""

child_loop_new = """                window.__isTukarDashboardTemp = isTukarDashboard;
                childNames.forEach(name => {
                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = 'position: relative; width: 100%; aspect-ratio: 1;';
                    
                    const btnAnak = document.createElement('button');
                    const childData = (typeof studentData !== 'undefined' && studentData[name]) ? studentData[name] : null;
                    const avatarSrc = (childData && childData.avatar) ? childData.avatar : 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                    
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; height: 100%;';
                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 85px; height: 85px; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" /></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;
                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        if (isTukarDashboard) {
                            if (window.tukarAnakIbuBapa) window.tukarAnakIbuBapa(name);
                        } else {
                            window.masukModMurid(name);
                        }
                    };
                    
                    const btnPadam = document.createElement('button');
                    btnPadam.className = 'neo-btn bg-white';
                    btnPadam.style.cssText = 'position: absolute; top: -10px; right: -10px; background: #ef4444; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; z-index: 10; cursor: pointer; box-shadow: 2px 2px 0 var(--color-dark);';
                    btnPadam.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    btnPadam.onclick = (e) => {
                        e.stopPropagation();
                        if (window.padamProfilAnakIbuBapa) {
                            window.padamProfilAnakIbuBapa(name);
                        }
                    };
                    
                    wrapper.appendChild(btnAnak);
                    wrapper.appendChild(btnPadam);
                    container.appendChild(wrapper);
                });"""
                
content = content.replace(child_loop_old, child_loop_new)

# 2. Update padamProfilAnakIbuBapa
padam_old = """        window.padamProfilAnakIbuBapa = function() {
            const childName = window.anakTerpilih;
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
                
                // set to first available or empty
                const names = window.parentChildNames || [];
                window.anakTerpilih = names.length > 0 ? names[0] : '';
                localStorage.setItem('ibubapaAnakTerpilih', window.anakTerpilih);
                
                window.renderParentDashboard();
            }
        };"""
        
padam_new = """        window.padamProfilAnakIbuBapa = function(namaAnak) {
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
        
content = content.replace(padam_old, padam_new)

with open("public/app-logic.js", "w") as f:
    f.write(content)
print("Updated public/app-logic.js")
