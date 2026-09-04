# Patch script to add subtle dot pattern to all white frames and style parent mode table title

import re

# =========================================================================
# 1. Update public/app-logic.js
# =========================================================================
with open('public/app-logic.js', 'r', encoding='utf-8') as f:
    app_logic = f.read()

# 1.1 Update showAppModalAlert modal card background
old_alert_card = '<div class="neo-box" style="background-color:#ffffff; max-width:400px;'
new_alert_card = '<div class="neo-box" style="background-color:#ffffff; background-image:radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px); background-size:16px 16px; max-width:400px;'
if old_alert_card in app_logic:
    app_logic = app_logic.replace(old_alert_card, new_alert_card, 1)
    print("Updated showAppModalAlert card background with dot pattern.")

# 1.2 Update bukaModalDaftarAdmin modal cards background (Guru & Ibu Bapa)
old_guru_modal_card = '<div class="neo-box" style="background-color:#ffffff; max-width:440px; width:100%; max-height:90vh; overflow-y:auto; box-sizing:border-box; padding:24px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:left; box-shadow:0 6px 0 var(--color-dark); position:relative; margin:auto;">'
new_guru_modal_card = '<div class="neo-box" style="background-color:#ffffff; background-image:radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px); background-size:16px 16px; max-width:440px; width:100%; max-height:90vh; overflow-y:auto; box-sizing:border-box; padding:24px 20px; border-radius:20px; border:3px solid var(--color-dark); text-align:left; box-shadow:0 6px 0 var(--color-dark); position:relative; margin:auto;">'

# Replace both occurrences in bukaModalDaftarAdmin
app_logic = app_logic.replace(old_guru_modal_card, new_guru_modal_card)
print("Updated bukaModalDaftarAdmin modal cards with dot pattern.")

# 1.3 Ensure Guru modal in bukaModalDaftarAdmin has orange colors
old_modal_guru_colors_check = """                <div class="neo-btn" style="background:#168f81; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>"""

new_modal_guru_colors_check = """                <div class="neo-btn" style="background:#ea580c; color:white; padding:7px 18px; font-weight:bold; font-size:1rem; border-radius:12px; border:2.5px solid var(--color-dark, #10182f); box-shadow:0 3px 0 var(--color-dark, #10182f); display:inline-flex; align-items:center; gap:8px; margin-bottom:16px; pointer-events:none;">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <span style="font-family:'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif;">Daftar Guru Baharu</span>
                </div>"""

if old_modal_guru_colors_check in app_logic:
    app_logic = app_logic.replace(old_modal_guru_colors_check, new_modal_guru_colors_check, 1)
    print("Updated Guru modal header badge to orange.")

old_modal_guru_submit = """                        <button type="button" class="neo-btn" style="background:#168f81; color:white; width:100%; padding:11px; font-weight:bold; font-size:0.95rem; border-radius:12px; cursor:pointer;" onclick="window.simpanDaftarGuruModal()">"""
new_modal_guru_submit = """                        <button type="button" class="neo-btn" style="background:#ea580c; color:white; width:100%; padding:11px; font-weight:bold; font-size:0.95rem; border-radius:12px; cursor:pointer;" onclick="window.simpanDaftarGuruModal()">"""
if old_modal_guru_submit in app_logic:
    app_logic = app_logic.replace(old_modal_guru_submit, new_modal_guru_submit, 1)
    print("Updated Guru modal submit button to orange.")

# 1.4 Update renderAdminUrus table card background with dot pattern
old_admin_card_bg = '<div class="neo-box admin-table-card" style="background:#ffffff; padding:18px; border-radius:18px;'
new_admin_card_bg = '<div class="neo-box admin-table-card" style="background-color:#ffffff; background-image:radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px); background-size:16px 16px; padding:18px; border-radius:18px;'

app_logic = app_logic.replace(old_admin_card_bg, new_admin_card_bg)
print("Updated admin-table-card background with dot pattern.")

with open('public/app-logic.js', 'w', encoding='utf-8') as f:
    f.write(app_logic)
print("Saved public/app-logic.js")

# =========================================================================
# 2. Update src/App.tsx
# =========================================================================
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app_tsx = f.read()

# 2.1 Admin Dashboard table card background with dot pattern
old_admin_dash_card = """          <div
            className="neo-box"
            style={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto 20px",
              padding: "20px",
              background: "white",
            }}
          >"""

new_admin_dash_card = """          <div
            className="neo-box"
            style={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto 20px",
              padding: "20px",
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
            }}
          >"""

