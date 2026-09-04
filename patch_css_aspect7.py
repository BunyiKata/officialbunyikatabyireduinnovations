with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update map-board
css = re.sub(
    r'\.map-board \{([^\}]+)grid-template-columns: repeat\(auto-fit, minmax\(240px, 1fr\)\);([^\}]+)\}',
    r'.map-board {\1grid-template-columns: repeat(auto-fit, minmax(220px, 260px)); justify-content: center;\2}',
    css
)

css = re.sub(
    r'\.island-inner-image \{[^\}]+\}',
    '.island-inner-image {\\n    width: 100%;\\n    height: 100%;\\n    aspect-ratio: 334 / 252;\\n    background-size: cover;\\n    background-position: center;\\n    background-repeat: no-repeat;\\n}',
    css
)

with open("public/styles.css", "w") as f:
    f.write(css)
