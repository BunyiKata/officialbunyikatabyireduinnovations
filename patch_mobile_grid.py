import re

with open("index.html", "r") as f:
    html = f.read()

orig_grid = """<div id="grid-huruf-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(65px, 1fr)); gap: 15px; margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.8); border: 3px solid var(--color-dark); border-radius: 20px; box-shadow: var(--shadow-hard-sm);">"""
new_grid = """<div id="grid-huruf-container">"""
html = html.replace(orig_grid, new_grid)

with open("index.html", "w") as f:
    f.write(html)
