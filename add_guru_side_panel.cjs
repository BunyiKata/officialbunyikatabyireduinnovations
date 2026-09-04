const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const guruSidePanel = `
    <div id="guru-side-panel-overlay" className="modal-overlay" style={{"zIndex":"2000","justifyContent":"flex-start","background":"rgba(0,0,0,0.5)","display":"none"}} onClick={(e) => { if(e.target === e.currentTarget) document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; }}>
        <div className="murid-side-panel" style={{"backgroundColor":"white","backgroundImage":"radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)","backgroundSize":"15px 15px","width":"280px","height":"100%","border":"var(--border-thick)","borderLeft":"none","borderRadius":"0 24px 24px 0","overflow":"hidden","display":"flex","flexDirection":"column","animation":"slideInLeft 0.3s forwards"}}>
            <div style={{"padding":"20px","backgroundColor":"var(--color-blue)","backgroundImage":"radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)","backgroundSize":"15px 15px","color":"white","display":"flex","alignItems":"center","gap":"15px","borderBottom":"var(--border-thick)","position":"relative"}}>
                <div style={{"fontSize":"1.8rem","background":"white","width":"50px","height":"50px","borderRadius":"50%","border":"var(--border-thick)","display":"inline-flex","alignItems":"center","justifyContent":"center","color":"var(--color-blue)","boxShadow":"none !important","flexShrink":"0"}}>
                    <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <div style={{"display":"flex","flexDirection":"column","gap":"2px","alignItems":"flex-start"}}>
                    <h2 style={{"fontSize":"1.3rem","margin":"0","wordBreak":"break-word","lineHeight":"1.1"}}>Mod<br/>Guru</h2>
                    <span style={{"fontSize":"0.7rem","opacity":"0.9"}}>Panel Kawalan Guru</span>
                </div>
                <button className="neo-btn bg-red" style={{"position":"absolute","top":"15px","right":"15px","padding":"6px 12px","minWidth":"auto","minHeight":"auto","fontSize":"1rem"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style={{"padding":"20px","display":"flex","flexDirection":"column","gap":"12px","overflowY":"auto","flex":"1"}}>
                <button className="neo-btn bg-blue" style={{"justifyContent":"flex-start","fontSize":"1.05rem","padding":"12px"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; paparSkrin('guru-dashboard') }}><i className="fa-solid fa-table-list" style={{"width":"30px"}}></i> Dashboard</button>
                <button className="neo-btn bg-orange" style={{"justifyContent":"flex-start","fontSize":"1.05rem","padding":"12px"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book" style={{"width":"30px"}}></i> Senarai Perkataan</button>
                <button className="neo-btn bg-green" style={{"justifyContent":"flex-start","fontSize":"1.05rem","padding":"12px"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole" style={{"width":"30px"}}></i> Akses Guru</button>
                <button className="neo-btn bg-yellow" style={{"justifyContent":"flex-start","fontSize":"1.05rem","padding":"12px","color":"var(--color-dark)"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; paparSkrin('main-menu-screen'); setTimeout(() => (window as any).bukaModalPilihPeta('belajar'), 50); }}><i className="fa-solid fa-book-open" style={{"width":"30px"}}></i> Peta Pembelajaran</button>
                <button className="neo-btn bg-purple" style={{"justifyContent":"flex-start","fontSize":"1.05rem","padding":"12px"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; paparSkrin('main-menu-screen'); setTimeout(() => (window as any).bukaModalPilihPeta('latihan'), 50); }}><i className="fa-solid fa-gamepad" style={{"width":"30px"}}></i> Peta Latihan</button>
            </div>
            
            <div style={{"background":"transparent","display":"flex","flexDirection":"column","padding":"20px","borderTop":"var(--border-thick)"}}>
                <button className="neo-btn bg-red" style={{"width":"100%","justifyContent":"center","fontSize":"1.05rem","padding":"12px"}} onClick={(e) => { document.getElementById('guru-side-panel-overlay')!.style.display = 'none'; keluarModGuru() }}><i className="fa-solid fa-right-from-bracket"></i> Keluar Mod Guru</button>
            </div>
        </div>
    </div>

    <button id="guru-mobile-menu-btn" className="neo-btn bg-blue" style={{"display":"none","position":"fixed","bottom":"20px","right":"20px","width":"60px","height":"60px","borderRadius":"50%","zIndex":"1999","fontSize":"1.5rem","padding":"0","justifyContent":"center","alignItems":"center"}} onClick={() => { document.getElementById('guru-side-panel-overlay')!.style.display = 'flex'; }}>
        <i className="fa-solid fa-bars"></i>
    </button>
`;

app = app.replace('<div id="login-screen"', guruSidePanel + '\n    <div id="login-screen"');
fs.writeFileSync('src/App.tsx', app);
console.log('Added guru side panel');
