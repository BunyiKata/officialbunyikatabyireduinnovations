with open('src/index.css', 'r') as f:
    content = f.read()

target = """        select.filter-select {
            font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif !important;
            font-weight: bold !important;
        }"""

replacement = """        select.filter-select {
            font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif !important;
            font-weight: bold !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: none;
        }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/index.css")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
