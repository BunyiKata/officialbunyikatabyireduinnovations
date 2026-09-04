const fs = require('fs');
const content = fs.readFileSync('public/app-logic.js', 'utf8');

const funcs = [
'flipFlashcard', 'tutupSidePanel', 'paparSkrin', 'bukaModalAksesGuru', 'keluarModGuru',
'tutupModalAksesGuru', 'tutupModal', 'bukaPeta', 'bukaSidePanel', 'masukModGuru',
'toggleTheme', 'logMasukMurid', 'bukaModalPilihPeta', 'tuntutGanjaranHarian',
'kembaliKePilihPeta', 'navigate', 'flipCardAndSync', 'prevFlashcard', 'nextFlashcard',
'sebutAudioHighlight', 'paparBantuan', 'pilihPadanan', 'semakPadanan', 'semakDragDrop',
'salahBelon', 'betulBelon', 'clearSlot', 'pilihSukuKata', 'sahkanEjaan', 'mainAudioKuiz',
'semakKuizAudio', 'buangSusunKata', 'pilihSusunKata', 'semakSusunKata', 'muatTurunSijil',
'muatTurunCSV', 'cetakLaporanPDF', 'tutupBantuan', 'bukaSenaraiHuruf', 'prevBelajarSukuKata',
'nextBelajarSukuKata', 'allowDrop', 'dropSyllable', 'mulaTarikGarisan', 'tamatTarikGarisan'
];

let missing = [];
for (let f of funcs) {
    if (!content.includes('function ' + f) && !content.includes('var ' + f) && !content.includes('const ' + f) && !content.includes('let ' + f)) {
        missing.push(f);
    }
}
console.log('Missing: ' + missing.join(', '));
