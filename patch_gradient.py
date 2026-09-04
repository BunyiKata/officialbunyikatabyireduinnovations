with open("public/app.js", "r") as f:
    js = f.read()

import re

orig_str = "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))"
new_str = "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))"

js = js.replace(orig_str, new_str)

with open("public/app.js", "w") as f:
    f.write(js)
