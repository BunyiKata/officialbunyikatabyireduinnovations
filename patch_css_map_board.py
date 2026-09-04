with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Update .map-board
css = css.replace("background-color: #bfe2ff;", "background-color: #feedd6;")

with open("public/styles.css", "w") as f:
    f.write(css)
