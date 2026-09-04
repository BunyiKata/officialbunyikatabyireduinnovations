import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

# Replace the beginning of bukaModalPilihAnak
buka_start = """        window.bukaModalPilihAnak = function(isTukarDashboard = false) {
            const modal = document.getElementById('modal-pilih-anak');
            if (!modal) return;
            
            const titleMain = modal.querySelector('.modal-title-main');
            const titleSub = modal.querySelector('p');
            if (isTukarDashboard) {
                if (titleMain) titleMain.textContent = 'Tukar Profil Anak';
                if (titleSub) titleSub.textContent = 'Pilih profil anak untuk paparan dashboard';
            } else {
                if (titleMain) titleMain.textContent = 'Mod Ibu Bapa';
                if (titleSub) titleSub.textContent = 'Pilih profil anak anda untuk melihat statistik & laporan';
            }
            
            const container = document.getElementById('ibubapa-profiles-container');
            if (container) {
                container.innerHTML = '';
                
                const childNames = window.parentChildNames || defaultParentChildNames || [];
                
                if (!isTukarDashboard) {"""

buka_start_new = """        window.bukaModalPilihAnak = function(isTukarDashboard = false, isStudentLogin = false) {
            const modal = document.getElementById('modal-pilih-anak');
            if (!modal) return;
            
            const titleMain = modal.querySelector('.modal-title-main');
            const titleSub = modal.querySelector('p');
            if (isStudentLogin) {
                if (titleMain) titleMain.textContent = 'Pilih Profil Murid';
                if (titleSub) titleSub.textContent = 'Sila pilih nama anda untuk memulakan latihan';
            } else if (isTukarDashboard) {
                if (titleMain) titleMain.textContent = 'Tukar Profil Anak';
                if (titleSub) titleSub.textContent = 'Pilih profil anak untuk paparan dashboard';
            } else {
                if (titleMain) titleMain.textContent = 'Mod Ibu Bapa';
                if (titleSub) titleSub.textContent = 'Pilih profil anak anda untuk melihat statistik & laporan';
            }
            
            const container = document.getElementById('ibubapa-profiles-container');
            if (container) {
                container.innerHTML = '';
                
                const childNames = window.parentChildNames || defaultParentChildNames || [];
                
                if (!isTukarDashboard && !isStudentLogin) {"""

content = content.replace(buka_start, buka_start_new)

# Find where the delete button is added and conditionally hide it if isStudentLogin is true
delete_old = """                    const btnPadam = document.createElement('button');
                    btnPadam.className = 'neo-btn bg-white';
                    btnPadam.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 !important; margin: 0; font-size: 1rem; z-index: 10; cursor: pointer; box-shadow: 2px 2px 0 var(--color-dark); aspect-ratio: 1;';
                    btnPadam.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    btnPadam.onclick = (e) => {
                        e.stopPropagation();
                        if (window.padamProfilAnakIbuBapa) {
                            window.padamProfilAnakIbuBapa(name);
                        }
                    };
                    
                    wrapper.appendChild(btnAnak);
                    wrapper.appendChild(btnPadam);
                    container.appendChild(wrapper);"""

delete_new = """                    
                    wrapper.appendChild(btnAnak);
                    if (!isStudentLogin) {
                        const btnPadam = document.createElement('button');
                        btnPadam.className = 'neo-btn bg-white';
                        btnPadam.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 !important; margin: 0; font-size: 1rem; z-index: 10; cursor: pointer; box-shadow: 2px 2px 0 var(--color-dark); aspect-ratio: 1;';
                        btnPadam.innerHTML = '<i class="fa-solid fa-trash"></i>';
                        btnPadam.onclick = (e) => {
                            e.stopPropagation();
                            if (window.padamProfilAnakIbuBapa) {
                                window.padamProfilAnakIbuBapa(name);
                            }
                        };
                        wrapper.appendChild(btnPadam);
                    }
                    container.appendChild(wrapper);"""
                    
content = content.replace(delete_old, delete_new)

# also conditionally hide the 'tambah anak' button
tambah_old = """                if (!isTukarDashboard) {
                    const btnTambah = document.createElement('button');"""
tambah_new = """                if (!isTukarDashboard && !isStudentLogin) {
                    const btnTambah = document.createElement('button');"""
content = content.replace(tambah_old, tambah_new)

with open("public/app-logic.js", "w") as f:
    f.write(content)
