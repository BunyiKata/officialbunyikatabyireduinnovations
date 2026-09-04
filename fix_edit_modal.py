import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

modal_old = """                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', color: 'var(--color-dark)'}}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px', color: 'var(--color-orange)'}}></i>
                    Edit Maklumat Kelas
                </h3>
                
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

                <div style={{marginBottom: '24px'}}>
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
                </div>"""

modal_new = """                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', color: 'var(--color-dark)'}}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px', color: 'var(--color-orange)'}}></i>
                    {(window as any).modIbuBapaAktif ? 'Edit Maklumat Anak' : 'Edit Maklumat Kelas'}
                </h3>
                
                {!(window as any).modIbuBapaAktif && (
                    <>
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
                    </>
                )}
                <div style={{marginBottom: '24px'}}>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>
                        {(window as any).modIbuBapaAktif ? 'Kod Anak' : 'Kod Kelas'}
                    </label>
                    <input 
                        type="text" 
                        value={editKodTemp}
                        onChange={(e) => setEditKodTemp(e.target.value)}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '8px',
                            border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                            fontFamily: "inherit"
                        }}
                    />
                </div>"""

content = content.replace(modal_old, modal_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
