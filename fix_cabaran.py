import sys
import re

with open('src/components/CabaranSukuKataGame.tsx', 'r') as f:
    content = f.read()

# I will inject the missing Map 1 and Map 4 keys into CABARAN_DATA

map1_data = """
  kenal_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'ph', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],
  kenali_huruf: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'b', options: ['d', 'b', 'p', 'q'], answer: 'b' },
    { type: 'dengar', audio: 'c', options: ['s', 'c', 'k', 'z'], answer: 'c' },
    { type: 'dengar', audio: 'd', options: ['b', 'p', 'd', 't'], answer: 'd' },
    { type: 'dengar', audio: 'e', options: ['i', 'a', 'e', 'u'], answer: 'e' },
    { type: 'dengar', audio: 'f', options: ['v', 'f', 'ph', 'p'], answer: 'f' },
    { type: 'dengar', audio: 'g', options: ['j', 'g', 'q', 'k'], answer: 'g' },
    { type: 'dengar', audio: 'h', options: ['n', 'h', 'm', 'k'], answer: 'h' },
    { type: 'dengar', audio: 'm', options: ['n', 'w', 'm', 'v'], answer: 'm' },
    { type: 'dengar', audio: 'z', options: ['s', 'x', 'z', 'c'], answer: 'z' }
  ],
  huruf_vokal: [
    { type: 'padan', image: '🐔', imageText: 'ayam', options: ['a', 'e', 'i', 'u'], answer: 'a' },
    { type: 'padan', image: '🍎', imageText: 'epal', options: ['e', 'a', 'o', 'i'], answer: 'e' },
    { type: 'padan', image: '🐟', imageText: 'ikan', options: ['i', 'u', 'o', 'a'], answer: 'i' },
    { type: 'padan', image: '🧠', imageText: 'otak', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'padan', image: '🐍', imageText: 'ular', options: ['u', 'a', 'e', 'o'], answer: 'u' },
    { type: 'padan', image: '🔥', imageText: 'api', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'padan', image: '6️⃣', imageText: 'enam', options: ['e', 'a', 'o', 'u'], answer: 'e' },
    { type: 'padan', image: '👵', imageText: 'ibu', options: ['i', 'a', 'u', 'e'], answer: 'i' },
    { type: 'padan', image: '🔦', imageText: 'obor', options: ['o', 'u', 'e', 'a'], answer: 'o' },
    { type: 'padan', image: '💊', imageText: 'ubat', options: ['u', 'a', 'i', 'o'], answer: 'u' }
  ],
  huruf_konsonan: [
    { type: 'teka', image: '📖', imageText: 'buku', text: 'b _ k u', options: ['u', 'a', 'i', 'e'], answer: 'u' },
    { type: 'teka', image: '🐴', imageText: 'kuda', text: 'k _ d a', options: ['u', 'a', 'i', 'o'], answer: 'u' },
    { type: 'teka', image: '⚽', imageText: 'bola', text: 'b _ l a', options: ['o', 'a', 'i', 'e'], answer: 'o' },
    { type: 'teka', image: '🪑', imageText: 'meja', text: 'm _ j a', options: ['e', 'a', 'i', 'u'], answer: 'e' },
    { type: 'teka', image: '🥄', imageText: 'sudu', text: 's _ d u', options: ['u', 'a', 'i', 'o'], answer: 'u' },
    { type: 'teka', image: '🪴', imageText: 'pasu', text: 'p _ s u', options: ['a', 'e', 'i', 'u'], answer: 'a' },
    { type: 'teka', image: '🔨', imageText: 'paku', text: 'p _ k u', options: ['a', 'i', 'u', 'e'], answer: 'a' },
    { type: 'teka', image: '👗', imageText: 'baju', text: 'b _ j u', options: ['a', 'e', 'i', 'o'], answer: 'a' },
    { type: 'teka', image: '🪨', imageText: 'batu', text: 'b _ t u', options: ['a', 'u', 'i', 'e'], answer: 'a' },
    { type: 'teka', image: '🦌', imageText: 'rusa', text: 'r _ s a', options: ['u', 'a', 'i', 'e'], answer: 'u' }
  ],
  fonik_abc: [
    { type: 'dengar', audio: 'a', options: ['a', 'b', 'c', 'd'], answer: 'a' },
    { type: 'dengar', audio: 'ba', options: ['ba', 'ca', 'da', 'ka'], answer: 'ba' },
    { type: 'dengar', audio: 'cu', options: ['ca', 'cu', 'ci', 'co'], answer: 'cu' },
    { type: 'dengar', audio: 'di', options: ['bi', 'di', 'fi', 'gi'], answer: 'di' },
    { type: 'dengar', audio: 'fe', options: ['fe', 'fa', 'fo', 'fu'], answer: 'fe' },
    { type: 'dengar', audio: 'gu', options: ['ga', 'ge', 'gu', 'gi'], answer: 'gu' },
    { type: 'dengar', audio: 'hi', options: ['ha', 'he', 'hi', 'ho'], answer: 'hi' },
    { type: 'dengar', audio: 'ja', options: ['ja', 'je', 'ji', 'ju'], answer: 'ja' },
    { type: 'dengar', audio: 'ku', options: ['ka', 'ke', 'ki', 'ku'], answer: 'ku' },
    { type: 'dengar', audio: 'lo', options: ['la', 'li', 'lu', 'lo'], answer: 'lo' },
    { type: 'dengar', audio: 'mi', options: ['ma', 'me', 'mi', 'mo'], answer: 'mi' }
  ],
  cerita_pendek: [
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 1, text: 'Ikan terbang di awan.', image: '🐟', category: 'b' }] },
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 2, text: 'Burung buat sarang di pokok.', image: '🦅', category: 'a' }] },
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 3, text: 'Lembu minum susu strawberi.', image: '🐄', category: 'b' }] },
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 4, text: 'Kucing suka makan ikan.', image: '🐈', category: 'a' }] },
    { type: 'bakul', bakulATitle: 'betul', bakulADesc: 'ayat logik', bakulBTitle: 'salah', bakulBDesc: 'ayat pelik', words: [{ id: 5, text: 'Bintang keluar waktu malam.', image: '⭐', category: 'a' }] }
  ],
"""

# Find where to inject
insert_idx = content.find('const CABARAN_DATA: Record<string, any[]> = {\n') + len('const CABARAN_DATA: Record<string, any[]> = {\n')

# Check if it already exists
if 'kenali_huruf' not in content:
    new_content = content[:insert_idx] + map1_data + content[insert_idx:]
    with open('src/components/CabaranSukuKataGame.tsx', 'w') as f:
        f.write(new_content)
    print("Injected map 1 data.")
else:
    print("Already exists.")

# Clean up duplicate fonik_abc, cerita_pendek from the generated script at the end
# The script outputting cabaran_patch had them at the end.
