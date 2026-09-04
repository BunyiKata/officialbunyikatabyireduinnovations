# Script to implement all 5 requests from the user
import re

# ==========================================
# 1. Update public/app-logic.js
# ==========================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# 1.1 In renderAdminTable, add solid highlight badges to titles
old_admin_table_guru = """        if (title) title.innerHTML = '<i class="fa-solid fa-chalkboard-user" style="color:#ea580c"></i> Senarai Guru Berdaftar';
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white;">"""

new_admin_table_guru = """        if (title) {
            title.className = "neo-btn";
            title.style.cssText = "background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:white; padding:7px 16px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none; margin:0;";
            title.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i> <span style="font-family:\\'AtlantaRoundedBlack\\', sans-serif;">Senarai Guru Berdaftar</span>';
        }
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: white;">"""

if old_admin_table_guru in app_logic:
    app_logic = app_logic.replace(old_admin_table_guru, new_admin_table_guru, 1)
    print("Updated adminTable guru title to orange badge.")

old_admin_table_parent = """        if (title) title.innerHTML = '<i class="fa-solid fa-users" style="color:#0284c7"></i> Senarai Ibu Bapa Berdaftar';
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white;">"""

new_admin_table_parent = """        if (title) {
            title.className = "neo-btn";
            title.style.cssText = "background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:white; padding:7px 16px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none; margin:0;";
            title.innerHTML = '<i class="fa-solid fa-users"></i> <span style="font-family:\\'AtlantaRoundedBlack\\', sans-serif;">Senarai Ibu Bapa Berdaftar</span>';
        }
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: white;">"""

if old_admin_table_parent in app_logic:
    app_logic = app_logic.replace(old_admin_table_parent, new_admin_table_parent, 1)
    print("Updated adminTable parent title to blue badge.")

old_admin_table_feedback = """        if (title) title.innerHTML = '<i class="fa-solid fa-comments" style="color:#d97706"></i> Senarai Maklum Balas Pengguna';
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white;">"""

new_admin_table_feedback = """        if (title) {
            title.className = "neo-btn";
            title.style.cssText = "background:linear-gradient(135deg, #d97706 0%, #b45309 100%); color:white; padding:7px 16px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none; margin:0;";
            title.innerHTML = '<i class="fa-solid fa-comments"></i> <span style="font-family:\\'AtlantaRoundedBlack\\', sans-serif;">Senarai Maklum Balas</span>';
        }
        adminThead.innerHTML = `
                    <tr style="background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: white;">"""

if old_admin_table_feedback in app_logic:
    app_logic = app_logic.replace(old_admin_table_feedback, new_admin_table_feedback, 1)
    print("Updated adminTable feedback title to 'Senarai Maklum Balas' with orange badge.")

# 1.2 In renderAdminUrus, update tabs styling (icon color for Ibu Bapa, orange for Guru)
old_tab_switcher_logic = """    ['guru', 'ibubapa'].forEach(t => {
        const btn = document.getElementById(`admin-urus-tab-btn-${t}`);
        if (btn) {
            if (t === activeTab) {
                btn.style.backgroundColor = t === 'guru' ? '#168f81' : '#0284c7';
                btn.style.color = '#ffffff';
                btn.style.boxShadow = '0 4px 0 var(--color-dark, #10182f)';
            } else {
                btn.style.backgroundColor = '#ffffff';
                btn.style.color = '#1e293b';
                btn.style.boxShadow = '0 2px 0 var(--color-dark, #10182f)';
            }
        }
    });"""

new_tab_switcher_logic = """    ['guru', 'ibubapa'].forEach(t => {
        const btn = document.getElementById(`admin-urus-tab-btn-${t}`);
        if (btn) {
            const icon = btn.querySelector('i');
            if (t === activeTab) {
                btn.style.backgroundColor = t === 'guru' ? '#ea580c' : '#0284c7';
                btn.style.color = '#ffffff';
                btn.style.boxShadow = '0 4px 0 var(--color-dark, #10182f)';
                if (icon) icon.style.color = '#ffffff';
            } else {
                btn.style.backgroundColor = '#ffffff';
                btn.style.color = '#1e293b';
                btn.style.boxShadow = '0 2px 0 var(--color-dark, #10182f)';
                if (icon) icon.style.color = t === 'guru' ? '#ea580c' : '#0284c7';
            }
        }
    });"""

