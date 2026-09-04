import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pencil_button = """                <button 
                    onClick={(e) => { 
                        setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                        setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"position": "absolute", "top": "55px", "right": "15px", "background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s", "zIndex": 10}}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <i className="fa-solid fa-pencil" style={{"fontSize":"1.1rem"}}></i>
                </button>"""

content = content.replace(pencil_button, "")

target_location = """                            <button 
                                onClick={(e) => { (window as any).padamProfilAnakIbuBapa && (window as any).padamProfilAnakIbuBapa(); }} 
                                style={{"background":"#ef4444","border":"2px solid var(--color-dark)","borderRadius":"10px","padding":"6px 10px","color":"white","cursor":"pointer","boxShadow":"1px 1px 0 var(--color-dark)","fontWeight":"bold","fontSize":"0.85rem"}}
                                title="Padam Profil Anak"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>"""

new_pencil = """                            <button 
                                onClick={(e) => { 
                                    setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                                    setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                                    setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                                    setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                                    setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                                    setIsEditModalOpen(true);
                                }} 
                                style={{"background":"rgba(255,255,255,0.3)","border":"2px solid var(--color-dark)","borderRadius":"10px","padding":"6px 10px","color":"white","cursor":"pointer","boxShadow":"1px 1px 0 var(--color-dark)","fontWeight":"bold","fontSize":"0.85rem"}}
                                title="Edit Maklumat Anak"
                            >
                                <i className="fa-solid fa-pencil"></i>
                            </button>"""

content = content.replace(target_location, new_pencil + "\n" + target_location)

with open('src/App.tsx', 'w') as f:
    f.write(content)
