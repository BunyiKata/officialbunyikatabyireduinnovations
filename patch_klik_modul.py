import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

pattern = r"const topBarTitle = document\.querySelector\('#murid-menu-belajar.*?paparSkrin\('murid-menu-belajar'\);"

replacement = "alert('Kandungan belum tersedia untuk modul ini.');"

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched klikModul!")
