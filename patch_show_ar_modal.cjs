const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const newCode = `
window.showARSukuKataModal = function() {
    const container = document.getElementById('ar-sukukata-buttons-container');
    const modal = document.getElementById('modal-pilih-ar-sukukata');
    if (!container || !modal) return;
    
    // Check if we are in Misi Suku Kata Hero (Peta 3) or Asas (Peta 2)
    const isHero = (window.currentPeta === 3);
    
    let buttonsHTML = '';
    
    if (isHero) {
        buttonsHTML = \`
            <button class="neo-btn bg-pink" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kv_kvk');">
                KV+KVK
            </button>
            <button class="neo-btn bg-cyan" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvk_kv');">
                KVK+KV
            </button>
            <button class="neo-btn bg-yellow" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvk_kvk');">
                KVK+KVK
            </button>
            <button class="neo-btn bg-green" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvkk');">
                KVKK
            </button>
            <button class="neo-btn bg-purple" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kv_kv_kvk');">
                KV+KV+KVK
            </button>
            <button class="neo-btn bg-orange" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvk_kv_kvk');">
                KVK+KV+KVK
            </button>
        \`;
    } else {
        buttonsHTML = \`
            <button class="neo-btn bg-pink" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kv');">
                KV
            </button>
            <button class="neo-btn bg-cyan" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvkv');">
                KVKV
            </button>
            <button class="neo-btn bg-yellow" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('v_kv');">
                V+KV
            </button>
            <button class="neo-btn bg-green" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvkvkv');">
                KVKVKV
            </button>
            <button class="neo-btn bg-purple" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('kvk');">
                KVK
            </button>
            <button class="neo-btn bg-orange" style="justify-content: center; padding: 14px 10px; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;" onclick="document.getElementById('modal-pilih-ar-sukukata').style.display = 'none'; if(window.bukaARSukuKataKemahiran) window.bukaARSukuKataKemahiran('v_kvk');">
                V+KVK
            </button>
        \`;
    }
    
    container.innerHTML = buttonsHTML;
    modal.style.display = 'flex';
};
`;

// Append to the end of app-logic.js
fs.appendFileSync('public/app-logic.js', newCode);
console.log("Appended window.showARSukuKataModal to public/app-logic.js");
