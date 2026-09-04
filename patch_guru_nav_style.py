import re

with open('src/index.css', 'r') as f:
    content = f.read()

target = """        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;"""

replacement = """        display: flex !important;
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/index.css")
else:
    print("Target not found")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
