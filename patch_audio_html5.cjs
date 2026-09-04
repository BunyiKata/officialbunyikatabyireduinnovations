const fs = require('fs');
let cabaran = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newPlaySoundEffect = `  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      if (type === 'correct') {
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          if (typeof (window as any).playTada === 'function') (window as any).playTada();
        });
      } else {
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {
          if (typeof (window as any).playOops === 'function') (window as any).playOops();
        });
      }
    } catch (e) {
      console.log('Audio error', e);
    }
  };`;

cabaran = cabaran.replace(/const playSoundEffect = \(type: 'correct' \| 'wrong'\) => \{[\s\S]*?catch \(e\) \{\n      console\.log\('Audio error', e\);\n    \}\n  \};/, newPlaySoundEffect);

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaran);
console.log('Updated CabaranSukuKataGame.tsx HTML5 audio');
