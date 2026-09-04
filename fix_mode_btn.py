import re
with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('''    .mode-btn i {
        font-size: 1.4rem !important;
    }''', '''    .mode-btn i {
        font-size: 1.4rem !important;
        width: 30px !important;
        text-align: center !important;
    }''')

with open('src/index.css', 'w') as f:
    f.write(content)

print("done")
