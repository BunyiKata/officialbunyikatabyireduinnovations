const fs = require('fs');
const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

function showAround(str) {
    const i = code.indexOf(str);
    if (i !== -1) {
        console.log(code.substring(Math.max(0, i - 20), i + 200));
    }
}
showAround("const [gameItems, setGameItems]");
showAround("const startGame =");
showAround("if (!isPaused || state.y > 0)");
showAround("{/* Floor */}");
showAround("{/* Mobile Controls */}");

