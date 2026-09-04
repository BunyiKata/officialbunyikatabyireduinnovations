const fs = require('fs');

// 1. Update public/app-logic.js to export window.playBubble, window.playOops, window.playTada
let appLogic = fs.readFileSync('public/app-logic.js', 'utf8');
if (!appLogic.includes('window.playBubble = playBubble;')) {
  appLogic += '\nwindow.playBubble = playBubble;\nwindow.playOops = playOops;\nwindow.playTada = playTada;\nwindow.sebutAudio = sebutAudio;\n';
  fs.writeFileSync('public/app-logic.js', appLogic);
  console.log('Updated public/app-logic.js with window exports');
}

// 2. Update CabaranSukuKataGame.tsx with Web Audio synthesis for correct & wrong answers
let cabaran = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newPlaySoundEffect = `  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;
        if (type === 'correct') {
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.25, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
          });
        } else {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      }
    } catch (e) {
      console.log('Audio Context error', e);
    }

    if ((window as any).sebutAudio) {
      (window as any).sebutAudio(type === 'correct' ? 'Betul!' : 'Cuba lagi');
    } else if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(type === 'correct' ? 'Betul!' : 'Cuba lagi');
        u.lang = 'ms-MY';
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  };`;

// Replace old playSoundEffect definition
cabaran = cabaran.replace(/const playSoundEffect = \(type: 'correct' \| 'wrong'\) => \{[\s\S]*?\};/, newPlaySoundEffect);

// Make sure handleCorrect and handleWrong call playSoundEffect
cabaran = cabaran.replace(
  "if ((window as any).playBubble) (window as any).playBubble();",
  "playSoundEffect('correct');"
);
cabaran = cabaran.replace(
  "if ((window as any).playOops) (window as any).playOops();",
  "playSoundEffect('wrong');"
);

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaran);
console.log('Updated CabaranSukuKataGame.tsx audio feedback');

// 3. Update App.tsx teacher sticky nav HTML
let app = fs.readFileSync('src/App.tsx', 'utf8');
const oldTeacherNav = `<nav id="teacher-sticky-nav" className="teacher-sticky-nav" aria-label="Navigasi mod guru">
        <button className="neo-btn bg-blue" onClick={(e) => { paparSkrin('guru-dashboard') }}><i className="fa-solid fa-table-list"></i> Dashboard</button>
        <button className="neo-btn bg-orange" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> Senarai Perkataan</button>
        <button className="neo-btn bg-green" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> Akses</button>
        <button className="neo-btn bg-red" onClick={(e) => { keluarModGuru() }}><i className="fa-solid fa-right-from-bracket"></i> Keluar</button>
    </nav>`;

const newTeacherNav = `<nav id="teacher-sticky-nav" className="teacher-sticky-nav" aria-label="Navigasi mod guru">
        <button className="neo-btn bg-white" onClick={(e) => { keluarModGuru() }}><i className="fa-solid fa-bars"></i> <span>Menu</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('guru-dashboard') }}><i className="fa-solid fa-table-list"></i> <span>Dashboard</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span></button>
    </nav>`;

app = app.replace(oldTeacherNav, newTeacherNav);
fs.writeFileSync('src/App.tsx', app);
console.log('Updated App.tsx teacher nav');

// 4. Update index.css rules for nav visibility and mobile teacher nav
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace line 716 "body:not(.teacher-mode) #student-global-nav { display: flex !important; }"
css = css.replace('body:not(.teacher-mode) #student-global-nav { display: flex !important; }', '/* line 716 override removed */');

// Add specific CSS rules at the bottom of index.css
const additionalCSS = `

/* --- MOBILE NAV & GAME NAV FIXES --- */
#student-global-nav {
    display: none !important;
}

body:not(.teacher-mode):has(#main-menu-screen.active) #student-global-nav,
body:not(.teacher-mode):has(#profile-screen.active) #student-global-nav,
body:not(.teacher-mode):has(#leaderboard-screen.active) #student-global-nav,
body:not(.teacher-mode):has(#lencana-screen.active) #student-global-nav {
    display: flex !important;
}

body.teacher-mode #student-global-nav,
body:has(#view-cabaran-suku-kata.active) #student-global-nav,
body:has(#view-tanduk-kata.active) #student-global-nav,
body:has(#view-perpustakaan.active) #student-global-nav,
body:has(#map-screen.active) #student-global-nav,
body:has(.screen[id^="view-latihan-"].active) #student-global-nav,
body:has(.screen[id^="view-learn-"].active) #student-global-nav,
body:has(#view-belajar-huruf.active) #student-global-nav,
body:has(#view-belajar-sukukata.active) #student-global-nav,
body:has(.modal-overlay[style*="display: flex"]) #student-global-nav {
    display: none !important;
}

/* Mod Guru Mobile Nav Bar */
@media (max-width: 720px) {
    .teacher-sticky-nav {
        top: auto !important;
        bottom: 12px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        width: calc(100% - 24px) !important;
        max-width: 480px !important;
        padding: 6px !important;
        background: #ffffff !important;
        border: 3px solid var(--color-dark) !important;
        border-radius: 24px !important;
        box-shadow: var(--shadow-hard) !important;
        display: grid !important;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 6px !important;
        z-index: 2000 !important;
    }
    .teacher-sticky-nav .neo-btn {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        min-height: 52px !important;
        padding: 6px 4px !important;
        font-size: 0.72rem !important;
        font-weight: 800 !important;
        border-radius: 16px !important;
        border: 2px solid var(--color-dark) !important;
        background: #ffffff !important;
        color: var(--color-dark) !important;
        box-shadow: none !important;
    }
    .teacher-sticky-nav .neo-btn i {
        font-size: 1.1rem !important;
        margin: 0 !important;
    }
    body.teacher-mode .screen.active {
        padding-top: 20px !important;
        padding-bottom: 90px !important;
    }
}
`;

css += additionalCSS;
fs.writeFileSync('src/index.css', css);
console.log('Updated index.css with mobile nav rules');

