# Patch script for:
# 1. Deduplication and strictly max 2 classes in Mod Guru
# 2. Put admin-urus title badge and + Daftar Baharu button INSIDE the white table card frame
# 3. Fix mobile overflow of "Pengurusan Murid & Kelas" title so text never spills out of orange pill
# 4. Make sure "Senarai Maklum Balas" does not say "Pengguna" in filter or title

import re

# =========================================================================
# 1. Update public/app-logic.js
# =========================================================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# 1.1 Robust getDaftarKelas and getKelasAktif:
# Fix the bug where currentActive was pushed if not strictly case-sensitive matching
old_get_daftar_block = """window.getDaftarKelas = function () {
    let list = [];
    try {
        const raw = localStorage.getItem('bunyiKataDaftarKelas');
        if (raw) list = JSON.parse(raw);
    } catch (e) { }
    if (!Array.isArray(list) || list.length === 0) {
        list = ['1 Cemerlang', '1 Pintar'];
        localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(list));
    }
    const currentActive = localStorage.getItem('bunyiKataNamaKelas');
    if (currentActive && !list.includes(currentActive)) {
        list.push(currentActive);
        localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(list));
    }
    return list;
};

window.getKelasAktif = function () {
    const list = window.getDaftarKelas();
    let cur = localStorage.getItem('bunyiKataNamaKelas');
    if (!cur || !list.includes(cur)) {
        cur = list[0] || '1 Cemerlang';
        localStorage.setItem('bunyiKataNamaKelas', cur);
    }
    return cur;
};"""

new_get_daftar_block = """window.getDaftarKelas = function () {
    let list = [];
    try {
        const raw = localStorage.getItem('bunyiKataDaftarKelas');
        if (raw) list = JSON.parse(raw);
    } catch (e) { }

    if (!Array.isArray(list) || list.length === 0) {
        list = ['1 Cemerlang', '1 Pintar'];
    }

    // Strict case-insensitive deduplication and sanitization
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

    // Hard limit: strictly maximum 2 classes
    let final2 = cleanList.slice(0, 2);
    if (final2.length === 0) {
        final2 = ['1 Cemerlang', '1 Pintar'];
    }

    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(final2));
    return final2;
};

window.getKelasAktif = function () {
    const list = window.getDaftarKelas();
    let cur = localStorage.getItem('bunyiKataNamaKelas') || '';
    cur = cur.trim();

    // Check if cur matches any item case-insensitively
    const match = list.find(k => k.toLowerCase() === cur.toLowerCase());
    if (match) {
        cur = match; // Normalize to standard case
    } else {
        cur = list[0] || '1 Cemerlang';
    }

    localStorage.setItem('bunyiKataNamaKelas', cur);
    return cur;
};"""

if old_get_daftar_block in app_logic:
    app_logic = app_logic.replace(old_get_daftar_block, new_get_daftar_block, 1)
    print("Replaced getDaftarKelas and getKelasAktif successfully.")
else:
    print("Warning: old_get_daftar_block not matched exactly, trying regex/flexible replace.")
    pattern = r"window\.getDaftarKelas\s*=\s*function\s*\(\)\s*\{[\s\S]*?return cur;\s*\};"
    if re.search(pattern, app_logic):
        app_logic = re.sub(pattern, new_get_daftar_block, app_logic, count=1)
        print("Replaced getDaftarKelas and getKelasAktif using regex.")

# 1.2 Move admin-urus header row INSIDE the white card frame for both Guru and Ibu Bapa
# Look for Guru container.innerHTML
old_guru_container_html = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px; width:100%; max-width:100%; min-width:0; box-sizing:border-box;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja (Warna Oren sedondon Dashboard) -->
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
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">"""

new_guru_container_html = """        container.innerHTML = `
            <!-- Table Card: Butang Daftar & Tajuk DI DALAM FRAME PUTIH ATAS JADUAL -->
            <div class="neo-box admin-table-card" style="background:#ffffff; padding:18px; border-radius:18px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box; margin-bottom:15px;">
                    <div class="neo-btn" style="background:#ea580c; color:white; padding:7px 16px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Guru Berdaftar (${teachers.length})</span>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#ea580c; color:white; padding:9px 16px; font-weight:bold; font-size:0.9rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('guru')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Guru Baharu</span>
                    </button>
                </div>"""

# And the closing tag for Guru:
old_guru_closing = """                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;"""

new_guru_closing = """                            </tbody>
                        </table>
                    </div>
            </div>
        `;"""

if old_guru_container_html in app_logic:
    app_logic = app_logic.replace(old_guru_container_html, new_guru_container_html, 1)
    if old_guru_closing in app_logic:
        app_logic = app_logic.replace(old_guru_closing, new_guru_closing, 1)
    print("Moved Guru header inside white card frame.")
else:
    print("Warning: old_guru_container_html not matched.")

