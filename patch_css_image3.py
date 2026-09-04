with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Use regex to strip out everything we just added
css = re.sub(r'\.island-inner-image \{[^\}]+\}', '', css)
css = re.sub(r'\.island-inner-box \{[^!]+!important;\n    overflow: hidden;\n\}', '', css)
css = re.sub(r'\.island-inner-box\.locked \{\n    padding: 10px !important;\n\}', '', css)
css = re.sub(r'/\* Island inner box fix \*/\n\.island-inner-box:has\(\.island-inner-image\) \{\n    padding: 0;\n    overflow: hidden;\n\}', '', css)


new_css = """
.island-inner-box:has(.island-inner-image) {
    padding: 0 !important;
    overflow: hidden;
}
.island-inner-image {
    width: 100%;
    height: 100%;
    min-height: 80px;
    background-size: cover;
    background-position: center;
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
