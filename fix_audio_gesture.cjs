const fs = require('fs');

// 1. Fix CabaranSukuKataGame
let cabaran = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');
const newPlaySoundEffect = `  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      if (type === 'correct') {
        if (typeof (window as any).playTada === 'function') (window as any).playTada();
      } else {
        if (typeof (window as any).playOops === 'function') (window as any).playOops();
      }
    } catch (e) {
      console.log('Audio error', e);
    }
  };`;
cabaran = cabaran.replace(/const playSoundEffect = \(type: 'correct' \| 'wrong'\) => \{[\s\S]*?catch \(e\) \{\n      console\.log\('Audio error', e\);\n    \}\n  \};/, newPlaySoundEffect);
fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaran);
console.log('Fixed CabaranSukuKataGame audio gesture');

// 2. Fix app-logic.js
let appLogic = fs.readFileSync('public/app-logic.js', 'utf8');

const newPlayOops = `function playOops() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.type = 'triangle'; const now = audioCtx.currentTime;
            osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }`;
appLogic = appLogic.replace(/function playOops\(\) \{[\s\S]*?osc\.start\(now\); osc\.stop\(now \+ 0\.3\);\n        \}/, newPlayOops);

const newPlayTada = `function playTada() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();`;
appLogic = appLogic.replace(/function playTada\(\) \{\n            try \{[\s\S]*?if \(audioCtx\.state === 'suspended'\) audioCtx\.resume\(\);/, newPlayTada);

fs.writeFileSync('public/app-logic.js', appLogic);
console.log('Fixed app-logic.js audio gesture');

