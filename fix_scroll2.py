with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('height: auto !important;', '')
content = content.replace('max-height: none !important;\\n    overflow-y: auto !important;', 'overflow-y: auto !important; height: 100% !important; flex: 1 !important;')

with open('src/index.css', 'w') as f:
    f.write(content)
print("fixed")
