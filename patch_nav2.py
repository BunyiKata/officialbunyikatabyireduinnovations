import re

with open('src/index.css', 'r') as f:
    content = f.read()

css_to_add = """
@media (min-width: 721px) {
    body.teacher-mode .screen.active { padding-top: 72px !important; }
}
"""

if "min-width: 721px) {\n    body.teacher-mode .screen.active" not in content:
    content += css_to_add

with open('src/index.css', 'w') as f:
    f.write(content)
print("Patched css 2")
