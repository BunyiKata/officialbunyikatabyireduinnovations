import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# For bukaPeta(1)
content = content.replace(
    "onClick={(e) => { bukaPeta(1) }}",
    "onClick={(e) => { if ((window as any).playNavSound) (window as any).playNavSound(); bukaPeta(1); }}"
)
# For bukaPeta(2)
content = content.replace(
    "onClick={(e) => { bukaPeta(2) }}",
    "onClick={(e) => { if ((window as any).playNavSound) (window as any).playNavSound(); bukaPeta(2); }}"
)
# For bukaPeta(3)
content = content.replace(
    "onClick={(e) => { bukaPeta(3) }}",
    "onClick={(e) => { if ((window as any).playNavSound) (window as any).playNavSound(); bukaPeta(3); }}"
)
# For bukaPeta(4)
content = content.replace(
    "onClick={(e) => { bukaPeta(4) }}",
    "onClick={(e) => { if ((window as any).playNavSound) (window as any).playNavSound(); bukaPeta(4); }}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Patched App.tsx for sounds")
