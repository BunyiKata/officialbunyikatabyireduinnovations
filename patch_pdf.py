import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_func_regex = r'function cetakLaporanPDF\(\) \{.*?\n\s+var selectedAvatarIcon'

new_func = r"""function cetakLaporanPDF() {
            if (typeof window.jspdf === 'undefined') {
                window.print();
                return;
            }
            
            let namaSekolah = localStorage.getItem('pdf_sekolah') || '';
            let namaKelas = localStorage.getItem('bunyiKataNamaKelas') || localStorage.getItem('pdf_kelas') || '1 Cemerlang';
            let namaGuru = localStorage.getItem('pdf_guru') || '';

            if (!namaSekolah || !namaGuru) {
                namaSekolah = prompt('Nama Sekolah (Kop Laporan):', namaSekolah) || namaSekolah;
                namaKelas = prompt('Nama Kelas:', namaKelas) || namaKelas;
                namaGuru = prompt('Nama Guru:', namaGuru) || namaGuru;
            } else {
                if (!confirm(`Maklumat Laporan:\nSekolah: ${namaSekolah}\nKelas: ${namaKelas}\nGuru: ${namaGuru}\n\nTekan OK untuk teruskan eksport, atau Cancel untuk kemaskini maklumat.`)) {
                    namaSekolah = prompt('Nama Sekolah (Kop Laporan):', namaSekolah) || namaSekolah;
                    namaKelas = prompt('Nama Kelas:', namaKelas) || namaKelas;
                    namaGuru = prompt('Nama Guru:', namaGuru) || namaGuru;
                }
            }
            if (namaSekolah) localStorage.setItem('pdf_sekolah', namaSekolah);
            if (namaKelas) localStorage.setItem('pdf_kelas', namaKelas);
            if (namaGuru) localStorage.setItem('pdf_guru', namaGuru);

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape');
            
            const petaId = window.petaFilter || '1';
            const mapObj = (typeof MAP_CHALLENGES !== 'undefined' && MAP_CHALLENGES[petaId]) ? MAP_CHALLENGES[petaId] : MAP_CHALLENGES[1];
            
            const generatePdf = (imgData) => {
                if (imgData) {
                    doc.addImage(imgData, 'PNG', 14, 10, 24, 24);
                } else {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(22);
                    doc.setTextColor(217, 119, 6);
                    doc.text('BUNYI KATA', 14, 25);
                }
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text((namaSekolah || 'NAMA SEKOLAH').toUpperCase(), 45, 18);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text('Kelas: ' + (namaKelas || '-'), 45, 24);
                doc.text('Guru: ' + (namaGuru || '-'), 45, 30);
                doc.text('Peta: ' + mapObj.title, 45, 36);
                
                const today = new Date();
                const dateStr = today.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
                const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                doc.setFontSize(9);
                doc.text('Tarikh Cetakan: ' + dateStr, pageWidth - 14, 18, { align: 'right' });
                
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.5);
                doc.line(14, 42, pageWidth - 14, 42);
                
                const headers = [['Bil.', 'Nama Murid', 'Markah', 'Lencana', ...mapObj.modules.map(m => m.title.replace(/^Cabaran\s+/i, ''))]];
                let idx = 1;
                const body = Object.entries(studentData).map(([nama, data]) => {
                    const l = data.latihan || {};
                    const s = data.scores || {};
                    const moduleScores = mapObj.modules.map(mod => {
                        const score = typeof jumlahMarkah === 'function' ? s[mod.id] : 0;
                        if (score && score > 0) return `${score}/10`;
                        else if (l[mod.id]) return 'Selesai';
                        else if (Number(localStorage.getItem('stars_' + mod.id) || 0) > 0) return (Number(localStorage.getItem('stars_' + mod.id) || 0) * 10) + '/10';
                        return 'Belum';
                    });
                    const ttlScore = typeof jumlahMarkah === 'function' ? jumlahMarkah(data) : (data.totalScore || 0);
                    return [`${idx++}`, nama.toUpperCase(), `${ttlScore}`, `${(data.badges || []).length}`, ...moduleScores];
                });
                
                doc.autoTable({
                    startY: 48,
                    head: headers,
                    body: body,
                    theme: 'grid',
                    headStyles: { 
                        fillColor: [30, 41, 59],
                        textColor: 255,
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    alternateRowStyles: {
                        fillColor: [248, 250, 252]
                    },
                    styles: { 
                        font: 'helvetica',
                        fontSize: 9,
                        cellPadding: 4,
                        lineColor: [203, 213, 225],
                        lineWidth: 0.1
                    },
                    columnStyles: {
                        0: { halign: 'center', cellWidth: 15 },
                        1: { halign: 'left', cellWidth: 50 },
                        2: { halign: 'center', cellWidth: 20 },
                        3: { halign: 'center', cellWidth: 20 }
                    },
                    rowPageBreak: 'avoid',
                    didDrawPage: function (data) {
                        const str = 'Muka Surat ' + doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(100, 100, 100);
                        doc.text(str, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
                        doc.text('Dijana oleh Mod Guru - Aplikasi Bunyi Kata', 14, doc.internal.pageSize.height - 10);
                    }
                });
                
                doc.save('Laporan_Prestasi_Murid_' + (namaKelas.replace(/\s+/g, '_')) + '.pdf');
            };
            
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = 'https://i.postimg.cc/63DYpLtR/Copy-of-BUNYI-KATA-APPS-(1).png';
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                generatePdf(dataURL);
            };
            img.onerror = function() {
                generatePdf(null);
            };
        }
        
        var selectedAvatarIcon"""

# Because it's a raw string, \n inside the f-string will be literal \n, which jsPDF/alert will show as \n instead of a newline. 
# We need to replace literal \n with actual newline or backslash-escaped newline in the js string.
# A safe way is to just use a function instead of sub.

new_content = content[:re.search(old_func_regex, content, flags=re.DOTALL).start()] + new_func + content[re.search(old_func_regex, content, flags=re.DOTALL).end():]
if new_content == content:
    print("Replace failed!")
else:
    with open('public/app-logic.js', 'w') as f:
        f.write(new_content)
    print("Replace success!")

