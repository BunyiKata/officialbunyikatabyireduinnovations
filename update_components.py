import os

# 1. Update TandukKataGame.tsx
tanduk_path = os.path.join('src', 'components', 'TandukKataGame.tsx')
with open(tanduk_path, 'r', encoding='utf-8') as f:
    t_code = f.read()

t_replacements = [
    ("{ word: 'kot', syllables: ['kot'], emoji: '🧥' }", "{ word: 'kot', syllables: ['kot'], emoji: '/images/sukukata/kot.png' }"),
    ("{ word: 'pam', syllables: ['pam'], emoji: '⛽' }", "{ word: 'pam', syllables: ['pam'], emoji: '/images/sukukata/pam.png' }"),
    ("{ word: 'pen', syllables: ['pen'], emoji: '🖊️' }", "{ word: 'pen', syllables: ['pen'], emoji: '/images/sukukata/pen.png' }"),
    ("{ word: 'pil', syllables: ['pil'], emoji: '💊' }", "{ word: 'pil', syllables: ['pil'], emoji: '/images/sukukata/pil.png' }"),
    ("{ word: 'pin', syllables: ['pin'], emoji: '📌' }", "{ word: 'pin', syllables: ['pin'], emoji: '/images/sukukata/pin.png' }"),
    ("{ word: 'garpu', syllables: ['gar', 'pu'], emoji: '🍴' }", "{ word: 'garpu', syllables: ['gar', 'pu'], emoji: '/images/sukukata/garpu.png' }"),
]

for old, new in t_replacements:
    if old in t_code:
        t_code = t_code.replace(old, new)
        print("TandukKataGame: replaced entry")
    else:
        print(f"TandukKataGame WARNING: entry not found: {old[:30]}")

with open(tanduk_path, 'w', encoding='utf-8') as f:
    f.write(t_code)


# 2. Update PerpustakaanGame.tsx
perp_path = os.path.join('src', 'components', 'PerpustakaanGame.tsx')
with open(perp_path, 'r', encoding='utf-8') as f:
    p_code = f.read()

p_replacements = [
    ("{ syl: ['kot'], word: 'kot', emoji: '🧥' }", "{ syl: ['kot'], word: 'kot', emoji: '/images/sukukata/kot.png' }"),
    ("{ syl: ['pam'], word: 'pam', emoji: '⛽' }", "{ syl: ['pam'], word: 'pam', emoji: '/images/sukukata/pam.png' }"),
    ("{ syl: ['pen'], word: 'pen', emoji: '🖊️' }", "{ syl: ['pen'], word: 'pen', emoji: '/images/sukukata/pen.png' }"),
    ("{ syl: ['pil'], word: 'pil', emoji: '💊' }", "{ syl: ['pil'], word: 'pil', emoji: '/images/sukukata/pil.png' }"),
    ("{ syl: ['pin'], word: 'pin', emoji: '📌' }", "{ syl: ['pin'], word: 'pin', emoji: '/images/sukukata/pin.png' }"),
    ("{ syl: ['gar', 'pu'], word: 'garpu', emoji: '🍴' }", "{ syl: ['gar', 'pu'], word: 'garpu', emoji: '/images/sukukata/garpu.png' }"),
]

for old, new in p_replacements:
    if old in p_code:
        p_code = p_code.replace(old, new)
        print("PerpustakaanGame: replaced entry")
    else:
        print(f"PerpustakaanGame WARNING: entry not found: {old[:30]}")

with open(perp_path, 'w', encoding='utf-8') as f:
    f.write(p_code)


# 3. Update CabaranSukuKataGame.tsx
cabaran_path = os.path.join('src', 'components', 'CabaranSukuKataGame.tsx')
with open(cabaran_path, 'r', encoding='utf-8') as f:
    c_code = f.read()

