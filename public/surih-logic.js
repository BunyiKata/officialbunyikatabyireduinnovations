// Logika Surih Huruf

window.bukaSurihHuruf = function() {
    // Guna SATU AudioContext kongsi seluruh app (elak had ~6 ctx pada mobile)
    window.audioContext = (typeof window.getGlobalAudioContext === 'function')
        ? window.getGlobalAudioContext()
        : window.audioContext;
    if (!window.audioContext) {
        window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window.audioContext.state === 'suspended') {
        window.audioContext.resume();
    }
    paparSkrin('view-surih-huruf');
    
    setTimeout(() => {
        if (!window.surihInitialized) {
            initSurih();
            window.surihInitialized = true;
        } else {
            resizeCanvas(); window.surihReset();
        }
    }, 50);
};

const surihData = {
    hurufSemasa: 0,
    jenisPaparan: 'both', // 'both', 'uppercase', 'lowercase'
    stars: 0,
    hurufSelesai: new Set(),
    demoMode: false,
    traceStrokSemasa: 1,
    laluanUser: [],
    strokBerjaya: new Set(),
    isDrawing: false
};

const hurufAbjad = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// === SIMPAN STATUS SELESAI SURIH HURUF (MURID PRO SAHAJA) ===
// Setiap huruf yang selesai disurih menyimpan SATU bintang (sekali sahaja)
// melalui window.tambahBintangGlobal(). Fungsi itu sendiri sudah menolak mod
// percuma / guru / admin / ibu bapa (affiliate), jadi hanya murid sah disimpan
// dan disegerakkan ke Firebase. Lukisan kanvas TIDAK disimpan (jimat ruang).
function kunciSurihHuruf(idx) {
    const huruf = hurufAbjad[idx];
    if (huruf === undefined) return null;
    return 'surih_huruf_' + huruf;
}

function sudahSelesaiSurihHuruf(idx) {
    const kunci = kunciSurihHuruf(idx);
    if (!kunci) return false;
    try {
        const namaMurid = window.namaMuridAktif || (typeof namaMuridAktif !== 'undefined' ? namaMuridAktif : '') || localStorage.getItem('muridAktif') || '';
        const data = (typeof studentData !== 'undefined' && studentData && studentData[namaMurid]) ? studentData[namaMurid] : null;
        if (data && data.stars && Number(data.stars[kunci] || 0) > 0) return true;
        if (Number(localStorage.getItem('stars_' + kunci) || 0) > 0) return true;
    } catch (e) { }
    return false;
}

function simpanStatusSurihHuruf(idx) {
    if (sudahSelesaiSurihHuruf(idx)) return false;
    const kunci = kunciSurihHuruf(idx);
    if (!kunci) return false;
    if (typeof window.tambahBintangGlobal === 'function') {
        window.tambahBintangGlobal(kunci, 1);
        return true;
    }
    return false;
}

function pulihkanStatusSurihHuruf() {
    surihData.hurufSelesai.clear();
    hurufAbjad.forEach((_, idx) => {
        if (sudahSelesaiSurihHuruf(idx)) {
            surihData.hurufSelesai.add(idx);
        }
    });
}

