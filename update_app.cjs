const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add class ar-top-nav
code = code.replace(
  `          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 24px",
            gap: "20px",
            width: "100%",
            zIndex: "10",
          }}
        >`,
  `          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 24px",
            gap: "20px",
            width: "100%",
            zIndex: "10",
          }}
          className="ar-top-nav"
        >`
);

// Change "MULA MAIN" to "MULA"
code = code.replace(
  `            <button
              id="start_btn_ar_sukukata"
              className="neo-btn bg-pink ar-start-btn"
            >
              MULA MAIN
            </button>`,
  `            <button
              id="start_btn_ar_sukukata"
              className="neo-btn bg-pink ar-start-btn"
            >
              MULA
            </button>`
);

code = code.replace(
  `              <p id="speech_status_ar_sukukata" className="ar-speech-text">
                Tekan "MULA MAIN"
              </p>`,
  `              <p id="speech_status_ar_sukukata" className="ar-speech-text">
                Tekan "MULA"
              </p>`
);

fs.writeFileSync('src/App.tsx', code);
