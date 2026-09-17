// Logika Surih Nombor

window.bukaSurihNombor = function() {
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
    paparSkrin('view-surih-nombor');
    
    setTimeout(() => {
        if (!window.surihNomborInitialized) {
            initSurihNombor();
            window.surihNomborInitialized = true;
        } else {
            resizeCanvasNombor();
            window.surihNomborReset();
        }
    }, 50);
};

const surihNomborData = {
    nomborSemasa: 0,
    kategori: '0-10', // '0-10' atau 'siri'
    stars: 0,
    nomborSelesai: new Set(),
    demoMode: false,
    traceStrokSemasa: 1,
    laluanUser: [],
    strokBerjaya: new Set(),
    isDrawing: false,
    isError: false,
    maxReachedIndex: 0
};

const senaraiNombor0_10 = ['0','1','2','3','4','5','6','7','8','9','10'];
const senaraiNomborSiri = ['10','20','30','40','50','60','70','80','90','100'];

function getSenaraiNombor() {
    return surihNomborData.kategori === 'siri' ? senaraiNomborSiri : senaraiNombor0_10;
}

// Data strok dipermudahkan (berdasarkan koordinat grid 100x100)
const svgBesarNombor = {
    '0': ["M 50 18 C 24 18, 24 85, 50 85 C 76 85, 76 18, 50 18"],
    '1': ["M 50 18 L 50 85"],
    '2': ["M 25 36 C 25 10, 75 10, 75 36 C 75 54, 50 70, 25 85", "M 25 85 L 75 85"],
    '3': ["M 28 28 C 28 10, 72 10, 72 34 C 72 46, 52 48, 48 48", "M 48 48 C 52 48, 72 50, 72 64 C 72 86, 28 86, 28 75"],
    '4': ["M 28 18 L 28 52", "M 28 52 L 78 52", "M 66 18 L 66 85"],
    '5': ["M 72 18 L 32 18", "M 32 18 L 32 48", "M 32 48 C 78 38, 78 86, 30 85"],
    '6': ["M 68 18 C 30 15, 22 45, 22 65 C 22 88, 72 88, 72 65 C 72 45, 26 45, 22 65"],
    '7': ["M 25 18 L 75 18", "M 75 18 L 40 85"],
    '8': ["M 50 18 C 30 18, 30 48, 50 48 C 70 48, 70 85, 50 85 C 30 85, 30 48, 50 48 C 70 48, 70 18, 50 18"],
    '9': ["M 68 40 C 68 10, 22 10, 22 40 C 22 60, 68 60, 68 40", "M 68 40 L 68 85"],
    '10': ["M 30 18 L 30 85", "M 70 18 C 48 18, 48 85, 70 85 C 92 85, 92 18, 70 18"]
};

const strokBesarNombor = {};

