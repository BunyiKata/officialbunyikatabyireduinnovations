with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Remove the bad padding rules
css = re.sub(r'\.island-inner-box \{\n    padding: 0 !important;\n    overflow: hidden;\n\}', '', css)
css = re.sub(r'\.island-inner-box\.locked \{\n    padding: 10px !important;\n\}', '', css)

new_css = """
/* Island inner box fix */
.island-inner-box:has(.island-inner-image) {
    padding: 0;
    overflow: hidden;
}
.island-inner-image {
    width: 100%;
    height: 100%;
    min-height: 80px;
    background-size: cover;
    background-position: center;
    /* Remove border radius so it fills the box nicely */
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
