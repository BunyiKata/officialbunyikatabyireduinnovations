import re
import json
import random

with open('src/components/TandukKataGame.tsx', 'r') as f:
    content = f.read()

# Extract WORD_DATABASE
db_part = content.split('const WORD_DATABASE')[1].split('const CATEGORY_TO_MODULE_MAP')[0]
# start from the actual object:
start_idx = db_part.find('= {') + 2
db_str = db_part[start_idx:db_part.rfind('}')+1]

# Add quotes to keys
db_str = re.sub(r'\'(.*?)\':', r'"\1":', db_str)
db_str = re.sub(r'([a-zA-Z0-9_]+):', r'"\1":', db_str)
db_str = db_str.replace("'", '"')

# Replace trailing commas
db_str = re.sub(r',\s*}', '}', db_str)
db_str = re.sub(r',\s*\]', ']', db_str)

db = json.loads(db_str)

def generate_cabaran(db):
    game_data = "export const GAME_DATA: Record<string, any[]> = {\n"
    
    # KV: dengar
    kv_items = db['KV']
    game_data += "  suku_kata_kv: [\n"
    for item in kv_items:
        options = random.sample([x['word'] for x in kv_items if x['word'] != item['word']], 3) + [item['word']]
        random.shuffle(options)
        game_data += f"    {{ type: 'dengar', audio: '{item['word']}', options: {options}, answer: '{item['word']}' }},\n"
    game_data += "  ],\n"

    # KV + KV: padan
    kvkv_items = db['KV + KV']
    game_data += "  suku_kata_kv_kv: [\n"
    for item in kvkv_items:
        options = random.sample([x['word'] for x in kvkv_items if x['word'] != item['word']], 3) + [item['word']]
        random.shuffle(options)
        game_data += f"    {{ type: 'padan', image: '{item['emoji']}', imageText: '{item['word']}', options: {options}, answer: '{item['word']}' }},\n"
    game_data += "  ],\n"

    # V + KV: lengkap (prefix: ___, suffix: 2nd syllable)
    vkv_items = db['V + KV']
    game_data += "  suku_kata_v_kv: [\n"
    for item in vkv_items:
        syl1 = item['syllables'][0]
        syl2 = item['syllables'][1]
        options = random.sample(['a', 'e', 'i', 'o', 'u'], 4)
        if syl1 not in options: options[0] = syl1
        random.shuffle(options)
        game_data += f"    {{ type: 'lengkap', image: '{item['emoji']}', imageText: '{item['word']}', prefix: '___', suffix: '{syl2}', options: {options}, answer: '{syl1}' }},\n"
    game_data += "  ],\n"

    # KV + KV + KV: susun
    kvkvkv_items = db['KV + KV + KV']
    game_data += "  suku_kata_kv_kv_kv: [\n"
    for item in kvkvkv_items:
        opts = item['syllables'][:]
        random.shuffle(opts)
        game_data += f"    {{ type: 'susun', image: '{item['emoji']}', imageText: '{item['word']}', syllables: {item['syllables']}, options: {opts} }},\n"
    game_data += "  ],\n"

    # KVK: teka
    kvk_items = db['KVK']
    game_data += "  suku_kata_kvk: [\n"
    for item in kvk_items:
        word = item['word']
        # Extract vowel
        vowel = 'a'
        for v in 'aeiou':
            if v in word: vowel = v; break
        text = word.replace(vowel, '_', 1)
        options = random.sample(['a', 'e', 'i', 'o', 'u'], 4)
        if vowel not in options: options[0] = vowel
        random.shuffle(options)
        game_data += f"    {{ type: 'teka', image: '{item['emoji']}', imageText: '{item['word']}', text: '{text}', options: {options}, answer: '{vowel}' }},\n"
    game_data += "  ],\n"

    # V + KVK: bakul
    vkvk_items = db['V + KVK']
    game_data += "  suku_kata_v_kvk: [\n"
    for i, item in enumerate(vkvk_items):
        cat = 'a' if i % 2 == 0 else 'b' # Just mock categories
        game_data += f"    {{ type: 'bakul', words: [{{ id: {i+1}, text: '{item['word']}', image: '{item['emoji']}', category: '{cat}' }}] }},\n"
    game_data += "  ],\n"

    # HERO
    # KV + KVK: dengar
    kvkvk_items = db['KV + KVK']
    game_data += "  suku_kata_kv_kvk: [\n"
    for item in kvkvk_items:
        options = random.sample([x['word'] for x in kvkvk_items if x['word'] != item['word']], 3) + [item['word']]
        random.shuffle(options)
        game_data += f"    {{ type: 'dengar', audio: '{item['word']}', options: {options}, answer: '{item['word']}' }},\n"
    game_data += "  ],\n"

    # KVK + KV: padan
    kvkkv_items = db['KVK + KV']
    game_data += "  suku_kata_kvk_kv: [\n"
    for item in kvkkv_items:
        options = random.sample([x['word'] for x in kvkkv_items if x['word'] != item['word']], 3) + [item['word']]
        random.shuffle(options)
        game_data += f"    {{ type: 'padan', image: '{item['emoji']}', imageText: '{item['word']}', options: {options}, answer: '{item['word']}' }},\n"
    game_data += "  ],\n"

    # KVK + KVK: lengkap (prefix: syl1, suffix: '___')
    kvkkvk_items = db['KVK + KVK']
    game_data += "  suku_kata_kvk_kvk: [\n"
    for item in kvkkvk_items:
        syl1 = item['syllables'][0]
        syl2 = item['syllables'][1]
        pool = [x['syllables'][1] for x in kvkkvk_items if x['syllables'][1] != syl2]
        if len(pool) < 3: pool = pool * 3
        options = random.sample(pool, 3) + [syl2]
        random.shuffle(options)
        game_data += f"    {{ type: 'lengkap', image: '{item['emoji']}', imageText: '{item['word']}', prefix: '{syl1}', suffix: '___', options: {options}, answer: '{syl2}' }},\n"
    game_data += "  ],\n"

    # KVKK: teka
    kvkk_items = db['KVKK']
    game_data += "  suku_kata_kvkk: [\n"
    for item in kvkk_items:
        word = item['word']
        vowel = 'a'
        for v in 'aeiou':
            if v in word: vowel = v; break
        text = word.replace(vowel, '_', 1)
        options = random.sample(['a', 'e', 'i', 'o', 'u'], 4)
        if vowel not in options: options[0] = vowel
        random.shuffle(options)
        game_data += f"    {{ type: 'teka', image: '{item['emoji']}', imageText: '{item['word']}', text: '{text}', options: {options}, answer: '{vowel}' }},\n"
    game_data += "  ],\n"

    # KV + KV + KVK: susun
    kvkvkvk_items = db['KV + KV + KVK']
    game_data += "  suku_kata_kv_kv_kvk: [\n"
    for item in kvkvkvk_items:
        opts = item['syllables'][:]
        random.shuffle(opts)
        game_data += f"    {{ type: 'susun', image: '{item['emoji']}', imageText: '{item['word']}', syllables: {item['syllables']}, options: {opts} }},\n"
    game_data += "  ],\n"

    # KVK + KV + KVK: susun
    kvkkvkvk_items = db['KVK + KV + KVK']
    game_data += "  suku_kata_kvk_kv_kvk: [\n"
    for item in kvkkvkvk_items:
        opts = item['syllables'][:]
        random.shuffle(opts)
        game_data += f"    {{ type: 'susun', image: '{item['emoji']}', imageText: '{item['word']}', syllables: {item['syllables']}, options: {opts} }},\n"
    game_data += "  ],\n"

    # Adding default fonik, cerita_pendek, huruf_konsonan for consistency (or keeping existing)
    game_data += """
  huruf_konsonan: [
    { type: 'teka', image: '📖', imageText: 'buku', text: 'b _ k u', options: ['u', 'a', 'i', 'e'], answer: 'u' }
  ],
  fonik_abc: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' }
  ],
  cerita_pendek: [
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 1, text: 'Ikan terbang di awan.', image: '🐟', category: 'b' }] }
  ]
"""
    game_data += "};\n"
    return game_data


