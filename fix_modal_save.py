import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_save = """                        onClick={() => {
                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');"""

new_save = """                        onClick={() => {
                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            localStorage.setItem('bunyiKataNamaSekolah', editSekolahTemp);
                            localStorage.setItem('bunyiKataSekolahAvatar', editAvatarTemp);
                            
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');"""

content = content.replace(old_save, new_save)

old_update = """                            if (guruEl) guruEl.innerText = editGuruTemp || '-';
                            
                            // Logik untuk tukar nama anak"""

new_update = """                            if (guruEl) guruEl.innerText = editGuruTemp || '-';
                            let sekolahEl = document.getElementById('guru-dashboard-nama-sekolah-title');
                            if (sekolahEl) sekolahEl.innerText = editSekolahTemp || '-';
                            let avatarEl = document.getElementById('guru-dashboard-avatar-sekolah');
                            if (avatarEl) avatarEl.style.backgroundImage = `url('${editAvatarTemp}')`;
                            
                            // Logik untuk tukar nama anak"""

content = content.replace(old_update, new_update)

old_stat = """                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>
                        <h2 id="guru-dashboard-nama-kelas-title" style={{"fontSize":"1.3rem","margin":"2px 0","color":"white","fontWeight":"bold"}}>1 Cemerlang</h2>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>"""

new_stat = """                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>
                        <h2 id="guru-dashboard-nama-kelas-title" style={{"fontSize":"1.3rem","margin":"2px 0","color":"white","fontWeight":"bold"}}>1 Cemerlang</h2>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px"}}>Sekolah: <span id="guru-dashboard-nama-sekolah-title">-</span></div>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px", "marginLeft":"8px"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>"""

content = content.replace(old_stat, new_stat)

old_avatar = """<div style={{"width":"100%","height":"100%","backgroundSize":"contain","backgroundPosition":"center","backgroundRepeat":"no-repeat","position":"relative","zIndex":1, "backgroundImage":"url('https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff')"}}></div>"""
new_avatar = """<div id="guru-dashboard-avatar-sekolah" style={{"width":"100%","height":"100%","backgroundSize":"contain","backgroundPosition":"center","backgroundRepeat":"no-repeat","position":"relative","zIndex":1}}></div>"""

content = content.replace(old_avatar, new_avatar)

# We need to set the initial avatar in a useEffect or something, or we can just use inline JS
old_effect = """        // Initialize defaults
        const existingKod = localStorage.getItem('bunyiKataKodKelas');
        if (!existingKod) localStorage.setItem('bunyiKataKodKelas', 'KELAS123');"""

new_effect = """        // Initialize defaults
        const existingKod = localStorage.getItem('bunyiKataKodKelas');
        if (!existingKod) localStorage.setItem('bunyiKataKodKelas', 'KELAS123');
        const existingSekolah = localStorage.getItem('bunyiKataNamaSekolah');
        if (existingSekolah) {
            let sekolahEl = document.getElementById('guru-dashboard-nama-sekolah-title');
            if (sekolahEl) sekolahEl.innerText = existingSekolah;
        }
        const existingAvatar = localStorage.getItem('bunyiKataSekolahAvatar');
        let avatarEl = document.getElementById('guru-dashboard-avatar-sekolah');
        if (avatarEl) {
            avatarEl.style.backgroundImage = `url('${existingAvatar || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff'}')`;
        }
"""
content = content.replace(old_effect, new_effect)


with open('src/App.tsx', 'w') as f:
    f.write(content)
