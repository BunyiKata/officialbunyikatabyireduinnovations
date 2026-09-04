import re

with open('src/index.css', 'r') as f:
    content = f.read()

target = """    .teacher-sticky-nav .neo-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        min-height: 52px !important;
        padding: 6px 4px !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        border-radius: 12px !important;
        border: 2px solid var(--color-dark) !important;
        background: #ffffff !important;
        color: var(--color-dark) !important;
        box-shadow: none !important;
    }"""

replacement = """    .teacher-sticky-nav .neo-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        min-height: 52px !important;
        padding: 6px 4px !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        border-radius: 12px !important;
        border: 2px solid var(--color-dark) !important;
        background: #ffffff !important;
        color: var(--color-dark) !important;
        box-shadow: none !important;
        flex: 0 0 70px !important;
        min-width: 70px !important;
    }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/index.css")
else:
    print("Target not found")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