if old_admin_dash_card in app_tsx:
    app_tsx = app_tsx.replace(old_admin_dash_card, new_admin_dash_card, 1)
    print("Updated admin dashboard table card with dot pattern.")
else:
    print("Warning: old_admin_dash_card not matched exactly.")

# 2.2 Guru Dashboard table card background with dot pattern
old_guru_dash_card = """        {/* Performance & Activity Tracking Table */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            backgroundColor: "#ffffff",
          }}
        >"""

new_guru_dash_card = """        {/* Performance & Activity Tracking Table */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            padding: "20px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        >"""

if old_guru_dash_card in app_tsx:
    app_tsx = app_tsx.replace(old_guru_dash_card, new_guru_dash_card, 1)
    print("Updated guru dashboard table card with dot pattern.")
else:
    print("Warning: old_guru_dash_card not matched exactly.")

# 2.3 Guru Urus Murid Cards (Kad 1, Kad 2, Kad 3) with dot pattern
old_guru_kad1 = """          {/* Kad 1: Tetapan Nama Kelas (Kecil & Padat) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

new_guru_kad1 = """          {/* Kad 1: Tetapan Nama Kelas (Kecil & Padat) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

if old_guru_kad1 in app_tsx:
    app_tsx = app_tsx.replace(old_guru_kad1, new_guru_kad1, 1)
    print("Updated guru kad 1 with dot pattern.")

old_guru_kad2 = """          {/* Kad 2: Tambah Murid Baharu (Kecil & Padat di sebelah input) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

new_guru_kad2 = """          {/* Kad 2: Tambah Murid Baharu (Kecil & Padat di sebelah input) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

if old_guru_kad2 in app_tsx:
    app_tsx = app_tsx.replace(old_guru_kad2, new_guru_kad2, 1)
    print("Updated guru kad 2 with dot pattern.")

old_guru_kad3 = """          {/* Kad 3: Senarai Murid Berdaftar */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "16px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

new_guru_kad3 = """          {/* Kad 3: Senarai Murid Berdaftar */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
              padding: "16px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >"""

if old_guru_kad3 in app_tsx:
    app_tsx = app_tsx.replace(old_guru_kad3, new_guru_kad3, 1)
    print("Updated guru kad 3 with dot pattern.")

# 2.4 Mod Ibu Bapa: Laporan AI Card & Jadual Perincian Card with dot pattern & table title badge
old_parent_laporan_card = """        {/* Diagnostik AI Ibu Bapa */}
        <div
          id="ibubapa-laporan-card"
          className="neo-box ibubapa-laporan-card-desktop"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
            padding: "18px 20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >"""

new_parent_laporan_card = """        {/* Diagnostik AI Ibu Bapa */}
        <div
          id="ibubapa-laporan-card"
          className="neo-box ibubapa-laporan-card-desktop"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            padding: "18px 20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >"""

if old_parent_laporan_card in app_tsx:
    app_tsx = app_tsx.replace(old_parent_laporan_card, new_parent_laporan_card, 1)
    print("Updated parent laporan card with dot pattern.")

old_parent_table_card = """        {/* Jadual Perincian Aktiviti Anak */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
            padding: "20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                margin: "0",
                color: "var(--color-dark)",
              }}
            >
              <i
                className="fa-solid fa-list-check"
                style={{ color: "#0284c7", marginRight: "8px" }}
              ></i>{" "}
              Rekod Kemajuan Cabaran
            </h3>"""

new_parent_table_card = """        {/* Jadual Perincian Aktiviti Anak */}
        <div
          className="neo-box"
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto 20px",
            backgroundColor: "#ffffff",
            backgroundImage:
              "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
            padding: "20px",
            borderRadius: "16px",
            border: "2px solid var(--color-dark)",
            boxShadow: "0 2px 0 var(--color-dark)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              className="neo-btn"
              style={{
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                padding: "7px 16px",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                pointerEvents: "none",
                margin: 0,
              }}
            >
              <i className="fa-solid fa-list-check"></i>
              <span style={{ fontFamily: "'AtlantaRoundedBlack', sans-serif" }}>
                Rekod Kemajuan Cabaran
              </span>
            </div>"""

if old_parent_table_card in app_tsx:
    app_tsx = app_tsx.replace(old_parent_table_card, new_parent_table_card, 1)
    print("Updated parent table card with dot pattern and table title badge.")
else:
    print("Warning: old_parent_table_card not matched exactly.")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app_tsx)
print("Saved src/App.tsx")
