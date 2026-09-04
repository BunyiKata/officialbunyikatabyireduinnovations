# Implementation script for User Requests (Audio 1 & Audio 2)
import re

# ==========================================
# 1. Update public/app-logic.js
# ==========================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# 1.1 In renderAdminUrus, update Guru Title Badge
old_guru_title = """                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#ccfbf1; display:flex; align-items:center; justify-content:center; color:#0f766e; flex-shrink:0;">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Guru Berdaftar (${teachers.length})
                        </h3>
                    </div>"""

new_guru_title = """                    <div class="neo-btn" style="background:#168f81; color:white; padding:8px 18px; font-weight:bold; font-size:1.05rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-chalkboard-user"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Guru Berdaftar (${teachers.length})</span>
                    </div>"""

if old_guru_title in app_logic:
    app_logic = app_logic.replace(old_guru_title, new_guru_title, 1)
    print("Updated Guru Title Badge in renderAdminUrus to solid green.")
else:
    print("Warning: old_guru_title not found in app-logic.js")

# 1.2 In renderAdminUrus, update Ibu Bapa Title Badge
old_parent_title = """                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; display:flex; align-items:center; justify-content:center; color:#0284c7; flex-shrink:0;">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Ibu Bapa Berdaftar (${parents.length})
                        </h3>
                    </div>"""

new_parent_title = """                    <div class="neo-btn" style="background:#0284c7; color:white; padding:8px 18px; font-weight:bold; font-size:1.05rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; pointer-events:none;">
                        <i class="fa-solid fa-users"></i>
                        <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Senarai Ibu Bapa Berdaftar (${parents.length})</span>
                    </div>"""

if old_parent_title in app_logic:
    app_logic = app_logic.replace(old_parent_title, new_parent_title, 1)
    print("Updated Ibu Bapa Title Badge in renderAdminUrus to solid blue.")
else:
    print("Warning: old_parent_title not found in app-logic.js")

# 1.3 In bukaModalDaftarAdmin, update Guru modal header badge to solid green
old_modal_guru_badge = """                <div style="display:inline-flex; align-items:center; gap:8px; background:#ccfbf1; padding:6px 14px; border-radius:10px; border:2px solid #0f766e; margin-bottom:16px;">
                    <i class="fa-solid fa-chalkboard-user" style="color:#0f766e;"></i>
                    <span style="font-weight:900; color:#0f766e; font-size:1rem; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>"""

new_modal_guru_badge = """                <div class="neo-btn" style="background:#168f81; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>"""

if old_modal_guru_badge in app_logic:
    app_logic = app_logic.replace(old_modal_guru_badge, new_modal_guru_badge, 1)
    print("Updated modal Guru header badge to solid green.")
else:
    print("Warning: old_modal_guru_badge not found in app-logic.js")

# 1.4 In bukaModalDaftarAdmin, update Ibu Bapa modal header badge to solid blue
old_modal_parent_badge = """                <div style="display:inline-flex; align-items:center; gap:8px; background:#e0f2fe; padding:6px 14px; border-radius:10px; border:2px solid #0284c7; margin-bottom:16px;">
                    <i class="fa-solid fa-users" style="color:#0284c7;"></i>
                    <span style="font-weight:900; color:#0284c7; font-size:1rem; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Ibu Bapa Baharu</span>
                </div>"""

new_modal_parent_badge = """                <div class="neo-btn" style="background:#0284c7; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-users"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Ibu Bapa Baharu</span>
                </div>"""

if old_modal_parent_badge in app_logic:
    app_logic = app_logic.replace(old_modal_parent_badge, new_modal_parent_badge, 1)
    print("Updated modal Ibu Bapa header badge to solid blue.")
else:
    print("Warning: old_modal_parent_badge not found in app-logic.js")

# 1.5 Update tambahKelasBaharu to enforce maximum 2 classes!
old_tambah_kelas = """window.tambahKelasBaharu = function () {
    const list = window.getDaftarKelas();
    const nama = prompt("Masukkan nama kelas baharu (cth: 1 Bestari, 1 Inovatif, dsb.):");
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
    alert(`Kelas "${cleanNama}" berjaya ditambah!`);
};"""