// Data strok dipermudahkan (berdasarkan koordinat grid 100x100)
// Format strok: [{x, y}, {x, y}, ...]
const svgBesar = {
    A: ["M 50 15 L 25 90", "M 50 15 L 75 90", "M 35 65 L 65 65"],
    B: ["M 30 10 L 30 90", "M 30 10 Q 80 10 75 30 Q 70 50 30 50", "M 30 50 Q 85 50 80 70 Q 75 90 30 90"],
    C: ["M 80 25 Q 70 10 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 70 90 80 75"],
    D: ["M 30 10 L 30 90", "M 30 10 Q 90 10 90 50 Q 90 90 30 90"],
    E: ["M 30 10 L 30 90", "M 30 10 L 70 10", "M 30 50 L 60 50", "M 30 90 L 70 90"],
    F: ["M 35 10 L 35 90", "M 35 10 L 70 10", "M 35 50 L 60 50"],
    G: ["M 80 25 Q 70 10 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 60 L 60 60"],
    H: ["M 30 10 L 30 90", "M 70 10 L 70 90", "M 30 50 L 70 50"],
    I: ["M 50 10 L 50 90", "M 30 10 L 70 10", "M 30 90 L 70 90"],
    J: ["M 30 10 L 70 10", "M 50 10 L 50 70 Q 50 95 20 90"],
    K: ["M 30 10 L 30 90", "M 70 10 L 30 50", "M 30 50 L 70 90"],
    L: ["M 35 10 L 35 90", "M 35 90 L 75 90"],
    M: ["M 20 90 L 20 10", "M 20 10 L 50 50", "M 50 50 L 80 10", "M 80 10 L 80 90"],
    N: ["M 25 90 L 25 10", "M 25 10 L 75 90", "M 75 90 L 75 10"],
    O: ["M 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 50 Q 80 10 50 10"],
    P: ["M 30 10 L 30 90", "M 30 10 Q 78 10 78 30 Q 78 50 30 50"],
    Q: ["M 50 10 Q 20 10 20 50 Q 20 90 50 90 Q 80 90 80 50 Q 80 10 50 10", "M 60 65 L 85 90"],
    R: ["M 30 10 L 30 90", "M 30 10 Q 80 10 80 30 Q 80 50 30 50", "M 45 50 L 75 90"],
    S: ["M 75 25 Q 70 10 50 10 Q 30 10 30 30 Q 30 50 50 50 Q 75 50 75 70 Q 75 90 50 90 Q 25 90 20 75"],
    T: ["M 20 10 L 80 10", "M 50 10 L 50 90"],
    U: ["M 25 10 L 25 60 Q 25 90 50 90 Q 75 90 75 60 L 75 10"],
    V: ["M 25 10 L 50 90", "M 50 90 L 75 10"],
    W: ["M 15 10 L 30 90", "M 30 90 L 50 50", "M 50 50 L 70 90", "M 70 90 L 85 10"],
    X: ["M 25 10 L 75 90", "M 75 10 L 25 90"],
    Y: ["M 25 10 L 50 50", "M 75 10 L 50 50", "M 50 50 L 50 90"],
    Z: ["M 25 10 L 75 10", "M 75 10 L 25 90", "M 25 90 L 75 90"]
};

const svgKecil = {
    A: ["M 70 45 Q 50 30 30 45 Q 10 65 30 85 Q 50 100 70 85", "M 70 38 L 70 95"],
    B: ["M 30 10 L 30 90", "M 30 50 Q 75 40 75 70 Q 75 100 30 90"],
    C: ["M 70 48 Q 65 38 50 38 Q 25 38 25 64 Q 25 90 50 90 Q 68 90 75 80"],
    D: ["M 70 45 Q 50 30 30 45 Q 10 65 30 85 Q 50 100 70 85", "M 70 10 L 70 90"],
    E: ["M 30 65 L 70 65 Q 70 35 50 35 Q 20 35 25 70 Q 30 100 70 85"],
    F: ["M 65 20 Q 50 10 40 25 L 40 90", "M 25 45 L 55 45"],
    G: ["M 70 45 Q 50 30 30 45 Q 10 65 30 85 Q 50 100 70 85", "M 70 45 L 70 105 Q 70 130 45 125 Q 30 120 30 105"],
    H: ["M 30 10 L 30 90", "M 30 50 Q 70 40 70 70 L 70 90"],
    I: ["M 50 40 L 50 90", "M 50 20 L 51 20"],
    J: ["M 50 40 L 50 90 Q 50 120 20 110", "M 50 20 L 51 20"],
    K: ["M 30 10 L 30 90", "M 65 40 L 30 65", "M 35 60 L 70 90"],
    L: ["M 50 10 L 50 90"],
    M: ["M 20 40 L 20 90", "M 20 50 Q 50 40 50 70 L 50 90", "M 50 50 Q 80 40 80 70 L 80 90"],
    N: ["M 30 40 L 30 90", "M 30 50 Q 70 40 70 70 L 70 90"],
    O: ["M 50 35 Q 20 35 20 65 Q 20 95 50 95 Q 80 95 80 65 Q 80 35 50 35"],
    P: ["M 30 38 L 30 118", "M 30 38 Q 78 38 78 63 Q 78 88 30 88"],
    Q: ["M 70 45 Q 50 30 30 45 Q 10 65 30 85 Q 50 100 70 85", "M 70 40 L 70 110 L 85 95"],
    R: ["M 35 40 L 35 90", "M 35 55 Q 65 40 70 60"],
    S: ["M 70 40 Q 50 25 35 40 Q 25 50 50 65 Q 75 80 60 90 Q 40 100 30 85"],
    T: ["M 50 20 L 50 90", "M 30 40 L 70 40"],
    U: ["M 30 40 L 30 72 Q 30 88 50 88 Q 68 88 68 70", "M 68 40 L 68 88"],
    V: ["M 30 40 L 50 90", "M 50 90 L 70 40"],
    W: ["M 20 40 L 35 90", "M 35 90 L 50 60", "M 50 60 L 65 90", "M 65 90 L 80 40"],
    X: ["M 30 40 L 70 90", "M 70 40 L 30 90"],
    Y: ["M 30 40 L 30 75 Q 30 95 50 95 Q 70 95 70 75", "M 70 40 L 70 105 Q 70 130 45 125 Q 30 120 30 105"],
    Z: ["M 30 40 L 70 40", "M 70 40 L 30 90", "M 30 90 L 70 90"]
};

