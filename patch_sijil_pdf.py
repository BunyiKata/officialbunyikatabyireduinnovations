with open("public/app-logic.js", "r") as f:
    content = f.read()

sijil_code = """function janaMuatTurunSijilPDF(namaOptional) {
    const studentName = namaOptional || ((typeof namaMuridAktif !== 'undefined' && namaMuridAktif) ? namaMuridAktif : (localStorage.getItem('bunyiKataNamaMurid') || 'Murid Cemerlang'));
    const currentDate = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

    let jsPDFObj = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (typeof jsPDF !== 'undefined' ? jsPDF : null);

    if (!jsPDFObj) {
        alert("Modul jsPDF sedang dimuatkan. Sila guna fungsi cetak sementara.");
        window.print();
        return;
    }

    try {
        const doc = new jsPDFObj({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth(); // 297
        const pageHeight = doc.internal.pageSize.getHeight(); // 210

        // Background color
        doc.setFillColor(254, 249, 236); // #fef9ec
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Outer Border
        doc.setDrawColor(22, 143, 129); // #168f81
        doc.setLineWidth(3);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

        // Inner Gold Border
        doc.setDrawColor(212, 175, 55); // #d4af37
        doc.setLineWidth(1.5);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

        // Corner Ornaments
        const corners = [[12, 12], [pageWidth - 12, 12], [12, pageHeight - 12], [pageWidth - 12, pageHeight - 12]];
        corners.forEach(([cx, cy]) => {
            doc.setFillColor(212, 175, 55);
            doc.circle(cx, cy, 3, 'F');
        });

        // Header Banner
        doc.setFillColor(22, 143, 129);
        doc.roundedRect(pageWidth / 2 - 50, 20, 100, 14, 4, 4, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('APLIKASI BUNYI KATA', pageWidth / 2, 29, { align: 'center' });

        // Certificate Title Badge
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(180, 83, 9);
        doc.text('SIJIL PENCAPAIAN RASMI', pageWidth / 2, 45, { align: 'center' });

        // Main Honor Title
        doc.setFontSize(26);
        doc.setTextColor(15, 23, 42);
        doc.text('KAPTEN HARTA KARUN', pageWidth / 2, 59, { align: 'center' });

        // Decorative line
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 65, 64, pageWidth / 2 + 65, 64);

        // Subtext
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105);
        doc.text('Dengan ini disahkan bahawa', pageWidth / 2, 75, { align: 'center' });

        // Student Name Box
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(pageWidth / 2 - 90, 82, 180, 22, 5, 5, 'F');
        doc.setDrawColor(2, 132, 199);
        doc.setLineWidth(1.2);
        doc.roundedRect(pageWidth / 2 - 90, 82, 180, 22, 5, 5, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(2, 132, 199);
        doc.text(String(studentName).toUpperCase(), pageWidth / 2, 96, { align: 'center' });

        // Description text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        const descText = 'Telah berjaya menyelesaikan kesemua 4 Peta Cabaran Pembelajaran Bunyi Kata (Kenal Huruf, Suku Kata Asas, Suku Kata Hero & Bacaan Bergred) serta memperolehi Lencana Kehormat Kapten Harta Karun!';
        const splitDesc = doc.splitTextToSize(descText, 210);
        doc.text(splitDesc, pageWidth / 2, 116, { align: 'center', lineHeightFactor: 1.4 });

        // Gold Medal Seal
        doc.setFillColor(212, 175, 55);
        doc.circle(pageWidth / 2, 142, 13, 'F');
        doc.setFillColor(255, 255, 255);
        doc.circle(pageWidth / 2, 142, 11, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(180, 83, 9);
        doc.text('LENCANA', pageWidth / 2, 140, { align: 'center' });
        doc.setFontSize(9);
        doc.text('UTAMA', pageWidth / 2, 145, { align: 'center' });

        // Date & Issuer Info
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`Tarikh: ${currentDate}`, 35, 172);

        doc.text('Dikeluarkan oleh: IR EduInnovation', pageWidth - 35, 172, { align: 'right' });

        // Signature lines
        doc.setDrawColor(148, 163, 184);
        doc.setLineWidth(0.5);
        doc.line(35, 167, 95, 167);
        doc.line(pageWidth - 95, 167, pageWidth - 35, 167);

        // Footer copyright
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text('MyIPO Hak Cipta Terpelihara CRDV2025M00849 ©2026', pageWidth / 2, 186, { align: 'center' });

        const cleanName = String(studentName).replace(/[^a-zA-Z0-9]/g, '_');
        doc.save(`Sijil_Pencapaian_BunyiKata_${cleanName}.pdf`);
    } catch(err) {
        console.error("Gagal menjana PDF:", err);
        alert("Gagal menjana PDF Sijil. Membuka mod cetakan...");
        window.print();
    }
}
window.janaMuatTurunSijilPDF = janaMuatTurunSijilPDF;

function muatTurunSijil() {
    const sijilBtn = document.getElementById('sijil-btn');
    if (sijilBtn && sijilBtn.disabled) {
        alert("Sijil Pencapaian masih terkunci! Selesaikan semua 4 Peta Cabaran untuk membuka Sijil Pencapaian Kapten Harta Karun.");
        return;
    }

    const studentName = (typeof namaMuridAktif !== 'undefined' && namaMuridAktif) ? namaMuridAktif : 'Murid Cemerlang';
    const currentDate = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });

    let certModal = document.getElementById('modal-sijil-pencapaian');
    if (!certModal) {
        certModal = document.createElement('div');
        certModal.id = 'modal-sijil-pencapaian';
        certModal.className = 'modal-overlay';
        certModal.style.cssText = 'display: flex; z-index: 3200; background: rgba(0,0,0,0.85); align-items: center; justify-content: center; padding: 15px;';
        document.body.appendChild(certModal);
    }

    certModal.innerHTML = `
    <div class="modal-content neo-box" style="max-width: 680px; width: 100%; background: #ffffff; border: 6px solid #d4af37; border-radius: 24px; padding: 26px 20px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3); background-image: radial-gradient(circle, rgba(212, 175, 55, 0.12) 1.5px, transparent 1.5px); background-size: 16px 16px;">
        <button class="neo-btn bg-red close-btn" onclick="document.getElementById('modal-sijil-pencapaian').style.display='none'" style="position: absolute; top: 12px; right: 12px; width: 38px; height: 38px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10;" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>

        <div style="border: 2px dashed #d4af37; padding: 22px 16px; border-radius: 16px; background: rgba(255,255,255,0.96);">
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 8px;">
                <img src="https://i.postimg.cc/cHTb186H/Copy-of-BUNYI-KATA-APPS-(2).png" alt="Bunyi Kata" style="max-height: 55px; width: auto;" />
            </div>

            <div class="century-gothic-font" style="font-size: 0.85rem; letter-spacing: 2px; color: #b45309; text-transform: uppercase; font-weight: 800; margin-bottom: 4px;">
                SIJIL PENCAPAIAN RASMI
            </div>

            <h1 class="century-gothic-font" style="font-size: clamp(1.5rem, 4vw, 2.1rem); font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; border-bottom: 3px solid #d4af37; display: inline-block; padding-bottom: 4px;">
                KAPTEN HARTA KARUN
            </h1>

            <p style="font-size: 0.95rem; color: #475569; margin-bottom: 6px;">
                Dengan ini disahkan bahawa
            </p>

            <div class="century-gothic-font" style="font-size: clamp(1.4rem, 4.5vw, 2rem); font-weight: 900; color: #0284c7; margin: 8px 0 14px; text-transform: uppercase; letter-spacing: 1px;">
                ${studentName}
            </div>

            <p style="font-size: 0.92rem; color: #334155; max-width: 500px; margin: 0 auto 18px; line-height: 1.55;">
                Telah berjaya menyelesaikan kesemua 4 Peta Cabaran Pembelajaran Bunyi Kata (Kenal Huruf, Suku Kata Asas, Suku Kata Hero & Bacaan Bergred) serta memperolehi Lencana Kehormat Kapten Harta Karun!
            </p>

            <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap;">
                <div style="width: 65px; height: 65px; border-radius: 50%; border: 3px solid #d4af37; overflow: hidden; background: #fff; padding: 2px;">
                    <img src="https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div style="text-align: left;">
                    <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">Aplikasi Bunyi Kata</div>
                    <div style="font-size: 0.8rem; color: #64748b;">Tarikh: ${currentDate}</div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button class="neo-btn bg-green" onclick="window.janaMuatTurunSijilPDF('${studentName.replace(/'/g, "\\'")}')" style="font-size: 0.95rem; padding: 10px 18px; display: inline-flex; align-items: center; gap: 6px;">
                    <i class="fa-solid fa-file-pdf"></i> Muat Turun Sijil (PDF)
                </button>
                <button class="neo-btn bg-orange" onclick="window.print()" style="font-size: 0.95rem; padding: 10px 18px; display: inline-flex; align-items: center; gap: 6px; color: white;">
                    <i class="fa-solid fa-print"></i> Cetak
                </button>
                <button class="neo-btn bg-blue" onclick="document.getElementById('modal-sijil-pencapaian').style.display='none'" style="font-size: 0.95rem; padding: 10px 18px;">
                    Tutup
                </button>
            </div>
        </div>
    </div>
    `;
    certModal.style.display = 'flex';
}
"""

# Replace function muatTurunSijil
start_marker = "function muatTurunSijil() {"
end_marker = "window.muatTurunSijil = muatTurunSijil;"

if start_marker in content and end_marker in content:
    idx1 = content.find(start_marker)
    idx2 = content.find(end_marker) + len(end_marker)
    content = content[:idx1] + sijil_code + "\nwindow.muatTurunSijil = muatTurunSijil;\nwindow.janaMuatTurunSijilPDF = janaMuatTurunSijilPDF;\n" + content[idx2:]
    with open("public/app-logic.js", "w") as f:
        f.write(content)
    print("Successfully patched muatTurunSijil and added janaMuatTurunSijilPDF")
else:
    print("Markers not found!")
