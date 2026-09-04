import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

modal_html = """
            {/* Modal Kod Kelas/Keluarga */}
            <AnimatePresence>
                {isCodeModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
"""

content = content.replace('{showAppInfoModal && (', modal_html + '\n    {showAppInfoModal && (')

with open('src/App.tsx', 'w') as f:
    f.write(content)