function convertSvgToPointsNombor(pathString) {
    let svg = document.getElementById('temp-svg-helper-nombor');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'temp-svg-helper-nombor';
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

// Generate coordinate arrays for single digits & 10, and normalize Y bounds
for (let h of senaraiNombor0_10) {
    if (svgBesarNombor[h]) {
        strokBesarNombor[h] = svgBesarNombor[h].map(convertSvgToPointsNombor);
        
        if (h !== '10') {
            let minY = Infinity, maxY = -Infinity;
            strokBesarNombor[h].forEach(strok => {
                strok.forEach(p => {
                    if (p.y < minY) minY = p.y;
                    if (p.y > maxY) maxY = p.y;
                });
            });
            const targetMinY = 18;
            const targetMaxY = 85;
            if (maxY > minY) {
                strokBesarNombor[h].forEach(strok => {
                    strok.forEach(p => {
                        p.y = targetMinY + ((p.y - minY) / (maxY - minY)) * (targetMaxY - targetMinY);
                    });
                });
            }
        }
    }
}

function getStrokForNombor(numStr) {
    if (strokBesarNombor[numStr]) {
        return strokBesarNombor[numStr];
    }
    
    const digits = numStr.split('');
    const len = digits.length;
    const resultStrokes = [];
    
    if (len === 2) {
        const centerPositions = [27, 73];
        
        digits.forEach((d, idx) => {
            const baseStrokes = strokBesarNombor[d];
            if (baseStrokes) {
                const center = centerPositions[idx];
                const scaleX = d === '0' ? 0.82 : (d === '1' ? 0.70 : 0.72);
                baseStrokes.forEach(strok => {
                    const mappedPoints = strok.map(p => ({
                        x: (p.x - 50) * scaleX + center,
                        y: p.y
                    }));
                    resultStrokes.push(mappedPoints);
                });
            }
        });
    } else if (len === 3) {
        const centerPositions = [16, 49, 82];
        
        digits.forEach((d, idx) => {
            const baseStrokes = strokBesarNombor[d];
            if (baseStrokes) {
                const center = centerPositions[idx];
                const scaleX = d === '0' ? 0.58 : 0.55;
                baseStrokes.forEach(strok => {
                    const mappedPoints = strok.map(p => ({
                        x: (p.x - 50) * scaleX + center,
                        y: p.y
                    }));
                    resultStrokes.push(mappedPoints);
                });
            }
        });
    }
    
    return resultStrokes;
}

let ctxNombor;
let canvasRectNombor;
let currentStrokesToDrawNombor = [];

function binaNavigasiNombor() {
    const navBar = document.getElementById('surih-nombor-nav-bar');
    if (navBar) {
        navBar.innerHTML = '';
        const senarai = getSenaraiNombor();
        senarai.forEach((h, i) => {
            const btn = document.createElement('button');
            btn.className = `neo-btn ${i === surihNomborData.nomborSemasa ? 'bg-orange' : 'bg-white'}`;
            btn.style.padding = "8px 10px";
            btn.style.minWidth = '40px';
            btn.innerText = h;
            btn.id = `surih-nombor-nav-btn-${i}`;
            btn.onclick = () => { window.surihNomborTukar(i - surihNomborData.nomborSemasa); };
            navBar.appendChild(btn);
        });
    }
}

window.surihNomborSetKategori = function(kat) {
    if (surihNomborData.kategori === kat) return;
    surihNomborData.kategori = kat;
    surihNomborData.nomborSemasa = 0;
    surihNomborData.nomborSelesai.clear();
    
    const selectEl = document.getElementById('surih-nombor-kategori');
    if (selectEl) {
        selectEl.value = kat;
    }
    
    binaNavigasiNombor();
    window.updateSurihNomborNavColors();
    window.surihNomborReset();
};

function initSurihNombor() {
    const canvas = document.getElementById('surih-nombor-canvas');
    if (!canvas) return;
    ctxNombor = canvas.getContext('2d');
    
    // Set UI filter active state
    const selectEl = document.getElementById('surih-nombor-kategori');
    if (selectEl) {
        selectEl.value = surihNomborData.kategori;
    }

    // Bina navigasi
    binaNavigasiNombor();

    // Events
    window.updateSurihNomborNavColors();
    canvas.addEventListener('mousedown', startTraceNombor);
    canvas.addEventListener('mousemove', tracingNombor);
    canvas.addEventListener('mouseup', endTraceNombor);
    canvas.addEventListener('mouseout', endTraceNombor);
    
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startTraceNombor(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); tracingNombor(e.touches[0]); }, {passive: false});
    canvas.addEventListener('touchend', endTraceNombor);
    
    window.addEventListener('resize', resizeCanvasNombor);
    resizeCanvasNombor();
    window.surihNomborReset();
}

function resizeCanvasNombor() {
    const canvas = document.getElementById('surih-nombor-canvas');
    if (!canvas) return;
    const container = canvas.parentElement;
    if (container.clientWidth === 0) return;
    
    canvas.width = container.clientWidth;
    canvas.height = canvas.width * 2 / 3;
    canvasRectNombor = canvas.getBoundingClientRect();
    
    calcCurrentStrokesNombor();
    renderSurihNombor();
}

window.surihNomborTukar = function(offset) {
    const senarai = getSenaraiNombor();
    let newIdx = surihNomborData.nomborSemasa + offset;
    if (newIdx < 0) newIdx = 0;
    if (newIdx >= senarai.length) newIdx = senarai.length - 1;
    
    surihNomborData.nomborSemasa = newIdx;
    window.updateSurihNomborNavColors();
    window.surihNomborReset();
};

window.surihNomborReset = function() {
    surihNomborData.traceStrokSemasa = 1;
    surihNomborData.strokBerjaya.clear();
    surihNomborData.laluanUser = [];
    surihNomborData.demoMode = false;
    
    const confettiEl = document.getElementById('surih-nombor-confetti');
    if (confettiEl) confettiEl.innerHTML = '';
    
    calcCurrentStrokesNombor();
    renderSurihNombor();
    window.surihNomborTunjukCara();
};