const strokBesar = {};
const strokKecil = {};

function convertSvgToPoints(pathString) {
    let svg = document.getElementById('temp-svg-helper-surih');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'temp-svg-helper-surih';
        svg.style.position = 'absolute';
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.overflow = 'hidden';
        svg.style.visibility = 'hidden';
        document.body.appendChild(svg);
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathString);
    svg.appendChild(path);
    let len = 0;
    try {
        len = path.getTotalLength() || 0;
    } catch(e) {
        len = 0;
    }
    const points = [];
    const numPoints = Math.max(2, Math.floor(len / 5)); // sample every 5 grid units
    for (let i = 0; i <= numPoints; i++) {
        try {
            const pt = path.getPointAtLength((i / numPoints) * len);
            if (pt) {
                points.push({ x: pt.x || 0, y: pt.y || 0 });
            }
        } catch(e) {}
    }
    try {
        svg.removeChild(path);
    } catch(e) {}
    return points;
}

// Generate coordinate arrays from SVG paths
for (let h of hurufAbjad) {
    if (svgBesar[h]) {
        strokBesar[h] = svgBesar[h].map(convertSvgToPoints);
    }
    if (svgKecil[h]) {
        strokKecil[h] = svgKecil[h].map(convertSvgToPoints);
    } else {
        strokKecil[h] = strokBesar[h]; // Fallback to uppercase
    }
}

let ctx;
let canvasRect;
let currentStrokesToDraw = []; // Array of strokes with absolute coordinates

function initSurih() {
    const canvas = document.getElementById('surih-canvas');
    ctx = canvas.getContext('2d');
    
    // Bina navigasi
    const navBar = document.getElementById('surih-nav-bar');
    navBar.innerHTML = '';
    hurufAbjad.forEach((h, i) => {
        const btn = document.createElement('button');
        btn.className = `neo-btn ${i === 0 ? 'bg-orange' : 'bg-white'}`;
        btn.style.padding = '8px 12px';
        btn.style.minWidth = '40px';
        btn.innerText = h;
        btn.id = `surih-nav-btn-${i}`;
        btn.onclick = () => { window.surihTukarHuruf(i - surihData.hurufSemasa); };
        navBar.appendChild(btn);
    });

    // Events
    pulihkanStatusSurihHuruf();
    window.updateSurihNavColors();
    canvas.addEventListener('mousedown', startTrace);
    canvas.addEventListener('mousemove', tracing);
    canvas.addEventListener('mouseup', endTrace);
    canvas.addEventListener('mouseout', endTrace);
    
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startTrace(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); tracing(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchend', endTrace);
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); window.surihReset();
}

function resizeCanvas() {
    const canvas = document.getElementById('surih-canvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    if (container.clientWidth === 0) return; // Prevent 0-width bugs when hidden
    
    canvas.width = container.clientWidth;
    // Maintain 3/2 aspect ratio
    canvas.height = canvas.width * 2 / 3;
    canvasRect = canvas.getBoundingClientRect();
    
    // Recalculate strokes for new dimensions
    calcCurrentStrokes();
    renderSurih();
}

window.surihTukarHuruf = function(offset) {
    let newIdx = surihData.hurufSemasa + offset;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= hurufAbjad.length) newIdx = hurufAbjad.length - 1;
    

    
        surihData.hurufSemasa = newIdx;
    pulihkanStatusSurihHuruf();
    window.updateSurihNavColors();
    window.surihReset();
};

