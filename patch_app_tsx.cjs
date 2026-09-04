const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const modalHTML = `
      {/* Modal Akses Peranti */}
      <div id="modal-akses-peranti" className="modal-overlay" style={{ display: "none", zIndex: 4500, backgroundColor: "rgba(0,0,0,0.85)" }}>
        <div className="modal-content" style={{ maxWidth: "350px", width: "90%", textAlign: "center", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", borderRadius: "16px" }}>
          <h2 style={{ color: "var(--color-dark)", marginBottom: "15px", fontSize: "1.5rem", fontWeight: "300" }}>Akses Peranti</h2>
          <p style={{ color: "#475569", marginBottom: "25px", fontSize: "1.05rem", lineHeight: "1.5" }}>
            Benarkan akses pergerakan (motion & orientation) dan kamera untuk mengawal VR/AR.
          </p>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <button
              className="neo-btn bg-green"
              style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: "1.1rem", fontWeight: "bold", color: "white" }}
              onClick={() => {
                const modal = document.getElementById("modal-akses-peranti");
                if (modal) modal.style.display = "none";
                if (window.pendingDeviceAccessCallback) {
                  window.pendingDeviceAccessCallback();
                  window.pendingDeviceAccessCallback = null;
                }
              }}
            >
              Benarkan
            </button>
            <button
              className="neo-btn bg-red"
              style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: "1.1rem", fontWeight: "bold", color: "white" }}
              onClick={() => {
                const modal = document.getElementById("modal-akses-peranti");
                if (modal) modal.style.display = "none";
                window.pendingDeviceAccessCallback = null;
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
`;

code = code.replace('{/* Modal Pilih AR Suku Kata */}', modalHTML + '\n      {/* Modal Pilih AR Suku Kata */}');
fs.writeFileSync('src/App.tsx', code);
console.log("Patched src/App.tsx with modal-akses-peranti");
