import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

content = content.replace('width:150px; min-width:120px;', 'width:200px; min-width:160px;')
content = content.replace('width:90px; min-width:80px;', 'width:110px; min-width:100px;')
content = content.replace('width:70px; min-width:60px;', 'width:90px; min-width:80px;')
content = content.replace('width: 65px; min-width: 65px;', 'width: 100px; min-width: 90px;')

with open('public/app-logic.js', 'w') as f:
    f.write(content)

print("done")
