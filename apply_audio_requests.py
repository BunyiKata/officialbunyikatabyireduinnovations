# Patch script for 4 user requests:
# 1. Mod Guru: Kad 3 title -> Orange badge "Senarai Murid" (no "Jumlah: 6 Murid", no "Berdaftar")
# 2. Mod Guru: Kad 1 -> Add Delete Class modern trash icon button (padamKelasSemasa)
# 3. Mod Guru: Kad 1 -> Popup modal for adding new class (bukaModalTambahKelas / simpanKelasBaharuModal)
# 4. Mod Admin: Title "Pengurusan Sistem Admin" -> "Pengurusan Sistem" (P and S uppercase only, no forced uppercase)
# 5. Mod Admin: Ensure table selector in Admin Dashboard always synchronizes with active table

import re

# =========================================================================
# 1. Update src/App.tsx
# =========================================================================
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_tsx = f.read()

# 1.1 Mod Admin: Title "Pengurusan Sistem Admin" -> "Pengurusan Sistem"
old_admin_title = """          <div
            className="neo-btn page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              backgroundColor: "#168f81",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
            }}
          >
            <i className="fa-solid fa-list-check" style={{ marginRight: "8px" }}></i>
            Pengurusan Sistem Admin
          </div>"""

new_admin_title = """          <div
            className="neo-btn century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              backgroundColor: "#168f81",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
              textTransform: "none",
            }}
          >
            <i className="fa-solid fa-list-check" style={{ marginRight: "8px" }}></i>
            Pengurusan Sistem
          </div>"""

if old_admin_title in app_tsx:
    app_tsx = app_tsx.replace(old_admin_title, new_admin_title, 1)
    print("Updated Mod Admin title to 'Pengurusan Sistem' with title case.")
else:
    print("Warning: old_admin_title not matched exactly.")

# 1.2 Mod Guru: Kad 1 -> Add Delete Class icon button right after Save button
old_kad1_save_btn = """              {/* Butang Simpan: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  minHeight: "40px",
                  padding: 0,
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
                onClick={() => {
                  if (typeof (window as any).simpanNamaKelas === "function") {
                    (window as any).simpanNamaKelas();
                  }
                }}
                title="Simpan Nama Kelas"
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>

              {/* Option Tambah Lagi 1 Kelas (Maks. 2 Kelas) */}
              <button
                id="btn-tambah-kelas-guru"
                type="button"
                className="neo-btn bg-green"
                style={{
                  color: "white",
                  height: "40px",
                  minHeight: "40px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  margin: 0,
                }}
                onClick={() => {
                  if (typeof (window as any).tambahKelasBaharu === "function") {
                    (window as any).tambahKelasBaharu();
                  }
                }}
                title="Tambah Kelas"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tambah Kelas</span>
              </button>"""

new_kad1_save_btn = """              {/* Butang Simpan: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  minHeight: "40px",
                  padding: 0,
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (typeof (window as any).simpanNamaKelas === "function") {
                    (window as any).simpanNamaKelas();
                  }
                }}
                title="Simpan Nama Kelas"
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>

              {/* Butang Padam Kelas: HANYA ICON TONG SAMPAH MODEN */}
              <button
                id="btn-padam-kelas-guru"
                type="button"
                className="neo-btn bg-red"
                style={{
                  color: "white",
                  backgroundColor: "var(--color-red, #ef4444)",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  minHeight: "40px",
                  padding: 0,
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (typeof (window as any).padamKelasSemasa === "function") {
                    (window as any).padamKelasSemasa();
                  }
                }}
                title="Padam Kelas Semasa"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>

              {/* Option Tambah Lagi 1 Kelas (Maks. 2 Kelas) - Buka Modal Popup */}
              <button
                id="btn-tambah-kelas-guru"
                type="button"
                className="neo-btn bg-green"
                style={{
                  color: "white",
                  height: "40px",
                  minHeight: "40px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  margin: 0,
                }}
                onClick={() => {
                  if (typeof (window as any).bukaModalTambahKelas === "function") {
                    (window as any).bukaModalTambahKelas();
                  } else if (typeof (window as any).tambahKelasBaharu === "function") {
                    (window as any).tambahKelasBaharu();
                  }
                }}
                title="Tambah Kelas"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tambah Kelas</span>
              </button>"""

if old_kad1_save_btn in app_tsx:
    app_tsx = app_tsx.replace(old_kad1_save_btn, new_kad1_save_btn, 1)
    print("Added Padam Kelas button and wired modal popup to Tambah Kelas button in App.tsx.")
else:
    print("Warning: old_kad1_save_btn not matched.")

