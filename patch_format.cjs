const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const oldFormat = `            const formatSukuKata = (text) => {
                let formatted = text;
                if(text.includes('-')) {
                    formatted = text.split('-').map((p, i) => \`<span style="color: \${i % 2 === 0 ? 'black' : 'red'};\'>\${p.trim()}</span>\`).join('');
                } else {
                    formatted = \`<span style="color: black;">\${text}</span>\`;
                }
                const rawLength = text.replace(/[-\\s]/g, '').length;`;

const newFormat = `            const formatSukuKata = (text) => {
                let formatted = text;
                if(text.includes('-')) {
                    // Handle multiple words separated by space but keeping hyphenation
                    const words = text.split('  '); // Use double space for word separation if needed, or we can just split by ' ' if space is not around hyphen
                    
                    // Actually, if we pass "du - a   pu - luh" (3 spaces), split by '   '
                    // Better: split by space if the space is not adjacent to a hyphen
                    // But an easier way is to format each word separately.
                    const formatWord = (word) => {
                        if (!word.includes('-')) return \`<span style="color: black;">\${word}</span>\`;
                        return word.split('-').map((p, i) => \`<span style="color: \${i % 2 === 0 ? 'black' : 'red'};\'>\${p.trim()}</span>\`).join('');
                    };
                    
                    if (text.includes(' | ')) {
                       formatted = text.split(' | ').map(formatWord).join(' ');
                    } else {
                       formatted = formatWord(text);
                    }
                } else {
                    formatted = \`<span style="color: black;">\${text}</span>\`;
                }
                const rawLength = text.replace(/[-\\s|]/g, '').length;`;

code = code.replace(oldFormat, newFormat);
fs.writeFileSync('public/app-logic.js', code);
console.log('patched formatSukuKata');
