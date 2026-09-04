const fs = require('fs');
const path = require('path');

// PATCH src/components/TandukKataGame.tsx
const tandukPath = path.join(__dirname, 'src', 'components', 'TandukKataGame.tsx');
let tandukCode = fs.readFileSync(tandukPath, 'utf8');

// 1. Update getCategoryWords to extract clean img src URL from c.icon if present
const oldGetCategoryWords = `function getCategoryWords(category: string) {
    const moduleId = CATEGORY_TO_MODULE_MAP[category];
    if (moduleId && (window as any).moduleContentData?.[moduleId]?.flashcards) {
        const cards = (window as any).moduleContentData[moduleId].flashcards;
        return cards.map((c: any) => {
            if (c.front.includes('-')) {
                const syllables = c.front.split('-').map((s: string) => s.trim());
                const word = c.back ? c.back.toLowerCase() : syllables.join('');
                return { word, syllables, emoji: c.icon || '🔊' };
            } else {
                return { word: c.front, syllables: [c.front], emoji: c.icon || '🔊' };
            }
        });
    }
    return WORD_DATABASE[category as keyof typeof WORD_DATABASE] || WORD_DATABASE['KV'];
}`;

const newGetCategoryWords = `function getCategoryWords(category: string) {
    const moduleId = CATEGORY_TO_MODULE_MAP[category];
    if (moduleId && (window as any).moduleContentData?.[moduleId]?.flashcards) {
        const cards = (window as any).moduleContentData[moduleId].flashcards;
        return cards.map((c: any) => {
            let emojiStr = c.icon || '🔊';
            if (emojiStr.includes('<img')) {
                const matchSrc = emojiStr.match(/src="([^"]+)"/);
                if (matchSrc) emojiStr = matchSrc[1];
            }
            if (c.front.includes('-')) {
                const syllables = c.front.split('-').map((s: string) => s.trim());
                const word = c.back ? c.back.toLowerCase() : syllables.join('');
                return { word, syllables, emoji: emojiStr };
            } else {
                return { word: c.front, syllables: [c.front], emoji: emojiStr };
            }
        });
    }
    return WORD_DATABASE[category as keyof typeof WORD_DATABASE] || WORD_DATABASE['KV'];
}`;

if (tandukCode.includes(oldGetCategoryWords)) {
  tandukCode = tandukCode.replace(oldGetCategoryWords, newGetCategoryWords);
  console.log('✅ getCategoryWords in TandukKataGame.tsx updated to extract img src');
} else {
  console.log('⚠️ Could not match oldGetCategoryWords in TandukKataGame.tsx');
}

// 2. Update JSX image rendering to handle html string, img src url, or emoji
const oldJsxRender = `{activeWord.emoji && selectedCategory !== 'KV' && (
                                <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
                                    {activeWord.emoji.includes('/') || activeWord.emoji.includes('.png') ? (
                                        <img src={activeWord.emoji} alt={activeWord.word} style={{ maxHeight: '130px', maxWidth: '180px', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '6rem', lineHeight: 1 }}>{activeWord.emoji}</span>
                                    )}
                                </div>
                            )}`;

const newJsxRender = `{activeWord.emoji && selectedCategory !== 'KV' && (
                                <div style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
                                    {activeWord.emoji.includes('<img') ? (
                                        <div dangerouslySetInnerHTML={{ __html: activeWord.emoji }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                    ) : activeWord.emoji.includes('/') || activeWord.emoji.includes('.png') ? (
                                        <img src={activeWord.emoji} alt={activeWord.word} style={{ maxHeight: '130px', maxWidth: '180px', objectFit: 'contain' }} />
                                    ) : (
                                        <span style={{ fontSize: '6rem', lineHeight: 1 }}>{activeWord.emoji}</span>
                                    )}
                                </div>
                            )}`;

if (tandukCode.includes(oldJsxRender)) {
  tandukCode = tandukCode.replace(oldJsxRender, newJsxRender);
  console.log('✅ Jsx rendering in TandukKataGame.tsx updated');
} else {
  console.log('⚠️ Could not match oldJsxRender in TandukKataGame.tsx');
}

fs.writeFileSync(tandukPath, tandukCode, 'utf8');
console.log('✅ TandukKataGame.tsx updated cleanly');
