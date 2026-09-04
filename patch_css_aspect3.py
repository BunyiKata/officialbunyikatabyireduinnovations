with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update .island-inner-image
css = re.sub(
    r'\.island-inner-image \{[^\}]+\}',
    '.island-inner-image {\\n    width: 100%;\\n    height: 100%;\\n    aspect-ratio: 15 / 10;\\n    background-size: cover;\\n    background-position: center;\\n    background-repeat: no-repeat;\\n}',
    css
)

css = css.replace(".island-inner-box.locked { background: #cbd5e1; filter: grayscale(100%); border-color: #94a3b8 !important; }", 
                  ".island-inner-box.locked { background: #cbd5e1; filter: grayscale(100%) brightness(0.85); border-color: #94a3b8 !important; }")

with open("public/styles.css", "w") as f:
    f.write(css)
