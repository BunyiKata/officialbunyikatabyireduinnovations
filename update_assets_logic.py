import os

app_logic_path = os.path.join('public', 'app-logic.js')
with open(app_logic_path, 'r', encoding='utf-8') as f:
    code = f.read()

kvk_replacements = [
    ("{front: 'kot', back: 'KOT', icon: '🧥'}", "{front: 'kot', back: 'KOT', icon: '<img src=\"/images/sukukata/kot.png\" class=\"sk-icon-img\" alt=\"kot\"/>'}"),
    ("{front: 'pam', back: 'PAM', icon: '⛽'}", "{front: 'pam', back: 'PAM', icon: '<img src=\"/images/sukukata/pam.png\" class=\"sk-icon-img\" alt=\"pam\"/>'}"),
    ("{front: 'pen', back: 'PEN', icon: '🖊️'}", "{front: 'pen', back: 'PEN', icon: '<img src=\"/images/sukukata/pen.png\" class=\"sk-icon-img\" alt=\"pen\"/>'}"),
    ("{front: 'pil', back: 'PIL', icon: '💊'}", "{front: 'pil', back: 'PIL', icon: '<img src=\"/images/sukukata/pil.png\" class=\"sk-icon-img\" alt=\"pil\"/>'}"),
    ("{front: 'pin', back: 'PIN', icon: '📌'}", "{front: 'pin', back: 'PIN', icon: '<img src=\"/images/sukukata/pin.png\" class=\"sk-icon-img\" alt=\"pin\"/>'}"),
]

for old, new in kvk_replacements:
    if old in code:
        code = code.replace(old, new)
        print("Replaced KVK item")

with open(app_logic_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("app-logic.js saved successfully.")
