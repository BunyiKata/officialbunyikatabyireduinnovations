import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("PILIH MOD</div>", "Pilih Mod</div>")

with open('src/App.tsx', 'w') as f:
    f.write(content)
