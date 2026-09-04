import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Edit Maklumat Kelas Modal Title
old_title_maklumat = """                <div className="neo-btn" style={{ backgroundColor: '#168f81', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'block', textAlign: 'center', pointerEvents: 'none', padding: '10px 20px' }}>
                    {(window as any).modIbuBapaAktif ? 'Maklumat Anak' : 'Maklumat Kelas'}
                </div>"""
new_title_maklumat = """                <div className="neo-btn" style={{ backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'block', textAlign: 'center', pointerEvents: 'none', padding: '10px 20px' }}>
                    {(window as any).modIbuBapaAktif ? 'Maklumat Anak' : 'Maklumat Kelas'}
                </div>"""
content = content.replace(old_title_maklumat, new_title_maklumat)

# 2. Width of the Maklumat Kelas modal
old_modal_width = """                backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', borderRadius: '16px', padding: '24px',
                position: 'relative', width: '90%', maxWidth: '400px', border: '3px solid var(--color-dark)',"""
new_modal_width = """                backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', borderRadius: '16px', padding: '24px',
                position: 'relative', width: '90%', maxWidth: '500px', border: '3px solid var(--color-dark)',"""
content = content.replace(old_modal_width, new_modal_width)

# 3. Avatar size
old_avatar_style = """                                style={{ 
                                    width: '80px', height: '80px', 
                                    backgroundColor: 'white', border: '2px solid var(--color-dark)', borderRadius: '12px',
                                    backgroundImage: `url('${editAvatarTemp}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                    cursor: 'pointer', boxShadow: '2px 2px 0 var(--color-dark)'
                                }}"""
new_avatar_style = """                                style={{ 
                                    width: '120px', height: '120px', 
                                    backgroundColor: 'white', border: '2px solid var(--color-dark)', borderRadius: '12px',
                                    backgroundImage: `url('${editAvatarTemp}')`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                    cursor: 'pointer', boxShadow: '2px 2px 0 var(--color-dark)'
                                }}"""
content = content.replace(old_avatar_style, new_avatar_style)

# 4. Log Masuk Modal Title
old_login_title = """                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div className="neo-btn" style={{ backgroundColor: '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '8px 20px', lineHeight: '1.2' }}>
                                    Log Masuk {pendingLoginMode === 'guru' ? 'Guru' : pendingLoginMode === 'ibubapa' ? 'Ibu Bapa' : 'Admin'}
                                </div>
                            </div>"""
new_login_title = """                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div className="neo-btn" style={{ backgroundColor: pendingLoginMode === 'guru' ? 'var(--color-orange)' : pendingLoginMode === 'ibubapa' ? 'var(--color-blue)' : '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '8px 20px', lineHeight: '1.2' }}>
                                    Log Masuk {pendingLoginMode === 'guru' ? 'Guru' : pendingLoginMode === 'ibubapa' ? 'Ibu Bapa' : 'Admin'}
                                </div>
                            </div>"""
content = content.replace(old_login_title, new_login_title)

# 5. Log Masuk Button
old_login_button = """                            <button 
                                className="neo-btn" 
                                style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px', backgroundColor: '#168f81', color: '#ffffff' }}
                                onClick={() => {"""
new_login_button = """                            <button 
                                className="neo-btn" 
                                style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px', backgroundColor: pendingLoginMode === 'guru' ? 'var(--color-orange)' : pendingLoginMode === 'ibubapa' ? 'var(--color-blue)' : '#168f81', color: '#ffffff' }}
                                onClick={() => {"""
content = content.replace(old_login_button, new_login_button)

with open('src/App.tsx', 'w') as f:
    f.write(content)
