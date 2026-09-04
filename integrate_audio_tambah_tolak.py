# Script to integrate AUDIO TAMBAH TOLAK into:
# 1. public/app-logic.js (window.getAudioPath mapping for all tambah & tolak expressions)
# 2. src/components/NomborGame.tsx (TAMBAH_NOMBOR_DATABASE & TOLAK_NOMBOR_DATABASE audio paths)
# 3. src/components/MathActivities.tsx (speakText priority check for sebutAudio & audio path)
# 4. src/components/CabaranSukuKataGame.tsx (CABARAN_DATA konsep_tambah & konsep_penolakan audio mapping)

import re

# =========================================================================
# 1. Update public/app-logic.js
# =========================================================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

math_audio_map_js = """
    // --- INTEGRASI AUDIO TAMBAH & TOLAK ---
    var mathAudioMap = {
        // Tambah
        '0+0': '/audio/tambah/sifar tambah sifar sama dengan sifar.mp3',
        '0 + 0': '/audio/tambah/sifar tambah sifar sama dengan sifar.mp3',
        'sifar tambah sifar': '/audio/tambah/sifar tambah sifar sama dengan sifar.mp3',
        'sifar tambah sifar sama dengan sifar': '/audio/tambah/sifar tambah sifar sama dengan sifar.mp3',

        '1+0': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
        '1 + 0': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
        '0+1': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
        '0 + 1': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
        'satu tambah sifar': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
        'satu tambah sifar sama dengan satu': '/audio/tambah/satu tambah sifar sama dengan satu.mp3',

        '1+1': '/audio/tambah/satu tambah satu sama dengan dua.mp3',
        '1 + 1': '/audio/tambah/satu tambah satu sama dengan dua.mp3',
        'satu tambah satu': '/audio/tambah/satu tambah satu sama dengan dua.mp3',
        'satu tambah satu sama dengan dua': '/audio/tambah/satu tambah satu sama dengan dua.mp3',

        '1+2': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        '1 + 2': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        '2+1': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        '2 + 1': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        'satu tambah dua': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        'dua tambah satu': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
        'satu tambah dua sama dengan tiga': '/audio/tambah/satu tambah dua sama dengan tiga.mp3',

        '1+3': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        '1 + 3': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        '3+1': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        '3 + 1': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        'satu tambah tiga': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        'tiga tambah satu': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
        'satu tambah tiga sama dengan empat': '/audio/tambah/satu tambah tiga sama dengan empat.mp3',

        '1+4': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        '1 + 4': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        '4+1': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        '4 + 1': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        'satu tambah empat': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        'empat tambah satu': '/audio/tambah/satu tambah empat sama dengan lima.mp3',
        'satu tambah empat sama dengan lima': '/audio/tambah/satu tambah empat sama dengan lima.mp3',

        '1+5': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        '1 + 5': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        '5+1': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        '5 + 1': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        'satu tambah lima': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        'lima tambah satu': '/audio/tambah/satu tambah lima sama dengan enam.mp3',
        'satu tambah lima sama dengan enam': '/audio/tambah/satu tambah lima sama dengan enam.mp3',

        '1+6': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        '1 + 6': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        '6+1': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        '6 + 1': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        'satu tambah enam': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        'enam tambah satu': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
        'satu tambah enam sama dengan tujuh': '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',

        '1+7': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        '1 + 7': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        '7+1': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        '7 + 1': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        'satu tambah tujuh': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        'tujuh tambah satu': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
        'satu tambah tujuh sama dengan lapan': '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',

        '1+8': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        '1 + 8': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        '8+1': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        '8 + 1': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        'satu tambah lapan': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        'lapan tambah satu': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
        'satu tambah lapan sama dengan sembilan': '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',

        '1+9': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        '1 + 9': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        '9+1': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        '9 + 1': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        'satu tambah sembilan': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        'sembilan tambah satu': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
        'satu tambah sembilan sama dengan sepuluh': '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',

        // Tolak
        '0-0': '/audio/tolak/sifar tolak sifar sama dengan sifar.mp3',
        '0 - 0': '/audio/tolak/sifar tolak sifar sama dengan sifar.mp3',
        'sifar tolak sifar': '/audio/tolak/sifar tolak sifar sama dengan sifar.mp3',
        'sifar tolak sifar sama dengan sifar': '/audio/tolak/sifar tolak sifar sama dengan sifar.mp3',

        '10-0': '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',
        '10 - 0': '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',
        '10 − 0': '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',
        'sepuluh tolak sifar': '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',
        'sepuluh tolak sifar sama dengan sepuluh': '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',

        '10-1': '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',
        '10 - 1': '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',
        '10 − 1': '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',
        'sepuluh tolak satu': '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',
        'sepuluh tolak satu sama dengan sembilan': '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',

        '10-2': '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',
        '10 - 2': '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',
        '10 − 2': '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',
        'sepuluh tolak dua': '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',
        'sepuluh tolak dua sama dengan lapan': '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',

        '10-3': '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',
        '10 - 3': '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',
        '10 − 3': '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',
        'sepuluh tolak tiga': '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',
        'sepuluh tolak tiga sama dengan tujuh': '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',

        '10-4': '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',
        '10 - 4': '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',
        '10 − 4': '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',
        'sepuluh tolak empat': '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',
        'sepuluh tolak empat sama dengan enam': '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',

        '10-5': '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',
        '10 - 5': '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',
        '10 − 5': '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',
        'sepuluh tolak lima': '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',
        'sepuluh tolak lima sama dengan lima': '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',

        '10-6': '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',
        '10 - 6': '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',
        '10 − 6': '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',
        'sepuluh tolak enam': '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',
        'sepuluh tolak enam sama dengan empat': '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',

        '10-7': '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',
        '10 - 7': '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',
        '10 − 7': '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',
        'sepuluh tolak tujuh': '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',
        'sepuluh tolak tujuh sama dengan tiga': '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',

        '10-8': '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',
        '10 - 8': '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',
        '10 − 8': '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',
        'sepuluh tolak lapan': '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',
        'sepuluh tolak lapan sama dengan dua': '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',

        '10-9': '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',
        '10 - 9': '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',
        '10 − 9': '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',
        'sepuluh tolak sembilan': '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',
        'sepuluh tolak sembilan sama dengan satu': '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',

        '10-10': '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3',
        '10 - 10': '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3',
        '10 − 10': '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3',
        'sepuluh tolak sepuluh': '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3',
        'sepuluh tolak sepuluh sama dengan sifar': '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3'
    };

    var mathKey = raw.replace(/\\s*=\\s*\\??/g, '').trim().toLowerCase();
    if (mathAudioMap[mathKey]) return mathAudioMap[mathKey];
    var mathCleanKey = mathKey.replace(/\\s+/g, '');
    if (mathAudioMap[mathCleanKey]) return mathAudioMap[mathCleanKey];
"""

