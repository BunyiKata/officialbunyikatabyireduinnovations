import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_style = """                            className="neo-box"
                            style={{
                                backgroundColor: '#ffffff', maxWidth: '350px', width: '90%',
                                padding: '25px', position: 'relative', borderRadius: '20px'
                            }}"""

new_style = """                            className="neo-box"
                            style={{
                                backgroundColor: '#fef9ec', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', maxWidth: '350px', width: '90%',
                                padding: '30px 20px', position: 'relative', borderRadius: '20px', textAlign: 'left'
                            }}"""
content = content.replace(old_style, new_style)

old_title = """                            <h2 style={{fontSize: '1.3rem', marginBottom: '20px', color: 'var(--color-dark)', textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px'}}>
                                Log Masuk {pendingLoginMode === 'guru' ? 'Guru' : pendingLoginMode === 'ibubapa' ? 'Ibu Bapa' : 'Admin'}
                            </h2>"""

new_title = """                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '8px 20px', lineHeight: '1.2' }}>
                                    Log Masuk {pendingLoginMode === 'guru' ? 'Guru' : pendingLoginMode === 'ibubapa' ? 'Ibu Bapa' : 'Admin'}
                                </div>
                            </div>"""

content = content.replace(old_title, new_title)

with open('src/App.tsx', 'w') as f:
    f.write(content)