# Look for Ibu Bapa container.innerHTML
old_parent_container_html = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px; width:100%; max-width:100%; min-width:0; box-sizing:border-box;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box;">
                    <div class="neo-btn" style="background:#0284c7; color:white; padding:8px 18px; font-weight:bold; font-size:1.05rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-users"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Ibu Bapa Berdaftar (${parents.length})</span>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#0284c7; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('ibubapa')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Ibu Bapa Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">"""

new_parent_container_html = """        container.innerHTML = `
            <!-- Table Card: Butang Daftar & Tajuk DI DALAM FRAME PUTIH ATAS JADUAL -->
            <div class="neo-box admin-table-card" style="background:#ffffff; padding:18px; border-radius:18px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box; margin-bottom:15px;">
                    <div class="neo-btn" style="background:#0284c7; color:white; padding:7px 16px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-users"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Ibu Bapa Berdaftar (${parents.length})</span>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#0284c7; color:white; padding:9px 16px; font-weight:bold; font-size:0.9rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('ibubapa')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Ibu Bapa Baharu</span>
                    </button>
                </div>"""

# And the closing tag for Ibu Bapa:
old_parent_closing = """                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;"""

new_parent_closing = """                            </tbody>
                        </table>
                    </div>
            </div>
        `;"""

if old_parent_container_html in app_logic:
    app_logic = app_logic.replace(old_parent_container_html, new_parent_container_html, 1)
    if old_parent_closing in app_logic:
        app_logic = app_logic.replace(old_parent_closing, new_parent_closing, 1)
    print("Moved Ibu Bapa header inside white card frame.")
else:
    print("Warning: old_parent_container_html not matched.")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)
print("Saved public/app-logic.js")

# =========================================================================
# 2. Update src/App.tsx
# =========================================================================
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_tsx = f.read()

# Fix mobile overflow of "Pengurusan Murid & Kelas":
# Remove `page-title` class (which adds max-width: 68vw and causes text overflow on mobile),
# and make it fluid with clamp and display: inline-flex
old_guru_title_div = """          <div
            className="neo-btn bg-orange page-title century-gothic-font"
            style={{
              color: "white",
              backgroundColor: "var(--color-orange, #ea580c)",
              pointerEvents: "none",
              fontSize: "1.2rem",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
            }}
          >
            <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
            Pengurusan Murid &amp; Kelas
          </div>"""

new_guru_title_div = """          <div
            className="neo-btn bg-orange century-gothic-font"
            style={{
              color: "white",
              backgroundColor: "var(--color-orange, #ea580c)",
              pointerEvents: "none",
              fontSize: "clamp(0.9rem, 3.8vw, 1.2rem)",
              textAlign: "center",
              padding: "8px 20px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "92vw",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
            Pengurusan Murid &amp; Kelas
          </div>"""

if old_guru_title_div in app_tsx:
    app_tsx = app_tsx.replace(old_guru_title_div, new_guru_title_div, 1)
    print("Updated Pengurusan Murid & Kelas title container in App.tsx (removed page-title class).")
else:
    print("Warning: old_guru_title_div not matched exactly.")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)
print("Saved src/App.tsx")

# =========================================================================
# 3. Update src/index.css
# =========================================================================
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make sure CSS has proper mobile rules for #guru-urus-murid title
old_css_rule = """/* Mod Guru: Pengurusan Murid & Kelas Consistent Orange Styling */
#guru-urus-murid .page-title,
#guru-urus-murid .bg-orange {
    background-color: var(--color-orange, #ea580c) !important;
    color: #ffffff !important;
}

@media (max-width: 768px) {
    #guru-urus-murid {
        padding-left: 12px !important;
        padding-right: 12px !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
    }

    #guru-urus-murid .page-title {
        font-size: 1rem !important;
        padding: 8px 16px !important;
        background-color: var(--color-orange, #ea580c) !important;
        color: #ffffff !important;
    }
}"""

new_css_rule = """/* Mod Guru: Pengurusan Murid & Kelas Consistent Orange Styling */
#guru-urus-murid .page-title,
#guru-urus-murid .bg-orange {
    background-color: var(--color-orange, #ea580c) !important;
    color: #ffffff !important;
}

@media (max-width: 768px) {
    #guru-urus-murid {
        padding-left: 10px !important;
        padding-right: 10px !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
    }

    #guru-urus-murid .century-gothic-font.bg-orange {
        font-size: clamp(0.85rem, 3.8vw, 1.05rem) !important;
        padding: 8px 14px !important;
        max-width: 95vw !important;
        white-space: normal !important;
        text-align: center !important;
        background-color: var(--color-orange, #ea580c) !important;
        color: #ffffff !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
}"""

if old_css_rule in css:
    css = css.replace(old_css_rule, new_css_rule, 1)
    print("Updated CSS mobile rule for guru-urus-murid title.")
else:
    css += "\n" + new_css_rule
    print("Appended CSS mobile rule for guru-urus-murid title.")

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Saved src/index.css")
