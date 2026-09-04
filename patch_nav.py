import re

with open('src/index.css', 'r') as f:
    content = f.read()

# Hide teacher sticky nav on desktop
css_to_add = """
@media (min-width: 721px) {
    body.teacher-mode #teacher-sticky-nav { display: none !important; }
}
"""

if "min-width: 721px) {\n    body.teacher-mode #teacher-sticky-nav" not in content:
    content += css_to_add

with open('src/index.css', 'w') as f:
    f.write(content)
print("Patched css")
