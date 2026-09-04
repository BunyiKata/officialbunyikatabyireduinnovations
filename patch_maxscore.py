import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Update getMaxScore function
old_fn = """        function getMaxScore(modId) {
            if (modId === 'suku_kata_v_kv') return 6;
            return 10;
        }"""
        
new_fn = """        function getMaxScore(modId) {
            if (modId === 'suku_kata_v_kv') return 6;
            if (modId === 'suku_kata_kvkk') return 6;
            return 10;
        }"""
        
content = content.replace(old_fn, new_fn)

# Update hardcoded inline maxScore assignments
old_inline = """(mod.id === 'suku_kata_v_kv' ? 6 : 10)"""
new_inline = """(mod.id === 'suku_kata_v_kv' || mod.id === 'suku_kata_kvkk' ? 6 : 10)"""
content = content.replace(old_inline, new_inline)

old_inline2 = """(key === 'suku_kata_v_kv' ? 6 : 10)"""
new_inline2 = """(key === 'suku_kata_v_kv' || key === 'suku_kata_kvkk' ? 6 : 10)"""
content = content.replace(old_inline2, new_inline2)


with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched getMaxScore")
