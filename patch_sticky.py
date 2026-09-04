import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace("body.teacher-mode .teacher-sticky-nav, body.parent-mode #parent-sticky-nav { display: flex; top: 52px !important; }", 
                          "body.teacher-mode #teacher-sticky-nav, body.parent-mode #parent-sticky-nav { display: flex; top: 52px; }")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