target_get_audio = "var normalized = raw.replace(/[-|]+/g, ' ').replace(/\\s+/g, ' ').trim();"
if target_get_audio in app_logic and "mathAudioMap" not in app_logic:
    app_logic = app_logic.replace(target_get_audio, target_get_audio + "\n" + math_audio_map_js, 1)
    print("Added mathAudioMap to window.getAudioPath in public/app-logic.js")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)
print("Saved public/app-logic.js")

# =========================================================================
# 2. Update src/components/NomborGame.tsx
# =========================================================================
with open('src/components/NomborGame.tsx', 'r', encoding='utf-8') as f:
    nombor_tsx = f.read()

# Replace audio paths in TAMBAH_NOMBOR_DATABASE and TOLAK_NOMBOR_DATABASE
new_tambah_db = """export const TAMBAH_NOMBOR_DATABASE: NomborItem[] = [
  {
    id: 'add_0',
    digit: '0 + 0',
    name: 'sifar tambah sifar sama dengan sifar',
    syllables: ['0 + 0', '=', '0'],
    image: '/images/nombor/sifar.png',
    audio: '/audio/tambah/sifar tambah sifar sama dengan sifar.mp3',
    count: 0,
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'add_1',
    digit: '1 + 0',
    name: 'satu tambah sifar sama dengan satu',
    syllables: ['1 + 0', '=', '1'],
    image: '/images/nombor/satu.png',
    audio: '/audio/tambah/satu tambah sifar sama dengan satu.mp3',
    count: 1,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'add_2',
    digit: '1 + 1',
    name: 'satu tambah satu sama dengan dua',
    syllables: ['1 + 1', '=', '2'],
    image: '/images/nombor/dua.png',
    audio: '/audio/tambah/satu tambah satu sama dengan dua.mp3',
    count: 2,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'add_3',
    digit: '1 + 2',
    name: 'satu tambah dua sama dengan tiga',
    syllables: ['1 + 2', '=', '3'],
    image: '/images/nombor/tiga.png',
    audio: '/audio/tambah/satu tambah dua sama dengan tiga.mp3',
    count: 3,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'add_4',
    digit: '1 + 3',
    name: 'satu tambah tiga sama dengan empat',
    syllables: ['1 + 3', '=', '4'],
    image: '/images/nombor/empat.png',
    audio: '/audio/tambah/satu tambah tiga sama dengan empat.mp3',
    count: 4,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'add_5',
    digit: '1 + 4',
    name: 'satu tambah empat sama dengan lima',
    syllables: ['1 + 4', '=', '5'],
    image: '/images/nombor/lima.png',
    audio: '/audio/tambah/satu tambah empat sama dengan lima.mp3',
    count: 5,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'add_6',
    digit: '1 + 5',
    name: 'satu tambah lima sama dengan enam',
    syllables: ['1 + 5', '=', '6'],
    image: '/images/nombor/enam.png',
    audio: '/audio/tambah/satu tambah lima sama dengan enam.mp3',
    count: 6,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'add_7',
    digit: '1 + 6',
    name: 'satu tambah enam sama dengan tujuh',
    syllables: ['1 + 6', '=', '7'],
    image: '/images/nombor/tujuh.png',
    audio: '/audio/tambah/satu tambah enam sama dengan tujuh.mp3',
    count: 7,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'add_8',
    digit: '1 + 7',
    name: 'satu tambah tujuh sama dengan lapan',
    syllables: ['1 + 7', '=', '8'],
    image: '/images/nombor/lapan.png',
    audio: '/audio/tambah/satu tambah tujuh sama dengan lapan.mp3',
    count: 8,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'add_9',
    digit: '1 + 8',
    name: 'satu tambah lapan sama dengan sembilan',
    syllables: ['1 + 8', '=', '9'],
    image: '/images/nombor/sembilan.png',
    audio: '/audio/tambah/satu tambah lapan sama dengan sembilan.mp3',
    count: 9,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'add_10',
    digit: '1 + 9',
    name: 'satu tambah sembilan sama dengan sepuluh',
    syllables: ['1 + 9', '=', '10'],
    image: '/images/nombor/sepuluh.png',
    audio: '/audio/tambah/satu tambah sembilan sama dengan sepuluh.mp3',
    count: 10,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];

export const TOLAK_NOMBOR_DATABASE: NomborItem[] = [
  {
    id: 'sub_0',
    digit: '10 - 10',
    name: 'sepuluh tolak sepuluh sama dengan sifar',
    syllables: ['10 - 10', '=', '0'],
    image: '/images/nombor/sifar.png',
    audio: '/audio/tolak/sepuluh tolak sepuluh sama dengan sifar.mp3',
    count: 0,
    color: '#ec4899',
    bgColor: '#fce7f3'
  },
  {
    id: 'sub_1',
    digit: '10 - 9',
    name: 'sepuluh tolak sembilan sama dengan satu',
    syllables: ['10 - 9', '=', '1'],
    image: '/images/nombor/satu.png',
    audio: '/audio/tolak/sepuluh tolak sembilan sama dengan satu.mp3',
    count: 1,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'sub_2',
    digit: '10 - 8',
    name: 'sepuluh tolak lapan sama dengan dua',
    syllables: ['10 - 8', '=', '2'],
    image: '/images/nombor/dua.png',
    audio: '/audio/tolak/sepuluh tolak lapan sama dengan dua.mp3',
    count: 2,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    id: 'sub_3',
    digit: '10 - 7',
    name: 'sepuluh tolak tujuh sama dengan tiga',
    syllables: ['10 - 7', '=', '3'],
    image: '/images/nombor/tiga.png',
    audio: '/audio/tolak/sepuluh tolak tujuh sama dengan tiga.mp3',
    count: 3,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    id: 'sub_4',
    digit: '10 - 6',
    name: 'sepuluh tolak enam sama dengan empat',
    syllables: ['10 - 6', '=', '4'],
    image: '/images/nombor/empat.png',
    audio: '/audio/tolak/sepuluh tolak enam sama dengan empat.mp3',
    count: 4,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'sub_5',
    digit: '10 - 5',
    name: 'sepuluh tolak lima sama dengan lima',
    syllables: ['10 - 5', '=', '5'],
    image: '/images/nombor/lima.png',
    audio: '/audio/tolak/sepuluh tolak lima sama dengan lima.mp3',
    count: 5,
    color: '#06b6d4',
    bgColor: '#cffafe'
  },
  {
    id: 'sub_6',
    digit: '10 - 4',
    name: 'sepuluh tolak empat sama dengan enam',
    syllables: ['10 - 4', '=', '6'],
    image: '/images/nombor/enam.png',
    audio: '/audio/tolak/sepuluh tolak empat sama dengan enam.mp3',
    count: 6,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    id: 'sub_7',
    digit: '10 - 3',
    name: 'sepuluh tolak tiga sama dengan tujuh',
    syllables: ['10 - 3', '=', '7'],
    image: '/images/nombor/tujuh.png',
    audio: '/audio/tolak/sepuluh tolak tiga sama dengan tujuh.mp3',
    count: 7,
    color: '#f97316',
    bgColor: '#ffedd5'
  },
  {
    id: 'sub_8',
    digit: '10 - 2',
    name: 'sepuluh tolak dua sama dengan lapan',
    syllables: ['10 - 2', '=', '8'],
    image: '/images/nombor/lapan.png',
    audio: '/audio/tolak/sepuluh tolak dua sama dengan lapan.mp3',
    count: 8,
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    id: 'sub_9',
    digit: '10 - 1',
    name: 'sepuluh tolak satu sama dengan sembilan',
    syllables: ['10 - 1', '=', '9'],
    image: '/images/nombor/sembilan.png',
    audio: '/audio/tolak/sepuluh tolak satu sama dengan sembilan.mp3',
    count: 9,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    id: 'sub_10',
    digit: '10 - 0',
    name: 'sepuluh tolak sifar sama dengan sepuluh',
    syllables: ['10 - 0', '=', '10'],
    image: '/images/nombor/sepuluh.png',
    audio: '/audio/tolak/sepuluh tolak sifar sama dengan sepuluh.mp3',
    count: 10,
    color: '#059669',
    bgColor: '#a7f3d0'
  }
];"""

