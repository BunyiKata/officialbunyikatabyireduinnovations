with open("index.html", "r") as f:
    html = f.read()

import re

# Fix back buttons
# In murid-menu-belajar
html = html.replace('<div id="murid-menu-belajar" class="screen">\n        <div class="map-top-bar">\n            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin(\'murid-menu-belajar\')">',
                    '<div id="murid-menu-belajar" class="screen">\n        <div class="map-top-bar">\n            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin(\'map-screen\')">')

# In murid-menu-latihan
html = html.replace('<div id="murid-menu-latihan" class="screen">\n        <div class="map-top-bar">\n            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin(\'murid-menu-belajar\')" aria-label="Kembali">',
                    '<div id="murid-menu-latihan" class="screen">\n        <div class="map-top-bar">\n            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin(\'map-screen\')" aria-label="Kembali">')

# Also modify grid in view-belajar-huruf
html = html.replace('grid-template-columns: repeat(auto-fit, minmax(80px, 1fr))', 'grid-template-columns: repeat(auto-fit, minmax(65px, 1fr))')

with open("index.html", "w") as f:
    f.write(html)
