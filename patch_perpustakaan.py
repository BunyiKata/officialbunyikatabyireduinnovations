import re

with open('src/components/PerpustakaanGame.tsx', 'r') as f:
    content = f.read()

# Replace ASAS_SHELVES_DATA
old_asas = """const ASAS_SHELVES_DATA = [
    {
        id: 'KV', title: 'Rak 1 — KV', color: '#ec4899', // pink
        words: [
            { syl: ['bo', 'la'], word: 'bola', emoji: '⚽' },
            { syl: ['pa', 'ku'], word: 'paku', emoji: '🔨' },
            { syl: ['ma', 'ta'], word: 'mata', emoji: '👀' },
            { syl: ['gi', 'gi'], word: 'gigi', emoji: '🦷' },
            { syl: ['su', 'du'], word: 'sudu', emoji: '🥄' },
            { syl: ['pi', 'pi'], word: 'pipi', emoji: '😊' },
            { syl: ['da', 'du'], word: 'dadu', emoji: '🎲' },
            { syl: ['me', 'ja'], word: 'meja', emoji: '🪑' },
        ]
    },
    {
        id: 'KV + KV', title: 'Rak 2 — KV + KV', color: '#3b82f6', // blue
        words: [
            { syl: ['bu', 'ku'], word: 'buku', emoji: '📖' },
            { syl: ['ba', 'ju'], word: 'baju', emoji: '👕' },
            { syl: ['ro', 'ti'], word: 'roti', emoji: '🍞' },
            { syl: ['lo', 'ri'], word: 'lori', emoji: '🚛' },
            { syl: ['pa', 'su'], word: 'pasu', emoji: '🏺' },
            { syl: ['ko', 'pi'], word: 'kopi', emoji: '☕' },
            { syl: ['ci', 'ku'], word: 'ciku', emoji: '🥝' },
            { syl: ['to', 'pi'], word: 'topi', emoji: '🧢' },
        ]
    },
    {
        id: 'V + KV', title: 'Rak 3 — V + KV', color: '#22c55e', // green
        words: [
            { syl: ['i', 'bu'], word: 'ibu', emoji: '👩' },
            { syl: ['a', 'pi'], word: 'api', emoji: '🔥' },
            { syl: ['i', 'si'], word: 'isi', emoji: '🥩' },
            { syl: ['a', 'bu'], word: 'abu', emoji: '🌫️' },
            { syl: ['o', 'bo'], word: 'obo', emoji: '🎺' },
            { syl: ['a', 'ki'], word: 'aki', emoji: '👴' },
            { syl: ['i', 'tu'], word: 'itu', emoji: '👉' },
            { syl: ['a', 'lu'], word: 'alu', emoji: '🏏' },
        ]
    },
    {
        id: 'KV + KV + KV', title: 'Rak 4 — KV + KV + KV', color: '#a855f7', // purple
        words: [
            { syl: ['ke', 'ra', 'ta'], word: 'kereta', emoji: '🚗' },
            { syl: ['pe', 'to', 'la'], word: 'petola', emoji: '🥒' },
            { syl: ['ke', 'la', 'pa'], word: 'kelapa', emoji: '🥥' },
            { syl: ['ke', 'me', 'ja'], word: 'kemeja', emoji: '👔' },
            { syl: ['ke', 'ru', 'si'], word: 'kerusi', emoji: '🪑' },
            { syl: ['ba', 'te', 'ri'], word: 'bateri', emoji: '🔋' },
            { syl: ['ka', 'me', 'ra'], word: 'kamera', emoji: '📷' },
            { syl: ['pe', 'ra', 'hu'], word: 'perahu', emoji: '🛶' },
        ]
    },
    {
        id: 'KVK', title: 'Rak 5 — KVK', color: '#f97316', // orange
        words: [
            { syl: ['bot'], word: 'bot', emoji: '🚤' },
            { syl: ['cat'], word: 'cat', emoji: '🎨' },
            { syl: ['jam'], word: 'jam', emoji: '⌚' },
            { syl: ['zip'], word: 'zip', emoji: '🤐' },
            { syl: ['beg'], word: 'beg', emoji: '🎒' },
            { syl: ['gam'], word: 'gam', emoji: '🧴' },
            { syl: ['kek'], word: 'kek', emoji: '🎂' },
            { syl: ['jus'], word: 'jus', emoji: '🍹' },
        ]
    },
    {
        id: 'V + KVK', title: 'Rak 6 — V + KVK', color: '#eab308', // yellow
        words: [
            { syl: ['a', 'yam'], word: 'ayam', emoji: '🐔' },
            { syl: ['u', 'bat'], word: 'ubat', emoji: '💊' },
            { syl: ['i', 'kan'], word: 'ikan', emoji: '🐟' },
            { syl: ['o', 'tak'], word: 'otak', emoji: '🧠' },
            { syl: ['e', 'pal'], word: 'epal', emoji: '🍎' },
            { syl: ['u', 'lar'], word: 'ular', emoji: '🐍' },
            { syl: ['o', 'ren'], word: 'oren', emoji: '🍊' },
            { syl: ['e', 'kor'], word: 'ekor', emoji: '🐒' },
        ]
    }
];"""

