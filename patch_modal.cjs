const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const modalCode = `
      {/* Modal Pilih Surih */}
      <div id="modal-pilih-surih" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <div className="modal-content" style={{ maxWidth: "450px", width: "90%", textAlign: "center", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
          <h2 style={{ color: "var(--color-dark)", marginBottom: "20px" }}>Pilih Mod Surih</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
            <button className="neo-btn bg-purple" style={{ justifyContent: "center", padding: "12px", fontSize: "1.1rem" }} onClick={(e) => {
              document.getElementById("modal-pilih-surih").style.display = "none";
              window.bukaSurihHuruf && window.bukaSurihHuruf();
            }}>
              <i className="fa-solid fa-font" style={{ marginRight: "8px" }}></i> Surih Huruf
            </button>
            <button className="neo-btn bg-orange" style={{ justifyContent: "center", padding: "12px", fontSize: "1.1rem" }} onClick={(e) => {
              document.getElementById("modal-pilih-surih").style.display = "none";
              window.bukaSurihNombor && window.bukaSurihNombor();
            }}>
              <i className="fa-solid fa-1" style={{ marginRight: "8px" }}></i> Surih Nombor
            </button>
          </div>
          <button className="neo-btn" style={{ marginTop: "20px", backgroundColor: "#cbd5e1", width: "100%", justifyContent: "center", padding: "12px", fontSize: "1.1rem" }} onClick={(e) => {
            document.getElementById("modal-pilih-surih").style.display = "none";
          }}>Tutup</button>
        </div>
      </div>
`;

if (!content.includes('id="modal-pilih-surih"')) {
    content = content.replace(/<div\s+id="mobile-floating-dial-container"/, modalCode + '\n        <div\n          id="mobile-floating-dial-container"');
    fs.writeFileSync('src/App.tsx', content);
}
