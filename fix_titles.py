import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Selamat Datang
content = content.replace('className="neo-btn page-title" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(0.9rem, 3.5vw, 1.25rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'block\', width: \'100%\', boxSizing: \'border-box\', pointerEvents: \'none\', padding: \'12px 15px\', lineHeight: \'1.3\', textTransform: \'uppercase\' }}',
'className="neo-btn" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(0.9rem, 3.5vw, 1.25rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'block\', width: \'100%\', boxSizing: \'border-box\', pointerEvents: \'none\', padding: \'12px 15px\', lineHeight: \'1.3\', textTransform: \'uppercase\' }}')

# Fix Pilih Mod
content = content.replace('className="neo-btn page-title" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(1.1rem, 4vw, 1.4rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'inline-block\', pointerEvents: \'none\', padding: \'10px 20px\', lineHeight: \'1.2\' }}',
'className="neo-btn" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(1.1rem, 4vw, 1.4rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'inline-block\', pointerEvents: \'none\', padding: \'10px 20px\', lineHeight: \'1.2\' }}')

# Fix Log Masuk
content = content.replace('className="neo-btn page-title" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(1.1rem, 4vw, 1.3rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'inline-block\', pointerEvents: \'none\', padding: \'8px 20px\', lineHeight: \'1.2\' }}',
'className="neo-btn" style={{ backgroundColor: \'#168f81\', color: \'white\', fontSize: \'clamp(1.1rem, 4vw, 1.3rem)\', margin: \'0 auto 20px auto\', whiteSpace: \'normal\', display: \'inline-block\', pointerEvents: \'none\', padding: \'8px 20px\', lineHeight: \'1.2\' }}')


with open('src/App.tsx', 'w') as f:
    f.write(content)
