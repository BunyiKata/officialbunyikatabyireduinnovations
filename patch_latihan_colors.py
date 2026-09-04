import re

with open('index.html', 'r') as f:
    content = f.read()

def replace_orange_to_purple(match):
    block = match.group(0)
    # Inside this block, replace the specific classes
    # 1. Back button
    block = re.sub(r'(<button class="neo-btn )bg-orange( back-icon-btn")', r'\1bg-purple\2', block)
    # 2. Page title
    block = re.sub(r'(<div class="neo-btn )bg-orange( page-title")', r'\1bg-purple\2', block)
    return block

# Find each view-latihan- screen and the murid-menu-latihan screen
# We can match from <div id="view-latihan-..." to the next </div> or just the map-top-bar
pattern = r'<div id="(view-latihan-[^"]+|murid-menu-latihan)" class="screen">.*?(?=</div)'

# Actually, it's safer to just replace it within map-top-bar of those specific IDs.
# Let's use BeautifulSoup or just regex.
# Regex to match map-top-bar inside these screens.
def map_top_bar_replace(match):
    block = match.group(0)
    block = re.sub(r'(<button class="neo-btn )bg-orange( back-icon-btn")', r'\1bg-purple\2', block)
    block = re.sub(r'(<div[^>]*class="neo-btn )bg-orange( page-title")', r'\1bg-purple\2', block)
    return block

# Using a slightly different approach:
# Split by '<div id="', then if it starts with 'view-latihan-' or 'murid-menu-latihan', do the replace on the first map-top-bar found.
sections = content.split('<div id="')
for i, section in enumerate(sections):
    if section.startswith('view-latihan-') or section.startswith('murid-menu-latihan"'):
        # Find map-top-bar
        top_bar_match = re.search(r'<div class="map-top-bar">.*?(?=</div>)', section, flags=re.DOTALL)
        if top_bar_match:
            new_top_bar = map_top_bar_replace(top_bar_match)
            section = section[:top_bar_match.start()] + new_top_bar + section[top_bar_match.end():]
        sections[i] = section

with open('index.html', 'w') as f:
    f.write('<div id="'.join(sections))

