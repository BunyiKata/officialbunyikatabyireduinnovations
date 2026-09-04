import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

tambah_old = """                // Add "+ Tambah Profil Anak" button ONLY IF < 3 children
                if (childNames.length < 3) {"""

tambah_new = """                // Add "+ Tambah Profil Anak" button ONLY IF < 3 children
                if (childNames.length < 3 && !isStudentLogin && !isTukarDashboard) {"""

if tambah_old in content:
    content = content.replace(tambah_old, tambah_new)
    print("Patched Tambah Anak logic")

with open("public/app-logic.js", "w") as f:
    f.write(content)
