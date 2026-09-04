import re
import ast

with open('public/app-logic.js', 'r') as f:
    content = f.read()

match = re.search(r'var moduleContentData = (\{.+?\n        \});\n        window\.moduleContentData = moduleContentData;', content, re.DOTALL)
if match:
    data_str = match.group(1)
    # The structure is JS, not strict JSON. Let's extract 'flashcards' arrays.
    for key_match in re.finditer(r"'suku_kata_([a-z_]+)':\s*\{[^\}]+flashcards:\s*\[(.*?)\]", data_str, re.DOTALL):
        key = key_match.group(1)
        cards_str = key_match.group(2)
        fronts = re.findall(r"front:\s*'([^']+)'", cards_str)
        print(f"{key}: {fronts}")
