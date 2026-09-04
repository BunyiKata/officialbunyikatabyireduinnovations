import re
import json

with open('src/components/TandukKataGame.tsx', 'r') as f:
    content = f.read()

db_match = re.search(r'const WORD_DATABASE: Record<string, any\[\]> = (\{.*?\});\n+const CATEGORY_TO_MODULE_MAP', content, re.DOTALL)
if db_match:
    print("Found!")
else:
    print("Not found.")
