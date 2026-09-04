import re

with open("index.html", "r") as f:
    html = f.read()

# Replace specific bg-* classes with bg-white or just remove them. 
# Let's use a nice modern neutral class or just inline style.
# The user wants "modern sikit", maybe #1e293b (slate-800) with white text.
# Let's add a custom class 'nav-modern' instead of bg-*

html = re.sub(r'class="nav-item bg-orange desktop-nav-only"', 'class="nav-item nav-modern desktop-nav-only"', html)
html = re.sub(r'class="nav-item bg-blue mobile-nav-only"', 'class="nav-item nav-modern mobile-nav-only"', html)
html = re.sub(r'class="nav-item bg-green mobile-nav-only"', 'class="nav-item nav-modern mobile-nav-only"', html)
html = re.sub(r'class="nav-item bg-orange mobile-nav-only"', 'class="nav-item nav-modern mobile-nav-only"', html)
html = re.sub(r'class="nav-item bg-purple desktop-nav-only"', 'class="nav-item nav-modern desktop-nav-only"', html)
html = re.sub(r'class="nav-item bg-yellow"', 'class="nav-item nav-modern"', html)

with open("index.html", "w") as f:
    f.write(html)
