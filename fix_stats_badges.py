import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_badges = """                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px"}}>Sekolah: <span id="guru-dashboard-nama-sekolah-title">-</span></div>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px", "marginLeft":"8px"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px", "marginLeft":"8px"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>"""

new_badges = """                        <div className="guru-stat-badges-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Sekolah: <span id="guru-dashboard-nama-sekolah-title">-</span></div>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                            <div className="stat-badge" style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>
                        </div>"""
content = content.replace(old_badges, new_badges)

with open('src/App.tsx', 'w') as f:
    f.write(content)
