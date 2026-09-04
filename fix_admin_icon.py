import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_admin = """                            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px', textAlign: 'center' }}>
                                <button className="neo-btn" style={{ backgroundColor: '#168f81', color: 'white', padding: '10px 15px', borderRadius: '20px', fontSize: '0.9rem' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">
                                    <i className="fa-solid fa-user-shield" style={{ marginRight: '8px' }}></i> Mod Admin
                                </button>
                            </div>"""

new_admin = """                            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '15px', textAlign: 'center' }}>
                                <button className="neo-btn" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '8px', border: 'none', boxShadow: 'none', transform: 'none', fontSize: '1.2rem' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">
                                    <i className="fa-solid fa-user-shield"></i>
                                </button>
                            </div>"""

content = content.replace(old_admin, new_admin)

with open('src/App.tsx', 'w') as f:
    f.write(content)

