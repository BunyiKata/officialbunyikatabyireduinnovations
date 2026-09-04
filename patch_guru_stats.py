import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """    {/*  Mod Guru (Dashboard Live Tracking)  */}
    <div id="guru-dashboard" className="screen" style={{paddingTop: "90px"}}>
        <div className="guru-controls-bar" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: "10px", flexWrap: "wrap", gap: "10px", width:"100%"}}>"""

replacement = """    {/*  Mod Guru (Dashboard Live Tracking)  */}
    <div id="guru-dashboard" className="screen" style={{paddingTop: "90px"}}>
        {/* Guru Stats Banner */}
        <div className="neo-box" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","padding":"20px","backgroundColor":"var(--color-orange)","backgroundImage":"linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","position":"relative","borderRadius":"20px","color":"white"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","flexWrap":"wrap","gap":"15px"}}>
                <div style={{"display":"flex","alignItems":"center","gap":"15px","textAlign":"left"}}>
                    <div className="ibubapa-card-avatar-box">
                        <div style={{"width":"100%","height":"100%","backgroundSize":"contain","backgroundPosition":"center","backgroundRepeat":"no-repeat","position":"relative","zIndex":1, "backgroundImage":"url('https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff')"}}></div>
                    </div>
                    <div>
                        <span style={{"fontSize":"0.75rem","background":"rgba(255,255,255,0.25)","padding":"2px 8px","borderRadius":"12px","textTransform":"uppercase","fontWeight":"bold","letterSpacing":"0.5px"}}>Statistik Kelas Saya</span>
                        <h2 style={{"fontSize":"1.3rem","margin":"2px 0","color":"white","fontWeight":"bold"}}>1 Cemerlang</h2>
                    </div>
                </div>
            </div>
        </div>

        {/* Kad Ringkasan Bil Murid & Aktiviti */}
        <div className="ibubapa-stats-grid" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(180px, 1fr))","gap":"15px"}}>
            <div className="neo-box" style={{"background":"white","padding":"16px","borderRadius":"16px","border":"2px solid var(--color-dark)","boxShadow":"2px 2px 0 var(--color-dark)","textAlign":"center"}}>
                <div style={{"fontSize":"0.8rem","fontWeight":"bold","color":"#64748b","textTransform":"uppercase"}}>Bilangan Murid</div>
                <div id="guru-jumlah-murid" style={{"fontSize":"2rem","fontWeight":"900","color":"#d97706","margin":"4px 0"}}>{students.length || 0}</div>
                <div style={{"fontSize":"0.75rem","color":"#475569"}}><i className="fa-solid fa-users" style={{"color":"#f59e0b"}}></i> Berdaftar</div>
            </div>
            <div className="neo-box" style={{"background":"white","padding":"16px","borderRadius":"16px","border":"2px solid var(--color-dark)","boxShadow":"2px 2px 0 var(--color-dark)","textAlign":"center"}}>
                <div style={{"fontSize":"0.8rem","fontWeight":"bold","color":"#64748b","textTransform":"uppercase"}}>Aktiviti Selesai</div>
                <div id="guru-aktiviti-selesai" style={{"fontSize":"2rem","fontWeight":"900","color":"#16a34a","margin":"4px 0"}}>0</div>
                <div style={{"fontSize":"0.75rem","color":"#475569"}}><i className="fa-solid fa-circle-check" style={{"color":"#16a34a"}}></i> Modul &amp; latihan</div>
            </div>
        </div>

        <div className="guru-controls-bar" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: "10px", flexWrap: "wrap", gap: "10px", width:"100%"}}>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/App.tsx")
else:
    print("Target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("done")
