import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))'", "backgroundColor: 'white', backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1))', backgroundSize: '15px 15px'")

with open('src/App.tsx', 'w') as f:
    f.write(content)

