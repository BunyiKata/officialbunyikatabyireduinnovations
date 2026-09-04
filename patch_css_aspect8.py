with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update map-board
css = re.sub(
    r'\.map-board \{([^\}]+)grid-template-columns: repeat\(auto-fit, minmax\(220px, 260px\)\);([^\}]+)\}',
    r'.map-board {\1grid-template-columns: repeat(auto-fit, minmax(180px, 220px));\2}',
    css
)

with open("public/styles.css", "w") as f:
    f.write(css)
