import { jsPDF } from 'jspdf';

export interface CertificateOptions {
  fontSize?: number;
  posY?: number;
  hurufBesar?: boolean;
  tebal?: boolean;
  tarikh?: string;
}

export const formatTarikhSijil = (d: Date = new Date()): string => {
  const bulan = [
    'JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN',
    'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'
  ];
  const day = d.getDate();
  const month = bulan[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export const generateCertificateCanvas = async (
  name: string,
  ic: string = '',
  includeIc: boolean = false,
  options: CertificateOptions = {}
): Promise<HTMLCanvasElement> => {
  const {
    fontSize = 38,
    posY = 47,
    hurufBesar = true,
    tebal = true,
    tarikh
  } = options;

  const canvas = document.createElement('canvas');
  // High-res A4 Portrait matching template
  canvas.width = 1414;
  canvas.height = 2000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  const w = canvas.width;
  const h = canvas.height;

  // Helper to safely load image
  const loadImage = (src: string): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  // Ensure Poppins font is loaded before rendering
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await Promise.all([
        document.fonts.load(`${tebal ? '700' : '500'} 48px "Poppins"`),
        document.fonts.load('600 28px "Poppins"'),
        document.fonts.load('700 38px "Poppins"'),
        document.fonts.load('500 38px "Poppins"')
      ]);
      await document.fonts.ready;
    } catch (e) {}
  }

  // Draw official template background
  const templateImg = (await loadImage('/images/sijil/sijil-template.png')) || (await loadImage('/images/sijil/sijil-template.jpg'));
  if (templateImg) {
    ctx.drawImage(templateImg, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#fbf7ee';
    ctx.fillRect(0, 0, w, h);
  }

  // 1. Recipient Name & optional IC (Font: Poppins, Warna: Hitam Gelap #000000)
  ctx.save();
  const finalName = hurufBesar ? name.toUpperCase() : name;
  const scaledFontSize = Math.round(fontSize * 1.35);
  ctx.font = `${tebal ? '700' : '500'} ${scaledFontSize}px "Poppins", Arial, sans-serif`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Name baseline sits right above the underline at y ~ 47.15% (or slider posY)
  const nameBaselineY = Math.round((posY / 100) * h) - 8;
  ctx.fillText(finalName, w / 2, nameBaselineY);

  if (includeIc && ic) {
    ctx.font = '600 24px "Poppins", Arial, sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`(No. K/P: ${ic})`, w / 2, nameBaselineY + 34);
  }
  ctx.restore();

  // 2. Generation Date ("Pada") (Font: Poppins, Warna: Hitam Gelap #000000)
  ctx.save();
  const dateStr = tarikh || formatTarikhSijil();
  ctx.font = '600 28px "Poppins", Arial, sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Date underline is at 64.75% of height (1295px on 2000px height)
  const dateBaselineY = Math.round(0.6475 * h) - 8;
  ctx.fillText(dateStr, w / 2, dateBaselineY);
  ctx.restore();

  return canvas;
};

// Download PNG
export const downloadCertificatePNG = async (
  name: string,
  ic: string = '',
  includeIc: boolean = false,
  options: CertificateOptions = {}
): Promise<void> => {
  const canvas = await generateCertificateCanvas(name, ic, includeIc, options);
  const clean = (options.hurufBesar !== false ? name.toUpperCase() : name).replace(/[^a-zA-Z0-9]/g, '_');
  const link = document.createElement('a');
  link.download = `Sijil_BunyiKata_${clean || 'Murid'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

// Download PDF
export const downloadCertificatePDF = async (
  name: string,
  ic: string = '',
  includeIc: boolean = false,
  options: CertificateOptions = {}
): Promise<void> => {
  const canvas = await generateCertificateCanvas(name, ic, includeIc, options);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfW = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfH = pdf.internal.pageSize.getHeight(); // 297mm

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
  const clean = (options.hurufBesar !== false ? name.toUpperCase() : name).replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`Sijil_BunyiKata_${clean || 'Murid'}.pdf`);
};

// Print Certificate directly
export const printCertificateA4 = async (
  name: string,
  ic: string = '',
  includeIc: boolean = false,
  options: CertificateOptions = {}
): Promise<void> => {
  const canvas = await generateCertificateCanvas(name, ic, includeIc, options);
  const dataUrl = canvas.toDataURL('image/png');

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Sijil Bunyi Kata</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #ffffff;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img id="certImg" src="${dataUrl}" />
        </body>
      </html>
    `);
    doc.close();

    const imgEl = doc.getElementById('certImg') as HTMLImageElement;
    const triggerPrint = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 300);
    };

    if (imgEl && !imgEl.complete) {
      imgEl.onload = triggerPrint;
    } else {
      triggerPrint();
    }
  }
};

