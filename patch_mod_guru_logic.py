# Update public/app-logic.js for Mod Guru class management and student registration
import re

with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update studentData initialization around line 930
old_sd_init = """var savedStudentData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));"""

new_sd_init = """var savedStudentData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
var studentData = Object.fromEntries(studentNames.map((name, i) => {
    const data = { ...studentRecord(), ...(savedStudentData[name] || {}) };
    if (!data.kelas) {
        data.kelas = i < 6 ? '1 Cemerlang' : '1 Pintar';
    }
    return [name, data];
}));"""

if old_sd_init in content:
    content = content.replace(old_sd_init, new_sd_init, 1)
    print("Updated studentData initialization with default class assignment.")
else:
    print("Warning: old_sd_init not found exactly.")

# 2. Add class management and updated renderSenaraiMuridUrus
old_pengurusan_block = """// --- PENGURUSAN MURID & KELAS ---
function updateStudentDropdown() {
    const select = document.getElementById('student-dropdown');
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = '<option value="" disabled selected>-- Senarai Nama Murid --</option>';
    studentNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name.toUpperCase();
        select.appendChild(opt);
    });
    if (currentVal && studentNames.includes(currentVal)) {
        select.value = currentVal;
    }
}

function renderSenaraiMuridUrus() {
    const container = document.getElementById('senarai-murid-container');
    const countEl = document.getElementById('jumlah-murid-count');
    const searchInput = document.getElementById('carian-murid-urus');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (countEl) countEl.innerText = studentNames.length;
    if (!container) return;

    if (studentNames.length === 0) {
        container.innerHTML = '<div style="padding:20px; text-align:center; color:#94a3b8; font-size:0.85rem; font-weight:bold;">Tiada murid berdaftar.</div>';
        return;
    }

    const filteredNames = query
        ? studentNames.filter(nama => nama && nama.toLowerCase().includes(query))
        : studentNames;

    if (filteredNames.length === 0) {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:#94a3b8; font-size:0.85rem; font-weight:bold;">Tiada murid ditemui untuk carian "${query}".</div>`;
        return;
    }

    let html = `
        <table style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.82rem; text-align:left;">
            <thead>
                <tr style="background:linear-gradient(135deg, #0f766e 0%, #0d9488 100%); color:#ffffff; position:sticky; top:0; z-index:10; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
                    <th style="padding:9px 8px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; border-right:1px solid rgba(255,255,255,0.2); width:50px; min-width:50px;">BIL</th>
                    <th style="padding:9px 12px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; border-right:1px solid rgba(255,255,255,0.2);">NAMA</th>
                    <th style="padding:9px 8px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; width:85px; min-width:85px;">TINDAKAN</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredNames.forEach((nama, idx) => {
        const origIdx = studentNames.indexOf(nama);
        const safeName = nama.replace(/"/g, '&quot;');
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        html += `
            <tr style="background:${rowBg}; border-bottom:1px solid #e2e8f0; transition:background 0.15s ease;">
                <td style="padding:7px 8px; text-align:center; font-weight:600; color:#64748b; border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; font-size:0.78rem;">${origIdx + 1}</td>
                <td style="padding:7px 12px; font-weight:bold; color:var(--color-dark, #1e293b); border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; text-transform:uppercase; font-size:0.8rem;">${nama.toUpperCase()}</td>
                <td style="padding:6px 8px; text-align:center; border-bottom:1px solid #e2e8f0;">
                    <button class="bg-red student-delete-btn neo-btn" style="padding:0 !important; font-size:0.72rem; width:28px !important; height:28px !important; min-width:28px !important; max-width:28px !important; min-height:28px !important; max-height:28px !important; border-radius:50% !important; aspect-ratio:1 / 1 !important; display:inline-flex !important; justify-content:center !important; align-items:center !important; cursor:pointer; flex-shrink:0 !important;   0 var(--color-dark) !important; margin:0 auto;" data-name="${safeName}" onclick="window.padamMurid(this.getAttribute('data-name'))" title="Padam Murid">
                        <i class="fa-solid fa-trash" style="font-size:0.72rem; line-height:1;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

window.renderSenaraiMuridUrus = renderSenaraiMuridUrus;

window.bukaModalUrusMurid = function () {
    if (typeof window.paparSkrin === 'function') {
        window.paparSkrin('guru-urus-murid');
    }
    const kelasInput = document.getElementById('input-nama-kelas');
    if (kelasInput) {
        kelasInput.value = localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang';
    }
    const searchInput = document.getElementById('carian-murid-urus');
    if (searchInput) {
        searchInput.value = '';
    }
    if (typeof renderSenaraiMuridUrus === 'function') {
        renderSenaraiMuridUrus();
    }
};"""

