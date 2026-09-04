import re

with open("index.html", "r") as f:
    html = f.read()

old_close = r"""    <!-- Modal Pilih Avatar -->
    <div id="modal-pilih-avatar" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="tutupModal\(\)" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>"""

new_close = """    <!-- Modal Pilih Avatar -->
    <div id="modal-pilih-avatar" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="document.getElementById('modal-pilih-avatar').style.display='none'" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>"""

if re.search(old_close, html):
    html = re.sub(old_close, new_close, html)
    print("Patched modal close button")
else:
    print("Pattern not found")

with open("index.html", "w") as f:
    f.write(html)