if old_tab_switcher_logic in app_logic:
    app_logic = app_logic.replace(old_tab_switcher_logic, new_tab_switcher_logic, 1)
    print("Updated tab switcher logic: Guru is orange, Ibu Bapa active icon is white.")

# 1.3 In renderAdminUrus, for Guru, change header badge, button, and table header to orange!
old_guru_urus_block = """                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box;">
                    <div class="neo-btn" style="background:#168f81; color:white; padding:8px 18px; font-weight:bold; font-size:1.05rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Guru Berdaftar (${teachers.length})</span>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#168f81; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('guru')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Guru Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                    <!-- Hint leret bagi peranti mudah alih -->
                    <div class="mobile-table-hint" style="display:none; font-size:0.75rem; color:#64748b; font-weight:bold; margin-bottom:8px; align-items:center; gap:6px;">
                        <i class="fa-solid fa-arrows-left-right" style="color:#168f81;"></i>
                        <span>Leret jadual ke kiri / kanan untuk lihat maklumat & tindakan</span>
                    </div>

                    <div style="width:100%; max-width:100%; min-width:0; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:12px; border:2px solid var(--color-dark, #10182f); box-sizing:border-box;">
                        <table style="width:100%; min-width:680px; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                            <thead>
                                <tr style="background:linear-gradient(135deg, #168f81 0%, #0f766e 100%); color:#ffffff;">"""

new_guru_urus_block = """                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja (Warna Oren sedondon Dashboard) -->
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box;">
                    <div class="neo-btn" style="background:#ea580c; color:white; padding:8px 18px; font-weight:bold; font-size:1.05rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Guru Berdaftar (${teachers.length})</span>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#ea580c; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('guru')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Guru Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                    <!-- Hint leret bagi peranti mudah alih -->
                    <div class="mobile-table-hint" style="display:none; font-size:0.75rem; color:#64748b; font-weight:bold; margin-bottom:8px; align-items:center; gap:6px;">
                        <i class="fa-solid fa-arrows-left-right" style="color:#ea580c;"></i>
                        <span>Leret jadual ke kiri / kanan untuk lihat maklumat & tindakan</span>
                    </div>

                    <div style="width:100%; max-width:100%; min-width:0; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:12px; border:2px solid var(--color-dark, #10182f); box-sizing:border-box;">
                        <table style="width:100%; min-width:680px; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                            <thead>
                                <tr style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:#ffffff;">"""

if old_guru_urus_block in app_logic:
    app_logic = app_logic.replace(old_guru_urus_block, new_guru_urus_block, 1)
    print("Updated Guru section in renderAdminUrus to orange.")

# 1.4 In bukaModalDaftarAdmin for guru, change header badge and submit button to orange
old_modal_guru_colors = """                <div class="neo-btn" style="background:#168f81; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Nama Guru:</label>
                        <input type="text" id="modal-admin-guru-nama" class="neo-input" placeholder="cth: Cikgu Noraini" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Nama Sekolah:</label>
                        <input type="text" id="modal-admin-guru-sekolah" class="neo-input" placeholder="cth: SK Bintang" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Emel Guru:</label>
                        <input type="email" id="modal-admin-guru-email" class="neo-input" placeholder="cikgu@moe.edu.my" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Kata Laluan:</label>
                        <input type="password" id="modal-admin-guru-password" class="neo-input" placeholder="Kata laluan..." style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Tempoh Akses (Hari):</label>
                        <input type="number" id="modal-admin-guru-hari" class="neo-input" value="30" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div style="margin-top:10px;">
                        <button type="button" class="neo-btn" style="background:#168f81; color:white; width:100%; padding:11px; font-weight:bold; font-size:0.95rem; border-radius:12px; cursor:pointer;" onclick="window.simpanDaftarGuruModal()">
                            <i class="fa-solid fa-floppy-disk" style="margin-right:6px;"></i> Simpan &amp; Daftar
                        </button>
                    </div>"""

