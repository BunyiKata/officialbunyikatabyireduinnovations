const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const newPdfCode = `
        function cetakLaporanPDF() {
            if (typeof window.jspdf === 'undefined') {
                window.print();
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape');
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('Laporan Prestasi Murid', 14, 20);
            
            const petaId = window.petaFilter || '1';
            const mapObj = (typeof MAP_CHALLENGES !== 'undefined' && MAP_CHALLENGES[petaId]) ? MAP_CHALLENGES[petaId] : MAP_CHALLENGES[1];
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Peta: ' + mapObj.title, 14, 28);
            
            const headers = [['Bil.', 'Nama Murid', 'Jumlah Markah', 'Lencana', ...mapObj.modules.map(m => m.title.replace(/^Cabaran\s+/i, ''))]];
            let idx = 1;
            const body = Object.entries(studentData).map(([nama, data]) => {
                const l = data.latihan || {};
                const s = data.scores || {};
                
                const moduleScores = mapObj.modules.map(mod => {
                    if (s[mod.id]) {
                        return \`\${s[mod.id]}\`;
                    } else if (l[mod.id] && l[mod.id].done) {
                        return 'Selesai';
                    }
                    return 'Belum';
                });
                
                return [\`\${idx++}\`, nama, \`\${data.totalScore || 0}\`, \`\${data.badges || 0}\`, ...moduleScores];
            });
            
            doc.autoTable({
                startY: 35,
                head: headers,
                body: body,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 8 }
            });
            
            doc.save('Laporan_Prestasi_Murid.pdf');
        }`;

code = code.replace(/function cetakLaporanPDF\(\) \{\s*window\.print\(\);\s*\}/g, newPdfCode);
fs.writeFileSync('public/app-logic.js', code);
console.log("Patched PDF logic");
