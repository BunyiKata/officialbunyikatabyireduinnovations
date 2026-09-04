import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add states for editSekolahTemp and editAvatarTemp
if 'const [editSekolahTemp, setEditSekolahTemp]' not in content:
    content = content.replace('const [editKelasTemp, setEditKelasTemp] = React.useState("");', 
                              'const [editKelasTemp, setEditKelasTemp] = React.useState("");\n  const [editSekolahTemp, setEditSekolahTemp] = React.useState("");\n  const [editAvatarTemp, setEditAvatarTemp] = React.useState("");')

# 2. Update setEditKelasTemp blocks to also set the new states (there are two places: one for guru, one for ibubapa)
old_click_handler = """                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }}"""

new_click_handler = """                    onClick={(e) => { 
                        setEditSekolahTemp(localStorage.getItem('bunyiKataNamaSekolah') || '');
                        setEditAvatarTemp(localStorage.getItem('bunyiKataSekolahAvatar') || 'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff');
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }}"""
content = content.replace(old_click_handler, new_click_handler)

# 3. Fix "EDIT MAKLUMAT KELAS / ANAK" -> "Maklumat Kelas / Maklumat Anak"
old_modal_title = """                <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'nowrap', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px' }}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px'}}></i>
                    {(window as any).modIbuBapaAktif ? 'EDIT MAKLUMAT ANAK' : 'EDIT MAKLUMAT KELAS'}
                </div>"""
new_modal_title = """                <div className="neo-btn" style={{ backgroundColor: '#168f81', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'block', textAlign: 'center', pointerEvents: 'none', padding: '10px 20px' }}>
                    {(window as any).modIbuBapaAktif ? 'Maklumat Anak' : 'Maklumat Kelas'}
                </div>"""
content = content.replace(old_modal_title, new_modal_title)

# 4. Modify the layout of the Guru section
old_guru_layout = """                    <>
                        <div style={{marginBottom: '16px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Kelas</label>
                            <input 
                                type="text" 
                                value={editKelasTemp} 
                                onChange={(e) => setEditKelasTemp(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '8px',
                                    border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>

                        <div style={{marginBottom: '16px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Guru</label>
                            <input 
                                type="text" 
                                value={editGuruTemp} 
                                onChange={(e) => setEditGuruTemp(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '8px',
                                    border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>
                    </>"""

new_guru_layout = """                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <div 
                                style={{ 
                                    width: '80px', height: '80px', 
                                    backgroundColor: 'white', border: '2px solid var(--color-dark)', borderRadius: '12px',
                                    backgroundImage: `url('${editAvatarTemp}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                    cursor: 'pointer', boxShadow: '2px 2px 0 var(--color-dark)'
                                }}
                                onClick={() => setEditAvatarTemp(`https://api.dicebear.com/7.x/shapes/svg?seed=${Math.random().toString(36).substring(7)}&backgroundColor=ffffff`)}
                                title="Klik untuk ubah avatar"
                            ></div>
                            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 'bold', textAlign: 'center' }}>Ubah<br/>Avatar</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Sekolah</label>
                                <input 
                                    type="text" 
                                    value={editSekolahTemp} 
                                    onChange={(e) => setEditSekolahTemp(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px',
                                        border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                        fontFamily: "inherit", boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Kelas</label>
                                <input 
                                    type="text" 
                                    value={editKelasTemp} 
                                    onChange={(e) => setEditKelasTemp(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px',
                                        border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                        fontFamily: "inherit", boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Guru</label>
                                <input 
                                    type="text" 
                                    value={editGuruTemp} 
                                    onChange={(e) => setEditGuruTemp(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '8px',
                                        border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                        fontFamily: "inherit", boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>
                    </div>"""
content = content.replace(old_guru_layout, new_guru_layout)

# Also fix the Mod Ibu Bapa section to have boxSizing border-box so it doesn't overflow
old_ibubapa_input = """                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                fontFamily: "inherit"
                            }}"""
new_ibubapa_input = """                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                fontFamily: "inherit", boxSizing: 'border-box'
                            }}"""
content = content.replace(old_ibubapa_input, new_ibubapa_input)

with open('src/App.tsx', 'w') as f:
    f.write(content)
