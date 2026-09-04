import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

content = content.replace("onclick=\"resetProgresMurid", "onclick=\"window.resetProgresMurid")

with open("public/app-logic.js", "w") as f:
    f.write(content)