# 1.3 Mod Guru: Kad 3 Title -> Solid orange badge "Senarai Murid" (no "Jumlah: 6 Murid", no "Berdaftar")
old_kad3_title_block = """              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "#ccfbf1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0f766e",
                  }}
                >
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.05rem",
                      fontWeight: "bold",
                      color: "#1e293b",
                      fontFamily:
                        "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                    }}
                  >
                    Senarai Murid Berdaftar
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      fontWeight: "bold",
                    }}
                  >
                    Jumlah:{" "}
                    <span
                      id="jumlah-murid-count"
                      style={{ color: "#ea580c" }}
                    >
                      0
                    </span>{" "}
                    Murid
                  </div>
                </div>
              </div>"""

new_kad3_title_block = """              <div
                className="neo-btn bg-orange"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "12px",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  pointerEvents: "none",
                  margin: 0,
                }}
              >
                <i className="fa-solid fa-users" style={{ fontSize: "0.9rem" }}></i>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "0.92rem",
                    fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                  }}
                >
                  Senarai Murid
                </span>
                <span id="jumlah-murid-count" style={{ display: "none" }}>0</span>
              </div>"""

if old_kad3_title_block in app_tsx:
    app_tsx = app_tsx.replace(old_kad3_title_block, new_kad3_title_block, 1)
    print("Updated Kad 3 title to orange badge 'Senarai Murid' (removed 'Berdaftar' and 'Jumlah: 6 Murid').")
else:
    print("Warning: old_kad3_title_block not matched.")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)
print("Saved src/App.tsx")

# =========================================================================
# 2. Update public/app-logic.js
# =========================================================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# 2.1 Synchronize admin-table-selector in renderAdminTable
old_render_admin_start = """window.renderAdminTable = function (type = 'guru') {
    const adminTbody = document.getElementById('admin-table-body') || document.getElementById('admin-tbody');
    const adminThead = document.getElementById('admin-table-head') || document.getElementById('admin-thead');
    const title = document.getElementById('admin-table-title');"""

new_render_admin_start = """window.renderAdminTable = function (type = 'guru') {
    const adminTbody = document.getElementById('admin-table-body') || document.getElementById('admin-tbody');
    const adminThead = document.getElementById('admin-table-head') || document.getElementById('admin-thead');
    const title = document.getElementById('admin-table-title');
    const selector = document.getElementById('admin-table-selector');
    if (selector && selector.value !== type) {
        selector.value = type;
    }"""

if old_render_admin_start in app_logic:
    app_logic = app_logic.replace(old_render_admin_start, new_render_admin_start, 1)
    print("Added selector sync in renderAdminTable.")
else:
    print("Warning: old_render_admin_start not matched.")

