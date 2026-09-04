import re
with open('src/index.css', 'r') as f:
    content = f.read()

# Fix box-shadow
content = content.replace('box-shadow: none !important;', 'box-shadow: 0 3px 0 var(--color-dark) !important;\n        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;')

with open('src/index.css', 'w') as f:
    f.write(content)

print("done")
