import re
with open('src/index.css', 'r') as f:
    content = f.read()

# For the container
content = content.replace('justify-content: flex-start !important;', 'justify-content: space-between !important;')

# For the buttons
old_btn = """        flex: 0 0 70px !important;
        min-width: 70px !important;"""
new_btn = """        flex: 1 !important;
        min-width: 0 !important;
        width: 100% !important;"""
content = content.replace(old_btn, new_btn)

with open('src/index.css', 'w') as f:
    f.write(content)

print("done")