tambah_pattern = re.compile(r'export const TAMBAH_NOMBOR_DATABASE: NomborItem\[\] = \[[\s\S]*?export const ModernSoccerBall', re.DOTALL)
nombor_tsx = tambah_pattern.sub(new_tambah_db + "\n\nexport const ModernSoccerBall", nombor_tsx)

with open('src/components/NomborGame.tsx', 'w', encoding='utf-8') as f:
    f.write(nombor_tsx)
print("Updated TAMBAH_NOMBOR_DATABASE & TOLAK_NOMBOR_DATABASE audio paths in NomborGame.tsx")

# =========================================================================
# 3. Update src/components/MathActivities.tsx
# =========================================================================
with open('src/components/MathActivities.tsx', 'r', encoding='utf-8') as f:
    math_tsx = f.read()

old_speak_text = """function speakText(text: string, onEnd?: () => void) {
  if ((window as any).sebutAudio) {
    (window as any).sebutAudio(text, onEnd);
    return;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ms-MY';
    utter.rate = 0.9;
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  }
}"""

new_speak_text = """function speakText(text: string, onEnd?: () => void) {
  if ((window as any).sebutAudio) {
    (window as any).sebutAudio(text, onEnd);
    return;
  }
  if (typeof (window as any).getAudioPath === 'function') {
    const p = (window as any).getAudioPath(text);
    if (p) {
      const a = new Audio(p);
      if (onEnd) a.onended = onEnd;
      a.play().catch(() => {});
      return;
    }
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ms-MY';
    utter.rate = 0.9;
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  }
}"""

