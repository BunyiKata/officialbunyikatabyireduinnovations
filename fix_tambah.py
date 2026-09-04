with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_tambah = """                    btnTambah.onclick = () => {
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
                    };"""

new_tambah = """                    btnTambah.onclick = () => {
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
                        `;
                        
                        overlay.appendChild(modalBox);
                        document.body.appendChild(overlay);
                        
                        let selectedAvatar = 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                        
                        const opts = modalBox.querySelectorAll('.avatar-option');
                        opts.forEach(opt => {
                            opt.onclick = () => {
                                opts.forEach(o => o.style.borderColor = 'transparent');
                                opt.style.borderColor = '#168f81';
                                selectedAvatar = opt.getAttribute('data-src');
                            };
                        });
                        
                        document.getElementById('btn-cancel-add').onclick = () => {
                            document.body.removeChild(overlay);
                        };
                        
                        document.getElementById('btn-confirm-add').onclick = () => {
                            const newName = document.getElementById('new-child-name').value;
                            if (newName && newName.trim()) {
                                const finalName = newName.trim();
                                if (window.parentChildNames && !window.parentChildNames.includes(finalName)) {
                                    window.parentChildNames.push(finalName);
                                } else if (!window.parentChildNames) {
                                    window.parentChildNames = [finalName];
                                }
                                
                                if (typeof studentData !== 'undefined') {
                                    if(!studentData[finalName]) {
                                        studentData[finalName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1 };
                                    }
                                    studentData[finalName].avatar = selectedAvatar;
                                }
                                if (typeof saveStudentData === 'function') saveStudentData();
                                
                                document.body.removeChild(overlay);
                                window.bukaModalPilihAnak();
                            } else {
                                alert("Sila masukkan nama profil yang sah.");
                            }
                        };
                    };"""

content = content.replace(old_tambah, new_tambah)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
