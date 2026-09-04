import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

def patch_buka_modal():
    global content
    # Find the start of window.bukaModalPilihAnak
    start_idx = content.find("window.bukaModalPilihAnak = function(isTukarDashboard = false) {")
    if start_idx == -1:
        print("Could not find window.bukaModalPilihAnak")
        return
        
    end_idx = content.find("window.__isTukarDashboardTemp = isTukarDashboard;", start_idx)
    if end_idx == -1:
        print("Could not find window.__isTukarDashboardTemp = isTukarDashboard;")
        return
        
    old_block = content[start_idx:end_idx + len("window.__isTukarDashboardTemp = isTukarDashboard;")]
    
    new_block = """window.bukaModalPilihAnak = function(isTukarDashboard = false) {
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
                
                if (!isTukarDashboard) {
                    // Add "Profil Ibu Bapa" button
                    const btnIbuBapa = document.createElement('button');
                    btnIbuBapa.className = 'neo-btn bg-white';
                    btnIbuBapa.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnIbuBapa.innerHTML = '<div style="font-size: 3rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; font-weight: bold;">Profil<br/>Ibu Bapa</span>';
                    btnIbuBapa.onclick = () => {
                        window.tutupModalPilihAnak();
                        window.masukModIbuBapa("Profil Ibu Bapa");
                    };
                    container.appendChild(btnIbuBapa);
                }

                window.__isTukarDashboardTemp = isTukarDashboard;"""
                
    content = content.replace(old_block, new_block)
    print("Patched bukaModalPilihAnak")

def patch_delete_button():
    global content
    old_str = "btnPadam.style.cssText = 'position: absolute; top: -10px; right: -10px; background: #ef4444; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; z-index: 10; cursor: pointer; box-shadow: 2px 2px 0 var(--color-dark);';"
    new_str = "btnPadam.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 0 !important; margin: 0; font-size: 1rem; z-index: 10; cursor: pointer; box-shadow: 2px 2px 0 var(--color-dark); aspect-ratio: 1;';"
    if old_str in content:
        content = content.replace(old_str, new_str)
        print("Patched delete button")
    else:
        print("Could not find old delete button string")

patch_buka_modal()
patch_delete_button()

with open("public/app-logic.js", "w") as f:
    f.write(content)
