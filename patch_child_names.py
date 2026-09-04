import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

names_old = """                const childNames = window.parentChildNames || defaultParentChildNames || [];"""
names_new = """                const childNames = isStudentLogin ? (window.studentNames || studentNames || []) : (window.parentChildNames || defaultParentChildNames || []);"""

if names_old in content:
    content = content.replace(names_old, names_new)
    print("Patched childNames logic")
else:
    print("Could not find childNames block")

with open("public/app-logic.js", "w") as f:
    f.write(content)
