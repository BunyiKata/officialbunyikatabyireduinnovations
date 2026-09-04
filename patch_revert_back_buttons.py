import re

with open('index.html', 'r') as f:
    content = f.read()

# For murid-menu-latihan and view-latihan-*
# We want to change the back button ONLY to bg-orange
def map_top_bar_replace(match):
    block = match.group(0)
    block = re.sub(r'(<button [^>]*class="neo-btn )bg-purple([^>]*back-icon-btn)', r'\1bg-orange\2', block)
    return block

sections = content.split('<div id="')
for i, section in enumerate(sections):
    if section.startswith('view-latihan-') or section.startswith('murid-menu-latihan"'):
        top_bar_match = re.search(r'<div class="map-top-bar">.*?(?=</div>)', section, flags=re.DOTALL)
        if top_bar_match:
            new_top_bar = map_top_bar_replace(top_bar_match)
            section = section[:top_bar_match.start()] + new_top_bar + section[top_bar_match.end():]
        sections[i] = section

with open('index.html', 'w') as f:
    f.write('<div id="'.join(sections))

with open('public/app.js', 'r') as f:
    app_js = f.read()

# Revert app.js map-back-btn logic
# Find: const backBtn = document.getElementById('map-back-btn');
# And remove the color changing logic.
old_logic = """            const backBtn = document.getElementById('map-back-btn');
            if (backBtn) {
                if (modSemasa === 'latihan') {
                    backBtn.classList.remove('bg-orange');
                    backBtn.classList.add('bg-purple');
                } else {
                    backBtn.classList.remove('bg-purple');
                    backBtn.classList.add('bg-orange');
                }
            }"""

new_logic = """            const backBtn = document.getElementById('map-back-btn');
            if (backBtn) {
                backBtn.classList.remove('bg-purple');
                backBtn.classList.add('bg-orange');
            }"""

if old_logic in app_js:
    app_js = app_js.replace(old_logic, new_logic)

with open('public/app.js', 'w') as f:
    f.write(app_js)

