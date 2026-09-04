import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

pattern = r"function bukaAksesGuru\(mod\) \{.*?paparSkrin\(mod === 'belajar' \? 'murid-menu-belajar' : 'murid-menu-latihan'\);.*?    \}"

content = re.sub(pattern, "function bukaAksesGuru(mod) { /* obsolete */ }", content, flags=re.DOTALL)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Removed bukaAksesGuru")
