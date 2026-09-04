import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add states
content = content.replace('const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);', 
'''const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const [editKodTemp, setEditKodTemp] = React.useState("");''')

# Add modal HTML
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
                                        // Auto-masuk ke mod murid untuk test demo
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

content = content.replace('{/* Modal App Info */}', modal_html + '\n            {/* Modal App Info */}')

# Edit Guru Dashboard to show Kod Kelas
guru_dash_old = """                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                    </div>"""
guru_dash_new = """                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500", "marginTop":"5px"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>
                    </div>"""
content = content.replace(guru_dash_old, guru_dash_new)

# Guru edit modal trigger
guru_edit_old = """                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setIsEditModalOpen(true);"""
guru_edit_new = """                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || '');
                        setIsEditModalOpen(true);"""
content = content.replace(guru_edit_old, guru_edit_new)

# Ibubapa dashboard to show Kod Keluarga
ibubapa_dash_old = """                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500"}}>Kelas: <span id="ibubapa-nama-kelas-title">-</span></div>
                    </div>"""
ibubapa_dash_new = """                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500"}}>Kelas: <span id="ibubapa-nama-kelas-title">-</span></div>
                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500", "marginTop":"5px"}}>Kod Keluarga: <span id="ibubapa-kod-keluarga-title">-</span></div>
                    </div>"""
content = content.replace(ibubapa_dash_old, ibubapa_dash_new)

# We need to add Kod field to Edit Modal
edit_modal_old = """                        <div style={{marginBottom: '15px'}}>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Nama Guru / Subjek:</label>
                            <input 
                                type="text" 
                                className="neo-input century-gothic-font"
                                value={editGuruTemp}
                                onChange={(e) => setEditGuruTemp(e.target.value)}
                                style={{width: '100%', padding: '10px'}}
                                placeholder="Contoh: Cikgu Ali"
                            />
                        </div>"""
edit_modal_new = edit_modal_old + """
                        <div style={{marginBottom: '15px'}}>
                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Kod Kelas / Kod Keluarga:</label>
                            <input 
                                type="text" 
                                className="neo-input century-gothic-font"
                                value={editKodTemp}
                                onChange={(e) => setEditKodTemp(e.target.value)}
                                style={{width: '100%', padding: '10px'}}
                                placeholder="Contoh: KELAS123"
                            />
                        </div>"""
content = content.replace(edit_modal_old, edit_modal_new)

# Save action
save_old = """                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');"""
save_new = """                            localStorage.setItem('bunyiKataNamaKelas', editKelasTemp);
                            localStorage.setItem('pdf_guru', editGuruTemp);
                            localStorage.setItem('bunyiKataKodKelas', editKodTemp);
                            let el = document.getElementById('guru-dashboard-nama-kelas-title');
                            let kodGuru = document.getElementById('guru-dashboard-kod-kelas-title');
                            if (kodGuru) kodGuru.innerText = editKodTemp || '-';
                            let kodIbu = document.getElementById('ibubapa-kod-keluarga-title');
                            if (kodIbu) kodIbu.innerText = editKodTemp || '-';"""
content = content.replace(save_old, save_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
