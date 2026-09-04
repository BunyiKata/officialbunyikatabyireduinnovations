import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Pattern 1: Hide video
target1 = """<video id="input_video_ar_sukukata" className="hidden" autoPlay playsInline></video>"""
replacement1 = """<video id="input_video_ar_sukukata" className="hidden" style={{ display: "none" }} autoPlay playsInline></video>"""
content = content.replace(target1, replacement1)

# Pattern 2: Add 2 buttons to modal
target2 = """            <button className="neo-btn bg-green" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kvkvkv');
            }}>
              <i className="fa-solid fa-font"></i> KVKVKV
            </button>
          </div>"""

replacement2 = """            <button className="neo-btn bg-green" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kvkvkv');
            }}>
              <i className="fa-solid fa-font"></i> KVKVKV
            </button>
            <button className="neo-btn bg-purple" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('kvk');
            }}>
              <i className="fa-solid fa-font"></i> KVK
            </button>
            <button className="neo-btn bg-orange" style={{ justifyContent: "center", padding: "14px 10px", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => {
              const modal = document.getElementById("modal-pilih-ar-sukukata");
              if (modal) modal.style.display = "none";
              window.bukaARSukuKataKemahiran && window.bukaARSukuKataKemahiran('v_kvk');
            }}>
              <i className="fa-solid fa-font"></i> V+KVK
            </button>
          </div>"""
content = content.replace(target2, replacement2)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Patched AR Modal and Video")
