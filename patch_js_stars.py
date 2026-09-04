with open("public/app.js", "r") as f:
    js = f.read()

import re

# We want to change where starsHTML is inserted:
# from inside .island-inner-box to before .island-inner-box (or just after .island-tape)

old_str = """                        <div class="island-tape" style="background: ${modul.color};"></div>
                        <div class="island-inner-box ${lockedClass}" style="border-color: ${modul.color};">
                            ${starsHTML}"""

new_str = """                        <div class="island-tape" style="background: ${modul.color};"></div>
                        ${starsHTML}
                        <div class="island-inner-box ${lockedClass}" style="border-color: ${modul.color};">"""

if old_str in js:
    js = js.replace(old_str, new_str)
    with open("public/app.js", "w") as f:
        f.write(js)
    print("Patched successfully!")
else:
    print("Could not find exact string")

