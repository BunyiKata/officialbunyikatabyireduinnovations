import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_select = """                const names = ["Profil Ibu Bapa", "+ Tambah Profil Anak"];
                names.forEach(name => {"""

new_select = """                const baseNames = window.studentNames || defaultStudentNames || [];
                const names = ["Profil Ibu Bapa", ...baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak"), "+ Tambah Profil Anak"];
                names.forEach(name => {"""
content = content.replace(old_select, new_select)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
