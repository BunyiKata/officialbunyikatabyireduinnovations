import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_code = """                htmlContent += `
                <div class="neo-box" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: white; border: 2.5px solid var(--color-dark); box-shadow: 2px 3px 0 var(--color-dark); border-radius: 16px; cursor: pointer;" onclick="bukaPeta(${petaId}); paparSkrin('map-screen');">"""

new_code = """                htmlContent += `
                <div class="neo-box" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: white; border: 2.5px solid var(--color-dark); box-shadow: 2px 3px 0 var(--color-dark); border-radius: 16px;">"""

content = content.replace(old_code, new_code)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched challenge container")
