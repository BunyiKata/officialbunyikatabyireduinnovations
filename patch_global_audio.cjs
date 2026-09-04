const fs = require('fs');
let appLogic = fs.readFileSync('public/app-logic.js', 'utf8');

const newPlayOops = `function playOops() {
            try {
                const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
                audio.volume = 0.5;
                audio.play().catch(()=>{});
            } catch(e) {}
            if (!audioCtx) audioCtx = new AudioContext();
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
            try {
                const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                audio.volume = 0.5;
                audio.play().catch(()=>{});
            } catch(e) {}
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();`;

appLogic = appLogic.replace(/function playTada\(\) \{\n            if \(\!audioCtx\) audioCtx = new \(window\.AudioContext \|\| window\.webkitAudioContext\)\(\);\n            if \(audioCtx\.state === 'suspended'\) audioCtx\.resume\(\);/, newPlayTada);

fs.writeFileSync('public/app-logic.js', appLogic);
console.log('Updated app-logic.js audio fallback');