# Replace garpu and cermin icons in CabaranSukuKataGame
c_code = c_code.replace(
    "{front: 'gar - pu', back: 'GARPU', icon: '🍴'}",
    "{front: 'gar - pu', back: 'GARPU', icon: '<img src=\"/images/sukukata/garpu.png\" class=\"sk-icon-img\" alt=\"garpu\"/>'}"
)
c_code = c_code.replace(
    "{front: 'cer - min', back: 'CERMIN', icon: '🪞'}",
    "{front: 'cer - min', back: 'CERMIN', icon: '<img src=\"/images/sukukata/cermin.png\" class=\"sk-icon-img\" alt=\"cermin\"/>'}"
)

# Add suku_kata_kvk to MODULE_FLASHCARDS if missing
kvk_block = """  suku_kata_kvk: [
    {front: 'bas', back: 'BAS', icon: '<img src="/images/sukukata/bas.png" class="sk-icon-img" alt="bas"/>'},
    {front: 'beg', back: 'BEG', icon: '<img src="/images/sukukata/beg.png" class="sk-icon-img" alt="beg"/>'},
    {front: 'bot', back: 'BOT', icon: '<img src="/images/sukukata/bot.png" class="sk-icon-img" alt="bot"/>'},
    {front: 'cat', back: 'CAT', icon: '<img src="/images/sukukata/cat.png" class="sk-icon-img" alt="cat"/>'},
    {front: 'jag', back: 'JAG', icon: '<img src="/images/sukukata/jag.png" class="sk-icon-img" alt="jag"/>'},
    {front: 'jam', back: 'JAM', icon: '<img src="/images/sukukata/jam.png" class="sk-icon-img" alt="jam"/>'},
    {front: 'jem', back: 'JEM', icon: '<img src="/images/sukukata/jem.png" class="sk-icon-img" alt="jem"/>'},
    {front: 'jet', back: 'JET', icon: '<img src="/images/sukukata/jet.png" class="sk-icon-img" alt="jet"/>'},
    {front: 'kek', back: 'KEK', icon: '<img src="/images/sukukata/kek.png" class="sk-icon-img" alt="kek"/>'},
    {front: 'kot', back: 'KOT', icon: '<img src="/images/sukukata/kot.png" class="sk-icon-img" alt="kot"/>'},
    {front: 'pam', back: 'PAM', icon: '<img src="/images/sukukata/pam.png" class="sk-icon-img" alt="pam"/>'},
    {front: 'pen', back: 'PEN', icon: '<img src="/images/sukukata/pen.png" class="sk-icon-img" alt="pen"/>'},
    {front: 'pil', back: 'PIL', icon: '<img src="/images/sukukata/pil.png" class="sk-icon-img" alt="pil"/>'},
    {front: 'pin', back: 'PIN', icon: '<img src="/images/sukukata/pin.png" class="sk-icon-img" alt="pin"/>'},
    {front: 'rak', back: 'RAK', icon: '<img src="/images/sukukata/rak.png" class="sk-icon-img" alt="rak"/>'},
    {front: 'rim', back: 'RIM', icon: '<img src="/images/sukukata/rim.png" class="sk-icon-img" alt="rim"/>'},
    {front: 'ros', back: 'ROS', icon: '<img src="/images/sukukata/ros.png" class="sk-icon-img" alt="ros"/>'},
    {front: 'sup', back: 'SUP', icon: '<img src="/images/sukukata/sup.png" class="sk-icon-img" alt="sup"/>'},
    {front: 'tin', back: 'TIN', icon: '<img src="/images/sukukata/tin.png" class="sk-icon-img" alt="tin"/>'},
    {front: 'van', back: 'VAN', icon: '<img src="/images/sukukata/van.png" class="sk-icon-img" alt="van"/>'}
  ],
"""

if 'suku_kata_kvk:' not in c_code:
    c_code = c_code.replace("const MODULE_FLASHCARDS: Record<string, Array<{front: string; back: string; icon: string}>> = {\n", "const MODULE_FLASHCARDS: Record<string, Array<{front: string; back: string; icon: string}>> = {\n" + kvk_block)
    print("CabaranSukuKataGame: added suku_kata_kvk to MODULE_FLASHCARDS")

with open(cabaran_path, 'w', encoding='utf-8') as f:
    f.write(c_code)

print("All components updated successfully.")
