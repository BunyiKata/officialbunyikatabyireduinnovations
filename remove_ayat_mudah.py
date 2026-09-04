import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# 1. Remove from map 4 cabaran definition
content = re.sub(r'\s*\{\s*id:\s*"ayat_mudah"[^\}]+\},', '', content)

# 2. Remove from map 4 modules definition
content = re.sub(r'\s*\{\s*id:\s*"ayat_mudah"[^\}]+\},', '', content)

# 3. Remove 'ayat_mudah': { ... } from content data
content = re.sub(r"\s*'ayat_mudah':\s*\{.*?\}(?=,\s*'ayat_pendek':)", '', content, flags=re.DOTALL)

# 4. Remove from includes check
content = content.replace("'ayat_mudah', ", "")

with open('public/app-logic.js', 'w') as f:
    f.write(content)

with open('src/App.tsx', 'r') as f:
    content_app = f.read()

content_app = content_app.replace(
"""                    <div id="read-title" style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--color-dark)',
                        display: 'none'
                    }}>
                        Ayat Mudah
                    </div>""",
"""                    <div id="read-title" style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--color-dark)',
                        display: 'none'
                    }}>
                        Bacaan
                    </div>"""
)

with open('src/App.tsx', 'w') as f:
    f.write(content_app)

