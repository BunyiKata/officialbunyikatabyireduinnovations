with open('src/index.css', 'r') as f:
    content = f.read()

import re
content = re.sub(r'overflow-y:\s*auto;', 'overflow-y: visible;', content)
content = re.sub(r'max-height:\s*none;\s*min-height:\s*500px;', '', content)
content = re.sub(r'min-height:\s*auto;', '', content)

with open('src/index.css', 'w') as f:
    f.write(content)

print("done")
