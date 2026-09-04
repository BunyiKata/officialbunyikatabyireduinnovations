with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    content = f.read()

content = content.replace("pointerEvents: 'auto' as const", "pointerEvents: 'auto' as 'auto' | 'none'")

with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
    f.write(content)
