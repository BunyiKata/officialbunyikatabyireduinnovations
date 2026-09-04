const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change the speech box in App.tsx
code = code.replace(
    '<div className="ar-speech-box neo-box">',
    '<div id="ar_speech_box_container" className="ar-speech-box neo-box" style={{ opacity: 0, visibility: "hidden", transition: "opacity 0.3s" }}>'
);
fs.writeFileSync('src/App.tsx', code);

let logicCode = fs.readFileSync('public/app-logic.js', 'utf8');

// In startBtn click handler (start)
logicCode = logicCode.replace(
    'window.isARPlaying = true;',
    'window.isARPlaying = true;\n                const sc = document.getElementById("ar_speech_box_container");\n                if (sc) { sc.style.visibility = "visible"; sc.style.opacity = 1; }'
);

// In startBtn click handler (stop)
logicCode = logicCode.replace(
    'window.isARPlaying = false;',
    'window.isARPlaying = false;\n                const sc = document.getElementById("ar_speech_box_container");\n                if (sc) { sc.style.opacity = 0; setTimeout(()=> { if(!window.isARPlaying) sc.style.visibility = "hidden"; }, 300); }'
);

// In bukaARSukuKataKemahiranSebenar reset
logicCode = logicCode.replace(
    'window.isARPlaying = false;\n    document.getElementById(\'score_display_ar_sukukata\').innerText = "0";',
    'window.isARPlaying = false;\n    const sc = document.getElementById("ar_speech_box_container");\n    if (sc) { sc.style.opacity = 0; sc.style.visibility = "hidden"; }\n    document.getElementById(\'score_display_ar_sukukata\').innerText = "0";'
);

fs.writeFileSync('public/app-logic.js', logicCode);
console.log("Patched speech box visibility");
