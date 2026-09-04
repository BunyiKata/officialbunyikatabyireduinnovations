import re
with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "if (susunSlots.includes(opt)) {",
    "if (susunSlots.includes(i as any)) {"
)

content = content.replace(
    "onClick={() => handleOptionClick(opt)}",
    "draggable={currentQ.type === 'susun' && !susunSlots.includes(i as any)}\n                                onDragStart={(e) => { e.dataTransfer.setData('text/plain', i.toString()); }}\n                                onClick={() => handleOptionClick(opt, i)}"
)

with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
    f.write(content)
