import re

with open('index.html', 'r') as f:
    html = f.read()

old_html = """<div class="neo-btn bg-blue" style="min-width: 50px; width: 50px; height: 50px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; pointer-events: none;"><i class="fa-solid fa-volume-high" style="color: white; font-size: 1.5rem;"></i></div>"""

new_html = """<div class="neo-btn bg-blue" style="min-width: 50px !important; width: 50px !important; height: 50px !important; padding: 0 !important; display: flex; align-items: center; justify-content: center; border-radius: 50% !important; pointer-events: none;"><i class="fa-solid fa-volume-high" style="color: white; font-size: 1.5rem;"></i></div>"""

if old_html in html:
    html = html.replace(old_html, new_html)

with open('index.html', 'w') as f:
    f.write(html)