new_modal_guru_colors = """                <div class="neo-btn" style="background:#ea580c; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Nama Guru:</label>
                        <input type="text" id="modal-admin-guru-nama" class="neo-input" placeholder="cth: Cikgu Noraini" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Nama Sekolah:</label>
                        <input type="text" id="modal-admin-guru-sekolah" class="neo-input" placeholder="cth: SK Bintang" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Emel Guru:</label>
                        <input type="email" id="modal-admin-guru-email" class="neo-input" placeholder="cikgu@moe.edu.my" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Kata Laluan:</label>
                        <input type="password" id="modal-admin-guru-password" class="neo-input" placeholder="Kata laluan..." style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div>
                        <label style="display:block; font-size:0.75rem; font-weight:bold; color:#475569; margin-bottom:3px;">Tempoh Akses (Hari):</label>
                        <input type="number" id="modal-admin-guru-hari" class="neo-input" value="30" style="width:100%; padding:8px 12px; font-size:0.9rem; box-sizing:border-box;" />
                    </div>
                    <div style="margin-top:10px;">
                        <button type="button" class="neo-btn" style="background:#ea580c; color:white; width:100%; padding:11px; font-weight:bold; font-size:0.95rem; border-radius:12px; cursor:pointer;" onclick="window.simpanDaftarGuruModal()">
                            <i class="fa-solid fa-floppy-disk" style="margin-right:6px;"></i> Simpan &amp; Daftar
                        </button>
                    </div>"""

if old_modal_guru_colors in app_logic:
    app_logic = app_logic.replace(old_modal_guru_colors, new_modal_guru_colors, 1)
    print("Updated modal Guru colors to orange.")

# 1.5 Robust Deduplication and Maximum 2 Classes logic in getDaftarKelas and kemaskiniSemuaDropdownKelas
old_get_daftar_kelas = """window.getDaftarKelas = function () {
    let list = [];
    try {
        const raw = localStorage.getItem('bunyiKataDaftarKelas');
        if (raw) list = JSON.parse(raw);
    } catch(e) {}
    if (!Array.isArray(list) || list.length === 0) {
        list = ['1 Cemerlang', '1 Pintar'];
        localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(list));
    }
    return list;
};"""

new_get_daftar_kelas = """window.getDaftarKelas = function () {
    let list = [];
    try {
        const raw = localStorage.getItem('bunyiKataDaftarKelas');
        if (raw) list = JSON.parse(raw);
    } catch(e) {}
    if (!Array.isArray(list) || list.length === 0) {
        list = ['1 Cemerlang', '1 Pintar'];
    }
    
    // Strict Case-Insensitive Deduplication & Max 2 classes
    const seen = new Set();
    const cleanList = [];
    for (const k of list) {
        if (typeof k === 'string') {
            const trimmed = k.trim();
            if (trimmed.length > 0) {
                const lower = trimmed.toLowerCase();
                if (!seen.has(lower)) {
                    seen.add(lower);
                    cleanList.push(trimmed);
                }
            }
        }
    }
    
    const final2 = cleanList.slice(0, 2);
    if (final2.length === 0) final2.push('1 Cemerlang');
    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(final2));
    return final2;
};"""

if old_get_daftar_kelas in app_logic:
    app_logic = app_logic.replace(old_get_daftar_kelas, new_get_daftar_kelas, 1)
    print("Updated getDaftarKelas with strict case-insensitive deduplication and max 2 classes.")

# Clean immediately in initialization
app_logic_extra_cleanup = """
// Auto-sanitize existing localStorage on load
try {
    if (typeof window !== 'undefined' && window.getDaftarKelas) {
        window.getDaftarKelas();
    }
} catch(e) {}
"""
if "Auto-sanitize existing localStorage on load" not in app_logic:
    app_logic += app_logic_extra_cleanup

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)

print("Saved public/app-logic.js")

# ==========================================
# 2. Update src/App.tsx
# ==========================================
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_tsx = f.read()

# 2.1 Update Admin Table Title & Selector in App.tsx
old_admin_table_header = """            <h3
              id="admin-table-title"
              style={{
                fontSize: "1.05rem",
                margin: "0",
                color: "var(--color-dark)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i
                className="fa-solid fa-chalkboard-user"
                style={{ color: "#ea580c" }}
              ></i>{" "}
              Senarai Guru Berdaftar
            </h3>
            <select
              id="admin-table-selector"
              className="neo-btn filter-select"
              style={{
                padding: "6px 32px 6px 10px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "2px solid var(--color-dark)",
                backgroundColor: "#f1f5f9",
                cursor: "pointer",
              }}
              onChange={(e) => {
                if (typeof (window as any).renderAdminTable === "function") {
                  (window as any).renderAdminTable(e.target.value);
                }
              }}
            >
              <option value="guru">Senarai Guru Berdaftar</option>
              <option value="ibubapa">Senarai Ibu Bapa Berdaftar</option>
              <option value="feedback">Senarai Maklum Balas Pengguna</option>
            </select>"""

