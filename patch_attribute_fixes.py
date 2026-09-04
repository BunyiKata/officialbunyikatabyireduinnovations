with open("public/app-logic.js", "r") as f:
    content = f.read()

# 1. renderSenaraiMuridUrus
old_senarai = """                const cleanName = nama.replace(/'/g, "\\\\'");
                html += `
                    <li style="display:flex; justify-content:space-between; align-items:center; padding:4px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                        <span style="font-weight:bold; font-size:0.75rem; color:var(--color-dark); text-transform:uppercase;">${origIdx + 1}. ${nama.toUpperCase()}</span>
                        <button class="bg-red student-delete-btn" style="padding:0 !important; font-size:0.72rem; width:28px !important; height:28px !important; min-width:28px !important; max-width:28px !important; min-height:28px !important; max-height:28px !important; border-radius:50% !important; aspect-ratio:1 / 1 !important; display:inline-flex !important; justify-content:center !important; align-items:center !important; cursor:pointer; flex-shrink:0 !important; box-shadow:1.5px 1.5px 0 var(--color-dark) !important;" onclick="window.padamMurid('${cleanName}')" title="Padam Murid">
                            <i class="fa-solid fa-trash" style="font-size:0.72rem; line-height:1;"></i>
                        </button>
                    </li>
                `;"""

new_senarai = """                const safeName = nama.replace(/"/g, '&quot;');
                html += `
                    <li style="display:flex; justify-content:space-between; align-items:center; padding:4px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                        <span style="font-weight:bold; font-size:0.75rem; color:var(--color-dark); text-transform:uppercase;">${origIdx + 1}. ${nama.toUpperCase()}</span>
                        <button class="bg-red student-delete-btn" style="padding:0 !important; font-size:0.72rem; width:28px !important; height:28px !important; min-width:28px !important; max-width:28px !important; min-height:28px !important; max-height:28px !important; border-radius:50% !important; aspect-ratio:1 / 1 !important; display:inline-flex !important; justify-content:center !important; align-items:center !important; cursor:pointer; flex-shrink:0 !important; box-shadow:1.5px 1.5px 0 var(--color-dark) !important;" data-name="${safeName}" onclick="window.padamMurid(this.getAttribute('data-name'))" title="Padam Murid">
                            <i class="fa-solid fa-trash" style="font-size:0.72rem; line-height:1;"></i>
                        </button>
                    </li>
                `;"""

if old_senarai in content:
    content = content.replace(old_senarai, new_senarai)
    print("Replaced renderSenaraiMuridUrus attribute")

# 2. resetProgresMurid button in renderTeacherTable
old_reset_btn = """onclick="window.resetProgresMurid('${nama}')\""""
new_reset_btn = """data-name="${nama.replace(/"/g, '&quot;')}" onclick="window.resetProgresMurid(this.getAttribute('data-name'))\""""
if old_reset_btn in content:
    content = content.replace(old_reset_btn, new_reset_btn)
    print("Replaced resetProgresMurid button attribute")

# 3. showAdminInfo in renderAdminTable
old_guru_info = """onclick="window.showAdminInfo('guru', '${t.nama}')\""""
new_guru_info = """data-name="${t.nama.replace(/"/g, '&quot;')}" onclick="window.showAdminInfo('guru', this.getAttribute('data-name'))\""""
if old_guru_info in content:
    content = content.replace(old_guru_info, new_guru_info)
    print("Replaced guru showAdminInfo button attribute")

old_parent_info = """onclick="window.showAdminInfo('ibubapa', '${t.nama}')\""""
new_parent_info = """data-name="${t.nama.replace(/"/g, '&quot;')}" onclick="window.showAdminInfo('ibubapa', this.getAttribute('data-name'))\""""
if old_parent_info in content:
    content = content.replace(old_parent_info, new_parent_info)
    print("Replaced ibubapa showAdminInfo button attribute")

with open("public/app-logic.js", "w") as f:
    f.write(content)

