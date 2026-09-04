with open('src/components/TandukKataGame.tsx', 'r') as f:
    content = f.read()

db_part = content.split('const WORD_DATABASE')[1].split('const CATEGORY_TO_MODULE_MAP')[0]
db_str = db_part[db_part.find('{'):db_part.rfind('}')+1]
print(db_str[:100])