new_asas = """const ASAS_SHELVES_DATA = [
    {
        id: 'KV', title: 'Rak 1 — KV', color: '#ec4899', // pink
        words: [
            { syl: ['ba'], word: 'ba', emoji: '🔊' },
            { syl: ['be'], word: 'be', emoji: '🔊' },
            { syl: ['bi'], word: 'bi', emoji: '🔊' },
            { syl: ['bo'], word: 'bo', emoji: '🔊' },
            { syl: ['bu'], word: 'bu', emoji: '🔊' },
            { syl: ['ca'], word: 'ca', emoji: '🔊' },
            { syl: ['ce'], word: 'ce', emoji: '🔊' },
            { syl: ['ci'], word: 'ci', emoji: '🔊' },
        ]
    },
    {
        id: 'KV + KV', title: 'Rak 2 — KV + KV', color: '#3b82f6', // blue
        words: [
            { syl: ['be', 'ca'], word: 'beca', emoji: '🛺' },
            { syl: ['ci', 'ku'], word: 'ciku', emoji: '🥔' },
            { syl: ['ja', 'ri'], word: 'jari', emoji: '👉' },
            { syl: ['ku', 'ku'], word: 'kuku', emoji: '💅' },
            { syl: ['la', 'bu'], word: 'labu', emoji: '🎃' },
            { syl: ['li', 'di'], word: 'lidi', emoji: '🪵' },
            { syl: ['ma', 'ta'], word: 'mata', emoji: '👁️' },
            { syl: ['na', 'si'], word: 'nasi', emoji: '🍚' },
        ]
    },
    {
        id: 'V + KV', title: 'Rak 3 — V + KV', color: '#22c55e', // green
        words: [
            { syl: ['a', 'lu'], word: 'alu', emoji: '🔨' },
            { syl: ['a', 'pi'], word: 'api', emoji: '🔥' },
            { syl: ['i', 'bu'], word: 'ibu', emoji: '👩' },
            { syl: ['i', 'si'], word: 'isi', emoji: '🥩' },
            { syl: ['u', 'bi'], word: 'ubi', emoji: '🥔' },
            { syl: ['u', 'lu'], word: 'ulu', emoji: '⛰️' },
        ]
    },
    {
        id: 'KV + KV + KV', title: 'Rak 4 — KV + KV + KV', color: '#a855f7', // purple
        words: [
            { syl: ['be', 'ru', 'du'], word: 'berudu', emoji: '🐸' },
            { syl: ['ke', 'la', 'di'], word: 'keladi', emoji: '🍠' },
            { syl: ['ke', 'la', 'pa'], word: 'kelapa', emoji: '🥥' },
            { syl: ['ke', 'me', 'ja'], word: 'kemeja', emoji: '👕' },
            { syl: ['ke', 're', 'ta'], word: 'kereta', emoji: '🚗' },
            { syl: ['ke', 'ru', 'si'], word: 'kerusi', emoji: '🪑' },
            { syl: ['pe', 'li', 'ta'], word: 'pelita', emoji: '🪔' },
            { syl: ['pe', 'ri', 'gi'], word: 'perigi', emoji: '🕳️' },
        ]
    },
    {
        id: 'KVK', title: 'Rak 5 — KVK', color: '#f97316', // orange
        words: [
            { syl: ['bas'], word: 'bas', emoji: '🚌' },
            { syl: ['beg'], word: 'beg', emoji: '🎒' },
            { syl: ['bot'], word: 'bot', emoji: '🚤' },
            { syl: ['cat'], word: 'cat', emoji: '🎨' },
            { syl: ['jag'], word: 'jag', emoji: '🥛' },
            { syl: ['jam'], word: 'jam', emoji: '⏰' },
            { syl: ['jem'], word: 'jem', emoji: '🍯' },
            { syl: ['jet'], word: 'jet', emoji: '✈️' },
        ]
    },
    {
        id: 'V + KVK', title: 'Rak 6 — V + KVK', color: '#eab308', // yellow
        words: [
            { syl: ['a', 'yam'], word: 'ayam', emoji: '🐔' },
            { syl: ['e', 'nam'], word: 'enam', emoji: '6️⃣' },
            { syl: ['e', 'pal'], word: 'epal', emoji: '🍎' },
            { syl: ['i', 'kan'], word: 'ikan', emoji: '🐟' },
            { syl: ['i', 'tik'], word: 'itik', emoji: '🦆' },
            { syl: ['o', 'bor'], word: 'obor', emoji: '🔥' },
            { syl: ['o', 'ren'], word: 'oren', emoji: '🍊' },
            { syl: ['o', 'tak'], word: 'otak', emoji: '🧠' },
        ]
    }
];"""