new_admin_table_header = """            <div
              id="admin-table-title"
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Senarai Guru Berdaftar
              </span>
            </div>
            <select
              id="admin-table-selector"
              className="neo-btn filter-select"
              style={{
                padding: "6px 32px 6px 10px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                borderRadius: "10px",
                border: "2px solid var(--color-dark)",
                backgroundColor: "#f1f5f9",
                cursor: "pointer",
              }}
              onChange={(e) => {
                if (typeof (window as any).renderAdminTable === "function") {
                  (window as any).renderAdminTable(e.target.value);
                }
              }}
            >
              <option value="guru">Senarai Guru Berdaftar</option>
              <option value="ibubapa">Senarai Ibu Bapa Berdaftar</option>
              <option value="feedback">Senarai Maklum Balas</option>
            </select>"""

if old_admin_table_header in app_tsx:
    app_tsx = app_tsx.replace(old_admin_table_header, new_admin_table_header, 1)
    print("Updated admin-table-title to solid orange badge & feedback option text.")

# 2.2 In #admin-urus, update tab button for Guru to orange background and icon for Ibu Bapa
old_admin_tab_buttons = """          <button
            id="admin-urus-tab-btn-guru"
            type="button"
            className="neo-btn admin-tab-switcher-btn"
            style={{
              backgroundColor: "#168f81",
              color: "white",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("guru");
              }
            }}
          >
            <i className="fa-solid fa-chalkboard-user"></i>
            <span>Guru & Sekolah</span>
          </button>

          <button
            id="admin-urus-tab-btn-ibubapa"
            type="button"
            className="neo-btn bg-white admin-tab-switcher-btn"
            style={{
              color: "#1e293b",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("ibubapa");
              }
            }}
          >
            <i className="fa-solid fa-users" style={{ color: "#0284c7" }}></i>
            <span>Ibu Bapa</span>
          </button>"""

new_admin_tab_buttons = """          <button
            id="admin-urus-tab-btn-guru"
            type="button"
            className="neo-btn admin-tab-switcher-btn"
            style={{
              backgroundColor: "#ea580c",
              color: "white",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("guru");
              }
            }}
          >
            <i className="fa-solid fa-chalkboard-user" style={{ color: "#ffffff" }}></i>
            <span>Guru & Sekolah</span>
          </button>

          <button
            id="admin-urus-tab-btn-ibubapa"
            type="button"
            className="neo-btn bg-white admin-tab-switcher-btn"
            style={{
              color: "#1e293b",
              padding: "10px 20px",
              fontWeight: "bold",
              fontSize: "0.95rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => {
              if (typeof (window as any).tukarAdminUrusTab === "function") {
                (window as any).tukarAdminUrusTab("ibubapa");
              }
            }}
          >
            <i className="fa-solid fa-users" style={{ color: "#0284c7" }}></i>
            <span>Ibu Bapa</span>
          </button>"""

if old_admin_tab_buttons in app_tsx:
    app_tsx = app_tsx.replace(old_admin_tab_buttons, new_admin_tab_buttons, 1)
    print("Updated admin-urus tab buttons: Guru is orange.")

# 2.3 In #guru-dashboard, update Prestasi Murid & Laporan Aktiviti title to "Prestasi Murid & Laporan" with table-matching green badge
old_guru_table_title = """            <h3
              id="guru-table-title"
              style={{
                fontSize: "1.05rem",
                margin: "0",
                color: "var(--color-dark)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i
                className="fa-solid fa-chart-line"
                style={{ color: "#168f81" }}
              ></i>{" "}
              Prestasi Murid &amp; Laporan Aktiviti
            </h3>"""

new_guru_table_title = """            <div
              id="guru-table-title"
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Prestasi Murid &amp; Laporan
              </span>
            </div>"""

if old_guru_table_title in app_tsx:
    app_tsx = app_tsx.replace(old_guru_table_title, new_guru_table_title, 1)
    print("Updated guru-table-title to green badge with text 'Prestasi Murid & Laporan'.")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)

print("Saved src/App.tsx")
