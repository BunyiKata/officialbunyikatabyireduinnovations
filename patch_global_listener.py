import re

with open("public/app.js", "r") as f:
    js = f.read()

new_listener = """
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            const btnEditProfil = document.getElementById('btn-edit-profil');
            if (btnEditProfil) {
                btnEditProfil.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.bukaModalAvatar) {
                        window.bukaModalAvatar();
                    }
                });
            }
        });
"""

# append to the end of app.js if not already there
if "btnEditProfil.addEventListener" not in js:
    with open("public/app.js", "a") as f:
        f.write(new_listener)
    print("Added global listener to app.js")
else:
    print("Listener already present")