new_pengurusan_block = """// --- PENGURUSAN MURID & KELAS ---
window.getDaftarKelas = function () {
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
};

window.kemaskiniSemuaDropdownKelas = function () {
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
};

window.tukarKelasAktif = function (namaKelas) {
    if (!namaKelas) return;
    localStorage.setItem('bunyiKataNamaKelas', namaKelas);
    window.kemaskiniSemuaDropdownKelas();
    if (typeof window.renderSenaraiMuridUrus === 'function') window.renderSenaraiMuridUrus();
    if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
    if (typeof window.updateStudentDropdown === 'function') window.updateStudentDropdown();
};

window.tambahKelasBaharu = function () {
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
};

window.simpanNamaKelas = function () {
    const kelasInput = document.getElementById('input-nama-kelas');
    if (!kelasInput) return;
    const newName = kelasInput.value.trim();
    if (!newName) {
        alert('Sila masukkan nama kelas!');
        return;
    }
    const oldName = window.getKelasAktif();
    let list = window.getDaftarKelas();

    const idx = list.indexOf(oldName);
    if (idx !== -1) {
        list[idx] = newName;
    } else {
        list.push(newName);
    }
    localStorage.setItem('bunyiKataDaftarKelas', JSON.stringify(list));
    localStorage.setItem('bunyiKataNamaKelas', newName);

    // Kemaskini data murid bagi kelas lama ke kelas baharu
    Object.keys(studentData).forEach(nama => {
        if (!studentData[nama].kelas || studentData[nama].kelas === oldName) {
            studentData[nama].kelas = newName;
        }
    });
    saveStudentData();

    window.kemaskiniSemuaDropdownKelas();
    if (typeof window.renderSenaraiMuridUrus === 'function') window.renderSenaraiMuridUrus();
    if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
    alert(`Nama kelas telah dikemaskini kepada "${newName}".`);
};

function updateStudentDropdown() {
    const select = document.getElementById('student-dropdown');
    if (!select) return;
    const currentVal = select.value;
    select.innerHTML = '<option value="" disabled selected>-- Senarai Nama Murid --</option>';
    studentNames.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name.toUpperCase();
        select.appendChild(opt);
    });
    if (currentVal && studentNames.includes(currentVal)) {
        select.value = currentVal;
    }
}

function renderSenaraiMuridUrus() {
    const container = document.getElementById('senarai-murid-container');
    const countEl = document.getElementById('jumlah-murid-count');
    const searchInput = document.getElementById('carian-murid-urus');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const activeKelas = window.getKelasAktif();

    const listKelas = window.getDaftarKelas();
    studentNames.forEach((nama, idx) => {
        if (!studentData[nama]) studentData[nama] = studentRecord();
        if (!studentData[nama].kelas) {
            studentData[nama].kelas = idx < 6 ? (listKelas[0] || '1 Cemerlang') : (listKelas[1] || '1 Pintar');
        }
    });

    const muridDalamKelas = studentNames.filter(nama => {
        const k = (studentData[nama] && studentData[nama].kelas) || listKelas[0];
        return k === activeKelas;
    });

    if (countEl) countEl.innerText = muridDalamKelas.length;
    if (!container) return;

    if (muridDalamKelas.length === 0) {
        container.innerHTML = `<div style="padding:24px 16px; text-align:center; color:#94a3b8; font-size:0.85rem; font-weight:bold;">Tiada murid berdaftar dalam kelas "${activeKelas}". Sila tambah murid baharu di atas.</div>`;
        return;
    }

    const filteredNames = query
        ? muridDalamKelas.filter(nama => nama && nama.toLowerCase().includes(query))
        : muridDalamKelas;

    if (filteredNames.length === 0) {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:#94a3b8; font-size:0.85rem; font-weight:bold;">Tiada murid ditemui untuk carian "${query}".</div>`;
        return;
    }

    let html = `
        <table style="width:100%; border-collapse:separate; border-spacing:0; font-size:0.82rem; text-align:left;">
            <thead>
                <tr style="background:linear-gradient(135deg, #0f766e 0%, #0d9488 100%); color:#ffffff; position:sticky; top:0; z-index:10; box-shadow:0 2px 4px rgba(0,0,0,0.06);">
                    <th style="padding:9px 8px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; border-right:1px solid rgba(255,255,255,0.2); width:50px; min-width:50px;">BIL</th>
                    <th style="padding:9px 12px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; border-right:1px solid rgba(255,255,255,0.2);">NAMA</th>
                    <th style="padding:9px 8px; text-align:center; font-weight:bold; font-size:0.78rem; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #042f2e; width:85px; min-width:85px;">TINDAKAN</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredNames.forEach((nama, idx) => {
        const origIdx = muridDalamKelas.indexOf(nama);
        const safeName = nama.replace(/"/g, '&quot;');
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        html += `
            <tr style="background:${rowBg}; border-bottom:1px solid #e2e8f0; transition:background 0.15s ease;">
                <td style="padding:7px 8px; text-align:center; font-weight:600; color:#64748b; border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; font-size:0.78rem;">${origIdx + 1}</td>
                <td style="padding:7px 12px; font-weight:bold; color:var(--color-dark, #1e293b); border-bottom:1px solid #e2e8f0; border-right:1px solid #e2e8f0; text-transform:uppercase; font-size:0.8rem;">${nama.toUpperCase()}</td>
                <td style="padding:6px 8px; text-align:center; border-bottom:1px solid #e2e8f0;">
                    <button class="bg-red student-delete-btn neo-btn" style="padding:0 !important; font-size:0.72rem; width:28px !important; height:28px !important; min-width:28px !important; max-width:28px !important; min-height:28px !important; max-height:28px !important; border-radius:50% !important; aspect-ratio:1 / 1 !important; display:inline-flex !important; justify-content:center !important; align-items:center !important; cursor:pointer; flex-shrink:0 !important; margin:0 auto;" data-name="${safeName}" onclick="window.padamMurid(this.getAttribute('data-name'))" title="Padam Murid">
                        <i class="fa-solid fa-trash" style="font-size:0.72rem; line-height:1;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;
    container.innerHTML = html;
}

window.renderSenaraiMuridUrus = renderSenaraiMuridUrus;

window.bukaModalUrusMurid = function () {
    if (typeof window.paparSkrin === 'function') {
        window.paparSkrin('guru-urus-murid');
    }
    if (typeof window.kemaskiniSemuaDropdownKelas === 'function') {
        window.kemaskiniSemuaDropdownKelas();
    }
    const searchInput = document.getElementById('carian-murid-urus');
    if (searchInput) {
        searchInput.value = '';
    }
    if (typeof renderSenaraiMuridUrus === 'function') {
        renderSenaraiMuridUrus();
    }
};"""

