const fs = require('fs');
let logic = fs.readFileSync('public/app-logic.js', 'utf-8');

logic = logic.replace(
    'max-width: 320px; width: 90%; padding: 25px 20px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin: 0 auto;',
    'max-width: 280px; width: 85%; padding: 20px 15px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin: 0 auto;'
);
logic = logic.replace(
    '<h3 style="margin-bottom: 12px; font-size: 1.4rem; color: #1e293b; font-weight: bold;">',
    '<h3 style="margin-bottom: 10px; font-size: 1.2rem; color: #1e293b; font-weight: bold;">'
);
logic = logic.replace(
    '<p style="margin-bottom: 24px; color: #475569; font-size: 1rem; line-height: 1.4;">',
    '<p style="margin-bottom: 20px; color: #475569; font-size: 0.9rem; line-height: 1.4;">'
);
logic = logic.replace(
    '<div style="display: flex; gap: 12px; justify-content: center;">',
    '<div style="display: flex; gap: 10px; justify-content: center;">'
);
logic = logic.replace(
    '<button id="btn-allow-sensor" class="neo-btn bg-green" style="padding: 12px 20px; font-size: 1rem; flex: 1;">',
    '<button id="btn-allow-sensor" class="neo-btn bg-green" style="padding: 10px 15px; font-size: 0.95rem; flex: 1;">'
);
logic = logic.replace(
    '<button id="btn-deny-sensor" class="neo-btn bg-red" style="padding: 12px 20px; font-size: 1rem; flex: 1;">',
    '<button id="btn-deny-sensor" class="neo-btn bg-red" style="padding: 10px 15px; font-size: 0.95rem; flex: 1;">'
);

fs.writeFileSync('public/app-logic.js', logic);
console.log('tweaked vr modal size');
