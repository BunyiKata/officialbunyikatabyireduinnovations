const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalPilihJenisHuruf = `
    <div id="modal-pilih-jenis-huruf" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="document.getElementById('modal-pilih-jenis-huruf').style.display='none'"><i class="fa-solid fa-xmark"></i></button>
            <h2 id="modal-pilih-jenis-huruf-title" style="font-size: 1.5rem; margin-bottom: 20px;">Pilih Jenis Huruf</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button class="neo-btn bg-blue" onclick="bukaSenaraiHuruf('kecil')" style="font-size: 1.2rem; padding: 15px;">Huruf Kecil (a-z)</button>
                <button class="neo-btn bg-green" onclick="bukaSenaraiHuruf('besar')" style="font-size: 1.2rem; padding: 15px;">Huruf Besar (A-Z)</button>
            </div>
        </div>
    </div>
`;

const viewBelajarHuruf = `
    <div id="view-belajar-huruf" class="screen">
        <div class="map-top-bar">
            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin('map-screen')"><i class="fa-solid fa-arrow-left"></i></button>
            <div id="view-belajar-huruf-title" class="neo-btn bg-orange page-title" style="pointer-events: none; font-size: 1.2rem; margin: 0 auto; white-space: nowrap;">Belajar Huruf</div>
            <div></div>
        </div>
        <div id="grid-huruf-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 15px; margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.8); border: 3px solid var(--color-dark); border-radius: 20px; box-shadow: var(--shadow-hard-sm);">
            <!-- Huruf buttons will be injected here -->
        </div>
    </div>
`;

html = html.replace('</body>', modalPilihJenisHuruf + viewBelajarHuruf + '\n</body>');
fs.writeFileSync('index.html', html);