new_tambah_kelas = """window.tambahKelasBaharu = function () {
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

if old_tambah_kelas in app_logic:
    app_logic = app_logic.replace(old_tambah_kelas, new_tambah_kelas, 1)
    print("Updated tambahKelasBaharu with maximum 2 classes rule.")
else:
    print("Warning: old_tambah_kelas not found in app-logic.js")

# 1.6 Update kemaskiniSemuaDropdownKelas to update button state
old_kemaskini_fn = """window.kemaskiniSemuaDropdownKelas = function () {
    const list = window.getDaftarKelas();
    const active = window.getKelasAktif();

    // 1. Dropdown pilih kelas di Tetapan Nama Kelas
    const selectTetapan = document.getElementById('select-pilih-kelas');
    if (selectTetapan) {
        selectTetapan.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectTetapan.appendChild(opt);
        });
    }

    // 2. Input nama kelas di Tetapan Nama Kelas
    const inputKelas = document.getElementById('input-nama-kelas');
    if (inputKelas) {
        inputKelas.value = active;
    }

    // 3. Dropdown filter di Senarai Murid Berdaftar (TIADA "Semua Kelas")
    const selectSenarai = document.getElementById('filter-kelas-senarai-murid');
    if (selectSenarai) {
        selectSenarai.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectSenarai.appendChild(opt);
        });
    }

    // 4. Dropdown filter di Dashboard Guru (TIADA "Semua Kelas")
    const selectDash = document.getElementById('guru-dashboard-kelas-select');
    if (selectDash) {
        selectDash.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectDash.appendChild(opt);
        });
    }

    // Update tajuk nama kelas di dashboard guru & ibubapa
    const t1 = document.getElementById('guru-dashboard-nama-kelas-title');
    if (t1) t1.innerText = active;
    const t2 = document.getElementById('ibubapa-nama-kelas-title');
    if (t2) t2.innerText = active;
};"""

new_kemaskini_fn = """window.kemaskiniSemuaDropdownKelas = function () {
    const list = window.getDaftarKelas();
    const active = window.getKelasAktif();

    // 1. Dropdown pilih kelas di Tetapan Nama Kelas
    const selectTetapan = document.getElementById('select-pilih-kelas');
    if (selectTetapan) {
        selectTetapan.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectTetapan.appendChild(opt);
        });
        selectTetapan.value = active;
    }

    // 2. Input nama kelas di Tetapan Nama Kelas
    const inputKelas = document.getElementById('input-nama-kelas');
    if (inputKelas) {
        inputKelas.value = active;
    }

    // 3. Dropdown filter di Senarai Murid Berdaftar (TIADA "Semua Kelas")
    const selectSenarai = document.getElementById('filter-kelas-senarai-murid');
    if (selectSenarai) {
        selectSenarai.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectSenarai.appendChild(opt);
        });
        selectSenarai.value = active;
    }

    // 4. Dropdown filter di Dashboard Guru (TIADA "Semua Kelas")
    const selectDash = document.getElementById('guru-dashboard-kelas-select');
    if (selectDash) {
        selectDash.innerHTML = '';
        list.forEach(k => {
            const opt = document.createElement('option');
            opt.value = k;
            opt.textContent = k;
            if (k === active) opt.selected = true;
            selectDash.appendChild(opt);
        });
        selectDash.value = active;
    }

    // 5. Butang Tambah Kelas: Had maksimum 2 kelas
    const btnTambah = document.getElementById('btn-tambah-kelas-guru');
    if (btnTambah) {
        if (list.length >= 2) {
            btnTambah.style.opacity = '0.65';
            btnTambah.title = 'Maksimum 2 kelas sahaja (Had telah dicapai)';
            btnTambah.innerHTML = '<i class="fa-solid fa-lock"></i> <span>Maks. 2 Kelas</span>';
        } else {
            btnTambah.style.opacity = '1';
            btnTambah.title = 'Tambah 1 Kelas Baharu (Maksimum 2 Kelas)';
            btnTambah.innerHTML = '<i class="fa-solid fa-plus"></i> <span>Tambah Kelas</span>';
        }
    }

    // Update tajuk nama kelas di dashboard guru & ibubapa
    const t1 = document.getElementById('guru-dashboard-nama-kelas-title');
    if (t1) t1.innerText = active;
    const t2 = document.getElementById('ibubapa-nama-kelas-title');
    if (t2) t2.innerText = active;
};"""

if old_kemaskini_fn in app_logic:
    app_logic = app_logic.replace(old_kemaskini_fn, new_kemaskini_fn, 1)
    print("Updated kemaskiniSemuaDropdownKelas with button state logic.")
else:
    print("Warning: old_kemaskini_fn not found in app-logic.js")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)

print("Saved public/app-logic.js")
