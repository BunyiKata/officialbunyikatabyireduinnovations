import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

pattern = re.compile(r"htmlBadges \+= `<div class=\"neo-box badge-board-card \$\{bgClass\}\" style=\"position: relative; \$\{opacityClass\}\">.*?</div>`;", re.DOTALL)

replacement = """htmlBadges += `<div class="neo-box badge-board-card ${bgClass}" style="position: relative; ${opacityClass} aspect-ratio: 1; display: flex; align-items: center; justify-content: center; padding: 10px; min-height: auto;">
                        ${lockIcon}
                        <i class="fa-solid ${modul.icon}"></i>
                    </div>`;"""

new_content = pattern.sub(replacement, content)
with open('public/app-logic.js', 'w') as f:
    f.write(new_content)
print("done")
