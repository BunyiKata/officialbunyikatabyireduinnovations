import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Find all keys in moduleContentData
match = re.search(r'var moduleContentData = \{(.+?)\n        window\.moduleContentData = moduleContentData;', content, re.DOTALL)
if match:
    data_str = match.group(1)
    keys = re.findall(r"'suku_kata_[^']+':", data_str)
    for key in keys:
        print(key)
