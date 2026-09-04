import re
with open("public/app.js", "r") as f:
    js = f.read()

def replacer(m):
    return m.group(0) + "\n            if(modSemasa === 'belajar') unlockNextBelajar(id);"

js = re.sub(r'currentModuleTitle = title;', replacer, js)

with open("public/app.js", "w") as f:
    f.write(js)
