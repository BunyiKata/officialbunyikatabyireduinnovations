with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    content = f.read()

content = content.replace('#bae6fd', '#fef08a')

with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
    f.write(content)
