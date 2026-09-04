with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('overflow: visible !important;', 'overflow-y: auto !important;')

with open('src/index.css', 'w') as f:
    f.write(content)
print("fixed")
