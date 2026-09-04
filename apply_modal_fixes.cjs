const fs = require('fs');

// 1. Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const oldModalArHtml = /<div id="modal-pilih-ar-sukukata"[\s\S]*?<\/div>\s*<\/div>/;

const newModalArHtml = `<div id="modal-pilih-ar-sukukata" className="modal-overlay" style={{ display: "none", zIndex: 4000, backgroundColor: "rgba(0,0,0,0.85)" }}>
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
          <h2 style={{ color: "var(--color-dark)", marginBottom: "8px", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <i className="fa-solid fa-camera"></i> AR Suku Kata
          </h2>
          <p style={{ marginBottom: "20px", fontSize: "1rem", color: "#475569" }}>
            Pilih kemahiran suku kata untuk mula bermain:
          </p>
          <div id="ar-sukukata-buttons-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", width: "100%" }}>
            {/* Populated dynamically via window.showARSukuKataModal() */}
          </div>
        </div>
      </div>`;

if (appTsx.includes('id="modal-pilih-ar-sukukata"')) {
    appTsx = appTsx.replace(oldModalArHtml, newModalArHtml);
    fs.writeFileSync('src/App.tsx', appTsx);
    console.log("Updated modal-pilih-ar-sukukata structure in src/App.tsx");
}

// 2. Update public/app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Update requestSensorPermissionAndStart max-width to 420px
logic = logic.replace(
    'max-width: 280px; width: 85%;',
    'max-width: 420px; width: 90%; padding: 24px 20px;'
);

// Update window.showARSukuKataModal
const oldShowModalReg = /window\.showARSukuKataModal\s*=\s*function\(\)[\s\S]*?\};/;

const newShowModalFunc = `window.showARSukuKataModal = function() {
    const container = document.getElementById('ar-sukukata-buttons-container');
    const modal = document.getElementById('modal-pilih-ar-sukukata');
    if (!container || !modal) return;
    
    // Check if we are in Misi Suku Kata Hero (Peta 3) or Asas (Peta 2)
    const isHero = (window.currentPeta === 3);
    
    let buttonsHTML = '';
    
    if (isHero) {
        const heroSkills = [
            { key: 'kv_kvk', label: 'KV + KVK' },
            { key: 'kvk_kv', label: 'KVK + KV' },
            { key: 'kvk_kvk', label: 'KVK + KVK' },
            { key: 'kvkk', label: 'KVKK' },
            { key: 'kv_kv_kvk', label: 'KV + KV + KVK' },
            { key: 'kvk_kv_kvk', label: 'KVK + KV + KVK' }
        ];
        buttonsHTML = heroSkills.map(s => \`
            <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #ff751f; color: #ffffff;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('\${s.key}');">
                \${s.label}
            </button>
        \`).join('');
    } else {
        const asasSkills = [
            { key: 'kv', label: 'KV' },
            { key: 'kvkv', label: 'KV + KV' },
            { key: 'v_kv', label: 'V + KV' },
            { key: 'kvkvkv', label: 'KV + KV + KV' },
            { key: 'kvk', label: 'KVK' },
            { key: 'v_kvk', label: 'V + KVK' }
        ];
        buttonsHTML = asasSkills.map(s => \`
            <button class="neo-btn" style="justify-content: center; padding: 12px 10px; font-size: 0.95rem; width: 100%; display: flex; align-items: center; background-color: #c1a472; color: #ffffff;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('\${s.key}');">
                \${s.label}
            </button>
        \`).join('');
    }
    
    container.innerHTML = buttonsHTML;
    modal.style.display = 'flex';
};`;

logic = logic.replace(oldShowModalReg, newShowModalFunc);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Updated public/app-logic.js with brown/orange buttons and wider sensor modal!");
