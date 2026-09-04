import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_render = """        window.renderParentDashboard = function() {
            const names = window.studentNames || defaultStudentNames || [];
            if (!window.anakTerpilih && names.length > 0) {
                window.anakTerpilih = names[0];
            }
            const childName = window.anakTerpilih || 'Murid';
            const data = (window.studentData && window.studentData[childName]) ? window.studentData[childName] : studentRecord();
            
            // Update header info
            const nameTitle = document.getElementById('ibubapa-nama-anak-title');
            if (nameTitle) nameTitle.textContent = childName;
            
            const kelasTitle = document.getElementById('ibubapa-nama-kelas-title');
            if (kelasTitle) kelasTitle.textContent = localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang';
            
            const avatarEl = document.getElementById('ibubapa-avatar-icon');
            if (avatarEl && typeof updateAvatarElement === 'function') {
                updateAvatarElement(avatarEl, data.avatar || selectedAvatarIcon);
            }
            
            // Populate select
            const select = document.getElementById('ibubapa-dashboard-child-select');
            if (select) {
                select.innerHTML = '';
                names.forEach(n => {
                    const opt = document.createElement('option');
                    opt.value = n;
                    opt.textContent = n;
                    if (n === childName) opt.selected = true;
                    select.appendChild(opt);
                });
            }"""

new_render = """        window.renderParentDashboard = function() {
            const baseNames = window.studentNames || defaultStudentNames || [];
            const childNames = baseNames.filter(n => n !== "Profil Ibu Bapa" && n !== "+ Tambah Profil Anak");
            
            if (!window.anakTerpilih && childNames.length > 0) {
                window.anakTerpilih = childNames[0];
            }
            const childName = window.anakTerpilih || 'Murid';
            const data = (window.studentData && window.studentData[childName]) ? window.studentData[childName] : studentRecord();
            
            // Update header info
            const nameTitle = document.getElementById('ibubapa-nama-anak-title');
            if (nameTitle) nameTitle.textContent = childName;
            
            const kelasTitle = document.getElementById('ibubapa-nama-kelas-title');
            if (kelasTitle) kelasTitle.textContent = localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang';
            
            const avatarEl = document.getElementById('ibubapa-avatar-icon');
            if (avatarEl && typeof updateAvatarElement === 'function') {
                updateAvatarElement(avatarEl, data.avatar || selectedAvatarIcon);
            }
            
            // Populate select
            const select = document.getElementById('ibubapa-dashboard-child-select');
            if (select) {
                select.innerHTML = '';
                childNames.forEach(n => {
                    const opt = document.createElement('option');
                    opt.value = n;
                    opt.textContent = n;
                    if (n === childName) opt.selected = true;
                    select.appendChild(opt);
                });
            }"""

content = content.replace(old_render, new_render)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
