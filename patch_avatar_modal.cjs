const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const modalHtml = `
    <!-- Modal Pilih Avatar -->
    <div id="modal-pilih-avatar" class="modal-overlay">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <button class="neo-btn bg-red close-btn" onclick="tutupModal()" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
            <h2 style="font-size: 1.8rem; margin-bottom: 20px; color: var(--color-dark);">Pilih Avatar</h2>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;" id="avatar-options">
                <!-- Dijana oleh JS -->
            </div>
        </div>
    </div>
`;

if (!html.includes('id="modal-pilih-avatar"')) {
    html = html.replace('</body>', modalHtml + '\n</body>');
    fs.writeFileSync('index.html', html);
}
