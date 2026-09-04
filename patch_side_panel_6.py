import re

with open("index.html", "r") as f:
    html = f.read()

old_code = r"""            <div style="background: #f8fafc; display: flex; flex-direction: column; border-top: var\(--border-thick\);">
                <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 0px;">"""

new_code = """            <div style="background: #f8fafc; display: flex; flex-direction: column; border-top: var(--border-thick);">
                <div style="padding: 20px; padding-bottom: 15px; display: flex; flex-direction: column; gap: 12px;">"""

if re.search(old_code, html):
    html = re.sub(old_code, new_code, html)
    with open("index.html", "w") as f:
        f.write(html)
    print("Patched side panel 6 successfully")
else:
    print("Failed to patch side panel 6 - pattern not found")
