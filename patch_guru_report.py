import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """    <button id="guru-report-mobile-btn" className="neo-btn bg-red" style={{display: "none", position: "fixed", bottom: "95px", right: "20px", width: "60px", height: "60px", borderRadius: "50%", zIndex: "1999", fontSize: "1.5rem", padding: "0", justifyContent: "center", alignItems: "center", animation: "red-glow 2s infinite alternate", color: "white"}} onClick={() => { document.getElementById('guru-report-menu')!.style.display = 'flex'; }}>
        <i className="fa-solid fa-file-export"></i>
    </button>
    <div id="guru-report-menu" className="modal-overlay" style={{display: 'none', zIndex: 2000, justifyContent: 'center', alignItems: 'center'}} onClick={(e) => { if(e.target === e.currentTarget) e.currentTarget.style.display = 'none'; }}>
       <div className="neo-box report-menu-card" style={{background: 'linear-gradient(135deg, #ffffff 0%, #fff8ec 100%)', border: '3px solid var(--color-dark)', boxShadow: '6px 6px 0 var(--color-dark)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px', width: '85%', maxWidth: '320px', borderRadius: '20px', textAlign: 'center'}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'var(--color-dark)'}}>
                <i className="fa-solid fa-file-export" style={{fontSize:'1.3rem', color:'var(--color-orange)'}}></i>
                <h3 className="century-gothic-font" style={{margin:0, fontSize:'1.15rem', fontWeight:'bold'}}>Muat Turun Laporan</h3>
            </div>
            <p style={{margin: '0', fontSize: '0.8rem', color: '#64748b', fontWeight: '500'}}>Pilih format laporan prestasi murid:</p>
            <button className="neo-btn bg-red century-gothic-font report-download-btn" onClick={() => { document.getElementById('guru-report-menu')!.style.display = 'none'; (window as any).cetakLaporanPDF && (window as any).cetakLaporanPDF(); }}><i className="fa-solid fa-file-pdf"></i> Muat Turun PDF</button>
            <button className="neo-btn century-gothic-font report-download-btn" style={{backgroundColor:"#168f81", color:"white"}} onClick={() => { document.getElementById('guru-report-menu')!.style.display = 'none'; (window as any).muatTurunCSV && (window as any).muatTurunCSV(); }}><i className="fa-solid fa-file-csv"></i> Muat Turun CSV</button>
       </div>
    </div>"""

target2 = """        <div id="guru-floating-dial-container" className={isReportDialOpen ? 'open' : ''}>
            <div className="mobile-dial-options">
                <button className="neo-btn bg-red cara-belajar-btn untuk-huruf" onClick={(e) => { setIsReportDialOpen(false); (window as any).eksportPDF && (window as any).eksportPDF(); }}>
                    <span className="cara-belajar-btn-text-short">Eksport PDF</span>
                    <i className="fa-solid fa-file-pdf"></i>
                </button>
                <button className="neo-btn bg-green cara-belajar-btn untuk-huruf" onClick={(e) => { setIsReportDialOpen(false); (window as any).eksportCSV && (window as any).eksportCSV(); }}>
                    <span className="cara-belajar-btn-text-short">Eksport CSV</span>
                    <i className="fa-solid fa-file-csv"></i>
                </button>
            </div>
            
            <button id="guru-floating-cta" className="neo-btn bg-red" onClick={(e) => { setIsReportDialOpen(!isReportDialOpen) }} aria-label="Laporan" style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.5rem', animation: 'red-glow 2s infinite alternate', color: 'white' }}>
                <i className={`fa-solid ${isReportDialOpen ? 'fa-xmark' : 'fa-file-export'}`}></i>
            </button>
        </div>"""

replacement2 = """        <div id="guru-floating-dial-container" className={isReportDialOpen ? 'open' : ''}>
            <div className="mobile-dial-options">
                <button className="neo-btn bg-red cara-belajar-btn" onClick={(e) => { setIsReportDialOpen(false); (window as any).cetakLaporanPDF && (window as any).cetakLaporanPDF(); }}>
                    <span className="cara-belajar-btn-text-short">Eksport PDF</span>
                    <i className="fa-solid fa-file-pdf"></i>
                </button>
                <button className="neo-btn bg-green cara-belajar-btn" onClick={(e) => { setIsReportDialOpen(false); (window as any).muatTurunCSV && (window as any).muatTurunCSV(); }} style={{ backgroundColor: '#168f81', color: 'white' }}>
                    <span className="cara-belajar-btn-text-short">Eksport CSV</span>
                    <i className="fa-solid fa-file-csv"></i>
                </button>
            </div>
            
            <button id="guru-floating-cta" className="neo-btn bg-red" onClick={(e) => { setIsReportDialOpen(!isReportDialOpen) }} aria-label="Laporan" style={{ width: '60px', height: '60px', borderRadius: '50%', fontSize: '1.5rem', animation: 'red-glow 2s infinite alternate', color: 'white', border: '3px solid var(--color-dark)', boxShadow: '2px 4px 0 var(--color-dark)' }}>
                <i className={`fa-solid ${isReportDialOpen ? 'fa-xmark' : 'fa-file-export'}`}></i>
            </button>
        </div>"""

if target1 in content:
    content = content.replace(target1, "")
    print("Replaced target1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target2")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("done")
