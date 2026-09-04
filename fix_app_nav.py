import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's see the bottom nav structure.
# grep nav-bottom, bottom-nav etc.
