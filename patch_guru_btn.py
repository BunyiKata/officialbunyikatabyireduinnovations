import re

with open("src/App.tsx", "r") as f:
    content = f.read()

btn_old = """            <button 
                onClick={(e) => { 
                    setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                    setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                    setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                    setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                    setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                    setIsEditModalOpen(true);
                }} 
                style={{"position":"absolute","top":"15px","right":"15px","background":"rgba(255,255,255,0.3)","border":"2px solid var(--color-dark)","borderRadius":"10px","padding":"6px 10px","color":"white","cursor":"pointer","boxShadow":"1px 1px 0 var(--color-dark)","fontWeight":"bold","fontSize":"0.85rem"}}
                title="Edit Maklumat Kelas"
            >"""

btn_new = """            <button 
                onClick={(e) => { 
                    setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                    setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                    setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                    setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                    setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                    setIsEditModalOpen(true);
                }} 
                className="neo-btn"
                style={{"position":"absolute","top":"15px","right":"15px","background":"rgba(255,255,255,0.3)","border":"2px solid var(--color-dark)","borderRadius":"50%","padding":"0","width":"32px","height":"32px","minWidth":"auto","minHeight":"auto","color":"white","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","boxShadow":"1px 2px 0 var(--color-dark)","fontWeight":"bold","fontSize":"0.9rem","zIndex":"100"}}
                title="Edit Maklumat Kelas"
            >"""

if btn_old in content:
    content = content.replace(btn_old, btn_new)
    print("Patched Edit Maklumat Kelas button")
else:
    print("Could not find Edit Maklumat Kelas button")

with open("src/App.tsx", "w") as f:
    f.write(content)
