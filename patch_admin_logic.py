import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

admin_logic_old = """        function renderAdminDashboard() {
            // Populate teacher table
            const adminTbody = document.getElementById('admin-table-body');
            if (adminTbody) {
                const adminTeachers = [
                    { nama: "Cikgu Ahmad", sekolah: "SK Bintang", murid: totalStudents },
                    { nama: "Cikgu Siti", sekolah: "SK Harmoni", murid: 15 },
                    { nama: "Cikgu Ramasamy", sekolah: "SJKT Maju", murid: 8 }
                ];
                adminTbody.innerHTML = '';
                adminTeachers.forEach((t, index) => {
                    adminTbody.innerHTML += `
                        <tr class="admin-table-row" style="border-bottom: 1px solid #e2e8f0;">
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 600; color: #64748b; border-right: 1px solid #e2e8f0; text-align: center;">${index + 1}</td>
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 500; color: #1e293b; border-right: 1px solid #e2e8f0;">${t.nama}</td>
                            <td class="admin-td" style="padding: 8px 12px; color: #475569; border-right: 1px solid #e2e8f0;">${t.sekolah}</td>
                            <td class="admin-td" style="padding: 8px 12px; text-align: center; font-weight: bold; color: #1e293b;">${t.murid}</td>
                        </tr>
                    `;
                });
            }
        }"""

admin_logic_new = """        window.showAdminInfo = function(type, nama, extra) {
            let info = "";
            if (type === 'guru') {
                info = `Maklumat Guru:\\n\\nNama: ${nama}\\nEmel: ${nama.toLowerCase().replace(/\\s/g, '')}@moe.edu.my\\nKata Laluan: ********\\nKod Kelas: KELAS${Math.floor(Math.random() * 900 + 100)}`;
            } else {
                info = `Maklumat Ibu Bapa:\\n\\nNama: ${nama}\\nEmel: ${nama.toLowerCase().replace(/\\s/g, '')}@gmail.com\\nKata Laluan: ********`;
            }
            alert(info);
        };

        window.renderAdminTable = function(type = 'guru') {
            const adminTbody = document.getElementById('admin-table-body');
            const adminThead = document.getElementById('admin-table-head');
            const title = document.getElementById('admin-table-title');
            
            if (!adminTbody || !adminThead) return;

            let totalStudents = Object.keys(window.studentData || {}).length || 0;
            
            if (type === 'guru') {
                if (title) title.innerHTML = '<i class="fa-solid fa-chalkboard-user" style="color:#168f81"></i> Senarai Guru Berdaftar';
                adminThead.innerHTML = `
                    <tr>
                        <th style="padding:8px 12px; background-color:#168f81; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem; width:40px">BIL.</th>
                        <th style="padding:8px 12px; background-color:#168f81; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem">NAMA GURU</th>
                        <th style="padding:8px 12px; background-color:#168f81; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem">NAMA SEKOLAH</th>
                        <th style="padding:8px 12px; background-color:#168f81; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem">BILANGAN MURID</th>
                        <th style="padding:8px 12px; background-color:#168f81; color:white; border-bottom:2px solid var(--color-dark); text-align:center; font-size:0.9rem; width:60px">INFO</th>
                    </tr>
                `;
                
                const adminTeachers = [
                    { nama: "Cikgu Ahmad", sekolah: "SK Bintang", murid: totalStudents > 0 ? totalStudents : 13 },
                    { nama: "Cikgu Siti", sekolah: "SK Harmoni", murid: 15 },
                    { nama: "Cikgu Ramasamy", sekolah: "SJKT Maju", murid: 8 }
                ];
                adminTbody.innerHTML = '';
                adminTeachers.forEach((t, index) => {
                    adminTbody.innerHTML += `
                        <tr class="admin-table-row" style="border-bottom: 1px solid #e2e8f0;">
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 600; color: #64748b; border-right: 1px solid #e2e8f0; text-align: center;">${index + 1}</td>
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 500; color: #1e293b; border-right: 1px solid #e2e8f0;">${t.nama}</td>
                            <td class="admin-td" style="padding: 8px 12px; color: #475569; border-right: 1px solid #e2e8f0;">${t.sekolah}</td>
                            <td class="admin-td" style="padding: 8px 12px; text-align: center; font-weight: bold; color: #1e293b; border-right: 1px solid #e2e8f0;">${t.murid}</td>
                            <td class="admin-td" style="padding: 8px 12px; text-align: center;">
                                <button class="neo-btn bg-white" style="padding:4px; width:28px; height:28px; border-radius:50%; min-width:0; min-height:0; display:inline-flex; align-items:center; justify-content:center; color:#0284c7;" onclick="window.showAdminInfo('guru', '${t.nama}')" title="Info">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                if (title) title.innerHTML = '<i class="fa-solid fa-users" style="color:#0284c7"></i> Senarai Ibu Bapa Berdaftar';
                adminThead.innerHTML = `
                    <tr>
                        <th style="padding:8px 12px; background-color:#0284c7; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem; width:40px">BIL.</th>
                        <th style="padding:8px 12px; background-color:#0284c7; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem">NAMA IBU BAPA</th>
                        <th style="padding:8px 12px; background-color:#0284c7; color:white; border-bottom:2px solid var(--color-dark); border-right:1px solid rgba(255,255,255,0.3); text-align:center; font-size:0.9rem">BILANGAN ANAK</th>
                        <th style="padding:8px 12px; background-color:#0284c7; color:white; border-bottom:2px solid var(--color-dark); text-align:center; font-size:0.9rem; width:60px">INFO</th>
                    </tr>
                `;
                
                const adminParents = [
                    { nama: "Encik Razak", anak: 2 },
                    { nama: "Puan Aishah", anak: 1 },
                    { nama: "Encik Muthu", anak: 3 }
                ];
                adminTbody.innerHTML = '';
                adminParents.forEach((t, index) => {
                    adminTbody.innerHTML += `
                        <tr class="admin-table-row" style="border-bottom: 1px solid #e2e8f0;">
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 600; color: #64748b; border-right: 1px solid #e2e8f0; text-align: center;">${index + 1}</td>
                            <td class="admin-td" style="padding: 8px 12px; font-weight: 500; color: #1e293b; border-right: 1px solid #e2e8f0;">${t.nama}</td>
                            <td class="admin-td" style="padding: 8px 12px; text-align: center; font-weight: bold; color: #1e293b; border-right: 1px solid #e2e8f0;">${t.anak}</td>
                            <td class="admin-td" style="padding: 8px 12px; text-align: center;">
                                <button class="neo-btn bg-white" style="padding:4px; width:28px; height:28px; border-radius:50%; min-width:0; min-height:0; display:inline-flex; align-items:center; justify-content:center; color:#0284c7;" onclick="window.showAdminInfo('ibubapa', '${t.nama}')" title="Info">
                                    <i class="fa-solid fa-circle-info"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
        }

        function renderAdminDashboard() {
            window.renderAdminTable(document.getElementById('admin-table-selector') ? document.getElementById('admin-table-selector').value : 'guru');
        }"""

if admin_logic_old in content:
    content = content.replace(admin_logic_old, admin_logic_new)
    print("Patched admin logic")
else:
    print("Could not find admin logic")

with open("public/app-logic.js", "w") as f:
    f.write(content)