old_hero = """const HERO_SHELVES_DATA = [
    {
        id: 'KV + KVK', title: 'Rak 1 — KV + KVK', color: '#ec4899', // pink
        words: [
            { syl: ['ka', 'sut'], word: 'kasut', emoji: '👟' },
            { syl: ['ba', 'kul'], word: 'bakul', emoji: '🧺' },
            { syl: ['bo', 'tol'], word: 'botol', emoji: '🍾' },
            { syl: ['ca', 'wan'], word: 'cawan', emoji: '☕' },
            { syl: ['ga', 'jah'], word: 'gajah', emoji: '🐘' },
            { syl: ['ru', 'mah'], word: 'rumah', emoji: '🏠' },
            { syl: ['lo', 'bak'], word: 'lobak', emoji: '🥕' },
            { syl: ['po', 'kok'], word: 'pokok', emoji: '🌳' },
        ]
    },
    {
        id: 'KVK + KV', title: 'Rak 2 — KVK + KV', color: '#3b82f6', // blue
        words: [
            { syl: ['kun', 'ci'], word: 'kunci', emoji: '🔑' },
            { syl: ['lam', 'pu'], word: 'lampu', emoji: '💡' },
            { syl: ['pin', 'tu'], word: 'pintu', emoji: '🚪' },
            { syl: ['bom', 'ba'], word: 'bomba', emoji: '🚒' },
            { syl: ['lem', 'bu'], word: 'lembu', emoji: '🐄' },
            { syl: ['gar', 'fu'], word: 'garfu', emoji: '🍴' },
            { syl: ['tim', 'ba'], word: 'timba', emoji: '🪣' },
            { syl: ['jum', 'pa'], word: 'jumpa', emoji: '🤝' },
        ]
    },
    {
        id: 'KVK + KVK', title: 'Rak 3 — KVK + KVK', color: '#22c55e', // green
        words: [
            { syl: ['dok', 'tor'], word: 'doktor', emoji: '👨‍⚕️' },
            { syl: ['cer', 'min'], word: 'cermin', emoji: '🪞' },
            { syl: ['ker', 'tas'], word: 'kertas', emoji: '📄' },
            { syl: ['ban', 'tal'], word: 'bantal', emoji: '🛌' },
            { syl: ['bis', 'kut'], word: 'biskut', emoji: '🍪' },
            { syl: ['sam', 'pul'], word: 'sampul', emoji: '✉️' },
            { syl: ['mas', 'jid'], word: 'masjid', emoji: '🕌' },
            { syl: ['cok', 'lat'], word: 'coklat', emoji: '🍫' },
        ]
    },
    {
        id: 'KVKK', title: 'Rak 4 — KVKK', color: '#a855f7', // purple
        words: [
            { syl: ['bank'], word: 'bank', emoji: '🏦' },
            { syl: ['zink'], word: 'zink', emoji: '🏠' },
            { syl: ['van'], word: 'van', emoji: '🚐' },
            { syl: ['gong'], word: 'gong', emoji: '🥁' },
            { syl: ['ring'], word: 'ring', emoji: '💍' },
            { syl: ['king'], word: 'king', emoji: '👑' },
            { syl: ['tank'], word: 'tank', emoji: '🪙' },
            { syl: ['kem'], word: 'kem', emoji: '⛺' },
        ]
    },
    {
        id: 'KV + KV + KVK', title: 'Rak 5 — KV + KV + KVK', color: '#f97316', // orange
        words: [
            { syl: ['ba', 'si', 'kal'], word: 'basikal', emoji: '🚲' },
            { syl: ['be', 'la', 'lang'], word: 'belalang', emoji: '🦗' },
            { syl: ['ke', 'tu', 'pat'], word: 'ketupat', emoji: '🫔' },
            { syl: ['se', 'ko', 'lah'], word: 'sekolah', emoji: '🏫' },
            { syl: ['pe', 'lan', 'gi'], word: 'pelangi', emoji: '🌈' },
            { syl: ['pem', 'ba', 'ris'], word: 'pembaris', emoji: '📏' },
            { syl: ['ke', 'la', 'war'], word: 'kelawar', emoji: '🦇' },
            { syl: ['ke', 'tam'], word: 'ketam', emoji: '🦀' },
        ]
    },
    {
        id: 'KVK + KV + KVK', title: 'Rak 6 — KVK + KV + KVK', color: '#eab308', // yellow
        words: [
            { syl: ['kom', 'pu', 'ter'], word: 'komputer', emoji: '💻' },
            { syl: ['cem', 'pe', 'dak'], word: 'cempedak', emoji: '🍈' },
            { syl: ['sem', 'pur', 'na'], word: 'sempurna', emoji: '✨' },
            { syl: ['kum', 'bang'], word: 'kumbang', emoji: '🐞' },
            { syl: ['ceng', 'ke', 'rik'], word: 'cengkerik', emoji: '🦗' },
            { syl: ['cem', 'pa', 'ka'], word: 'cempaka', emoji: '🌺' },
            { syl: ['cen', 'da', 'wan'], word: 'cendawan', emoji: '🍄' },
            { syl: ['teng', 'ko', 'rak'], word: 'tengkorak', emoji: '💀' },
        ]
    }
];"""