window.surihSetJenis = function(jenis) {
    surihData.jenisPaparan = jenis;
    pulihkanStatusSurihHuruf();
    window.surihReset();
};

window.surihReset = function() {
    surihData.traceStrokSemasa = 1;
    surihData.strokBerjaya.clear();
    surihData.laluanUser = [];
    surihData.demoMode = false;
    // Clear confetti
    document.getElementById('surih-confetti').innerHTML = '';
    
    calcCurrentStrokes();
    renderSurih();
    window.surihTunjukCara(); // Auto demo on new letter
};

function calcCurrentStrokes() {
    const h = hurufAbjad[surihData.hurufSemasa];
    const cWidth = document.getElementById('surih-canvas').width;
    const cHeight = document.getElementById('surih-canvas').height;
    
    currentStrokesToDraw = [];
    
    let drawBesar = (surihData.jenisPaparan === 'both' || surihData.jenisPaparan === 'uppercase');
    let drawKecil = (surihData.jenisPaparan === 'both' || surihData.jenisPaparan === 'lowercase');
    
    let offsetBesarX = drawKecil && drawBesar ? cWidth * 0.15 : (drawBesar ? cWidth * 0.3 : 0);
    let offsetKecilX = drawBesar && drawKecil ? cWidth * 0.55 : (drawKecil ? cWidth * 0.3 : 0);
    
    let scale = Math.min(cWidth * 0.4, cHeight * 0.7) / 100;
    let offsetY = cHeight * 0.15;

    let totalStrokeIndex = 1;
    
    if (drawBesar) {
        strokBesar[h].forEach(strok => {
            const mapped = strok.map(p => ({ x: offsetBesarX + p.x * scale, y: offsetY + p.y * scale }));
            currentStrokesToDraw.push({ points: mapped, id: totalStrokeIndex++, isBesar: true });
        });
    }
    
    if (drawKecil) {
        strokKecil[h].forEach(strok => {
            const mapped = strok.map(p => ({ x: offsetKecilX + p.x * scale, y: offsetY + p.y * scale }));
            currentStrokesToDraw.push({ points: mapped, id: totalStrokeIndex++, isBesar: false });
        });
    }
}

function renderSurih() {
    if (!ctx) return;
    const canvas = document.getElementById('surih-canvas');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base line
    ctx.beginPath();
    ctx.moveTo(10, canvas.height * 0.78);
    ctx.lineTo(canvas.width - 10, canvas.height * 0.78);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw all strokes
    currentStrokesToDraw.forEach(strok => {
        const isDone = surihData.strokBerjaya.has(strok.id);
        const isActive = surihData.traceStrokSemasa === strok.id;
        
        ctx.beginPath();
        ctx.moveTo(strok.points[0].x, strok.points[0].y);
        for(let i=1; i<strok.points.length; i++) {
            ctx.lineTo(strok.points[i].x, strok.points[i].y);
        }
        
        if (isDone) {
            ctx.strokeStyle = '#ff7a00'; // Orange for done
            ctx.setLineDash([]);
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        } else {
            ctx.strokeStyle = isActive ? '#94a3b8' : '#e2e8f0';
            ctx.setLineDash([10, 10]);
            ctx.lineWidth = 15;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            // Draw number at start
            if (isActive) {
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.arc(strok.points[0].x, strok.points[0].y, 14, 0, Math.PI * 2);
                ctx.fillStyle = '#ef4444'; // Red circle for active
                ctx.fill();
                ctx.fillStyle = 'white';
                ctx.font = 'bold 16px "Atlanta Rounded", Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(strok.id, strok.points[0].x, strok.points[0].y + 1);
            }
        }
    });
    
    // Draw user path
    if (surihData.laluanUser.length > 0 && !surihData.demoMode) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(surihData.laluanUser[0].x, surihData.laluanUser[0].y);
        for(let i=1; i<surihData.laluanUser.length; i++) {
            ctx.lineTo(surihData.laluanUser[i].x, surihData.laluanUser[i].y);
        }
        ctx.strokeStyle = surihData.isError ? '#ef4444' : '#ff7a00';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
}

