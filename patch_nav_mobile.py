import re

with open('src/index.css', 'r') as f:
    content = f.read()

target = """@media (max-width: 720px) {
    .teacher-sticky-nav {"""
replacement = """@media (max-width: 720px) {
    body.teacher-mode #teacher-sticky-nav, body.parent-mode #parent-sticky-nav {"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/index.css")
else:
    print("Target not found")

with open('src/index.css', 'w') as f:
    f.write(content)
