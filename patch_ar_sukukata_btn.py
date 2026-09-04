import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Pattern 1
target1 = """            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <i className="fa-solid fa-gamepad"></i>{" "}
              <span className="cara-belajar-btn-text-full">Tanduk Kata</span>
              <span className="cara-belajar-btn-text-short">Tanduk</span>
            </button>"""

replacement1 = """            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <i className="fa-solid fa-gamepad"></i>{" "}
              <span className="cara-belajar-btn-text-full">Tanduk Kata</span>
              <span className="cara-belajar-btn-text-short">Tanduk</span>
            </button>
            <button
              className="neo-btn bg-green cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                const modal = document.getElementById("modal-pilih-ar-sukukata");
                if (modal) modal.style.display = "flex";
              }}
            >
              <i className="fa-solid fa-camera"></i>{" "}
              <span className="cara-belajar-btn-text-full">AR Suku Kata</span>
              <span className="cara-belajar-btn-text-short">AR</span>
            </button>"""

content = content.replace(target1, replacement1)

# Pattern 2
target2 = """            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                setIsDialOpen(false);
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <span className="cara-belajar-btn-text-short">Tanduk Kata</span>
              <i className="fa-solid fa-gamepad"></i>
            </button>"""

replacement2 = """            <button
              className="neo-btn bg-pink cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                setIsDialOpen(false);
                window.bukaTandukKata && window.bukaTandukKata();
              }}
            >
              <span className="cara-belajar-btn-text-short">Tanduk Kata</span>
              <i className="fa-solid fa-gamepad"></i>
            </button>
            <button
              className="neo-btn bg-green cara-belajar-btn untuk-sukukata"
              onClick={(e) => {
                setIsDialOpen(false);
                const modal = document.getElementById("modal-pilih-ar-sukukata");
                if (modal) modal.style.display = "flex";
              }}
            >
              <span className="cara-belajar-btn-text-short">AR Suku Kata</span>
              <i className="fa-solid fa-camera"></i>
            </button>"""

content = content.replace(target2, replacement2)

# Pattern 3: Add modal
target3 = """      {/* Modal Pilih VR */}"""

replacement3 = """      {/* Modal Pilih AR Suku Kata */}
      <div id="modal-pilih-ar-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
            <button className="neo-btn bg-pink" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kv');
            }}>
              <i className="fa-solid fa-font"></i> KV
            </button>
            <button className="neo-btn bg-cyan" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kvkv');
            }}>
              <i className="fa-solid fa-font"></i> KVKV
            </button>
            <button className="neo-btn bg-yellow" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('v_kv');
            }}>
              <i className="fa-solid fa-font"></i> V+KV
            </button>
            <button className="neo-btn bg-green" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kvkvkv');
            }}>
              <i className="fa-solid fa-font"></i> KVKVKV
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pilih VR */}"""

content = content.replace(target3, replacement3)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Patched App.tsx")
