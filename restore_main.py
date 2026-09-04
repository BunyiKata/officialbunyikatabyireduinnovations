import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

main_button = """
        <div className="neo-box" id="mode-selection-card" style={{"width":"90%","maxWidth":"485px","textAlign":"center","backgroundColor":"#168f81","backgroundImage":"linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"100% 100%, 15px 15px","padding":"30px 20px","margin":"0 auto 20px auto"}}>
            <div id="mode-buttons-container" className="mode-buttons-container" style={{"display":"flex","justifyContent":"center"}}>
                <button className="neo-btn bg-red" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"white", "animation":"gold-glow 2s infinite alternate", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("murid"); setShowAppInfoModal(true); }}>
                    <i className="fa-solid fa-play"></i> <span>Main</span>
                </button>
            </div>
        </div>"""

content = content.replace(
'''        <div style={{textAlign: "center", margin: "0 auto 30px auto", padding: "0 15px", fontSize: "clamp(0.85rem, 3vw, 1rem)", fontWeight: "bold", color: "var(--color-dark)", cursor: "pointer"}} onClick={(e) => { setIsCodeModalOpen(true); }}>''',
main_button + '''
        <div style={{textAlign: "center", margin: "0 auto 30px auto", padding: "0 15px", fontSize: "clamp(0.85rem, 3vw, 1rem)", fontWeight: "bold", color: "var(--color-dark)", cursor: "pointer"}} onClick={(e) => { setIsCodeModalOpen(true); }}>'''
)

# And fix the top right button to just be an icon without "Mod" text
old_top_right = """        <div style={{"position":"fixed","top":"15px","right":"15px","display":"flex","gap":"10px","zIndex":"100"}}>
            <button className="neo-btn bg-yellow teacher-login-icon" style={{"position":"static","color":"var(--color-dark)","padding":"8px 15px","borderRadius":"20px"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setIsModeMenuOpen(true); }} title="Pilih Mod">
                <i className="fa-solid fa-bars" style={{marginRight: '8px'}}></i><span>Mod</span>
            </button>
        </div>"""

new_top_right = """        <div style={{"position":"fixed","top":"15px","right":"15px","display":"flex","gap":"10px","zIndex":"100"}}>
            <button className="neo-btn bg-yellow teacher-login-icon" style={{"position":"static","color":"var(--color-dark)","width":"44px","height":"44px","borderRadius":"50%","padding":"0","display":"flex","alignItems":"center","justifyContent":"center"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setIsModeMenuOpen(true); }} title="Pilih Mod">
                <i className="fa-solid fa-bars" style={{margin: '0', fontSize: '1.2rem'}}></i>
            </button>
        </div>"""

content = content.replace(old_top_right, new_top_right)

with open('src/App.tsx', 'w') as f:
    f.write(content)

