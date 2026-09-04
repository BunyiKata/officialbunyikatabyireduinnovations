with open("public/styles.css", "r") as f:
    css = f.read()

import re

# replace stars-container and star
css = re.sub(
    r'\.stars-container \{[^\}]+\}',
    '.stars-container { display: flex; gap: 6px; position: absolute; top: -18px; z-index: 20; left: 50%; transform: translateX(-50%); background-color: var(--color-white); border: 3px solid var(--color-dark); padding: 5px 12px; border-radius: 16px; box-shadow: 0 4px 0 var(--color-dark); align-items: center; justify-content: center; min-width: 80px; }\\n' +
    'body.dark-mode .stars-container { background-color: #1e293b; border-color: #0f172a; box-shadow: 0 4px 0 #0f172a; }',
    css
)

css = re.sub(
    r'\.star \{[^\}]+\}',
    '.star { font-size: 1.4rem; color: #cbd5e1; stroke: #94a3b8; stroke-width: 15px; }',
    css
)

css = re.sub(
    r'\.star\.earned \{[^\}]+\}',
    '.star.earned { color: #ffc107; filter: drop-shadow(0 0 2px rgba(255,193,7,0.5)); }',
    css
)

with open("public/styles.css", "w") as f:
    f.write(css)
