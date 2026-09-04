import re

with open("src/App.tsx", "r") as f:
    content = f.read()

login_old = """                                        if (joinCode.trim().toUpperCase() === kodKelas.toUpperCase() || joinCode.trim().toUpperCase() === kodKeluarga.toUpperCase()) {
                                            alert('Kod berjaya disahkan!');
                                            setIsCodeModalOpen(false);
                                            const modal = document.getElementById('modal-pilih-anak');
                                            if (modal) {
                                                modal.style.display = 'flex';
                                                if (typeof (window as any).bukaModalPilihAnak === 'function') {
                                                    (window as any).bukaModalPilihAnak(false, true);
                                                }
                                            }
                                        }"""

login_new = """                                        if (joinCode.trim().toUpperCase() === kodKelas.toUpperCase()) {
                                            alert('Kod berjaya disahkan!');
                                            setIsCodeModalOpen(false);
                                            const modal = document.getElementById('modal-pilih-anak');
                                            if (modal) {
                                                modal.style.display = 'flex';
                                                if (typeof (window as any).bukaModalPilihAnak === 'function') {
                                                    (window as any).bukaModalPilihAnak(false, true); // isStudentLogin
                                                }
                                            }
                                        } else if (joinCode.trim().toUpperCase() === kodKeluarga.toUpperCase()) {
                                            alert('Kod berjaya disahkan!');
                                            setIsCodeModalOpen(false);
                                            const modal = document.getElementById('modal-pilih-anak');
                                            if (modal) {
                                                modal.style.display = 'flex';
                                                if (typeof (window as any).bukaModalPilihAnak === 'function') {
                                                    (window as any).bukaModalPilihAnak(false, false); // normal mode (Mod Ibu Bapa)
                                                }
                                            }
                                        }"""

if login_old in content:
    content = content.replace(login_old, login_new)
    print("Patched App.tsx login logic 3")
else:
    print("Could not find login logic block")

with open("src/App.tsx", "w") as f:
    f.write(content)
