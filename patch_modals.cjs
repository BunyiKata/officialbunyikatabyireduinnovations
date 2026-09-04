const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newModals = `      {/* Modal Pilih Vokal / Konsonan */}
      <div id="modal-pilih-vokal-konsonan" className="modal-overlay" style={{ display: "none", zIndex: 3000 }}>
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) !important",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-vokal-konsonan").style.display = "none";
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            id="modal-pilih-vokal-konsonan-title"
            style={{ fontSize: "1.5rem", marginBottom: "20px" }}
          >
            Vokal dan Konsonan
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              className="neo-btn"
              onClick={(e) => {
                document.getElementById("modal-pilih-vokal-konsonan").style.display = "none";
                (window as any).currentModuleId = 'huruf_vokal';
                (window as any).bukaSenaraiHuruf("kecil");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Huruf Vokal
            </button>
            <button
              className="neo-btn"
              onClick={(e) => {
                document.getElementById("modal-pilih-vokal-konsonan").style.display = "none";
                (window as any).currentModuleId = 'huruf_konsonan';
                (window as any).bukaSenaraiHuruf("kecil");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Huruf Konsonan
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih Jenis Nombor */}
      <div id="modal-pilih-jenis-nombor" className="modal-overlay" style={{ display: "none", zIndex: 3000 }}>
        <div
          className="modal-content"
          style={{
            maxWidth: "400px",
            textAlign: "center",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px), linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) !important",
          }}
        >
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2
            id="modal-pilih-jenis-nombor-title"
            style={{ fontSize: "1.5rem", marginBottom: "20px" }}
          >
            Pengenalan Nombor
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              className="neo-btn"
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
                (window as any).initBelajarSukuKata("bilang_0_10", "Bilang 0-10");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Bilang 0-10
            </button>
            <button
              className="neo-btn"
              onClick={(e) => {
                document.getElementById("modal-pilih-jenis-nombor").style.display = "none";
                (window as any).initBelajarSukuKata("bilang_siri_nombor", "Bilang Siri Nombor");
              }}
              style={{
                fontSize: "1.05rem",
                padding: "10px",
                background: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              Bilang Siri Nombor
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih Tanduk Kata */}`;

code = code.replace(/{[\s]*\/\*[\s]*Modal Pilih Tanduk Kata[\s]*\*\/}/, newModals);

fs.writeFileSync('src/App.tsx', code);
console.log('Modals added to App.tsx');