if old_pengurusan_block in content:
    content = content.replace(old_pengurusan_block, new_pengurusan_block, 1)
    print("Updated pengurusan block with getDaftarKelas, kemaskiniSemuaDropdownKelas, etc.")
else:
    print("Warning: old_pengurusan_block not found exactly.")

# 3. Update tambahMuridBaru around line 16315
old_tambah_block = """window.tambahMuridBaru = function () {
    const input = document.getElementById('input-nama-murid-baru');
    if (!input) return;
    const rawValue = input.value.trim();
    if (!rawValue) {
        alert('Sila masukkan nama murid!');
        return;
    }

    const namesToAdd = rawValue.split(/[\n,]+/).map(n => n.trim().toUpperCase()).filter(n => n.length > 0);

    let addedCount = 0;
    let duplicates = [];

    namesToAdd.forEach(nama => {
        if (studentNames.some(n => n && n.toUpperCase() === (nama || '').toUpperCase())) {
            duplicates.push(nama);
        } else {
            studentNames.push(nama);
            if (!studentData[nama]) {
                studentData[nama] = studentRecord();
            }
            addedCount++;
        }
    });

    if (addedCount > 0) {
        saveStudentData();
        input.value = '';
        renderSenaraiMuridUrus();
        updateStudentDropdown();
        if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
    }

    if (duplicates.length > 0 && addedCount === 0) {
        alert('Semua nama murid tersebut sudah wujud dalam senarai!');
    } else if (duplicates.length > 0) {
        alert(addedCount + ' murid berjaya ditambah.\\nTerdapat nama yang diabaikan kerana sudah wujud:\\n' + duplicates.join(', '));
    }
};"""

new_tambah_block = """window.tambahMuridBaru = function () {
    const input = document.getElementById('input-nama-murid-baru');
    if (!input) return;
    const rawValue = input.value.trim();
    if (!rawValue) {
        alert('Sila masukkan nama murid!');
        return;
    }

    const activeKelas = window.getKelasAktif();
    const namesToAdd = rawValue.split(/[\n,]+/).map(n => n.trim().toUpperCase()).filter(n => n.length > 0);

    let addedCount = 0;
    let duplicates = [];

    namesToAdd.forEach(nama => {
        if (studentNames.some(n => n && n.toUpperCase() === (nama || '').toUpperCase())) {
            duplicates.push(nama);
        } else {
            studentNames.push(nama);
            if (!studentData[nama]) {
                studentData[nama] = studentRecord();
            }
            studentData[nama].kelas = activeKelas;
            addedCount++;
        }
    });

    if (addedCount > 0) {
        saveStudentData();
        input.value = '';
        renderSenaraiMuridUrus();
        updateStudentDropdown();
        if (typeof window.renderTeacherTable === 'function') window.renderTeacherTable();
    }

    if (duplicates.length > 0 && addedCount === 0) {
        alert(`Semua nama murid tersebut sudah wujud dalam senarai!`);
    } else if (duplicates.length > 0) {
        alert(addedCount + ` murid berjaya ditambah ke kelas "${activeKelas}".\\nTerdapat nama yang diabaikan kerana sudah wujud:\\n` + duplicates.join(', '));
    }
};"""

if old_tambah_block in content:
    content = content.replace(old_tambah_block, new_tambah_block, 1)
    print("Updated tambahMuridBaru to assign active class.")
else:
    print("Warning: old_tambah_block not found exactly.")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved public/app-logic.js")
