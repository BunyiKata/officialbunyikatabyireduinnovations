with open('public/app-logic.js', 'r') as f:
    content = f.read()

content = content.replace('var defaultParentChildNames = ["Ali", "Siti"];', 'var defaultParentChildNames = ["Ali Bin Abu", "Siti Aminah"];')

with open('public/app-logic.js', 'w') as f:
    f.write(content)
