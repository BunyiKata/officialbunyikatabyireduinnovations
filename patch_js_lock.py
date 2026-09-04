with open("public/app.js", "r") as f:
    js = f.read()

import re

# original
orig = """                            ${isLockedForUser ? '<i class="fa-solid fa-lock module-lock-icon" aria-label="Terkunci"></i>' : ''}
                            ${isLockedForUser ? '' : (modul.image ? `<div class="island-inner-image" style="background-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), url('${modul.image}');"></div>` : `<div class="island-inner-text">${modul.content}</div>`)}"""

# new
new_html = """                            ${isLockedForUser ? '<i class="fa-solid fa-lock module-lock-icon" style="position: absolute; z-index: 10; color: white; font-size: 2.5rem; text-shadow: 0px 2px 4px rgba(0,0,0,0.8);" aria-label="Terkunci"></i>' : ''}
                            ${modul.image ? `<div class="island-inner-image" style="background-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6)), url('${modul.image}');"></div>` : (isLockedForUser ? '' : `<div class="island-inner-text">${modul.content}</div>`)}"""

if orig in js:
    js = js.replace(orig, new_html)
else:
    print("Could not find the original string. Need regex.")
    
with open("public/app.js", "w") as f:
    f.write(js)