new_hero = """const HERO_SHELVES_DATA = [
    {
        id: 'KV + KVK', title: 'Rak 1 — KV + KVK', color: '#ec4899', // pink
        words: [
            { syl: ['ba', 'kul'], word: 'bakul', emoji: '🧺' },
            { syl: ['be', 'lon'], word: 'belon', emoji: '🎈' },
            { syl: ['be', 'ruk'], word: 'beruk', emoji: '🐒' },
            { syl: ['be', 'tik'], word: 'betik', emoji: '🍈' },
            { syl: ['bo', 'tol'], word: 'botol', emoji: '🍾' },
            { syl: ['ca', 'wan'], word: 'cawan', emoji: '☕' },
            { syl: ['ce', 'rek'], word: 'cerek', emoji: '🫖' },
            { syl: ['ga', 'jah'], word: 'gajah', emoji: '🐘' },
        ]
    },
    {
        id: 'KVK + KV', title: 'Rak 2 — KVK + KV', color: '#3b82f6', // blue
        words: [
            { syl: ['bal', 'di'], word: 'baldi', emoji: '🪣' },
            { syl: ['ben', 'di'], word: 'bendi', emoji: '🥬' },
            { syl: ['gar', 'pu'], word: 'garpu', emoji: '🍴' },
            { syl: ['jam', 'bu'], word: 'jambu', emoji: '🍐' },
            { syl: ['kun', 'ci'], word: 'kunci', emoji: '🔑' },
            { syl: ['lam', 'pu'], word: 'lampu', emoji: '💡' },
            { syl: ['lem', 'bu'], word: 'lembu', emoji: '🐄' },
            { syl: ['pin', 'tu'], word: 'pintu', emoji: '🚪' },
        ]
    },
    {
        id: 'KVK + KVK', title: 'Rak 3 — KVK + KVK', color: '#22c55e', // green
        words: [
            { syl: ['bis', 'kut'], word: 'biskut', emoji: '🍪' },
            { syl: ['cer', 'min'], word: 'cermin', emoji: '🪞' },
            { syl: ['cin', 'cin'], word: 'cincin', emoji: '💍' },
            { syl: ['dok', 'tor'], word: 'doktor', emoji: '👨‍⚕️' },
            { syl: ['man', 'cis'], word: 'mancis', emoji: '🔥' },
            { syl: ['mas', 'jid'], word: 'masjid', emoji: '🕌' },
            { syl: ['ram', 'but'], word: 'rambut', emoji: '💇' },
            { syl: ['rum', 'put'], word: 'rumput', emoji: '🌿' },
        ]
    },
    {
        id: 'KVKK', title: 'Rak 4 — KVKK', color: '#a855f7', // purple
        words: [
            { syl: ['bank'], word: 'bank', emoji: '🏦' },
            { syl: ['gong'], word: 'gong', emoji: '🪘' },
            { syl: ['jong'], word: 'jong', emoji: '⛵' },
            { syl: ['tong'], word: 'tong', emoji: '🛢️' },
            { syl: ['wang'], word: 'wang', emoji: '💵' },
            { syl: ['zink'], word: 'zink', emoji: '🏗️' },
        ]
    },
    {
        id: 'KV + KV + KVK', title: 'Rak 5 — KV + KV + KVK', color: '#f97316', // orange
        words: [
            { syl: ['ba', 'si', 'kal'], word: 'basikal', emoji: '🚲' },
            { syl: ['ke', 'la', 'war'], word: 'kelawar', emoji: '🦇' },
            { syl: ['ke', 'le', 'dek'], word: 'keledek', emoji: '🍠' },
            { syl: ['ke', 'tu', 'pat'], word: 'ketupat', emoji: '🍙' },
            { syl: ['pi', 'ra', 'mid'], word: 'piramid', emoji: '🔺' },
            { syl: ['pu', 'la', 'san'], word: 'pulasan', emoji: '🌰' },
            { syl: ['te', 'le', 'fon'], word: 'telefon', emoji: '☎️' },
            { syl: ['te', 'ti', 'kus'], word: 'tetikus', emoji: '🖱️' },
        ]
    },
    {
        id: 'KVK + KV + KVK', title: 'Rak 6 — KVK + KV + KVK', color: '#eab308', // yellow
        words: [
            { syl: ['cem', 'pe', 'dak'], word: 'cempedak', emoji: '🍈' },
            { syl: ['cen', 'da', 'wan'], word: 'cendawan', emoji: '🍄' },
            { syl: ['jam', 'ba', 'tan'], word: 'jambatan', emoji: '🌉' },
            { syl: ['kom', 'pu', 'ter'], word: 'komputer', emoji: '💻' },
            { syl: ['pem', 'ba', 'ris'], word: 'pembaris', emoji: '📏' },
            { syl: ['tem', 'pa', 'yan'], word: 'tempayan', emoji: '🏺' },
        ]
    }
];"""

if old_asas in content:
    content = content.replace(old_asas, new_asas)
else:
    print("WARNING: old ASAS_SHELVES_DATA not found exactly")

if old_hero in content:
    content = content.replace(old_hero, new_hero)
else:
    print("WARNING: old HERO_SHELVES_DATA not found exactly")

with open('src/components/PerpustakaanGame.tsx', 'w') as f:
    f.write(content)

print("Updated PerpustakaanGame.tsx")
