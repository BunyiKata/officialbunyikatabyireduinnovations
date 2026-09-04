import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Update Add Child Modal
old_tambah = """                    btnTambah.onclick = () => {
                        const overlay = document.createElement('div');
                        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);';
                        
                        const modalBox = document.createElement('div');
                        modalBox.className = 'neo-box bg-white';
                        modalBox.style.cssText = 'width: 90%; max-width: 400px; padding: 25px; border-radius: 20px; text-align: center; position: relative;';
                        
                        modalBox.innerHTML = `
                            <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--color-dark); font-weight: bold;">Tambah Profil Anak</h3>
                            <input type="text" id="new-child-name" class="neo-input century-gothic-font" placeholder="Nama Panggilan" style="width: 100%; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 1.1rem; text-align: center;" />
                            
                            <p style="font-size: 1rem; font-weight: bold; margin-bottom: 10px; color: #475569;">Pilih Watak</p>
                            <div id="new-child-avatars" style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px;">
                                <div class="avatar-option" data-src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #168f81; cursor: pointer; overflow: hidden; background: #e0f2fe; padding: 5px; box-sizing: border-box;"><img src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 100%; height: 100%; object-fit: contain;" /></div>
                                <div class="avatar-option" data-src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid transparent; cursor: pointer; overflow: hidden; background: #e0f2fe; padding: 5px; box-sizing: border-box;"><img src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 100%; height: 100%; object-fit: contain;" /></div>
                            </div>
                            
                            <div style="display: flex; gap: 10px;">
                                <button id="btn-cancel-add" class="neo-btn bg-red" style="flex: 1; padding: 12px; font-size: 1.1rem;"><i class="fa-solid fa-xmark"></i> Batal</button>
                                <button id="btn-confirm-add" class="neo-btn bg-green" style="flex: 1; padding: 12px; font-size: 1.1rem;"><i class="fa-solid fa-check"></i> Simpan</button>
                            </div>
                        `;"""

new_tambah = """                    btnTambah.onclick = () => {
                        const overlay = document.createElement('div');
                        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);';
                        
                        const modalBox = document.createElement('div');
                        modalBox.className = 'neo-box bg-white';
                        modalBox.style.cssText = 'width: 90%; max-width: 400px; padding: 0; border-radius: 20px; text-align: center; position: relative; overflow: hidden;';
                        
                        modalBox.innerHTML = `
                            <div style="background-color: #168f81; color: white; padding: 15px; font-size: 1.3rem; font-weight: bold; border-bottom: 2px solid var(--color-dark);">
                                TAMBAH PROFIL ANAK
                            </div>
                            <div style="padding: 25px; background-color: #fdfbf7; background-image: radial-gradient(#cbd5e1 2px, transparent 2px); background-size: 20px 20px;">
                                <p style="font-size: 1rem; font-weight: bold; margin-bottom: 15px; color: #475569;">Masukkan nama dan pilih watak:</p>
                                <input type="text" id="new-child-name" class="neo-input century-gothic-font" placeholder="Nama Panggilan" style="width: 100%; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 1.1rem; text-align: center; border: 2px solid var(--color-dark);" />
                                
                                <div id="new-child-avatars" style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap;">
                                    <div class="avatar-option" data-src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 110px; border-radius: 16px; border: 4px solid #168f81; cursor: pointer; background: var(--color-orange); padding: 10px; box-sizing: border-box; transform: scale(1.05); transition: all 0.2s ease; display: flex; justify-content: center; align-items: center;"><img src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" /></div>
                                    <div class="avatar-option" data-src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 110px; border-radius: 16px; border: 3px solid #cbd5e1; cursor: pointer; background: white; padding: 10px; box-sizing: border-box; transform: scale(1); transition: all 0.2s ease; display: flex; justify-content: center; align-items: center;"><img src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" /></div>
                                </div>
                                
                                <div style="display: flex; gap: 10px;">
                                    <button id="btn-cancel-add" class="neo-btn bg-red" style="flex: 1; padding: 12px; font-size: 1.1rem;"><i class="fa-solid fa-xmark"></i> Batal</button>
                                    <button id="btn-confirm-add" class="neo-btn bg-green" style="flex: 1; padding: 12px; font-size: 1.1rem;"><i class="fa-solid fa-check"></i> Simpan</button>
                                </div>
                            </div>
                        `;"""

content = content.replace(old_tambah, new_tambah)


# Update child button rendering to remove circle and use plain avatar
old_anak_render = """                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid #0284c7; background: #e0f2fe; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: cover;" /></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;"""

new_anak_render = """                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: contain;" /></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;"""

content = content.replace(old_anak_render, new_anak_render)

# Update avatar selection styling logic inside the popup
old_avatar_select = """                        const opts = modalBox.querySelectorAll('.avatar-option');
                        opts.forEach(opt => {
                            opt.onclick = () => {
                                opts.forEach(o => o.style.borderColor = 'transparent');
                                opt.style.borderColor = '#168f81';
                                selectedAvatar = opt.getAttribute('data-src');
                            };
                        });"""

new_avatar_select = """                        const opts = modalBox.querySelectorAll('.avatar-option');
                        opts.forEach(opt => {
                            opt.onclick = () => {
                                opts.forEach(o => {
                                    o.style.borderColor = '#cbd5e1';
                                    o.style.background = 'white';
                                    o.style.transform = 'scale(1)';
                                });
                                opt.style.borderColor = '#168f81';
                                opt.style.background = 'var(--color-orange)';
                                opt.style.transform = 'scale(1.05)';
                                selectedAvatar = opt.getAttribute('data-src');
                            };
                        });"""
                        
content = content.replace(old_avatar_select, new_avatar_select)

# Add Delete profile logic
padam_func = """
        window.padamProfilAnakIbuBapa = function() {
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
        };
"""

content = content + padam_func

with open('public/app-logic.js', 'w') as f:
    f.write(content)
