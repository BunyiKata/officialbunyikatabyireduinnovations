import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { generateCertificateCanvas, formatTarikhSijil } from '../utils/sijilGenerator';

interface StudentItem {
  id: string;
  name: string;
  ic: string;
}

const DEFAULT_STUDENTS: StudentItem[] = [
  { id: '1', name: 'MUHAMMAD ABU BIN ATAN', ic: '170512-10-5432' },
  { id: '2', name: 'NUR SYAFIQAH BINTI ZULKIFLI', ic: '170823-14-6120' },
  { id: '3', name: 'DANISH HAZIQ BIN KHAIRUDDIN', ic: '170314-10-7789' },
  { id: '4', name: 'AISYAH HUMAIRA BINTI ABDUL', ic: '171109-08-5544' },
  { id: '5', name: 'CHONG WEI JIAN', ic: '170205-14-8833' },
  { id: '6', name: 'DIVYASHINI A/P RAMANATHAN', ic: '170617-10-9922' },
  { id: '7', name: 'MUHAMMAD FARHAN BIN ROSLI', ic: '170928-10-3344' },
  { id: '8', name: 'SARAH ADRIANA BINTI KAMAL', ic: '170411-14-1188' },
  { id: '9', name: 'ADAM RAYYAN BIN MOKHTAR', ic: '171201-01-4455' },
  { id: '10', name: 'NUR AMANI BINTI FAIZAL', ic: '170719-10-2211' }
];

export interface AdminSijilManagerProps {
  isGuruMode?: boolean;
  initialClass?: string;
  onClose?: () => void;
}

const loadStudentsForClass = (clsName: string): StudentItem[] => {
  try {
    let rawData: Record<string, any> = {};
    if (typeof window !== 'undefined' && (window as any).studentData) {
      rawData = (window as any).studentData;
    } else {
      const stored = localStorage.getItem('bunyiKataStudentData');
      if (stored) rawData = JSON.parse(stored);
    }
    
    const items: StudentItem[] = [];
    let idx = 1;
    for (const [name, data] of Object.entries(rawData)) {
      if (!name || name.toLowerCase() === 'murid') continue;
      const sKelas = ((data as any)?.kelas || '').trim();
      if (sKelas.toLowerCase() === clsName.trim().toLowerCase()) {
        items.push({
          id: String(idx++),
          name: name.toUpperCase(),
          ic: (data as any)?.ic || (data as any)?.noKP || ''
        });
      }
    }
    if (items.length > 0) return items;

    // Fallback: check studentNames from window or localStorage
    const sNames: string[] = (typeof window !== 'undefined' && (window as any).studentNames) 
      || JSON.parse(localStorage.getItem('bunyiKataStudentNames') || '[]');
    if (Array.isArray(sNames) && sNames.length > 0) {
      sNames.forEach((n, i) => {
        const k = i < 6 ? '1 Cemerlang' : '1 Pintar';
        if (k.toLowerCase() === clsName.trim().toLowerCase()) {
          items.push({
            id: String(idx++),
            name: n.toUpperCase(),
            ic: ''
          });
        }
      });
      if (items.length > 0) return items;
    }
  } catch (e) {
    console.warn('loadStudentsForClass error:', e);
  }
  return DEFAULT_STUDENTS;
};

const playClick = () => {
  try {
    if (typeof window !== 'undefined') {
      if ((window as any).playBubble) {
        (window as any).playBubble();
        return;
      }
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = (window as any).globalAudioCtx || new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    }
  } catch (e) {}
};