if old_speak_text in math_tsx:
    math_tsx = math_tsx.replace(old_speak_text, new_speak_text, 1)
    print("Updated speakText in MathActivities.tsx with direct audio path lookup.")

with open('src/components/MathActivities.tsx', 'w', encoding='utf-8') as f:
    f.write(math_tsx)
print("Saved MathActivities.tsx")

# =========================================================================
# 4. Update src/components/CabaranSukuKataGame.tsx
# =========================================================================
with open('src/components/CabaranSukuKataGame.tsx', 'r', encoding='utf-8') as f:
    cabaran_tsx = f.read()

old_cabaran_math = """  konsep_tambah: [
    { type: 'padan', image: '1 + 1 = ?', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '2 + 1 = ?', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '2 + 2 = ?', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '3 + 1 = ?', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '3 + 2 = ?', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '4 + 1 = ?', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '4 + 2 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '5 + 2 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '5 + 3 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '5 + 5 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' }
  ],
  konsep_penolakan: [
    { type: 'padan', image: '2 - 1 = ?', imageText: '', options: ['➖', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪' },
    { type: 'padan', image: '3 - 1 = ?', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '3 - 2 = ?', imageText: '', options: ['➖', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪' },
    { type: 'padan', image: '4 - 1 = ?', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '4 - 2 = ?', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '5 - 2 = ?', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '5 - 3 = ?', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '7 - 2 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '8 - 3 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 5 = ?', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' }
  ]"""

