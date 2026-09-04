import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Edit Maklumat Modal Background & Close Button
old_edit_maklumat_bg = "backgroundColor: 'white', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', borderRadius: '16px', padding: '24px',"
new_edit_maklumat_bg = "backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', borderRadius: '16px', padding: '24px',"
content = content.replace(old_edit_maklumat_bg, new_edit_maklumat_bg)

# Let's add a close button to Edit Maklumat and remove "Batal"
old_edit_maklumat_header = """                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', color: 'var(--color-dark)'}}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px', color: 'var(--color-orange)'}}></i>
                    {(window as any).modIbuBapaAktif ? 'Edit Maklumat Anak' : 'Edit Maklumat Kelas'}
                </h3>"""
new_edit_maklumat_header = """                <button
                    className="neo-btn bg-red"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10
                    }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px' }}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px'}}></i>
                    {(window as any).modIbuBapaAktif ? 'EDIT MAKLUMAT ANAK' : 'EDIT MAKLUMAT KELAS'}
                </div>"""
content = content.replace(old_edit_maklumat_header, new_edit_maklumat_header)
# Need to make its container relative
content = content.replace("width: '90%', maxWidth: '400px', border: '3px solid var(--color-dark)',", "position: 'relative', width: '90%', maxWidth: '400px', border: '3px solid var(--color-dark)',")

# 2. Modals Kod Kelas and Pilih Mod
old_code_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))', backgroundSize: '15px 15px', maxWidth: '400px', width: '90%',
                                padding: '30px', textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setIsCodeModalOpen(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'none', border: 'none', fontSize: '1.5rem',
                                    cursor: 'pointer', color: 'var(--color-dark)', zIndex: 10
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            
                            <div className="neo-btn bg-white page-title" style={{ fontSize: '1.4rem', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none' }}>Masukkan Kod</div>"""

new_code_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', maxWidth: '400px', width: '90%',
                                padding: '30px', textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                className="neo-btn bg-red"
                                onClick={() => setIsCodeModalOpen(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 10
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            
                            <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px' }}>MASUKKAN KOD</div>"""
content = content.replace(old_code_modal, new_code_modal)


old_mod_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))', backgroundSize: '15px 15px', maxWidth: '350px', width: '90%',
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
                            
                            <div className="neo-btn bg-white page-title" style={{ fontSize: '1.4rem', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none' }}>Pilih Mod</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                                <button className="neo-btn bg-orange mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("guru"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-person-chalkboard" style={{ fontSize: '1.5rem' }}></i> <span>Guru</span>
                                </button>
                                <button className="neo-btn bg-blue mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("ibubapa"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-users" style={{ fontSize: '1.5rem' }}></i> <span>Ibu Bapa</span>
                                </button>
                            </div>
                            
                            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px', textAlign: 'center' }}>
                                <button className="neo-btn" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '8px', border: 'none', boxShadow: 'none', transform: 'none', fontSize: '1.2rem' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">
                                    <i className="fa-solid fa-user-shield"></i>
                                </button>
                            </div>
                        </motion.div>"""

new_mod_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', maxWidth: '350px', width: '90%',
                                padding: '30px 20px', textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                className="neo-btn bg-red"
                                onClick={() => setIsModeMenuOpen(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 10
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            
                            <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px' }}>PILIH MOD</div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                                <button className="neo-btn bg-orange mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("guru"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-person-chalkboard" style={{ fontSize: '1.5rem' }}></i> <span>Guru</span>
                                </button>
                                <button className="neo-btn bg-blue mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); if ((window as any).playBubble) (window as any).playBubble(); setPendingMode("ibubapa"); setShowAppInfoModal(true); }}>
                                    <i className="fa-solid fa-users" style={{ fontSize: '1.5rem' }}></i> <span>Ibu Bapa</span>
                                </button>
                            </div>
                            
                            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px', textAlign: 'center' }}>
                                <button className="neo-btn" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '8px', border: 'none', boxShadow: 'none', transform: 'none', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">
                                    <i className="fa-solid fa-user-shield"></i> <span style={{ fontWeight: 'bold' }}>Admin</span>
                                </button>
                            </div>
                        </motion.div>"""
content = content.replace(old_mod_modal, new_mod_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
