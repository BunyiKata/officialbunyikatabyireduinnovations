import re

with open("src/App.tsx", "r") as f:
    content = f.read()

stray_block = """                <div style={{"textAlign":"right"}}>
                    <button 
                        onClick={(e) => { 
                            setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                            setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                            setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                            setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                            setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                            setIsEditModalOpen(true);
                        }} 
                        style={{"background":"rgba(255,255,255,0.3)","border":"2px solid var(--color-dark)","borderRadius":"10px","padding":"6px 10px","color":"white","cursor":"pointer","boxShadow":"1px 1px 0 var(--color-dark)","fontWeight":"bold","fontSize":"1.2rem"}}
                        title="Edit Maklumat Kelas"
                    >
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                </div>"""

if stray_block in content:
    content = content.replace(stray_block, "")
    print("Removed stray button")

with open("src/App.tsx", "w") as f:
    f.write(content)
