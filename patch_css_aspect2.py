with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update .island-inner-image
css = re.sub(
    r'\.island-inner-image \{[^\}]+\}',
    '.island-inner-image {\\n    width: 100%;\\n    height: 100%;\\n    aspect-ratio: 16 / 8;\\n    background-size: cover;\\n    background-position: center;\\n    background-repeat: no-repeat;\\n}',
    css
)

with open("public/styles.css", "w") as f:
    f.write(css)
