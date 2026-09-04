import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# 1 & 2. Fix Tambah Profil Anak UI
old_tambah_ui = """                            <div style="padding: 25px; background-color: #fdfbf7; background-image: radial-gradient(#cbd5e1 2px, transparent 2px); background-size: 20px 20px;">
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
                            </div>"""

new_tambah_ui = """                            <div style="padding: 25px; background-color: #fefce8; background-image: radial-gradient(#cbd5e1 2px, transparent 2px); background-size: 20px 20px;">
                                <p style="font-size: 1rem; font-weight: bold; margin-bottom: 15px; color: #475569;">Masukkan nama dan pilih watak:</p>
                                <input type="text" id="new-child-name" class="neo-input century-gothic-font" placeholder="Nama Panggilan" style="width: 100%; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-size: 1.1rem; text-align: center; border: 2px solid var(--color-dark);" />
                                
                                <div id="new-child-avatars" style="display: flex; gap: 15px; justify-content: center; margin-bottom: 25px; flex-wrap: wrap;">
                                    <div class="avatar-option" data-src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 110px; border-radius: 16px; border: 4px solid #168f81; cursor: pointer; background: var(--color-orange); padding: 10px; box-sizing: border-box; transform: scale(1.05); transition: all 0.2s ease; display: flex; justify-content: center; align-items: center;"><img src="https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" /></div>
                                    <div class="avatar-option" data-src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 110px; border-radius: 16px; border: 3px solid #cbd5e1; cursor: pointer; background: white; padding: 10px; box-sizing: border-box; transform: scale(1); transition: all 0.2s ease; display: flex; justify-content: center; align-items: center;"><img src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" /></div>
                                </div>
                                
                                <div style="display: flex; gap: 10px;">
                                    <button id="btn-cancel-add" class="neo-btn bg-red" style="flex: 1; padding: 12px; font-size: 1.1rem;"><i class="fa-solid fa-xmark"></i> Batal</button>
                                    <button id="btn-confirm-add" class="neo-btn" style="flex: 1; padding: 12px; font-size: 1.1rem; background-color: #168f81; color: white;"><i class="fa-solid fa-check"></i> Simpan</button>
                                </div>
                            </div>"""

content = content.replace(old_tambah_ui, new_tambah_ui)

# 3. Avatar sizes in Parent popup
old_anak_render = """                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: contain;" /></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;"""
new_anak_render = """                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 85px; height: 85px; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" /></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;"""
content = content.replace(old_anak_render, new_anak_render)

# "Profil Ibu Bapa" icon and text size update to match
old_ibu_btn = """                btnIbuBapa.innerHTML = '<div style="font-size: 2rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center;">Profil<br/>Ibu Bapa</span>';"""
new_ibu_btn = """                btnIbuBapa.innerHTML = '<div style="font-size: 3rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-user-tie"></i></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; font-weight: bold;">Profil<br/>Ibu Bapa</span>';"""
content = content.replace(old_ibu_btn, new_ibu_btn)

old_tambah_btn = """                if (childNames.length < 3) {
                    const btnTambah = document.createElement('button');
                    btnTambah.className = 'neo-btn bg-white';
                    btnTambah.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1; border: 2px dashed #0284c7; box-shadow: none;';
                    btnTambah.innerHTML = '<div style="font-size: 1.5rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-plus"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; color: #0284c7;">Tambah<br/>Anak</span>';"""
                    
new_tambah_btn = """                if (childNames.length < 3) {
                    const btnTambah = document.createElement('button');
                    btnTambah.className = 'neo-btn bg-white';
                    btnTambah.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1; border: 2px dashed #0284c7; box-shadow: none;';
                    btnTambah.innerHTML = '<div style="font-size: 2.5rem; color: #0284c7; margin-bottom: 8px;"><i class="fa-solid fa-plus"></i></div><span style="font-size: 0.95rem; line-height: 1.2; text-align: center; color: #0284c7; font-weight: bold;">Tambah<br/>Anak</span>';"""
content = content.replace(old_tambah_btn, new_tambah_btn)


with open('public/app-logic.js', 'w') as f:
    f.write(content)
