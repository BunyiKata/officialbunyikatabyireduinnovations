import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Change title and background color
old_title = "backgroundColor: 'var(--color-blue)' , color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px', lineHeight: '1.2' }}>MASUKKAN KOD</div>"
new_title = "backgroundColor: 'var(--color-green)' , color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px', lineHeight: '1.2' }}>Masukkan Kod</div>"
content = content.replace(old_title, new_title)

# Change Sahkan Kod button
old_btn = """                            <button
                                className="neo-btn"
                                style={{ width: '100%', padding: '12px', color: 'white', fontSize: '1.1rem', backgroundColor: '#168f81' }}
                                onClick={() => {"""
                                
new_btn = """                            <button
                                className="neo-btn"
                                style={{ width: '100%', padding: '12px', color: 'white', fontSize: '1.1rem', backgroundColor: '#168f81', animation: 'outlineGlowGold 2.5s infinite, pulse-scale 2.5s infinite ease-in-out' }}
                                onClick={() => {"""
content = content.replace(old_btn, new_btn)

with open("src/App.tsx", "w") as f:
    f.write(content)