# 2.2 Add padamKelasSemasa, bukaModalTambahKelas, and simpanKelasBaharuModal
class_handlers_code = """
window.padamKelasSemasa = function () {
    const list = window.getDaftarKelas();
    if (list.length <= 1) {
        alert("Akaun guru mesti mempunyai sekurang-kurangnya 1 kelas. Anda tidak boleh memadam kelas terakhir.");
        return;
    }

    const currentActive = window.getKelasAktif();
    const remaining = list.filter(k => k.toLowerCase() !== currentActive.toLowerCase());
    const newActive = remaining[0] || '1 Cemerlang';

    const sahkan = confirm(`Adakah anda pasti mahu memadam kelas "${currentActive}"?\\n\\nSemua murid dalam kelas ini akan dipindahkan ke kelas "${newActive}".`);
    if (!sahkan) return;

    // Pindahkan murid ke kelas yang tinggal
    if (typeof studentData === 'object' && studentData) {
        Object.keys(studentData).forEach(nama => {
            if (studentData[nama] && (!studentData[nama].kelas || studentData[nama].kelas.toLowerCase() === currentActive.toLowerCase())) {
                studentData[nama].kelas = newActive;
            }
        });
        if (typeof saveStudentData === 'function') saveStudentData();
    }

    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(remaining));
    localStorage.setItem('bunyiKataNamaKelas', newActive);

    window.kemaskiniSemuaDropdownKelas();
    if (typeof window.renderSenaraiMuridUrus === 'function') window.renderSenaraiMuridUrus();
    if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();

    alert(`Kelas "${currentActive}" telah berjaya dipadam! Kelas aktif kini ialah "${newActive}".`);
};

window.bukaModalTambahKelas = function () {
    const list = window.getDaftarKelas();
    if (list.length >= 2) {
        alert("Maksimum 2 kelas sahaja dibenarkan untuk satu akaun guru! Anda boleh padam salah satu kelas jika ingin menambah kelas baharu.");
        return;
    }

    let overlay = document.getElementById('modal-tambah-kelas-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modal-tambah-kelas-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.65); z-index:99999; display:flex; align-items:center; justify-content:center; padding:15px; box-sizing:border-box;';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div class="neo-box" style="background-color:#ffffff; background-image:radial-gradient(circle, rgba(16, 24, 47, 0.14) 1.8px, transparent 1.8px); background-size:16px 16px; max-width:420px; width:100%; padding:24px 20px; border-radius:20px; border:3px solid var(--color-dark, #10182f); text-align:left; box-shadow:0 6px 0 var(--color-dark, #10182f); position:relative; margin:auto; box-sizing:border-box;">
            <button type="button" onclick="document.getElementById('modal-tambah-kelas-overlay').style.display='none'" class="neo-btn bg-red" style="position:absolute; top:12px; right:12px; width:34px; height:34px; min-width:34px; min-height:34px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:10px; cursor:pointer;" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
            
            <div class="neo-btn" style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:14px; pointer-events:none;">
                <i class="fa-solid fa-chalkboard"></i>
                <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Tambah Kelas Baharu</span>
            </div>

            <p style="font-size:0.85rem; color:#64748b; font-weight:bold; margin-top:0; margin-bottom:12px; line-height:1.4;">
                Sila masukkan nama kelas baharu (Maksimum 2 kelas sahaja dibenarkan).
            </p>

            <div style="display:flex; flex-direction:column; gap:12px;">
                <div>
                    <label style="display:block; font-size:0.8rem; font-weight:bold; color:#1e293b; margin-bottom:4px;">Nama Kelas:</label>
                    <input type="text" id="modal-input-nama-kelas-baharu" class="neo-input" placeholder="cth: 1 Pintar" style="width:100%; padding:10px 14px; font-size:0.95rem; font-weight:bold; box-sizing:border-box; text-transform:uppercase;" onkeydown="if(event.key==='Enter') window.simpanKelasBaharuModal()" />
                </div>

                <div style="display:flex; gap:10px; margin-top:6px;">
                    <button type="button" class="neo-btn bg-white" style="flex:1; padding:10px; font-weight:bold; font-size:0.9rem; border-radius:12px; cursor:pointer;" onclick="document.getElementById('modal-tambah-kelas-overlay').style.display='none'">
                        Batal
                    </button>
                    <button type="button" class="neo-btn" style="flex:1.4; background:#ea580c; color:white; padding:10px; font-weight:bold; font-size:0.9rem; border-radius:12px; cursor:pointer;" onclick="window.simpanKelasBaharuModal()">
                        <i class="fa-solid fa-plus" style="margin-right:6px;"></i> Tambah
                    </button>
                </div>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    setTimeout(() => {
        const input = document.getElementById('modal-input-nama-kelas-baharu');
        if (input) input.focus();
    }, 50);
};

window.simpanKelasBaharuModal = function () {
    const input = document.getElementById('modal-input-nama-kelas-baharu');
    if (!input) return;
    const nama = input.value.trim();
    if (!nama) {
        alert("Sila masukkan nama kelas baharu!");
        input.focus();
        return;
    }

    let list = window.getDaftarKelas();
    if (list.length >= 2) {
        alert("Maksimum 2 kelas sahaja dibenarkan untuk satu akaun guru!");
        document.getElementById('modal-tambah-kelas-overlay').style.display = 'none';
        return;
    }

    if (list.some(k => k.toLowerCase() === nama.toLowerCase())) {
        alert(`Kelas "${nama}" sudah wujud dalam senarai kelas anda!`);
        window.tukarKelasAktif(list.find(k => k.toLowerCase() === nama.toLowerCase()));
        document.getElementById('modal-tambah-kelas-overlay').style.display = 'none';
        return;
    }

    list.push(nama);
    const final2 = list.slice(0, 2);
    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(final2));
    window.tukarKelasAktif(nama);

    document.getElementById('modal-tambah-kelas-overlay').style.display = 'none';
    alert(`Kelas "${nama}" telah berjaya didaftarkan! (2/2 Kelas digunakan)`);
};
"""

# Replace or wire tambahKelasBaharu to bukaModalTambahKelas
old_tambah_func = """window.tambahKelasBaharu = function () {
    const list = window.getDaftarKelas();
    if (list.length >= 2) {
        alert("Maksimum 2 kelas sahaja dibenarkan untuk satu akaun guru!");
        return;
    }
    const nama = prompt("Masukkan nama kelas baharu (Maksimum 2 kelas sahaja):", "1 Pintar");
    if (!nama || !nama.trim()) return;
    const cleanNama = nama.trim();
    if (list.some(k => k.toLowerCase() === cleanNama.toLowerCase())) {
        alert(`Kelas "${cleanNama}" sudah wujud dalam senarai!`);
        window.tukarKelasAktif(list.find(k => k.toLowerCase() === cleanNama.toLowerCase()));
        return;
    }
    list.push(cleanNama);
    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(list));
    window.tukarKelasAktif(cleanNama);
    alert(`Kelas "${cleanNama}" berjaya ditambah! (2/2 Kelas digunakan)`);
};"""

if old_tambah_func in app_logic:
    app_logic = app_logic.replace(old_tambah_func, class_handlers_code, 1)
    print("Replaced old tambahKelasBaharu with full modal popup and delete class handlers.")
else:
    app_logic += class_handlers_code
    print("Appended class handlers code.")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)
print("Saved public/app-logic.js")
