import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace("    .teacher-sticky-nav .neo-btn {", "    body.teacher-mode #teacher-sticky-nav .neo-btn, body.parent-mode #parent-sticky-nav .neo-btn {")
content = content.replace("    .teacher-sticky-nav .neo-btn i {", "    body.teacher-mode #teacher-sticky-nav .neo-btn i, body.parent-mode #parent-sticky-nav .neo-btn i {")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
