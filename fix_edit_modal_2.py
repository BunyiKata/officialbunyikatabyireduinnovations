import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

modal_old = """                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', color: 'var(--color-dark)'}}>
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
                )}"""

modal_new = """                <h3 style={{marginTop: 0, marginBottom: '20px', fontSize: '1.4rem', color: 'var(--color-dark)'}}>
                    <i className="fa-solid fa-pencil" style={{marginRight: '8px', color: 'var(--color-orange)'}}></i>
                    {(window as any).modIbuBapaAktif ? 'Edit Maklumat Anak' : 'Edit Maklumat Kelas'}
                </h3>
                
                {(window as any).modIbuBapaAktif ? (
                    <div style={{marginBottom: '16px'}}>
                        <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Anak</label>
                        <input 
                            type="text" 
                            id="edit-nama-anak-input"
                            defaultValue={(window as any).anakTerpilih || 'Nama Anak'}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '8px',
                                border: '2px solid var(--color-dark)', fontSize: '1.1rem',
                                fontFamily: "inherit"
                            }}
                        />
                    </div>
                ) : (
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
                )}"""

content = content.replace(modal_old, modal_new)

save_old = """                            let guruEl = document.getElementById('guru-dashboard-nama-guru-title');
                            if (guruEl) guruEl.innerText = editGuruTemp || '-';
                            setIsEditModalOpen(false);"""
save_new = """                            let guruEl = document.getElementById('guru-dashboard-nama-guru-title');
                            if (guruEl) guruEl.innerText = editGuruTemp || '-';
                            
                            // Logik untuk tukar nama anak
                            if ((window as any).modIbuBapaAktif) {
                                const newName = (document.getElementById('edit-nama-anak-input') as HTMLInputElement)?.value;
                                if (newName && newName !== (window as any).anakTerpilih) {
                                    const oldName = (window as any).anakTerpilih;
                                    if ((window as any).studentNames) {
                                        const idx = (window as any).studentNames.indexOf(oldName);
                                        if (idx > -1) (window as any).studentNames[idx] = newName;
                                    }
                                    if ((window as any).studentData && (window as any).studentData[oldName]) {
                                        (window as any).studentData[newName] = (window as any).studentData[oldName];
                                        delete (window as any).studentData[oldName];
                                    }
                                    (window as any).anakTerpilih = newName;
                                    if ((window as any).renderParentDashboard) (window as any).renderParentDashboard();
                                }
                            }
                            
                            setIsEditModalOpen(false);"""
content = content.replace(save_old, save_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
