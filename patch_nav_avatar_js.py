with open("public/app.js", "r") as f:
    js = f.read()

import re

js = js.replace(
    "if(profileAvatar) { profileAvatar.className = \"fa-solid \" + selectedAvatarIcon; }",
    "if(profileAvatar) { profileAvatar.className = \"fa-solid \" + selectedAvatarIcon; }\n            const navAvatar = document.getElementById('nav-avatar-icon');\n            if(navAvatar) navAvatar.className = \"fa-solid \" + selectedAvatarIcon;"
)

js = js.replace(
    "if (document.getElementById('profil-avatar-icon')) {\n                    document.getElementById('profil-avatar-icon').className = 'fa-solid ' + icon;\n                }",
    "if (document.getElementById('profil-avatar-icon')) {\n                    document.getElementById('profil-avatar-icon').className = 'fa-solid ' + icon;\n                }\n                if (document.getElementById('nav-avatar-icon')) {\n                    document.getElementById('nav-avatar-icon').className = 'fa-solid ' + icon;\n                }"
)

with open("public/app.js", "w") as f:
    f.write(js)
