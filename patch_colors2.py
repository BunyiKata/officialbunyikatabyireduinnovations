with open("public/app.js", "r") as f:
    js = f.read()

import re

def replace_in_block(pattern, old_color, new_color, text):
    match = re.search(pattern, text)
    if not match:
        return text
    block = match.group(0)
    new_block = block.replace(old_color, new_color)
    return text.replace(block, new_block)

js = replace_in_block(r'if \(nomborPeta === 1\) \{[\s\S]*?\} else if \(nomborPeta === 2\)', 'var(--color-red)', '#90b562', js)
js = replace_in_block(r'\} else if \(nomborPeta === 2\) \{[\s\S]*?\} else if \(nomborPeta === 3\)', 'var(--color-purple)', '#c1a472', js)
js = replace_in_block(r'\} else if \(nomborPeta === 3\) \{[\s\S]*?\} else if \(nomborPeta === 4\)', 'var(--color-orange)', '#ff751f', js)
js = replace_in_block(r'\} else if \(nomborPeta === 4\) \{[\s\S]*?\};?\n            \}', 'var(--color-green)', '#ff66c4', js)

with open("public/app.js", "w") as f:
    f.write(js)
