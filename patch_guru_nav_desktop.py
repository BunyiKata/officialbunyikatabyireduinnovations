import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """<button className="neo-btn bg-white" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>"""
target2 = """<button className="neo-btn bg-white" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span></button>"""

if target1 in content:
    content = content.replace(target1, """<button className="neo-btn bg-white desktop-nav-only" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>""")
    print("Replaced target1 in src/App.tsx")

if target2 in content:
    content = content.replace(target2, """<button className="neo-btn bg-white desktop-nav-only" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span></button>""")
    print("Replaced target2 in src/App.tsx")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("done")
