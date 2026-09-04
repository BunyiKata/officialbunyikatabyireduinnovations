import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Modal Kod Kelas/Keluarga
old_code_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: 'white', maxWidth: '400px', width: '90%',
                                padding: '30px', textAlign: 'center', position: 'relative'
                            }}
                        >
                            <button
                                onClick={() => setIsCodeModalOpen(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    background: 'none', border: 'none', fontSize: '1.5rem',
                                    cursor: 'pointer', color: 'var(--color-dark)'
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <h2 style={{ marginBottom: '15px' }}>Masukkan Kod</h2>
                            <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                                Masukkan kod kelas atau keluarga untuk memuatkan profil.
                            </p>
                            <input
                                type="text"
                                className="neo-input century-gothic-font"
                                style={{ width: '100%', padding: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                                placeholder="Cth: KELAS123"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            />
                            <button
                                className="neo-btn bg-green"
                                style={{ width: '100%', padding: '12px', color: 'white', fontSize: '1.1rem' }}
                                onClick={() => {
                                    if(joinCode.trim()) {
                                        alert('Kod berjaya disahkan. (Sistem Demo)');
                                        setIsCodeModalOpen(false);
                                        if (typeof (window as any).masukModMurid === 'function') {
                                            (window as any).masukModMurid();
                                        }
                                    }
                                }}
                            >
                                Sahkan Kod
                            </button>
                        </motion.div>"""

new_code_modal = """                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))', maxWidth: '400px', width: '90%',
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
                            
                            <div className="neo-btn bg-white page-title" style={{ fontSize: '1.4rem', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none' }}>Masukkan Kod</div>
                            
                            <p style={{ marginBottom: '20px', fontSize: '0.95rem' }}>
                                Masukkan kod kelas atau keluarga untuk memuatkan profil.
                            </p>
                            <input
                                type="text"
                                className="neo-input century-gothic-font"
                                style={{ width: '100%', padding: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                                placeholder="Cth: KELAS123"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            />
                            <button
                                className="neo-btn"
                                style={{ width: '100%', padding: '12px', color: 'white', fontSize: '1.1rem', backgroundColor: '#168f81' }}
                                onClick={() => {
                                    if(joinCode.trim()) {
                                        alert('Kod berjaya disahkan. (Sistem Demo)');
                                        setIsCodeModalOpen(false);
                                        if (typeof (window as any).masukModMurid === 'function') {
                                            (window as any).masukModMurid();
                                        }
                                    }
                                }}
                            >
                                Sahkan Kod
                            </button>
                        </motion.div>"""

content = content.replace(old_code_modal, new_code_modal)


# Fix Modal Pilih Mod
old_mod_modal = """                        <motion.div
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
                                backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))', maxWidth: '350px', width: '90%',
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

content = content.replace(old_mod_modal, new_mod_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
