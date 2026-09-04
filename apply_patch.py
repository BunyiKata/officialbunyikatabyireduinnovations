import sys

# Patch CabaranSukuKataGame
with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    c_content = f.read()

with open('cabaran_patch.ts', 'r') as f:
    c_patch = f.read()

# Replace GAME_DATA with CABARAN_DATA in the patch text
c_patch = c_patch.replace('export const GAME_DATA', 'const CABARAN_DATA')

start_idx = c_content.find('const CABARAN_DATA: Record<string, any[]> = {')
end_idx = c_content.find('};', start_idx) + 2

if start_idx != -1 and end_idx != -1:
    new_c_content = c_content[:start_idx] + c_patch + c_content[end_idx:]
    with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
        f.write(new_c_content)
    print("Patched CabaranSukuKataGame.tsx")
else:
    print("Failed to patch CabaranSukuKataGame.tsx")
