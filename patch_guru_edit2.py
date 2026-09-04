import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_block = """        <div className="neo-box" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","padding":"20px","backgroundColor":"var(--color-orange)","backgroundImage":"linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","position":"relative","borderRadius":"20px","color":"white"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","flexWrap":"wrap","gap":"15px"}}>
                <div style={{"display":"flex","alignItems":"center","gap":"15px","textAlign":"left"}}>
                    <div className="ibubapa-card-avatar-box">
                        <div id="guru-dashboard-avatar-sekolah" style={{width:"100%",height:"100%",backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"relative",zIndex:1, backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>
                        <h2 id="guru-dashboard-nama-kelas-title" style={{"fontSize":"1.3rem","margin":"2px 0","color":"white","fontWeight":"bold"}}>1 Cemerlang</h2>
                        <div className="guru-stat-badges-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Sekolah: <span id="guru-dashboard-nama-sekolah-title">-</span></div>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>
                        </div>
                    </div>
                </div>
                <div style={{"textAlign":"right"}}>
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
                </div>
            </div>
        </div>"""

new_block = """        <div className="neo-box" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","padding":"20px","backgroundColor":"var(--color-orange)","backgroundImage":"linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","position":"relative","borderRadius":"20px","color":"white"}}>
            <div style={{"display":"flex","alignItems":"center","gap":"15px","textAlign":"left"}}>
                <div className="ibubapa-card-avatar-box">
                    <div id="guru-dashboard-avatar-sekolah" style={{width:"100%",height:"100%",backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"relative",zIndex:1, backgroundImage: `url('${localStorage.getItem("bunyiKataSekolahAvatar") || "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff"}')`}}></div>
                </div>
                <div>
                    <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>
                    <h2 id="guru-dashboard-nama-kelas-title" style={{"fontSize":"1.3rem","margin":"2px 0","color":"white","fontWeight":"bold","paddingRight":"35px"}}>1 Cemerlang</h2>
                    <div className="guru-stat-badges-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Sekolah: <span id="guru-dashboard-nama-sekolah-title">-</span></div>
                        <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                        <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>
                    </div>
                </div>
            </div>
            <button 
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
            >
                <i className="fa-solid fa-pencil"></i>
            </button>
        </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    print("Patched guru banner")
else:
    print("Could not find guru banner")

with open("src/App.tsx", "w") as f:
    f.write(content)
