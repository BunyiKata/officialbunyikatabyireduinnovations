import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_func = """        window.bukaModalPilihAnak = function() {
            const modal = document.getElementById('modal-pilih-anak');"""

new_func = """        window.bukaModalPilihAnak = function(isTukarDashboard = false) {
            const modal = document.getElementById('modal-pilih-anak');"""
            
content = content.replace(old_func, new_func)

old_btn_click = """                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        window.masukModMurid(name);
                    };"""
                    
new_btn_click = """                    btnAnak.onclick = () => {
                        window.tutupModalPilihAnak();
                        if (isTukarDashboard) {
                            if (window.tukarAnakIbuBapa) window.tukarAnakIbuBapa(name);
                        } else {
                            window.masukModMurid(name);
                        }
                    };"""
                    
content = content.replace(old_btn_click, new_btn_click)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
