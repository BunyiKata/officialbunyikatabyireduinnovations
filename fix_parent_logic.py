import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Add parentChildNames
new_vars = """        var defaultStudentNames = ["Ali Bin Abu", "Siti Aminah", "Raju A/L Muthu", "Mei Ling", "Ahmad Zaki", "Nur Aishah", "Chong Wei", "Deepak Kumar", "Farah Nadia", "Muhammad Harith", "Adam Rayyan", "Sofia Zara"];
        var savedStudentNames = JSON.parse(localStorage.getItem('bunyiKataStudentNames') || 'null');
        var studentNames = (Array.isArray(savedStudentNames) && savedStudentNames.length > 0) ? savedStudentNames : defaultStudentNames;
        
        var defaultParentChildNames = ["Ali", "Siti"];
        var savedParentChildNames = JSON.parse(localStorage.getItem('bunyiKataParentChildNames') || 'null');
        var parentChildNames = (Array.isArray(savedParentChildNames) && savedParentChildNames.length > 0) ? savedParentChildNames : defaultParentChildNames;"""
content = re.sub(
    r'var defaultStudentNames = .*?var studentNames = .*?defaultStudentNames;',
    new_vars,
    content,
    flags=re.DOTALL
)

# Update saveStudentData
old_save = """        function saveStudentData() {
            localStorage.setItem('bunyiKataStudentNames', JSON.stringify(studentNames));
            localStorage.setItem('bunyiKataStudentData', JSON.stringify(studentData));
        }"""
new_save = """        function saveStudentData() {
            localStorage.setItem('bunyiKataStudentNames', JSON.stringify(studentNames));
            localStorage.setItem('bunyiKataParentChildNames', JSON.stringify(parentChildNames));
            localStorage.setItem('bunyiKataStudentData', JSON.stringify(studentData));
        }"""
content = content.replace(old_save, new_save)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
