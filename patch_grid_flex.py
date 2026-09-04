import re

with open("public/styles.css", "r") as f:
    css = f.read()

css = css.replace("grid-template-columns: 60px 1fr 60px !important;", "grid-template-columns: minmax(60px, 1fr) auto minmax(60px, 1fr) !important;")
css = css.replace("grid-template-columns: 48px 1fr 48px !important;", "grid-template-columns: minmax(48px, 1fr) auto minmax(48px, 1fr) !important;")

with open("public/styles.css", "w") as f:
    f.write(css)
