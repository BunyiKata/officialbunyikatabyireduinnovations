import re

with open('public/styles.css', 'r') as f:
    css = f.read()

# find .scene
css = re.sub(r'(\.scene \{[^}]+)(cursor: pointer;)', r'\1\2 border-radius: var(--radius-lg);', css)

with open('public/styles.css', 'w') as f:
    f.write(css)
