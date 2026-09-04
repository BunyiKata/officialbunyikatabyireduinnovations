import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's remove the "Perkataan" and "Akses" from the mobile view by simply relying on what they have. 
# Oh wait, let's look at the button:
# <button className="neo-btn bg-white desktop-nav-only"
# If it has desktop-nav-only, why does it show in the user's mobile screenshot?
# Wait! In the user's screenshot, it looks like a mobile device but the width might be e.g., 768px (iPad portrait) or similar? Or maybe it doesn't have desktop-nav-only.
