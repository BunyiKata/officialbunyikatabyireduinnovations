import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """<button className="neo-btn bg-white" onClick={(e) => { keluarModGuru() }}><i className="fa-solid fa-bars"></i> <span>Menu</span></button>"""
replacement = """<button className="neo-btn bg-white" onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'flex'; }}><i className="fa-solid fa-bars"></i> <span>Menu</span></button>"""

if target in content:
    content = content.replace(target, replacement, 1) # Only replace the first one which is in teacher nav
    print("Replaced target in src/App.tsx")
else:
    print("Target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
