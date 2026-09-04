import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update edit modal initialization for kod
old_edit_modal_init_ib = """                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || '');
                        setIsEditModalOpen(true);
                    }} """

new_edit_modal_init_ib = """                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKeluarga') || 'KELUARGA123');
                        setIsEditModalOpen(true);
                    }} """
content = content.replace(old_edit_modal_init_ib, new_edit_modal_init_ib)

old_edit_modal_init_guru = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || '');
                        setIsEditModalOpen(true);
                    }} """

new_edit_modal_init_guru = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }} """
content = content.replace(old_edit_modal_init_guru, new_edit_modal_init_guru)


# 2. Update saving in edit modal
old_edit_save = """                        onClick={() => {
                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            localStorage.setItem('bunyiKataKodKelas', editKodTemp);
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');
                            let kodGuru = document.getElementById('guru-dashboard-kod-kelas-title');
                            if (kodGuru) kodGuru.innerText = editKodTemp || '-';
                            let kodIbu = document.getElementById('ibubapa-kod-keluarga-title');
                            if (kodIbu) kodIbu.innerText = editKodTemp || '-';"""

new_edit_save = """                        onClick={() => {
                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');
                            let kodGuru = document.getElementById('guru-dashboard-kod-kelas-title');
                            let kodIbu = document.getElementById('ibubapa-kod-keluarga-title');
                            
                            if ((window as any).modIbuBapaAktif) {
                                localStorage.setItem('bunyiKataKodKeluarga', editKodTemp);
                                if (kodIbu) kodIbu.innerText = editKodTemp || 'KELUARGA123';
                            } else {
                                localStorage.setItem('bunyiKataKodKelas', editKodTemp);
                                if (kodGuru) kodGuru.innerText = editKodTemp || 'KELAS123';
                            }"""
content = content.replace(old_edit_save, new_edit_save)


# 3. Update the code modal validation
old_code_validate = """                                onClick={() => {
                                    if(joinCode.trim()) {
                                        alert('Kod berjaya disahkan. (Sistem Demo)');
                                        setIsCodeModalOpen(false);
                                        if (typeof (window as any).masukModMurid === 'function') {
                                            (window as any).masukModMurid();
                                        }
                                    }
                                }}"""

new_code_validate = """                                onClick={() => {
                                    if(joinCode.trim()) {
                                        const kodKeluarga = localStorage.getItem('bunyiKataKodKeluarga') || 'KELUARGA123';
                                        const kodKelas = localStorage.getItem('bunyiKataKodKelas') || 'KELAS123';
                                        
                                        if (joinCode.trim().toUpperCase() === kodKeluarga.toUpperCase() || joinCode.trim().toUpperCase() === kodKelas.toUpperCase()) {
                                            alert('Kod berjaya disahkan!');
                                            setIsCodeModalOpen(false);
                                            if (typeof (window as any).masukModMurid === 'function') {
                                                (window as any).masukModMurid();
                                            }
                                        } else {
                                            alert('Kod tidak sah. Sila pastikan kod adalah betul.');
                                        }
                                    }
                                }}"""
content = content.replace(old_code_validate, new_code_validate)


with open('src/App.tsx', 'w') as f:
    f.write(content)
