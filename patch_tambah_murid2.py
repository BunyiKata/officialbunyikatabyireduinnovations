with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = """window.tambahMuridBaru = function () {
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
};
"""

assert 'window.simpanNamaKelas = function () {' in lines[16464]
assert 'window.padamMurid = function (nama) {' in lines[16517]

lines[16464:16516] = [new_block]

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('SUCCESS')
