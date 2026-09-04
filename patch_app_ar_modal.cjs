const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldModalStart = `<div id="modal-pilih-ar-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>`;
const oldModalEnd = `      {/* Modal Pilih VR */}`;

if (code.includes(oldModalStart) && code.includes(oldModalEnd)) {
    const startIndex = code.indexOf(oldModalStart);
    const endIndex = code.indexOf(oldModalEnd);
    
    const newModalHTML = `<div id="modal-pilih-ar-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <div className="modal-content" style={{ maxWidth: "450px", width: "90%", textAlign: "center", padding: "28px 20px 24px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", position: "relative" }}>
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2 style={{ color: "var(--color-dark)", marginBottom: "20px", fontSize: "1.4rem" }}>Pilih Kemahiran AR Suku Kata</h2>
          <div id="ar-sukukata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
            {/* Populated dynamically via window.showARSukuKataModal() */}
          </div>
        </div>
      </div>
`;
    code = code.substring(0, startIndex) + newModalHTML + code.substring(endIndex);
    
    // We also need to change the AR Suku Kata button onClick handlers to call window.showARSukuKataModal()
    // Find:
    // const modal = document.getElementById("modal-pilih-ar-sukukata");
    // if (modal) modal.style.display = "flex";
    
    code = code.replace(/const modal = document\.getElementById\("modal-pilih-ar-sukukata"\);\s*if \(modal\) modal\.style\.display = "flex";/g, 'if (window.showARSukuKataModal) window.showARSukuKataModal(); else { const m = document.getElementById("modal-pilih-ar-sukukata"); if(m) m.style.display="flex"; }');
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched AR Suku Kata modal in App.tsx");
} else {
    console.log("Could not find modal in App.tsx");
}
