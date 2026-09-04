const fs = require('fs');

// 1. Fix CabaranSukuKataGame.tsx Audio
let cabaran = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newPlaySoundEffect = `  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      if (type === 'correct') {
        if (typeof (window as any).playTada === 'function') {
          (window as any).playTada();
        }
      } else {
        if (typeof (window as any).playOops === 'function') {
          (window as any).playOops();
        }
      }
    } catch (e) {
      console.log('Audio error', e);
    }
  };`;

cabaran = cabaran.replace(/const playSoundEffect = \(type: 'correct' \| 'wrong'\) => \{[\s\S]*?catch \(e\) \{\n      console\.log\('Audio Context error', e\);\n    \}\n  \};/, newPlaySoundEffect);

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaran);
console.log('Updated CabaranSukuKataGame.tsx audio');


// 2. Fix CSS
let css = fs.readFileSync('src/index.css', 'utf8');

// Replace existing Mod Guru Mobile Nav Bar styles
const oldTeacherNavCssRegex = /\/\* Mod Guru Mobile Nav Bar \*\/[\s\S]*?(?=\n\n|\Z)/;
const newTeacherNavCss = `/* Mod Guru Mobile Nav Bar */
@media (max-width: 720px) {
    .teacher-sticky-nav {
        top: auto !important;
        bottom: 0px !important;
        left: 0 !important;
        transform: none !important;
        width: 100vw !important;
        max-width: 100vw !important;
        padding: 8px 12px 24px 12px !important;
        background: #ffffff !important;
        border: none !important;
        border-top: 3px solid var(--color-dark) !important;
        border-radius: 24px 24px 0 0 !important;
        box-shadow: 0 -4px 10px rgba(0,0,0,0.1) !important;
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
        border-radius: 12px !important;
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
        padding-bottom: 110px !important;
    }
}

body:has(#login-screen.active) .teacher-sticky-nav {
    display: none !important;
}
body:has(#login-screen.active) #student-global-nav {
    display: none !important;
}
`;

if (oldTeacherNavCssRegex.test(css)) {
    css = css.replace(oldTeacherNavCssRegex, newTeacherNavCss);
} else {
    css += '\n' + newTeacherNavCss;
}

fs.writeFileSync('src/index.css', css);
console.log('Updated index.css');
