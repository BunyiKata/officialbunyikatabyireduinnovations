import re

with open("index.html", "r") as f:
    html = f.read()

html = html.replace('id="incomplete-modules-container" style="display:flex; flex-direction:column; gap:10px;"',
                    'id="incomplete-modules-container" style="display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:8px;"')

with open("index.html", "w") as f:
    f.write(html)