new_cabaran_math = """  konsep_tambah: [
    { type: 'padan', image: '1 + 1 = ?', audio: '1 + 1', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '1 + 2 = ?', audio: '1 + 2', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 3 = ?', audio: '1 + 3', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 4 = ?', audio: '1 + 4', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 5 = ?', audio: '1 + 5', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 6 = ?', audio: '1 + 6', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 7 = ?', audio: '1 + 7', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 8 = ?', audio: '1 + 8', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '1 + 9 = ?', audio: '1 + 9', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '0 + 0 = ?', audio: '0 + 0', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '0' }
  ],
  konsep_penolakan: [
    { type: 'padan', image: '10 - 1 = ?', audio: '10 - 1', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 2 = ?', audio: '10 - 2', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 3 = ?', audio: '10 - 3', imageText: '', options: ['🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 4 = ?', audio: '10 - 4', imageText: '', options: ['🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 5 = ?', audio: '10 - 5', imageText: '', options: ['🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 6 = ?', audio: '10 - 6', imageText: '', options: ['🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪', '🍪 🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 7 = ?', audio: '10 - 7', imageText: '', options: ['🍪', '🍪 🍪', '🍪 🍪 🍪', '🍪 🍪 🍪 🍪'], answer: '🍪 🍪 🍪' },
    { type: 'padan', image: '10 - 8 = ?', audio: '10 - 8', imageText: '', options: ['➖', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪 🍪' },
    { type: 'padan', image: '10 - 9 = ?', audio: '10 - 9', imageText: '', options: ['➖', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '🍪' },
    { type: 'padan', image: '10 - 10 = ?', audio: '10 - 10', imageText: '', options: ['0', '🍪', '🍪 🍪', '🍪 🍪 🍪'], answer: '0' }
  ]"""

if old_cabaran_math in cabaran_tsx:
    cabaran_tsx = cabaran_tsx.replace(old_cabaran_math, new_cabaran_math, 1)
    print("Updated CABARAN_DATA konsep_tambah and konsep_penolakan to match audio files.")

with open('src/components/CabaranSukuKataGame.tsx', 'w', encoding='utf-8') as f:
    f.write(cabaran_tsx)
print("Saved CabaranSukuKataGame.tsx")
