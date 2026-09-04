import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Pilih Mod color to hijau #168f81
content = content.replace("backgroundColor: 'var(--color-blue)' , color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px', lineHeight: '1.2' }}>Pilih Mod",
                          "backgroundColor: '#168f81' , color: 'white', fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px', lineHeight: '1.2' }}>Pilih Mod")

# Fix Simpan button for Maklumat Kelas/Anak
# It's currently: backgroundColor: 'var(--color-blue)' ,
# Let's change it to: backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)' ,
content = content.replace("backgroundColor: 'var(--color-blue)' ,\n                            border: '2px solid var(--color-dark)', fontWeight: 'bold', cursor: 'pointer',\n                            color: 'white'",
                          "backgroundColor: (window as any).modIbuBapaAktif ? 'var(--color-blue)' : 'var(--color-orange)' ,\n                            border: '2px solid var(--color-dark)', fontWeight: 'bold', cursor: 'pointer',\n                            color: 'white'")

# "Kod Anak" to "Kod Keluarga"
# First let's check what is currently there.
with open('src/App.tsx', 'w') as f:
    f.write(content)
