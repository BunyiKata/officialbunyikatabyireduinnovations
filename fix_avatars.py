import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix 1: Admin dashboard avatar ID
admin_avatar_old = """                    <div className="ibubapa-card-avatar-box">
                        <div id="guru-dashboard-avatar-sekolah" style={{"width":"100%","height":"100%","backgroundSize":"contain","backgroundPosition":"center","backgroundRepeat":"no-repeat","position":"relative","zIndex":1}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Sistem</span>"""
admin_avatar_new = """                    <div className="ibubapa-card-avatar-box">
                        <div id="admin-dashboard-avatar-sekolah" style={{width:"100%",height:"100%",backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"relative",zIndex:1, backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Sistem</span>"""
content = content.replace(admin_avatar_old, admin_avatar_new)

# Fix 2: Guru dashboard avatar ID and backgroundImage
guru_avatar_old = """                    <div className="ibubapa-card-avatar-box">
                        <div id="guru-dashboard-avatar-sekolah" style={{"width":"100%","height":"100%","backgroundSize":"contain","backgroundPosition":"center","backgroundRepeat":"no-repeat","position":"relative","zIndex":1}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>"""
guru_avatar_new = """                    <div className="ibubapa-card-avatar-box">
                        <div id="guru-dashboard-avatar-sekolah" style={{width:"100%",height:"100%",backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"relative",zIndex:1, backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>"""
content = content.replace(guru_avatar_old, guru_avatar_new)

# Fix 3: Ensure update also targets admin just in case
save_old = """                            let avatarEl = document.getElementById('guru-dashboard-avatar-sekolah');
                            if (avatarEl) avatarEl.style.backgroundImage = `url('${editAvatarTemp}')`;"""
save_new = """                            let avatarEl = document.getElementById('guru-dashboard-avatar-sekolah');
                            if (avatarEl) avatarEl.style.backgroundImage = `url('${editAvatarTemp}')`;
                            let adminAvatarEl = document.getElementById('admin-dashboard-avatar-sekolah');
                            if (adminAvatarEl) adminAvatarEl.style.backgroundImage = `url('${editAvatarTemp}')`;"""
content = content.replace(save_old, save_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