def generate_perpustakaan(db):
    res = "const ASAS_SHELVES_DATA = [\n"
    mapping_asas = [
        ('KV', 'Rak 1 — KV', '#ec4899'),
        ('KV + KV', 'Rak 2 — KV + KV', '#3b82f6'),
        ('V + KV', 'Rak 3 — V + KV', '#22c55e'),
        ('KV + KV + KV', 'Rak 4 — KV + KV + KV', '#a855f7'),
        ('KVK', 'Rak 5 — KVK', '#f97316'),
        ('V + KVK', 'Rak 6 — V + KVK', '#eab308')
    ]
    for key, title, color in mapping_asas:
        items = db[key]
        res += f"    {{\n        id: '{key}', title: '{title}', color: '{color}',\n        words: [\n"
        for item in items:
            res += f"            {{ syl: {item['syllables']}, word: '{item['word']}', emoji: '{item['emoji']}' }},\n"
        res += "        ]\n    },\n"
    res += "];\n\n"

    res += "const HERO_SHELVES_DATA = [\n"
    mapping_hero = [
        ('KV + KVK', 'Rak 1 — KV + KVK', '#ec4899'),
        ('KVK + KV', 'Rak 2 — KVK + KV', '#3b82f6'),
        ('KVK + KVK', 'Rak 3 — KVK + KVK', '#22c55e'),
        ('KVKK', 'Rak 4 — KVKK', '#a855f7'),
        ('KV + KV + KVK', 'Rak 5 — KV + KV + KVK', '#f97316'),
        ('KVK + KV + KVK', 'Rak 6 — KVK + KV + KVK', '#eab308')
    ]
    for key, title, color in mapping_hero:
        items = db[key]
        res += f"    {{\n        id: '{key}', title: '{title}', color: '{color}',\n        words: [\n"
        for item in items:
            res += f"            {{ syl: {item['syllables']}, word: '{item['word']}', emoji: '{item['emoji']}' }},\n"
        res += "        ]\n    },\n"
    res += "];\n"
    return res

cabaran = generate_cabaran(db)
perp = generate_perpustakaan(db)

with open('cabaran_patch.ts', 'w') as f:
    f.write(cabaran)

with open('perp_patch.ts', 'w') as f:
    f.write(perp)

print("Generated cabaran_patch.ts and perp_patch.ts")