function calcCurrentStrokesNombor() {
    const canvas = document.getElementById('surih-nombor-canvas');
    if (!canvas) return;
    const senarai = getSenaraiNombor();
    const h = senarai[surihNomborData.nomborSemasa] || senarai[0];
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    
    currentStrokesToDrawNombor = [];
    
    let scale = Math.min(cWidth * 0.45, cHeight * 0.7) / 100;
    let offsetBesarX = (cWidth - 100 * scale) / 2;
    let offsetY = (cHeight - 100 * scale) / 2;

    let totalStrokeIndex = 1;
    
    const strokList = getStrokForNombor(h);
    if (strokList) {
        strokList.forEach(strok => {
            const mapped = strok.map(p => ({ x: offsetBesarX + p.x * scale, y: offsetY + p.y * scale }));
            currentStrokesToDrawNombor.push({ points: mapped, id: totalStrokeIndex++, isBesar: true });
        });
    }
}

function renderSurihNombor() {
    if (!ctxNombor) return;
    const canvas = document.getElementById('surih-nombor-canvas');
    if (!canvas) return;
    ctxNombor.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base line (putus-putus)
    ctxNombor.beginPath();
    ctxNombor.moveTo(10, canvas.height * 0.78);
    ctxNombor.lineTo(canvas.width - 10, canvas.height * 0.78);
    ctxNombor.strokeStyle = '#cbd5e1';
    ctxNombor.setLineDash([8, 8]);
    ctxNombor.lineWidth = 2;
    ctxNombor.stroke();
    ctxNombor.setLineDash([]);
    
    // Draw all strokes
    currentStrokesToDrawNombor.forEach(strok => {
        if (!strok || !strok.points || strok.points.length === 0) return;
        const isDone = surihNomborData.strokBerjaya.has(strok.id);
        const isActive = surihNomborData.traceStrokSemasa === strok.id;
        
        if (strok.points[0]) {
            ctxNombor.beginPath();
            ctxNombor.moveTo(strok.points[0].x, strok.points[0].y);
            for(let i=1; i<strok.points.length; i++) {
                if (strok.points[i]) {
                    ctxNombor.lineTo(strok.points[i].x, strok.points[i].y);
                }
            }
            
            if (isDone) {
                ctxNombor.strokeStyle = '#ff7a00'; // Orange for done
                ctxNombor.setLineDash([]);
                ctxNombor.lineWidth = 15;
                ctxNombor.lineCap = 'round';
                ctxNombor.lineJoin = 'round';
                ctxNombor.stroke();
            } else {
                ctxNombor.strokeStyle = isActive ? '#94a3b8' : '#e2e8f0';
                ctxNombor.setLineDash([10, 10]);
                ctxNombor.lineWidth = 15;
                ctxNombor.lineCap = 'round';
                ctxNombor.lineJoin = 'round';
                ctxNombor.stroke();
                
                // Draw number at start
                if (isActive) {
                    ctxNombor.setLineDash([]);
                    ctxNombor.beginPath();
                    ctxNombor.arc(strok.points[0].x, strok.points[0].y, 14, 0, Math.PI * 2);
                    ctxNombor.fillStyle = '#ef4444'; // Red circle for active
                    ctxNombor.fill();
                    ctxNombor.fillStyle = 'white';
                    ctxNombor.font = 'bold 16px "Atlanta Rounded", Arial';
                    ctxNombor.textAlign = 'center';
                    ctxNombor.textBaseline = 'middle';
                    ctxNombor.fillText(strok.id, strok.points[0].x, strok.points[0].y + 1);
                }
            }
        }
    });
    
    // Draw user path (Strictly hidden during demoMode)
    if (surihNomborData.laluanUser.length > 0 && !surihNomborData.demoMode) {
        if (surihNomborData.laluanUser[0]) {
            ctxNombor.beginPath();
            ctxNombor.setLineDash([]);
            ctxNombor.moveTo(surihNomborData.laluanUser[0].x, surihNomborData.laluanUser[0].y);
            for(let i=1; i<surihNomborData.laluanUser.length; i++) {
                if (surihNomborData.laluanUser[i]) {
                    ctxNombor.lineTo(surihNomborData.laluanUser[i].x, surihNomborData.laluanUser[i].y);
                }
            }
            ctxNombor.strokeStyle = surihNomborData.isError ? '#ef4444' : '#ff7a00';
            ctxNombor.lineWidth = 12;
            ctxNombor.lineCap = 'round';
            ctxNombor.lineJoin = 'round';
            ctxNombor.stroke();
        }
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

function getMousePosNombor(e) {
    const canvas = document.getElementById('surih-nombor-canvas');
    if (!canvas) return { x: 0, y: 0 };
    canvasRectNombor = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvasRectNombor.width;
    const scaleY = canvas.height / canvasRectNombor.height;
    return {
        x: (e.clientX - canvasRectNombor.left) * scaleX,
        y: (e.clientY - canvasRectNombor.top) * scaleY
    };
}

function startTraceNombor(e) {
    if (surihNomborData.demoMode) {
        surihNomborData.demoMode = false;
        surihNomborData.laluanUser = [];
        renderSurihNombor();
    }
    if (surihNomborData.traceStrokSemasa > currentStrokesToDrawNombor.length) return; // Done
    
    const pos = getMousePosNombor(e);
    
    // Check if close to start of current stroke
    const targetStroke = currentStrokesToDrawNombor.find(s => s.id === surihNomborData.traceStrokSemasa);
    if (!targetStroke) return;
    const startPoint = targetStroke.points[0];
    const d = Math.sqrt(dist2(pos, startPoint));
    
    if (d < 45) {
        surihNomborData.isDrawing = true;
        surihNomborData.laluanUser = [pos];
        surihNomborData.isError = false;
        surihNomborData.maxReachedIndex = 0;
        renderSurihNombor();
    } else {
        const otherStroke = currentStrokesToDrawNombor.find(s => !surihNomborData.strokBerjaya.has(s.id) && Math.sqrt(dist2(pos, s.points[0])) < 45);
        if (otherStroke && otherStroke.id !== surihNomborData.traceStrokSemasa) {
            if (typeof window.showAppToast === 'function') {
                window.showAppToast('Ikut Urutan', `Mulakan dari nombor ${surihNomborData.traceStrokSemasa} dahulu!`, 'warning');
            } else {
                alert(`Mulakan dari nombor ${surihNomborData.traceStrokSemasa} dahulu!`);
            }
        }
    }
}

function tracingNombor(e) {
    if (!surihNomborData.isDrawing || surihNomborData.demoMode) return;
    const pos = getMousePosNombor(e);
    surihNomborData.laluanUser.push(pos);
    
    // Check tolerance
    const targetStroke = currentStrokesToDrawNombor.find(s => s.id === surihNomborData.traceStrokSemasa);
    if (!targetStroke) return;
    let minD = 9999;
    for (let i = 0; i < targetStroke.points.length - 1; i++) {
        const d = distToSegment(pos, targetStroke.points[i], targetStroke.points[i+1]);
        if (d < minD) minD = d;
    }
    
    if (minD > 45) { // Tolerance
        surihNomborData.isError = true;
        renderSurihNombor();
        setTimeout(() => {
            surihNomborData.isDrawing = false;
            surihNomborData.laluanUser = [];
            surihNomborData.isError = false;
            surihNomborData.maxReachedIndex = 0;
            renderSurihNombor();
        }, 200);
    } else {
        // Track sequential progress along stroke points with a strict forward lookahead window
        const totalPts = targetStroke.points.length;
        const currentIdx = surihNomborData.maxReachedIndex || 0;
        const maxCheck = Math.min(totalPts - 1, currentIdx + 5);
        
        for (let i = currentIdx; i <= maxCheck; i++) {
            if (Math.sqrt(dist2(pos, targetStroke.points[i])) < 40) {
                surihNomborData.maxReachedIndex = Math.max(surihNomborData.maxReachedIndex || 0, i);
            }
        }

        renderSurihNombor();
        
        // Check if reached end
        const lastIdx = totalPts - 1;
        const endPoint = targetStroke.points[lastIdx];
        const reachEndDist = Math.sqrt(dist2(pos, endPoint));
        const minIndexNeeded = Math.max(1, totalPts - 3);
        
        if ((surihNomborData.maxReachedIndex || 0) >= minIndexNeeded && reachEndDist < 35) {
            // Berjaya!
            surihNomborData.isDrawing = false;
            surihNomborData.strokBerjaya.add(surihNomborData.traceStrokSemasa);
            surihNomborData.laluanUser = [];
            surihNomborData.traceStrokSemasa++;
            surihNomborData.maxReachedIndex = 0;
            
            // Audio ding
            mainkanBunyiDingNombor();
            tambahBintangSurihNombor();
            renderSurihNombor();
            
            if (surihNomborData.traceStrokSemasa > currentStrokesToDrawNombor.length) {
                // Semua selesai!
                setTimeout(() => {
                    tunjukKonfetiSurihNombor();
                    tunjukMesejKejayaanNombor();
                    mainkanBunyiSorakNombor();
                    surihNomborData.nomborSelesai.add(surihNomborData.nomborSemasa);
                    window.updateSurihNomborNavColors();
                }, 300);
            }
        }
    }
}

function endTraceNombor(e) {
    if (surihNomborData.isDrawing) {
        surihNomborData.isDrawing = false;
        surihNomborData.laluanUser = [];
        surihNomborData.maxReachedIndex = 0;
        renderSurihNombor();
    }
}

function mainkanBunyiDingNombor() {
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

function mainkanBunyiSorakNombor() {
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

function tambahBintangSurihNombor() {
    surihNomborData.stars++;
    const starsEl = document.getElementById('surih-nombor-stars') || document.getElementById('surih-stars');
    if (starsEl) starsEl.innerText = surihNomborData.stars;
    const el = document.getElementById('surih-nombor-score') || document.getElementById('surih-score');
    if (el) {
        el.style.transform = 'scale(1.3)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }
}

window.surihNomborTunjukCara = function() {
    if (surihNomborData.demoMode) return;
    surihNomborData.demoMode = true;
    surihNomborData.laluanUser = [];
    let stokId = 1;
    let pointIndex = 0;
    
    function animateDemo() {
        if (!surihNomborData.demoMode) return;
        
        const targetStroke = currentStrokesToDrawNombor.find(s => s.id === stokId);
        if (!targetStroke || !targetStroke.points || targetStroke.points.length === 0 || pointIndex >= targetStroke.points.length) {
            surihNomborData.demoMode = false;
            surihNomborData.laluanUser = [];
            renderSurihNombor();
            return;
        }

        const p = targetStroke.points[pointIndex];
        if (!p) {
            surihNomborData.demoMode = false;
            surihNomborData.laluanUser = [];
            renderSurihNombor();
            return;
        }
        
        if (pointIndex === 0) {
            surihNomborData.laluanUser = [p];
        } else {
            surihNomborData.laluanUser.push(p);
        }
        
        renderSurihNombor();
        
        // Draw hand cursor
        ctxNombor.fillStyle = 'rgba(251, 191, 36, 0.9)';
        ctxNombor.beginPath();
        ctxNombor.arc(p.x, p.y, 16, 0, Math.PI * 2);
        ctxNombor.fill();
        ctxNombor.fillStyle = '#000000';
        ctxNombor.font = '16px sans-serif';
        ctxNombor.textAlign = 'center';
        ctxNombor.textBaseline = 'middle';
        ctxNombor.fillText('👆', p.x, p.y);
        
        pointIndex++;
        if (pointIndex >= targetStroke.points.length) {
            stokId++;
            pointIndex = 0;
            surihNomborData.laluanUser = [];
            setTimeout(animateDemo, 500);
        } else {
            requestAnimationFrame(animateDemo);
        }
    }
    
    animateDemo();
};

function tunjukKonfetiSurihNombor() {
    const container = document.getElementById('surih-nombor-confetti');
    if (!container) return;
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

function tunjukMesejKejayaanNombor() {
    const container = document.getElementById('surih-nombor-confetti');
    if (!container) return;
    const senarai = getSenaraiNombor();
    const textNombor = senarai[surihNomborData.nomborSemasa] || '';
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
    el.innerHTML = `Bagus!<br>Nombor ${textNombor} berjaya ditulis!`;
    container.appendChild(el);
    
    setTimeout(() => {
        if (window.surihNomborTukar) {
            window.surihNomborTukar(1);
        }
    }, 1500);
}

window.updateSurihNomborNavColors = function() {
    const senarai = getSenaraiNombor();
    senarai.forEach((h, i) => {
        const btn = document.getElementById(`surih-nombor-nav-btn-${i}`);
        if (!btn) return;
        btn.classList.remove('bg-orange', 'bg-white', 'bg-green');
        if (i === surihNomborData.nomborSemasa) {
            btn.classList.add('bg-orange');
        } else if (surihNomborData.nomborSelesai && surihNomborData.nomborSelesai.has(i)) {
            btn.classList.add('bg-green');
        } else {
            btn.classList.add('bg-white');
        }
    });
};