// Distance point to line segment
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 === 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
function dist2(v, w) { return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); }
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function getMousePos(e) {
    const canvas = document.getElementById('surih-canvas');
    canvasRect = canvas.getBoundingClientRect(); // Always fresh to prevent scrolling bugs
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;
    return {
        x: (e.clientX - canvasRect.left) * scaleX,
        y: (e.clientY - canvasRect.top) * scaleY
    };
}

function startTrace(e) {
    if (surihData.demoMode) return;
    if (surihData.traceStrokSemasa > currentStrokesToDraw.length) return; // Done
    
    const pos = getMousePos(e);
    
    // Check if close to start of current stroke
    const targetStroke = currentStrokesToDraw.find(s => s.id === surihData.traceStrokSemasa);
    const startPoint = targetStroke.points[0];
    const d = Math.sqrt(dist2(pos, startPoint));
    
    if (d < 40) {
        surihData.isDrawing = true;
        surihData.laluanUser = [pos];
        surihData.isError = false;
        renderSurih();
    } else {
        // Maybe clicked wrong number
        const otherStroke = currentStrokesToDraw.find(s => !surihData.strokBerjaya.has(s.id) && Math.sqrt(dist2(pos, s.points[0])) < 40);
        if (otherStroke && otherStroke.id !== surihData.traceStrokSemasa) {
            if (typeof window.showAppToast === 'function') {
                window.showAppToast('Ikut Urutan', `Mulakan dari nombor ${surihData.traceStrokSemasa} dahulu!`, 'warning');
            } else {
                alert(`Mulakan dari nombor ${surihData.traceStrokSemasa} dahulu!`);
            }
        }
    }
}

function tracing(e) {
    if (!surihData.isDrawing || surihData.demoMode) return;
    const pos = getMousePos(e);
    surihData.laluanUser.push(pos);
    
    // Check tolerance
    const targetStroke = currentStrokesToDraw.find(s => s.id === surihData.traceStrokSemasa);
    let minD = 9999;
    for (let i = 0; i < targetStroke.points.length - 1; i++) {
        const d = distToSegment(pos, targetStroke.points[i], targetStroke.points[i+1]);
        if (d < minD) minD = d;
    }
    
    if (minD > 35) { // Tolerance
        surihData.isError = true;
        renderSurih();
        setTimeout(() => {
            surihData.isDrawing = false;
            surihData.laluanUser = [];
            surihData.isError = false;
            renderSurih();
        }, 200);
    } else {
        renderSurih();
        
        // Check if reached end
        const endPoint = targetStroke.points[targetStroke.points.length - 1];
        if (Math.sqrt(dist2(pos, endPoint)) < 30) {
            // Berjaya!
            surihData.isDrawing = false;
            surihData.strokBerjaya.add(surihData.traceStrokSemasa);
            surihData.laluanUser = [];
            surihData.traceStrokSemasa++;
            
            // Audio ding
            mainkanBunyiDing();
            tambahBintangSurih();
            renderSurih();
            
            if (surihData.traceStrokSemasa > currentStrokesToDraw.length) {
                // Semua selesai!
                simpanStatusSurihHuruf(surihData.hurufSemasa);
                setTimeout(() => {
                    tunjukKonfetiSurih(); tunjukMesejKejayaan();
                    mainkanBunyiSorak();
                    surihData.hurufSelesai.add(surihData.hurufSemasa);
                    window.updateSurihNavColors();
                }, 300);
            }
        }
    }
}

function endTrace(e) {
    if (surihData.isDrawing) {
        surihData.isDrawing = false;
        surihData.laluanUser = [];
        renderSurih();
    }
}

function mainkanBunyiDing() {
    if (window.audioContext) {
        try {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            gain.gain.setValueAtTime(0.5, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
        } catch(e){}
    }
}

function mainkanBunyiSorak() {
    if (window.audioContext) {
        try {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.5);
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 1);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + 1);
        } catch(e){}
    }
}

function tambahBintangSurih() {
    surihData.stars++;
    document.getElementById('surih-stars').innerText = surihData.stars;
    const el = document.getElementById('surih-score');
    el.style.transform = 'scale(1.3)';
    setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
}

