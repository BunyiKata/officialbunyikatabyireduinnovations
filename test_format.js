const test = "ti - ga";
const formatSukuKata = (text) => {
    let formatted = text;
    if(text.includes('-')) {
        const formatWord = (word) => {
            if (!word.includes('-')) return `<span style="color: black;">${word}</span>`;
            return word.split('-').map((p, i) => `<span style="color: ${i % 2 === 0 ? 'black' : 'red'};">${p.trim()}</span>`).join('');
        };
        
        if (text.includes(' | ')) {
           formatted = text.split(' | ').map(formatWord).join('&nbsp;&nbsp;');
        } else {
           formatted = formatWord(text);
        }
    } else {
        formatted = `<span style="color: black;">${text}</span>`;
    }
    const rawLength = text.replace(/[-\s|]/g, '').length;
    if (rawLength >= 9) { return `<span style="font-size: 0.5em; display: inline-block; white-space: nowrap;">${formatted}</span>`; } else if (rawLength >= 7) {
        return `<span style="font-size: 0.65em; display: inline-block;">${formatted}</span>`;
    } else if (rawLength >= 5) {
        return `<span style="font-size: 0.85em; display: inline-block;">${formatted}</span>`;
    }
    return formatted;
};
console.log(formatSukuKata(test));
