with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('@media (max-width: 768px) {\n    \n}\n}', '')
content = content.replace('@media (max-width: 768px) {\n\n}\n}', '')
content = content.replace('@media (max-width: 768px) {\n}', '')

with open('src/index.css', 'w') as f:
    f.write(content)