window.surihTunjukCara = function() {
    if (surihData.demoMode) return;
    surihData.demoMode = true;
    surihData.laluanUser = [];
    let stokId = 1;
    let pointIndex = 0;
    
    function animateDemo() {
        if (!surihData.demoMode) return;
        
        const targetStroke = currentStrokesToDraw.find(s => s.id === stokId);
        if (!targetStroke || !targetStroke.points || targetStroke.points.length === 0 || pointIndex >= targetStroke.points.length) {
            surihData.demoMode = false;
            surihData.laluanUser = [];
            renderSurih();
            return;
        }

        const p = targetStroke.points[pointIndex];
        if (!p) {
            surihData.demoMode = false;
            surihData.laluanUser = [];
            renderSurih();
            return;
        }
        
        if (pointIndex === 0) {
            surihData.laluanUser = [p];
        } else {
            surihData.laluanUser.push(p);
        }
        
        renderSurih();
        
        // Draw hand cursor
        ctx.fillStyle = 'rgba(251, 191, 36, 0.8)'; // Yellow dot cursor
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.font = '20px "Font Awesome 6 Free"';
        ctx.fillText('\uf25a', p.x, p.y + 5); // Hand pointer icon
        
        pointIndex++;
        if (pointIndex >= targetStroke.points.length) {
            stokId++;
            pointIndex = 0;
            surihData.laluanUser = [];
            setTimeout(animateDemo, 500);
        } else {
            requestAnimationFrame(animateDemo);
        }
    }
    
    animateDemo();
};

function tunjukKonfetiSurih() {
    const container = document.getElementById('surih-confetti');
    container.innerHTML = '';
    for(let i=0; i<30; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.left = Math.random() * 100 + '%';
        conf.style.top = '-10%';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.backgroundColor = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7'][Math.floor(Math.random()*5)];
        conf.style.animation = `fallDown ${1 + Math.random()}s linear forwards`;
        container.appendChild(conf);
    }
}

function tunjukMesejKejayaan() {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '50%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.background = 'var(--color-yellow)';
    el.style.width = '85%';
    el.style.maxWidth = '300px';
    el.style.padding = '15px';
    el.style.borderRadius = '20px';
    el.style.border = '4px solid var(--color-dark)';
    el.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.2)';
    el.style.fontSize = '1.3rem';
    el.style.fontWeight = 'bold';
    el.style.zIndex = '20';
    el.style.textAlign = 'center';
    el.style.lineHeight = '1.4';
    el.innerHTML = `Bagus!<br>Huruf ${hurufAbjad[surihData.hurufSemasa]} berjaya ditulis!`;
    document.getElementById('surih-confetti').appendChild(el);
    
    // Auto next after 1.5 seconds
    setTimeout(() => {
        if (window.surihTukarHuruf) {
            window.surihTukarHuruf(1);
        }
    }, 1500);
}

window.updateSurihNavColors = function() {
    hurufAbjad.forEach((h, i) => {
        const btn = document.getElementById(`surih-nav-btn-${i}`);
        if (!btn) return;
        btn.classList.remove('bg-orange', 'bg-white', 'bg-green');
        if (i === surihData.hurufSemasa) {
            btn.classList.add('bg-orange');
        } else if (surihData.hurufSelesai && surihData.hurufSelesai.has(i)) {
            btn.classList.add('bg-green');
        } else {
            btn.classList.add('bg-white');
        }
    });
};

// Butang "Hantar": simpan status selesai huruf semasa (murid PRO sahaja).
window.surihHantarStatus = function() {
    const idx = surihData.hurufSemasa;
    const huruf = hurufAbjad[idx];
    if (huruf === undefined) return;
    const berjayaSimpan = simpanStatusSurihHuruf(idx);
    surihData.hurufSelesai.add(idx);
    window.updateSurihNavColors();
    if (typeof window.showAppToast === 'function') {
        if (berjayaSimpan) {
            window.showAppToast('Berjaya Dihantar', `Status surih huruf ${huruf} telah disimpan.`, 'success');
        } else {
            window.showAppToast('Sudah Disimpan', `Huruf ${huruf} sudahpun direkodkan.`, 'success');
        }
    }
};
