import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_modal = """            <div className="modal-neo-box" style={{"background":"#f8fafc", "padding":"14px 16px", "marginBottom":"18px", "borderRadius":"14px"}}>
                <label style={{"fontWeight":"bold", "fontSize":"0.9rem", "display":"block", "marginBottom":"6px", "color":"var(--color-dark)"}}>
                    <i className="fa-solid fa-child" style={{"color":"#0284c7", "marginRight":"6px"}}></i> Sila Pilih Profil Anak:
                </label>
                <select id="ibubapa-child-select" className="neo-input century-gothic-font" style={{"width":"100%", "fontSize":"0.95rem", "padding":"10px 12px", "borderRadius":"10px", "marginBottom":"0", "border":"2px solid var(--color-dark)", "background":"white", "color":"var(--color-dark)", "fontWeight":"bold", "fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif"}}>
                    {/* Populated by JS */}
                </select>
            </div>

            <button className="neo-btn" style={{"width":"100%", "padding":"12px", "fontSize":"1rem", "borderRadius":"12px", "backgroundColor":"#0284c7", "color":"white", "fontWeight":"bold"}} onClick={() => { (window as any).logMasukIbuBapa && (window as any).logMasukIbuBapa(); }}>
                <i className="fa-solid fa-right-to-bracket"></i> Masuk Mod Ibu Bapa
            </button>"""

new_modal = """            <div id="ibubapa-profiles-container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px', justifyContent: 'center'}}>
                {/* Populated by JS */}
            </div>"""

content = content.replace(old_modal, new_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
