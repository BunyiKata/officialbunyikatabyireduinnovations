const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix mode-buttons-container inline style
html = html.replace(
    'id="mode-buttons-container" style="display: flex; flex-direction: row; gap: 12px; margin-top: 20px; justify-content: center;"',
    'id="mode-buttons-container" class="mode-buttons-container" style="display: flex; gap: 12px; margin-top: 20px; justify-content: center;"'
);

fs.writeFileSync('index.html', html);
