import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Title wrapper
old_title = """                <div className="neo-btn" style={{ backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)', color: 'white', fontSize: '1.2rem', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'block', textAlign: 'center', pointerEvents: 'none', padding: '10px 20px' }}>
                    {(window as any).modIbuBapaAktif ? 'Maklumat Anak' : 'Maklumat Kelas'}
                </div>"""
new_title = """                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div className="neo-btn" style={{ backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)', color: 'white', fontSize: '1.2rem', margin: '0 auto', whiteSpace: 'normal', display: 'inline-block', textAlign: 'center', pointerEvents: 'none', padding: '10px 20px' }}>
                        {(window as any).modIbuBapaAktif ? 'Maklumat Anak' : 'Maklumat Kelas'}
                    </div>
                </div>"""
content = content.replace(old_title, new_title)

# 2. Input font sizes (there are 4 inputs to fix)
# Just regex replace the fontSize: '1.1rem' for the inputs inside the modal
content = content.replace("fontSize: '1.1rem',\n                                        fontFamily: \"inherit\", boxSizing: 'border-box'",
                          "fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',\n                                        fontFamily: \"inherit\", boxSizing: 'border-box'")

# Also fix the Mod Ibu Bapa input
content = content.replace("fontSize: '1.1rem',\n                                fontFamily: \"inherit\", boxSizing: 'border-box'",
                          "fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',\n                                fontFamily: \"inherit\", boxSizing: 'border-box'")

# 3. Fix Simpan button color
old_simpan_btn = """                            <button 
                                className="neo-btn" 
                                style={{ width: '120px', padding: '10px', fontSize: '1.1rem', backgroundColor: '#168f81', color: 'white' }}
                                onClick={() => {"""
new_simpan_btn = """                            <button 
                                className="neo-btn" 
                                style={{ width: '120px', padding: '10px', fontSize: '1.1rem', backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)', color: 'white' }}
                                onClick={() => {"""
content = content.replace(old_simpan_btn, new_simpan_btn)

with open('src/App.tsx', 'w') as f:
    f.write(content)
