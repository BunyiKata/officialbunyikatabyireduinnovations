# Patch public/app-logic.js, src/App.tsx, and src/index.css for full mobile responsiveness in Mod Admin

# 1. Update public/app-logic.js
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# Make showAppModalAlert responsive
old_alert_modal = """<div class="neo-box" style="background-color:#ffffff; max-width:380px; width:90%; padding:28px 20px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:center; box-shadow: 0 4px 0 var(--color-dark); position:relative;">"""
new_alert_modal = """<div class="neo-box" style="background-color:#ffffff; max-width:400px; width:100%; max-height:90vh; overflow-y:auto; box-sizing:border-box; padding:28px 20px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:center; box-shadow: 0 4px 0 var(--color-dark); position:relative; margin:auto;">"""

if old_alert_modal in app_logic:
    app_logic = app_logic.replace(old_alert_modal, new_alert_modal, 1)
    print("Updated showAppModalAlert container style.")

# Update Guru section in renderAdminUrus
old_guru_container = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#ccfbf1; display:flex; align-items:center; justify-content:center; color:#0f766e;">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Guru Berdaftar (${teachers.length})
                        </h3>
                    </div>

                    <button type="button" class="neo-btn" style="background:#168f81; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px;" onclick="window.bukaModalDaftarAdmin('guru')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Guru Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box" style="background:#ffffff; padding:16px; border-radius:16px; text-align:left; width:100%;">
                    <div style="overflow-x:auto; border-radius:12px; border:2px solid var(--color-dark, #10182f);">
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">"""

new_guru_container = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px; width:100%; max-width:100%; min-width:0; box-sizing:border-box;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#ccfbf1; display:flex; align-items:center; justify-content:center; color:#0f766e; flex-shrink:0;">
                            <i class="fa-solid fa-chalkboard-user"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Guru Berdaftar (${teachers.length})
                        </h3>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#168f81; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('guru')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Guru Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                    <!-- Hint leret bagi peranti mudah alih -->
                    <div class="mobile-table-hint" style="display:none; font-size:0.75rem; color:#64748b; font-weight:bold; margin-bottom:8px; align-items:center; gap:6px;">
                        <i class="fa-solid fa-arrows-left-right" style="color:#168f81;"></i>
                        <span>Leret jadual ke kiri / kanan untuk lihat maklumat & tindakan</span>
                    </div>

                    <div style="width:100%; max-width:100%; min-width:0; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:12px; border:2px solid var(--color-dark, #10182f); box-sizing:border-box;">
                        <table style="width:100%; min-width:680px; border-collapse:collapse; font-size:0.85rem; text-align:left;">"""

if old_guru_container in app_logic:
    app_logic = app_logic.replace(old_guru_container, new_guru_container, 1)
    print("Updated Guru section in renderAdminUrus.")

# Update Ibu Bapa section in renderAdminUrus
old_parent_container = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; display:flex; align-items:center; justify-content:center; color:#0284c7;">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Ibu Bapa Berdaftar (${parents.length})
                        </h3>
                    </div>

                    <button type="button" class="neo-btn" style="background:#0284c7; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px;" onclick="window.bukaModalDaftarAdmin('ibubapa')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Ibu Bapa Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box" style="background:#ffffff; padding:16px; border-radius:16px; text-align:left; width:100%;">
                    <div style="overflow-x:auto; border-radius:12px; border:2px solid var(--color-dark, #10182f);">
                        <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">"""

new_parent_container = """        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:14px; width:100%; max-width:100%; min-width:0; box-sizing:border-box;">
                <!-- Header Card: Butang Pilihan Daftar Baharu Sahaja -->
                <div class="admin-urus-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; width:100%; box-sizing:border-box;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; display:flex; align-items:center; justify-content:center; color:#0284c7; flex-shrink:0;">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <h3 style="margin:0; font-size:1.15rem; font-weight:bold; color:#1e293b; font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">
                            Senarai Ibu Bapa Berdaftar (${parents.length})
                        </h3>
                    </div>

                    <button type="button" class="neo-btn admin-daftar-btn" style="background:#0284c7; color:white; padding:10px 18px; font-weight:bold; font-size:0.92rem; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.bukaModalDaftarAdmin('ibubapa')">
                        <i class="fa-solid fa-user-plus"></i>
                        <span>+ Daftar Ibu Bapa Baharu</span>
                    </button>
                </div>

                <!-- Table Card: Lebar & Selesa Dilengkapi Kolum INFO -->
                <div class="neo-box admin-table-card" style="background:#ffffff; padding:14px; border-radius:16px; text-align:left; width:100%; max-width:100%; min-width:0; box-sizing:border-box; overflow:hidden;">
                    <!-- Hint leret bagi peranti mudah alih -->
                    <div class="mobile-table-hint" style="display:none; font-size:0.75rem; color:#64748b; font-weight:bold; margin-bottom:8px; align-items:center; gap:6px;">
                        <i class="fa-solid fa-arrows-left-right" style="color:#0284c7;"></i>
                        <span>Leret jadual ke kiri / kanan untuk lihat maklumat & tindakan</span>
                    </div>

                    <div style="width:100%; max-width:100%; min-width:0; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:12px; border:2px solid var(--color-dark, #10182f); box-sizing:border-box;">
                        <table style="width:100%; min-width:680px; border-collapse:collapse; font-size:0.85rem; text-align:left;">"""

if old_parent_container in app_logic:
    app_logic = app_logic.replace(old_parent_container, new_parent_container, 1)
    print("Updated Parent section in renderAdminUrus.")

# Make bukaModalDaftarAdmin modal responsive
old_modal_inner = """<div class="neo-box" style="background-color:#ffffff; max-width:440px; width:100%; padding:24px; border-radius:20px; border:3px solid var(--color-dark); text-align:left; box-shadow:0 6px 0 var(--color-dark); position:relative;">"""
new_modal_inner = """<div class="neo-box" style="background-color:#ffffff; max-width:440px; width:100%; max-height:90vh; overflow-y:auto; box-sizing:border-box; padding:24px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:left; box-shadow:0 6px 0 var(--color-dark); position:relative; margin:auto;">"""

if old_modal_inner in app_logic:
    app_logic = app_logic.replace(old_modal_inner, new_modal_inner)
    print("Updated bukaModalDaftarAdmin modal containers.")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)

print("Finished updating public/app-logic.js")
