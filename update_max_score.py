with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_fn = """        function getMaxScore(modId) {
            if (modId === 'suku_kata_v_kv') return 6;
            if (modId === 'suku_kata_kvkk') return 6;
            return 10;
        }"""

new_fn = """        function getMaxScore(modId) {
            if (modId === 'suku_kata_v_kv') return 6;
            if (modId === 'suku_kata_kvk_kv') return 8;
            if (modId === 'suku_kata_kvkk') return 6;
            if (modId === 'suku_kata_kv_kv_kvk') return 9;
            if (modId === 'suku_kata_kvk_kv_kvk') return 6;
            return 10;
        }"""

if old_fn in content:
    content = content.replace(old_fn, new_fn)
    with open('public/app-logic.js', 'w') as f:
        f.write(content)
    print("Updated public/app-logic.js")
else:
    print("Could not find the function in public/app-logic.js")
