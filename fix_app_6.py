import re
with open('src/index.css', 'r') as f:
    content = f.read()

# Replace the hide-on-mobile block at the end with a more specific one
content = content.replace('.hide-on-mobile { display: none !important; }', 
    'body.teacher-mode #teacher-sticky-nav .neo-btn.hide-on-mobile,\n    body.parent-mode #parent-sticky-nav .neo-btn.hide-on-mobile,\n    .hide-on-mobile { display: none !important; }')

with open('src/index.css', 'w') as f:
    f.write(content)

print("done")
