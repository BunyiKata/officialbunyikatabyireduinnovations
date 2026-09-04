with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """window.simpanNamaKelas = function () {
    const kelasInput = document.getElementById('input-nama-kelas');
    if (!kelasInput) return;
    const val = kelasInput.value.trim() || '1 Cemerlang';
    localStorage.setItem('bunyiKataNamaKelas', val);
    let el1 = document.getElementById('guru-dashboard-nama-kelas-title');
    if (el1) el1.innerText = val;
    let el2 = document.getElementById('ibubapa-nama-kelas-title');
    if (el2) el2.innerText = val;
    alert('Nama kelas telah disimpan: ' + val);
};

window.tambahMuridBaru = function () {
    const input = document.getElementById('input-nama-murid-baru');
    if (!input) return;
    const rawValue = input.value.trim();
    if (!rawValue) {
        alert('Sila masukkan nama murid!');
        return;
    }

    const namesToAdd = rawValue.split(/[\\n,]+/).map(n => n.trim().toUpperCase()).filter(n => n.length > 0);

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

replacement = """window.tambahMuridBaru = function () {
    const input = document.getElementById('input-nama-murid-baru');
    if (!input) return;
    const rawValue = input.value.trim();
    if (!rawValue) {
        alert('Sila masukkan nama murid!');
        return;
    }

    const activeKelas = window.getKelasAktif();
    const namesToAdd = rawValue.split(/[\\n,]+/).map(n => n.trim().toUpperCase()).filter(n => n.length > 0);

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
        alert('Semua nama murid tersebut sudah wujud dalam senarai!');
    } else if (duplicates.length > 0) {
        alert(addedCount + ' murid berjaya ditambah ke kelas "' + activeKelas + '".\\nTerdapat nama yang diabaikan kerana sudah wujud:\\n' + duplicates.join(', '));
    }
};"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('public/app-logic.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND")