export const AdminSijilManager: React.FC<AdminSijilManagerProps> = ({
  isGuruMode = false,
  initialClass = '',
  onClose
}) => {
  // Tabs: 'individu' | 'pukal'
  const [activeTab, setActiveTab] = useState<'individu' | 'pukal'>('individu');

  const classList: string[] = typeof window !== 'undefined' && (window as any).getDaftarKelas 
    ? (window as any).getDaftarKelas() 
    : [];

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (initialClass) return initialClass;
    if (typeof window !== 'undefined' && (window as any).getKelasAktif) {
      return (window as any).getKelasAktif();
    }
    return localStorage.getItem('bunyiKataNamaKelas') || '';
  });

  // Bulk Students
  const [students, setStudents] = useState<StudentItem[]>(() => {
    if (isGuruMode) {
      return loadStudentsForClass(initialClass || localStorage.getItem('bunyiKataNamaKelas') || '');
    }
    return DEFAULT_STUDENTS;
  });

  // Certificate Parameters (Individu)
  const [namaPenerima, setNamaPenerima] = useState<string>(() => {
    if (isGuruMode && students.length > 0) return students[0].name;
    return 'MUHAMMAD ABU BIN ATAN';
  });
  const [tambahKP, setTambahKP] = useState<boolean>(false);
  const [noKP, setNoKP] = useState<string>(() => {
    if (isGuruMode && students.length > 0) return students[0].ic || '';
    return '170512-10-5432';
  });
  const [tarikhSijil, setTarikhSijil] = useState<string>(() => formatTarikhSijil());
  const [hurufBesar, setHurufBesar] = useState<boolean>(true);
  const [tebal, setTebal] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(38);
  const [posY, setPosY] = useState<number>(47);

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => students[0]?.id || '1');
  const [tampalTeks, setTampalTeks] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');

  // Update students when class changes in Guru Mode
  useEffect(() => {
    if (isGuruMode) {
      const clsStudents = loadStudentsForClass(selectedClass);
      setStudents(clsStudents);
      if (clsStudents.length > 0) {
        setSelectedStudentId(clsStudents[0].id);
        setNamaPenerima(clsStudents[0].name);
        setNoKP(clsStudents[0].ic || '');
      }
    }
  }, [isGuruMode, selectedClass]);

  const certRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When switching or selecting student in bulk mode, update name & IC
  const handleSelectStudent = (s: StudentItem) => {
    playClick();
    setSelectedStudentId(s.id);
    setNamaPenerima(s.name);
    if (s.ic) {
      setNoKP(s.ic);
    }
  };

  // Reset to default
  const handleReset = () => {
    playClick();
    setNamaPenerima('MUHAMMAD ABU BIN ATAN');
    setTambahKP(false);
    setNoKP('170512-10-5432');
    setTarikhSijil(formatTarikhSijil());
    setHurufBesar(true);
    setTebal(true);
    setFontSize(38);
    setPosY(47);
    setZoomLevel(100);
    setStudents(DEFAULT_STUDENTS);
    setSelectedStudentId('1');
  };

  // Import bulk names from textarea
  const handleImportText = () => {
    playClick();
    if (!tampalTeks.trim()) return;
    const lines = tampalTeks
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (lines.length === 0) return;

    const newItems: StudentItem[] = lines.map((name, idx) => ({
      id: Date.now().toString() + '_' + idx,
      name: name.toUpperCase(),
      ic: ''
    }));

    setStudents(prev => [...prev, ...newItems]);
    setTampalTeks('');
    if (newItems.length > 0) {
      handleSelectStudent(newItems[0]);
    }
  };

  // File import for CSV/TXT
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    playClick();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
      const parsed: StudentItem[] = [];

      lines.forEach((line, idx) => {
        // Check if csv contains comma separating Name, IC
        const parts = line.split(',');
        const rawName = parts[0]?.replace(/["']/g, '').trim();
        const rawIc = parts[1]?.replace(/["']/g, '').trim() || '';

        // Skip potential header row
        if (rawName && !rawName.toLowerCase().includes('nama') && !rawName.toLowerCase().includes('name')) {
          parsed.push({
            id: Date.now().toString() + '_' + idx,
            name: rawName.toUpperCase(),
            ic: rawIc
          });
        }
      });

      if (parsed.length > 0) {
        setStudents(prev => [...prev, ...parsed]);
        handleSelectStudent(parsed[0]);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Add single empty row
  const handleAddStudentRow = () => {
    playClick();
    const newItem: StudentItem = {
      id: Date.now().toString(),
      name: 'NAMA MURID BAHARU',
      ic: ''
    };
    setStudents(prev => [newItem, ...prev]);
    handleSelectStudent(newItem);
  };

  // Delete student row
  const handleDeleteStudent = (id: string, e: React.MouseEvent) => {
    playClick();
    e.stopPropagation();
    setStudents(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (selectedStudentId === id && filtered.length > 0) {
        handleSelectStudent(filtered[0]);
      }
      return filtered;
    });
  };

  // Update student in list
  const handleUpdateStudentField = (id: string, field: 'name' | 'ic', val: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: val };
        if (selectedStudentId === id) {
          if (field === 'name') setNamaPenerima(val);
          if (field === 'ic') setNoKP(val);
        }
        return updated;
      }
      return s;
    }));
  };

  // Get active display name
  const displayName = hurufBesar ? namaPenerima.toUpperCase() : namaPenerima;

  // Download Single PNG
  const handleDownloadPNG = async () => {
    playClick();
    setIsExporting(true);
    setExportProgress('Menjana PNG Sijil...');
    try {
      const canvas = await generateCertificateCanvas(namaPenerima, noKP, tambahKP, {
        fontSize,
        posY,
        hurufBesar,
        tebal,
        tarikh: tarikhSijil
      });
      const link = document.createElement('a');
      const clean = (hurufBesar ? namaPenerima.toUpperCase() : namaPenerima).replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `Sijil_BunyiKata_${clean || 'Murid'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
      alert('Ralat semasa menjana PNG sijil');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Download Single PDF using jsPDF (A4 Portrait Menegak)
  const handleDownloadPDF = async () => {
    playClick();
    setIsExporting(true);
    setExportProgress('Menjana PDF Sijil...');
    try {
      const canvas = await generateCertificateCanvas(namaPenerima, noKP, tambahKP, {
        fontSize,
        posY,
        hurufBesar,
        tebal,
        tarikh: tarikhSijil
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfW = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfH = pdf.internal.pageSize.getHeight(); // 297mm

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      const clean = (hurufBesar ? namaPenerima.toUpperCase() : namaPenerima).replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`Sijil_BunyiKata_${clean || 'Murid'}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Ralat semasa menjana PDF sijil');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Download Bulk PNGs
  const handleBulkDownloadPNG = async () => {
    playClick();
    if (students.length === 0) {
      alert('Tiada murid dalam senarai.');
      return;
    }
    setIsExporting(true);
    try {
      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        setExportProgress(`Menjana PNG (${i + 1}/${students.length}): ${s.name}...`);
        const canvas = await generateCertificateCanvas(s.name, s.ic || noKP, Boolean(s.ic), {
          fontSize,
          posY,
          hurufBesar,
          tebal,
          tarikh: tarikhSijil
        });
        const link = document.createElement('a');
        const clean = s.name.replace(/[^a-zA-Z0-9]/g, '_');
        link.download = `Sijil_${i + 1}_${clean}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        // Short pause to avoid browser choking on downloads
        await new Promise(res => setTimeout(res, 400));
      }
    } catch (e) {
      console.error(e);
      alert('Ralat semasa menjana PNG pukal');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Download Bulk Multi-Page PDF
  const handleBulkDownloadPDF = async () => {
    playClick();
    if (students.length === 0) {
      alert('Tiada murid dalam senarai.');
      return;
    }
    setIsExporting(true);
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfW = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfH = pdf.internal.pageSize.getHeight(); // 297mm

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        setExportProgress(`Memproses PDF (${i + 1}/${students.length}): ${s.name}...`);
        const canvas = await generateCertificateCanvas(s.name, s.ic || noKP, Boolean(s.ic), {
          fontSize,
          posY,
          hurufBesar,
          tebal,
          tarikh: tarikhSijil
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      }

      setExportProgress('Menyimpan fail PDF Pukal...');
      pdf.save(`Sijil_Pukal_BunyiKata_${students.length}_Murid.pdf`);
    } catch (e) {
      console.error(e);
      alert('Ralat semasa menjana PDF pukal');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  // Print Certificate directly (Only the certificate itself)
  const handlePrint = async () => {
    playClick();
    setIsExporting(true);
    setExportProgress('Menyediakan cetakan sijil...');
    try {
      const canvas = await generateCertificateCanvas(namaPenerima, noKP, tambahKP, {
        fontSize,
        posY,
        hurufBesar,
        tebal,
        tarikh: tarikhSijil
      });
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
    } catch (e) {
      console.error(e);
      alert('Ralat semasa mencetak sijil');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '6px 4px 30px', boxSizing: 'border-box' }}>
      {/* Top Header Card / Banner */}
      <div
        className="neo-box sijil-header-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: onClose ? '12px 42px 12px 18px' : '12px 18px',
          border: '3px solid #0f172a',
          boxShadow: '0 4px 0 #0f172a',
          marginBottom: '16px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          textAlign: 'center',
          maxWidth: isGuruMode ? '520px' : '440px',
          width: '100%',
          margin: '0 auto 16px',
          boxSizing: 'border-box'
        }}
      >
        {/* Close Button if modal (Pinned Top-Right) */}
        {onClose && (
          <button
            type="button"
            className="neo-btn bg-red"
            onClick={() => {
              playClick();
              onClose();
            }}
            aria-label="Tutup"
            style={{
              position: 'absolute',
              top: '10px',
              right: '12px',
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '2px solid #0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 5
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        {/* Center: Logo & Title */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', maxWidth: '100%' }}>
          <img
            src="/images/sampingan/logo-main-screen.png"
            alt="Bunyi Kata"
            style={{ height: '30px', objectFit: 'contain', flexShrink: 0 }}
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(1.05rem, 3.2vw, 1.35rem)',
              fontWeight: '900',
              color: '#0f172a',
              fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
            }}
          >
            Sijil Pencapaian
          </h1>
        </div>

        {/* Center: Kelas (if Guru) & Tabs (Sijil Individu & Jana Pukal) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
          {isGuruMode && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#64748b' }}>Kelas:</span>
              <select
                value={selectedClass}
                onChange={(e) => {
                  playClick();
                  setSelectedClass(e.target.value);
                }}
                className="neo-btn"
                style={{
                  padding: '5px 10px',
                  borderRadius: '10px',
                  border: '2px solid #0f172a',
                  fontWeight: 'bold',
                  fontSize: '0.82rem',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  cursor: 'pointer',
                  height: '34px'
                }}
              >
                {classList.map((k: string) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <button
              type="button"
              className="neo-btn"
              onClick={() => {
                playClick();
                setActiveTab('individu');
              }}
              style={{
                backgroundColor: activeTab === 'individu' ? '#ea580c' : '#ffffff',
                color: activeTab === 'individu' ? '#ffffff' : '#0f172a',
                border: '2.5px solid #0f172a',
                boxShadow: '0 3px 0 #0f172a',
                padding: '7px 16px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-file-invoice"></i> Sijil Individu
            </button>

            <button
              type="button"
              className="neo-btn"
              onClick={() => {
                playClick();
                setActiveTab('pukal');
              }}
              style={{
                backgroundColor: activeTab === 'pukal' ? '#ea580c' : '#ffffff',
                color: activeTab === 'pukal' ? '#ffffff' : '#0f172a',
                border: '2.5px solid #0f172a',
                boxShadow: '0 3px 0 #0f172a',
                padding: '7px 16px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-users"></i> Jana Pukal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '18px',
          alignItems: 'start'
        }}
      >
        {/* LEFT COLUMN: Controls / Bulk Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'individu' ? (
            <>
              {/* Card 1: Nama Penerima Sijil */}
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: '900', color: '#ea580c', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    <i className="fa-solid fa-user-tag" style={{ marginRight: '6px' }}></i> NAMA PENERIMA SIJIL
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backgroundColor: '#f1f5f9',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      color: '#475569'
                    }}
                  >
                    Sijil Bunyi Kata
                  </span>
                </div>

                <input
                  type="text"
                  value={namaPenerima}
                  onChange={(e) => setNamaPenerima(e.target.value)}
                  placeholder="Masukkan nama penerima..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '2.5px solid #0f172a',
                    fontWeight: '800',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    color: '#0f172a'
                  }}
                />

                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>
                    <input
                      type="checkbox"
                      checked={tambahKP}
                      onChange={(e) => {
                        playClick();
                        setTambahKP(e.target.checked);
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ea580c' }}
                    />
                    Tambah No. K/P Di Bawah Nama
                  </label>

                  {tambahKP && (
                    <input
                      type="text"
                      value={noKP}
                      onChange={(e) => setNoKP(e.target.value)}
                      placeholder="Contoh: 170512-10-5432"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '2px solid #0f172a',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  )}

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                      <i className="fa-solid fa-calendar-day" style={{ marginRight: '6px', color: '#ea580c' }}></i> Tarikh Sijil
                    </label>
                    <input
                      type="text"
                      value={tarikhSijil}
                      onChange={(e) => setTarikhSijil(e.target.value)}
                      placeholder="Contoh: 6 SEPTEMBER 2026"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '2px solid #0f172a',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Gaya Teks */}
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '16px'
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: '900', color: '#ea580c', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    <i className="fa-solid fa-font" style={{ marginRight: '6px' }}></i> GAYA TEKS
                  </span>
                </div>

                {/* Font Size Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Saiz Fon Nama</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#ea580c' }}>{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="22"
                    max="60"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Card 3: Kedudukan Menegak (Paksi Y) */}
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '18px'
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: '900', color: '#ea580c', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    <i className="fa-solid fa-arrows-up-down" style={{ marginRight: '6px' }}></i> KEDUDUKAN MENEGAK (PAKSI Y)
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Ketinggian Posisi Teks</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#ea580c' }}>{posY}%</span>
                  </div>
                  <input
                    type="range"
                    min="38"
                    max="56"
                    step="0.5"
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', fontWeight: '700' }}>
                    <span>Atas (38%)</span>
                    <span>Tepat Atas Garisan (47%)</span>
                    <span>Bawah (56%)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* JANA PUKAL TAB */
            <>
              <div
                className="neo-box"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '18px'
                }}
              >
                {/* Header Senarai Murid */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div
                    style={{
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      padding: '7px 18px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '900',
                      border: '2px solid #0f172a',
                      boxShadow: '0 2px 0 #0f172a',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    <i className="fa-solid fa-users"></i> SENARAI MURID
                  </div>

                  <button
                    type="button"
                    className="neo-btn"
                    onClick={handleAddStudentRow}
                    title="Tambah Murid"
                    style={{
                      border: '2px solid #0f172a',
                      boxShadow: '0 2px 0 #0f172a',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>

                {/* Box Tampal Senarai Nama */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #94a3b8',
                    borderRadius: '14px',
                    padding: '12px',
                    marginBottom: '14px'
                  }}
                >
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Tampal Senarai Nama (Pisahkan dengan baris baharu atau koma):
                  </label>
                  <textarea
                    rows={3}
                    value={tampalTeks}
                    onChange={(e) => setTampalTeks(e.target.value)}
                    placeholder="Contoh: MUHAMMAD AMIRUL, NUR SYAFIQAH, AHMAD DANIAL..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      boxSizing: 'border-box',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="neo-btn"
                      onClick={handleImportText}
                      style={{
                        flex: 1,
                        backgroundColor: '#ea580c',
                        color: '#ffffff',
                        border: '2px solid #0f172a',
                        boxShadow: '0 2px 0 #0f172a',
                        padding: '7px 12px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-file-import"></i> Import Nama
                    </button>

                    <button
                      type="button"
                      className="neo-btn bg-white"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        border: '2px solid #0f172a',
                        boxShadow: '0 2px 0 #0f172a',
                        padding: '7px 14px',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-file-csv"></i> CSV / TXT
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Table of Students */}
                <div style={{ maxHeight: '340px', overflowY: 'auto', border: '2px solid #0f172a', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#ea580c', borderBottom: '2px solid #0f172a', color: '#ffffff' }}>
                        <th style={{ padding: '9px 6px', width: '42px', textAlign: 'center', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.5px' }}>BIL.</th>
                        <th style={{ padding: '9px 8px', textAlign: 'center', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.5px' }}>NAMA MURID</th>
                        <th style={{ padding: '9px 8px', width: '120px', textAlign: 'center', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.5px' }}>NO. K/P</th>
                        <th style={{ padding: '9px 6px', width: '50px', textAlign: 'center', fontWeight: '900', fontSize: '0.82rem', letterSpacing: '0.5px' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((st, idx) => {
                        const isSelected = st.id === selectedStudentId;
                        return (
                          <tr
                            key={st.id}
                            onClick={() => handleSelectStudent(st)}
                            style={{
                              backgroundColor: isSelected ? '#fff7ed' : (idx % 2 === 0 ? '#ffffff' : '#f8fafc'),
                              borderBottom: '1px solid #e2e8f0',
                              cursor: 'pointer'
                            }}
                          >
                            <td style={{ padding: '6px 4px', textAlign: 'center', fontWeight: '900', color: '#0f172a' }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '6px 6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  title="Lihat Pratonton Sijil"
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: isSelected ? '#ea580c' : '#94a3b8',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    flexShrink: 0
                                  }}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                                <input
                                  type="text"
                                  value={st.name}
                                  onChange={(e) => handleUpdateStudentField(st.id, 'name', e.target.value)}
                                  style={{
                                    width: '100%',
                                    border: isSelected ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                                    borderRadius: '6px',
                                    padding: '4px 6px',
                                    fontSize: '0.82rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    backgroundColor: '#ffffff'
                                  }}
                                />
                              </div>
                            </td>
                            <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                              <input
                                type="text"
                                value={st.ic}
                                placeholder="Pilihan"
                                onChange={(e) => handleUpdateStudentField(st.id, 'ic', e.target.value)}
                                style={{
                                  width: '100%',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  padding: '4px 6px',
                                  fontSize: '0.78rem',
                                  fontWeight: '600',
                                  textAlign: 'center',
                                  backgroundColor: '#ffffff'
                                }}
                              />
                            </td>
                            <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteStudent(st.id, e)}
                                title="Padam Murid"
                                style={{
                                  border: 'none',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <i className="fa-solid fa-trash-can" style={{ fontSize: '0.75rem' }}></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bulk Download Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                  <button
                    type="button"
                    className="neo-btn"
                    disabled={isExporting}
                    onClick={handleBulkDownloadPNG}
                    style={{
                      backgroundColor: '#ea580c',
                      color: '#ffffff',
                      border: '2.5px solid #0f172a',
                      boxShadow: '0 3px 0 #0f172a',
                      padding: '10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: isExporting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-download"></i> PNG ({students.length})
                  </button>

                  <button
                    type="button"
                    className="neo-btn"
                    disabled={isExporting}
                    onClick={handleBulkDownloadPDF}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: '2.5px solid #0f172a',
                      boxShadow: '0 3px 0 #0f172a',
                      padding: '10px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: isExporting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-file-pdf"></i> PDF ({students.length})
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN: Certificate Preview (A4 PORTRAIT MENEGAK) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Preview Container Box */}
          <div
            className="neo-box"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '3px solid #0f172a',
              boxShadow: '0 5px 0 #0f172a',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Top Toolbar of Preview */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a' }}></div>
                <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f172a' }}>
                  Preview
                </span>
              </div>

              {/* Tools: Zoom, Print */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setZoomLevel(z => Math.max(70, z - 10));
                  }}
                  title="Zum Keluar"
                  style={{ border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontWeight: '800' }}
                >
                  <i className="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setZoomLevel(z => Math.min(130, z + 10));
                  }}
                  title="Zum Masuk"
                  style={{ border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontWeight: '800' }}
                >
                  <i className="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Cetak Sijil"
                  style={{ border: '1.5px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontWeight: '800' }}
                >
                  <i className="fa-solid fa-print"></i>
                </button>
              </div>
            </div>

            {/* A4 Portrait Certificate Stage */}
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '8px 0',
                backgroundColor: '#f1f5f9',
                borderRadius: '14px',
                border: '1.5px dashed #cbd5e1'
              }}
            >
              <div
                ref={certRef}
                style={{
                  // Exact A4 Portrait Aspect Ratio: 210mm x 297mm (1 : 1.4142)
                  width: `${380 * (zoomLevel / 100)}px`,
                  maxWidth: '100%',
                  aspectRatio: '210 / 297',
                  height: 'auto',
                  backgroundImage: 'url(/images/sijil/sijil-template.png)',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '16px',
                  border: '3.5px solid #0f172a',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  userSelect: 'none',
                  transition: 'width 0.2s ease'
                }}
              >
                {/* Recipient Name & optional IC (Font: Poppins, Warna: Hitam Gelap #000000) */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${posY}%`,
                    left: '14%',
                    right: '14%',
                    transform: 'translateY(-100%)',
                    textAlign: 'center',
                    zIndex: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    id="cert-preview-name"
                    className="sijil-text-poppins"
                    style={{
                      fontSize: `${(fontSize * 0.38) * (zoomLevel / 100)}px`,
                      fontWeight: tebal ? 700 : 500,
                      color: '#000000',
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.15,
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {displayName}
                  </div>

                  {tambahKP && noKP && (
                    <div
                      className="sijil-text-poppins"
                      style={{
                        fontSize: `${7.5 * (zoomLevel / 100)}px`,
                        fontWeight: 600,
                        color: '#000000',
                        fontFamily: "'Poppins', sans-serif",
                        marginTop: '2px'
                      }}
                    >
                      (No. K/P: {noKP})
                    </div>
                  )}
                </div>

                {/* Generation Date Under "Pada" (Font: Poppins, Warna: Hitam Gelap #000000) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '64.5%',
                    left: '25%',
                    right: '25%',
                    transform: 'translateY(-100%)',
                    textAlign: 'center',
                    zIndex: 6,
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    id="cert-preview-date"
                    className="sijil-text-poppins"
                    style={{
                      fontSize: `${8.5 * (zoomLevel / 100)}px`,
                      fontWeight: 600,
                      color: '#000000',
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: '0.5px'
                    }}
                  >
                    {tarikhSijil}
                  </div>
                </div>
              </div>
            </div>

            {/* Export status notice */}
            {isExporting && (
              <div
                style={{
                  marginTop: '10px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa-solid fa-spinner fa-spin"></i> {exportProgress}
              </div>
            )}

            {/* Bottom 2 Action Buttons (PNG & PDF) */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '16px'
              }}
            >
              <button
                type="button"
                className="neo-btn"
                disabled={isExporting}
                onClick={handleDownloadPNG}
                style={{
                  backgroundColor: '#ea580c',
                  backgroundImage: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
                  color: '#ffffff',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: '900',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isExporting ? 'not-allowed' : 'pointer'
                }}
              >
                <i className="fa-solid fa-download"></i> PNG
              </button>

              <button
                type="button"
                className="neo-btn"
                disabled={isExporting}
                onClick={handleDownloadPDF}
                style={{
                  backgroundColor: '#dc2626',
                  backgroundImage: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: '3px solid #0f172a',
                  boxShadow: '0 4px 0 #0f172a',
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: '900',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isExporting ? 'not-allowed' : 'pointer'
                }}
              >
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
