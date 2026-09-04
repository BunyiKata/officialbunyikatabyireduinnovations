with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update map-board max-width just in case we want to restrict its total width
# But #map-screen has max-width: 1200px.

# Let's see if there is any place setting island-inner-box height
css = re.sub(
    r'\.island-inner-image \{[^\}]+\}',
    '.island-inner-image {\\n    width: 100%;\\n    height: 100%;\\n    aspect-ratio: 334 / 252;\\n    background-size: cover;\\n    background-position: top;\\n    background-repeat: no-repeat;\\n}',
    css
)

with open("public/styles.css", "w") as f:
    f.write(css)
