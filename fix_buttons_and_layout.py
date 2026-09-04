import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Maklumat modal buttons
# Batal button:
content = re.sub(
    r"backgroundColor:\s*'#e2e8f0',([^}]+color:\s*'var\(--color-dark\)')",
    r"backgroundColor: '#ef4444', \1 /* RED BUTTON */, color: 'white'",
    content
)

# Simpan button (line 1968)
content = re.sub(
    r"backgroundColor:\s*'#168f81'([^}]+color:\s*'white')",
    r"backgroundColor: 'var(--color-blue)' \1",
    content
)

# 2. Fix the layout of Maklumat modal on mobile.
# Earlier I added CSS for .maklumat-form-container to stack.
# We need to remove that stacking so it goes back to side-by-side, but keep it responsive or scale it.
# Actually, I can just modify src/index.css to remove the flex-direction: column for maklumat-form-container, OR remove .maklumat-form-container entirely.

with open('src/App.tsx', 'w') as f:
    f.write(content)
