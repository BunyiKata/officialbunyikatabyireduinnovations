import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

content = content.replace(">AKSI<", ">RESET<")
content = content.replace(">Aksi<", ">Reset<")

with open("public/app-logic.js", "w") as f:
    f.write(content)
