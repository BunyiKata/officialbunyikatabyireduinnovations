with open("public/app.js", "r") as f:
    js = f.read()

import re

# Map 1: var(--color-red) -> #90b562
js = re.sub(
    r'(if \(nomborPeta === 1\) \{[\s\S]*?)(var\(--color-red\))([\s\S]*?\} else if \(nomborPeta === 2\))',
    lambda m: m.group(1) + m.group(2).replace("var(--color-red)", "#90b562") + m.group(3),
    js
)

# Since replace only replaces one, we need to do it multiple times for the block or just string replace in the slice.
