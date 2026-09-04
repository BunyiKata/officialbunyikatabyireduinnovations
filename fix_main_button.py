import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_main_button = """        <div className="neo-box" id="mode-selection-card" style={{"width":"100%","maxWidth":"485px","textAlign":"center","backgroundColor":"#168f81","backgroundImage":"linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","padding":"30px 20px","margin":"0 auto 30px auto"}}>
            <div id="mode-buttons-container" className="mode-buttons-container" style={{"display":"flex","justifyContent":"center"}}>
                <button className="neo-btn bg-red" style={{"width":"100%", "maxWidth":"250px", "fontSize":"2rem", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"white"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("murid"); setShowAppInfoModal(true); }}>
                    <i className="fa-solid fa-play"></i> <span>Main</span>
                </button>
            </div>
        </div>
        <div style={{textAlign: "center", marginTop: "-15px", marginBottom: "30px", fontSize: "1rem", fontWeight: "bold", color: "var(--color-dark)", cursor: "pointer"}} onClick={(e) => { setIsCodeModalOpen(true); }}>
            Sudah ada kod kelas atau keluarga? <span style={{color: "#3b82f6", textDecoration: "underline"}}>Masukkan di sini</span>
        </div>"""

new_main_button = """        <div className="neo-box" id="mode-selection-card" style={{"width":"90%","maxWidth":"485px","textAlign":"center","backgroundColor":"#168f81","backgroundImage":"linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","padding":"30px 20px","margin":"0 auto 20px auto"}}>
            <div id="mode-buttons-container" className="mode-buttons-container" style={{"display":"flex","justifyContent":"center"}}>
                <button className="neo-btn bg-red" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"white", "animation":"gold-glow 2s infinite alternate", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("murid"); setShowAppInfoModal(true); }}>
                    <i className="fa-solid fa-play"></i> <span>Main</span>
                </button>
            </div>
        </div>
        <div style={{textAlign: "center", margin: "0 auto 30px auto", padding: "0 15px", fontSize: "clamp(0.85rem, 3vw, 1rem)", fontWeight: "bold", color: "var(--color-dark)", cursor: "pointer"}} onClick={(e) => { setIsCodeModalOpen(true); }}>
            Sudah ada kod kelas atau keluarga? <br className="mobile-only-br" /><span style={{color: "#3b82f6", textDecoration: "underline", display: "inline-block", marginTop: "5px"}}>Masukkan di sini</span>
        </div>"""

content = content.replace(old_main_button, new_main_button)

with open('src/App.tsx', 'w') as f:
    f.write(content)

