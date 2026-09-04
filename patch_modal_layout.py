import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

layout_old = """            const container = document.getElementById('ibubapa-profiles-container');
            if (container) {
                container.innerHTML = '';
                
                const childNames = isStudentLogin ? (window.studentNames || studentNames || []) : (window.parentChildNames || defaultParentChildNames || []);"""

layout_new = """            const container = document.getElementById('ibubapa-profiles-container');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                if (isStudentLogin) {
                    modalContent.style.maxWidth = '750px';
                } else {
                    modalContent.style.maxWidth = '450px';
                }
            }
            if (container) {
                container.innerHTML = '';
                if (isStudentLogin) {
                    container.className = 'student-profiles-grid';
                } else {
                    container.className = 'ibubapa-profiles-grid';
                }
                
                const childNames = isStudentLogin ? (window.studentNames || studentNames || []) : (window.parentChildNames || defaultParentChildNames || []);"""

if layout_old in content:
    content = content.replace(layout_old, layout_new)
    print("Patched modal layout logic")
else:
    print("Could not find modal layout logic")

with open("public/app-logic.js", "w") as f:
    f.write(content)