// Buka Modal Sijil Pencapaian Rasmi untuk Mod Murid
export const bukaModalSijilMurid = async (namaOptional?: string): Promise<void> => {
  let studentName = (namaOptional && typeof namaOptional === 'string' && namaOptional.trim()) ? namaOptional.trim() : '';
  if (!studentName) {
    const raw = (window as any).namaMuridAktif;
    if (raw && typeof raw === 'string' && raw.trim() && raw !== 'Tetamu' && raw !== 'Admin') {
      studentName = raw.trim();
    } else {
      studentName = localStorage.getItem('muridAktif') || 
                    localStorage.getItem('bunyiKataCurrentMurid') || 
                    localStorage.getItem('bunyiKataNamaMurid') || 
                    (raw || 'MURID CEMERLANG');
    }
  }

  let certModal = document.getElementById('modal-sijil-pencapaian');
  if (!certModal) {
    certModal = document.createElement('div');
    certModal.id = 'modal-sijil-pencapaian';
    certModal.className = 'modal-overlay';
    certModal.style.cssText = 'display: flex; z-index: 3200; background: rgba(0,0,0,0.85); align-items: center; justify-content: center; padding: 12px;';
    document.body.appendChild(certModal);
  }

  // Show loading skeleton while rendering the high-res certificate image
  certModal.innerHTML = `
    <style>
      @keyframes sijilPreviewGlow {
        0%, 100% {
          box-shadow: 0 0 0 3px #f59e0b, 0 0 16px rgba(245, 158, 11, 0.65), 0 0 32px rgba(251, 191, 36, 0.4), 0 8px 20px rgba(0, 0, 0, 0.25);
          border-color: #0f172a;
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 0 5px #fde047, 0 0 28px rgba(245, 158, 11, 0.95), 0 0 52px rgba(251, 191, 36, 0.7), 0 10px 24px rgba(0, 0, 0, 0.3);
          border-color: #d97706;
          transform: scale(1.012);
        }
      }

      @keyframes certDashedOutlineGlow {
        0%, 100% {
          border-color: rgba(245, 158, 11, 0.45);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
        }
        50% {
          border-color: #f59e0b;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.35);
        }
      }

      @keyframes sijilModalCardGlow {
        0%, 100% {
          box-shadow: 0 10px 0 #0f172a, 0 0 0 2px rgba(245, 158, 11, 0.3), 0 0 14px rgba(245, 158, 11, 0.2);
        }
        50% {
          box-shadow: 0 10px 0 #0f172a, 0 0 0 4px #fbbf24, 0 0 28px rgba(245, 158, 11, 0.45);
        }
      }

      .sijil-modal-card {
        max-width: 520px !important;
        width: 92% !important;
        max-height: 94vh !important;
        overflow-y: auto !important;
        background-color: #ffffff !important;
        background-image: radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px) !important;
        background-size: 16px 16px !important;
        border: 4px solid #0f172a !important;
        border-radius: 24px !important;
        padding: 20px 18px 18px 18px !important;
        text-align: center !important;
        position: relative !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        box-shadow: 0 10px 0 #0f172a !important;
      }

      #modal-sijil-canvas-container {
        display: flex !important;
        grid-template-columns: none !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
        width: fit-content !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        background: #fffdf8 !important;
        border-radius: 16px !important;
        border: 2px dashed #f59e0b !important;
        padding: 8px !important;
        margin: 12px auto 16px auto !important;
      }

      .sijil-img-glow {
        animation: sijilPreviewGlow 2.4s infinite ease-in-out !important;
        will-change: box-shadow, border-color, transform;
        width: auto !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: 64vh !important;
        aspect-ratio: 1414 / 2000 !important;
        object-fit: contain !important;
        border-radius: 12px !important;
        border: 3.5px solid #0f172a !important;
        display: block !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
      }

      .sijil-container-glow {
        animation: certDashedOutlineGlow 2.4s infinite ease-in-out !important;
      }

      .sijil-modal-glow {
        animation: sijilModalCardGlow 2.4s infinite ease-in-out !important;
      }

      .sijil-btn-row {
        display: flex !important;
        grid-template-columns: none !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        width: 100% !important;
        max-width: 380px !important;
        box-sizing: border-box !important;
      }

      .sijil-btn-row > button {
        flex: 1 1 0 !important;
        width: 0 !important;
        min-width: 0 !important;
        height: 48px !important;
        padding: 0 8px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        font-size: 0.94rem !important;
        font-weight: 800 !important;
        border-radius: 14px !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
      }

      .sijil-btn-row > button:hover {
        transform: translateY(-2px) !important;
      }
      .sijil-btn-row > button:active {
        transform: translateY(1px) !important;
      }

      /* Mobile View: Kekal kemas & tepat seperti yang disahkan */
      @media (max-width: 480px) {
        #modal-sijil-pencapaian {
          padding: 8px !important;
        }
        .sijil-modal-card {
          max-width: 340px !important;
          width: 90% !important;
          padding: 12px 10px !important;
          border-radius: 18px !important;
          border-width: 3px !important;
        }
        #modal-sijil-canvas-container {
          padding: 6px !important;
          margin-top: 18px !important;
          margin-bottom: 12px !important;
          min-height: 260px !important;
        }
        .sijil-img-glow {
          width: 100% !important;
          max-width: 270px !important;
          max-height: 58vh !important;
          border-radius: 10px !important;
          border-width: 2.5px !important;
        }
        .sijil-btn-row {
          gap: 6px !important;
          max-width: 100% !important;
        }
        .sijil-btn-row > button {
          height: 42px !important;
          font-size: 0.82rem !important;
          padding: 0 2px !important;
          gap: 4px !important;
          border-radius: 12px !important;
        }
      }
    </style>
    <div class="modal-content neo-box sijil-modal-card sijil-modal-glow">
      <!-- Butang X merah petak -->
      <button class="neo-btn bg-red close-btn" onclick="document.getElementById('modal-sijil-pencapaian').style.display='none'" style="position: absolute; top: 12px; right: 12px; width: 38px; height: 38px; border-radius: 8px; border: 2.5px solid #0f172a; box-shadow: 0 3px 0 #0f172a; background-color: #ef4444; color: #ffffff; padding: 0; display: flex; align-items: center; justify-content: center; z-index: 10; cursor: pointer;" aria-label="Tutup"><i class="fa-solid fa-xmark" style="font-size: 1.15rem; color: #ffffff;"></i></button>

      <div id="modal-sijil-canvas-container" class="sijil-container-glow">
        <div style="font-weight: 800; color: #64748b; font-size: 0.9rem; padding: 30px 20px;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: #ea580c; display: block; margin-bottom: 10px;"></i>
          Menjana Sijil Rasmi...
        </div>
      </div>

      <div class="sijil-btn-row">
        <!-- Butang PDF merah (hanya teks PDF dan icon sahaja) -->
        <button id="btn-sijil-pdf" class="neo-btn" style="background-color: #ef4444; color: white; border: 2.5px solid #0f172a; box-shadow: 0 3px 0 #0f172a; cursor: pointer;">
          <i class="fa-solid fa-file-pdf"></i> PDF
        </button>
        <!-- Butang PNG (icon download dan teks PNG) -->
        <button id="btn-sijil-png" class="neo-btn" style="background-color: #ea580c; color: white; border: 2.5px solid #0f172a; box-shadow: 0 3px 0 #0f172a; cursor: pointer;">
          <i class="fa-solid fa-download"></i> PNG
        </button>
        <!-- Butang Cetak (cetak gambar sijil) -->
        <button id="btn-sijil-print" class="neo-btn bg-white" title="Cetak" aria-label="Cetak" style="border: 2.5px solid #0f172a; box-shadow: 0 3px 0 #0f172a; color: #0f172a; cursor: pointer;">
          <i class="fa-solid fa-print"></i> Cetak
        </button>
      </div>
    </div>
  `;
  certModal.style.display = 'flex';

  // Gelung "processing" untuk proses menjana sijil yang kelihatan (spinner).
  // Dihentikan dalam SEMUA laluan (berjaya/gagal) melalui `finally`.
  let processing: any = null;
  try {
    if (typeof window !== 'undefined' && (window as any).bkSfx && (window as any).bkSfx.startLoop) {
      processing = (window as any).bkSfx.startLoop('processing');
    }
    const canvas = await generateCertificateCanvas(studentName, '', false);
    const container = document.getElementById('modal-sijil-canvas-container');
    if (container) {
      const dataUrl = canvas.toDataURL('image/png');
      container.innerHTML = `
        <img src="${dataUrl}" alt="Sijil Bunyi Kata" class="sijil-img-glow" />
      `;
    }

    // Attach button actions
    const pdfBtn = document.getElementById('btn-sijil-pdf');
    if (pdfBtn) {
      pdfBtn.onclick = () => downloadCertificatePDF(studentName, '', false);
    }
    const pngBtn = document.getElementById('btn-sijil-png');
    if (pngBtn) {
      pngBtn.onclick = () => downloadCertificatePNG(studentName, '', false);
    }
    const printBtn = document.getElementById('btn-sijil-print');
    if (printBtn) {
      printBtn.onclick = () => printCertificateA4(studentName, '', false);
    }
    // Sijil berjaya dijana = keputusan lengkap.
    try {
      if ((window as any).bkSfx && (window as any).bkSfx.outcome) (window as any).bkSfx.outcome('success');
    } catch { /* abaikan */ }
  } catch (err) {
    console.error('Error rendering student certificate modal:', err);
    try {
      if (typeof window !== 'undefined' && (window as any).bkSfx && (window as any).bkSfx.outcome) {
        (window as any).bkSfx.outcome('error');
      }
    } catch { /* abaikan */ }
  } finally {
    // Pastikan gelung berhenti & pemegang dibuang pada SETIAP laluan.
    try {
      if (typeof window !== 'undefined' && (window as any).bkSfx && (window as any).bkSfx.stopLoop) {
        (window as any).bkSfx.stopLoop('processing');
      }
      processing?.stop?.();
    } catch { /* abaikan */ }
    processing = null;
  }
};

// Bind to window so global scripts can call them seamlessly
if (typeof window !== 'undefined') {
  (window as any).generateCertificateCanvas = generateCertificateCanvas;
  (window as any).downloadCertificatePNG = downloadCertificatePNG;
  (window as any).downloadCertificatePDF = downloadCertificatePDF;
  (window as any).printCertificateA4 = printCertificateA4;
  (window as any).bukaModalSijilMurid = bukaModalSijilMurid;
  (window as any).muatTurunSijil = bukaModalSijilMurid;
  (window as any).janaMuatTurunSijilPDF = (name?: string) => downloadCertificatePDF(name || (window as any).namaMuridAktif || 'MURID CEMERLANG');
}
