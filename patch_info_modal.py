import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add states
content = content.replace(
    'const [editGuruTemp, setEditGuruTemp] = React.useState("");',
    'const [editGuruTemp, setEditGuruTemp] = React.useState("");\n  const [showAppInfoModal, setShowAppInfoModal] = React.useState(false);\n  const [pendingMode, setPendingMode] = React.useState("");'
)

# Replace the onClick for mode buttons
old_murid_btn = '<button className="neo-btn bg-orange mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { masukModMurid() }}>'
new_murid_btn = '<button className="neo-btn bg-orange mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("murid"); setShowAppInfoModal(true); }}>'
content = content.replace(old_murid_btn, new_murid_btn)

old_guru_btn = '<button className="neo-btn bg-purple mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { masukModGuru() }}>'
new_guru_btn = '<button className="neo-btn bg-purple mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("guru"); setShowAppInfoModal(true); }}>'
content = content.replace(old_guru_btn, new_guru_btn)

old_ibubapa_btn = '<button className="neo-btn bg-blue mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { (window as any).bukaModalPilihAnak && (window as any).bukaModalPilihAnak(); }}>'
new_ibubapa_btn = '<button className="neo-btn bg-blue mode-btn" style={{"flex":"1","fontSize":"1rem","padding":"12px 16px","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","gap":"8px"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("ibubapa"); setShowAppInfoModal(true); }}>'
content = content.replace(old_ibubapa_btn, new_ibubapa_btn)

# Add the modal JSX near the bottom of App.tsx but inside the main div
modal_jsx = """
    {showAppInfoModal && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center', padding: '30px' }}>
                <img referrerPolicy="no-referrer" src="https://i.postimg.cc/cHTb186H/Copy-of-BUNYI-KATA-APPS-(2).png" alt="Bunyi Kata" style={{ maxWidth: '180px', height: 'auto', marginBottom: '20px' }} />
                
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-dark)', marginBottom: '15px', textAlign: 'justify' }}>
                    Aplikasi ini adalah satu aplikasi mengenal huruf dan suku kata yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas. Aplikasi ini terbahagi kepada dua iaitu Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan membawa kepada keseronokan dalam pembelajaran. Di akhir pembelajaran dan latihan, murid akan memperoleh hadiah yang menarik!
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 'bold', marginBottom: '10px' }}>
                    Aplikasi ini dibangunkan sepenuhnya oleh IR EduInnovation.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '25px', fontWeight: 'bold' }}>
                    <div>MYIPO Hak Cipta Terpelihara: CRDV2025M00849</div>
                    <div>&copy; 2026</div>
                </div>
                
                <button 
                    className="neo-btn bg-green" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px' }}
                    onClick={() => {
                        if ((window as any).playBubble) (window as any).playBubble();
                        setShowAppInfoModal(false);
                        if (pendingMode === 'murid') {
                            masukModMurid();
                        } else if (pendingMode === 'guru') {
                            masukModGuru();
                        } else if (pendingMode === 'ibubapa') {
                            (window as any).bukaModalPilihAnak && (window as any).bukaModalPilihAnak();
                        }
                    }}
                >
                    Teruskan <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                </button>
            </div>
        </div>
    )}
"""

content = content.replace("    </div>\n  );\n}", modal_jsx + "    </div>\n  );\n}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Patched App.tsx with info modal")
