import re
with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    content = f.read()

# Replace the duplicated block at the end
content = re.sub(r'huruf_konsonan: \[\n.*?\]\n};', '};', content, flags=re.DOTALL)

with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
    f.write(content)
