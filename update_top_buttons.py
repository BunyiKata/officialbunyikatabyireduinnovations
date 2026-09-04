import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add state
content = content.replace('const [isReportDialOpen, setIsReportDialOpen] = React.useState(false);',
'''const [isReportDialOpen, setIsReportDialOpen] = React.useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = React.useState(false);''')

# Replace top right buttons
old_buttons = """        <div style={{"position":"fixed","top":"15px","right":"15px","display":"flex","gap":"10px","zIndex":"100"}}>
            <button className="neo-btn bg-blue teacher-login-icon" style={{"position":"static","color":"white"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("ibubapa"); setShowAppInfoModal(true); }} title="Mod Ibu Bapa"><i className="fa-solid fa-users"></i></button>
            <button className="neo-btn bg-orange teacher-login-icon" style={{"position":"static","color":"white"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("guru"); setShowAppInfoModal(true); }} title="Mod Guru"><i className="fa-solid fa-person-chalkboard"></i></button>
            <button className="neo-btn teacher-login-icon" style={{"position":"static","backgroundColor":"#168f81","color":"white"}} onClick={(e) => { (window as any).masukModAdmin() }} title="Mod Admin"><i className="fa-solid fa-user-shield"></i></button>
        </div>"""

new_buttons = """        <div style={{"position":"fixed","top":"15px","right":"15px","display":"flex","gap":"10px","zIndex":"100"}}>
            <button className="neo-btn bg-yellow teacher-login-icon" style={{"position":"static","color":"var(--color-dark)","padding":"8px 15px","borderRadius":"20px"}} onClick={(e) => { if ((window as any).playBubble) (window as any).playBubble(); setIsModeMenuOpen(true); }} title="Pilih Mod">
                <i className="fa-solid fa-bars" style={{marginRight: '8px'}}></i><span>Mod</span>
            </button>
        </div>"""

content = content.replace(old_buttons, new_buttons)

# Add Mode Menu Modal
mode_menu_modal = """
            {/* Modal Pilih Mod */}
            <AnimatePresence>
                {isModeMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: 'white', maxWidth: '350px', width: '90%',
                                padding: '30px 20px', textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setIsModeMenuOpen(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'none', border: 'none', fontSize: '1.5rem',
                                    cursor: 'pointer', color: 'var(--color-dark)', zIndex: 10
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <h2 style={{ marginBottom: '20px', fontSize: '1.4rem' }}>Pilih Mod</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                                <button className="neo-btn bg-orange mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("guru"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-person-chalkboard" style={{ fontSize: '1.5rem' }}></i> <span>Mod Guru</span>
                                </button>
                                <button className="neo-btn bg-blue mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("ibubapa"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-users" style={{ fontSize: '1.5rem' }}></i> <span>Mod Ibu Bapa</span>
                                </button>
                            </div>
                            
                            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px', textAlign: 'center' }}>
                                <button className="neo-btn" style={{ backgroundColor: '#168f81', color: 'white', padding: '10px 15px', borderRadius: '20px', fontSize: '0.9rem' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">
                                    <i className="fa-solid fa-user-shield" style={{ marginRight: '8px' }}></i> Mod Admin
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
"""

content = content.replace('{/* Modal App Info */}', mode_menu_modal + '\n            {/* Modal App Info */}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
