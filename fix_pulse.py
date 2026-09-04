import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'style={{"animation":"pulse-scale 3s infinite"}} onClick={(e) => { bukaModalPilihPeta(\'belajar\') }}',
    'style={{"animation":"pulse-scale 4s infinite alternate"}} onClick={(e) => { bukaModalPilihPeta(\'belajar\') }}'
)
content = content.replace(
    'style={{"animation":"pulse-scale 3s infinite"}} onClick={(e) => { bukaModalPilihPeta(\'latihan\') }}',
    'style={{"animation":"pulse-scale 4s infinite alternate"}} onClick={(e) => { bukaModalPilihPeta(\'latihan\') }}'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
