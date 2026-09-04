# Patch src/App.tsx for admin-urus and guru-urus-murid

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update #admin-urus top bar: remove back button and center title
old_admin_top_bar = """      <div id="admin-urus" className="screen">
        <div
          className="map-top-bar"
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto 15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxSizing: "border-box",
          }}
        >
          <button
            className="neo-btn back-icon-btn"
            style={{ backgroundColor: "#168f81", color: "white", flexShrink: 0 }}
            onClick={(e) => {
              paparSkrin("admin-dashboard");
            }}
            title="Kembali ke Dashboard Admin"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "clamp(0.95rem, 3.5vw, 1.2rem)",
              backgroundColor: "#168f81",
              flex: 1,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <i className="fa-solid fa-list-check" style={{ marginRight: "8px" }}></i>
            Pengurusan Sistem Admin
          </div>
        </div>"""

new_admin_top_bar = """      <div id="admin-urus" className="screen">
        <div
          style={{
            width: "100%",
            maxWidth: "1150px",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            className="neo-btn page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
              backgroundColor: "#168f81",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
            }}
          >
            <i className="fa-solid fa-list-check" style={{ marginRight: "8px" }}></i>
            Pengurusan Sistem Admin
          </div>
        </div>"""

if old_admin_top_bar in content:
    content = content.replace(old_admin_top_bar, new_admin_top_bar, 1)
    print("Updated admin-urus top bar: removed back button and centered title.")
else:
    print("Warning: old_admin_top_bar not found in App.tsx")

# 2. Update #guru-urus-murid title and cards
old_guru_urus_block = """      <div id="guru-urus-murid" className="screen">
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="neo-btn bg-orange page-title century-gothic-font"
            style={{
              color: "white",
              pointerEvents: "none",
              fontSize: "1.2rem",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
            }}
          >
            <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
            Pengurusan Murid &amp; Kelas
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Kad 1: Tetapan Nama Kelas (Kecil & Padat) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            {/* Tajuk Highlight Warna Oren */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffedd5",
                padding: "4px 12px",
                borderRadius: "10px",
                border: "2px solid #ea580c",
                marginBottom: "10px",
              }}
            >
              <i className="fa-solid fa-chalkboard" style={{ color: "#ea580c", fontSize: "0.9rem" }}></i>
              <span
                style={{
                  fontWeight: 900,
                  color: "#ea580c",
                  fontSize: "0.92rem",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tetapan Nama Kelas
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              {/* Dropdown Tukar / Pilih Kelas yang ada */}
              <select
                id="select-pilih-kelas"
                className="neo-btn filter-select"
                style={{
                  padding: "6px 28px 6px 10px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  height: "38px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark)",
                  backgroundColor: "#f8fafc",
                  color: "var(--color-dark)",
                  cursor: "pointer",
                }}
                onChange={(e) => {
                  if (typeof (window as any).tukarKelasAktif === "function") {
                    (window as any).tukarKelasAktif(e.target.value);
                  }
                }}
                title="Pilih Kelas"
              >
                {/* Populated dynamically by kemaskiniSemuaDropdownKelas */}
              </select>

              {/* Input Edit Nama Kelas */}
              <input
                type="text"
                id="input-nama-kelas"
                className="neo-input"
                defaultValue={
                  localStorage.getItem("bunyiKataNamaKelas") || "1 Cemerlang"
                }
                placeholder="Nama kelas..."
                style={{
                  flex: 1,
                  minWidth: "160px",
                  fontSize: "0.9rem",
                  padding: "6px 12px",
                  height: "38px",
                }}
              />

              {/* Butang Simpan: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  padding: 0,
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
                onClick={() => {
                  if (typeof (window as any).simpanNamaKelas === "function") {
                    (window as any).simpanNamaKelas();
                  }
                }}
                title="Simpan Nama Kelas"
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>

              {/* Option Tambah Lagi 1 Kelas */}
              <button
                type="button"
                className="neo-btn bg-green"
                style={{
                  color: "white",
                  height: "38px",
                  minHeight: "38px",
                  padding: "0 12px",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  if (typeof (window as any).tambahKelasBaharu === "function") {
                    (window as any).tambahKelasBaharu();
                  }
                }}
                title="Tambah 1 Kelas Baharu"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tambah Kelas</span>
              </button>
            </div>
          </div>

          {/* Kad 2: Tambah Murid Baharu (Kecil & Padat di sebelah input) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            {/* Tajuk Highlight Warna Oren */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffedd5",
                padding: "4px 12px",
                borderRadius: "10px",
                border: "2px solid #ea580c",
                marginBottom: "10px",
              }}
            >
              <i className="fa-solid fa-user-plus" style={{ color: "#ea580c", fontSize: "0.9rem" }}></i>
              <span
                style={{
                  fontWeight: 900,
                  color: "#ea580c",
                  fontSize: "0.92rem",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tambah Murid Baharu
              </span>
            </div>

            {/* Input + Butang Icon Tambah Murid Betul-betul Di Sebelah Ruang Input */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                id="input-nama-murid-baru"
                className="neo-input"
                placeholder="cth: SITI AISHAH, MUHAMMAD AMIR, NUR FATIN..."
                style={{
                  flex: 1,
                  fontSize: "0.9rem",
                  padding: "6px 12px",
                  height: "38px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (typeof (window as any).tambahMuridBaru === "function") {
                      (window as any).tambahMuridBaru();
                    }
                  }
                }}
              />
              {/* Butang Tambah Murid: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  padding: 0,
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
                onClick={() => {
                  if (typeof (window as any).tambahMuridBaru === "function") {
                    (window as any).tambahMuridBaru();
                  }
                }}
                title="Tambah Murid"
              >
                <i className="fa-solid fa-user-plus"></i>
              </button>
            </div>
          </div>"""

new_guru_urus_block = """      <div id="guru-urus-murid" className="screen">
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto 15px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="neo-btn bg-orange page-title century-gothic-font"
            style={{
              color: "white",
              backgroundColor: "var(--color-orange, #ea580c)",
              pointerEvents: "none",
              fontSize: "1.2rem",
              textAlign: "center",
              padding: "10px 24px",
              borderRadius: "14px",
              border: "3px solid var(--color-dark, #10182f)",
              boxShadow: "0 4px 0 var(--color-dark, #10182f)",
            }}
          >
            <i className="fa-solid fa-users-gear" style={{ marginRight: "8px" }}></i>
            Pengurusan Murid &amp; Kelas
          </div>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Kad 1: Tetapan Nama Kelas (Kecil & Padat) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            {/* Tajuk Highlight Warna Oren: Sama macam reka bentuk tajuk Pengurusan Murid & Kelas */}
            <div
              className="neo-btn bg-orange"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--color-orange, #ea580c)",
                color: "white",
                padding: "6px 16px",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                marginBottom: "12px",
                pointerEvents: "none",
              }}
            >
              <i className="fa-solid fa-chalkboard" style={{ fontSize: "0.9rem" }}></i>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tetapan Nama Kelas
              </span>
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              {/* Dropdown Tukar / Pilih Kelas yang ada */}
              <select
                id="select-pilih-kelas"
                className="neo-btn filter-select"
                style={{
                  padding: "0 28px 0 10px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  height: "40px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  backgroundColor: "#f8fafc",
                  color: "var(--color-dark, #10182f)",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  margin: 0,
                }}
                onChange={(e) => {
                  if (typeof (window as any).tukarKelasAktif === "function") {
                    (window as any).tukarKelasAktif(e.target.value);
                  }
                }}
                title="Pilih Kelas"
              >
                {/* Populated dynamically by kemaskiniSemuaDropdownKelas */}
              </select>

              {/* Input Edit Nama Kelas */}
              <input
                type="text"
                id="input-nama-kelas"
                className="neo-input"
                defaultValue={
                  localStorage.getItem("bunyiKataNamaKelas") || "1 Cemerlang"
                }
                placeholder="Nama kelas..."
                style={{
                  flex: 1,
                  minWidth: "150px",
                  fontSize: "0.9rem",
                  padding: "0 12px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxSizing: "border-box",
                  margin: 0,
                }}
              />

              {/* Butang Simpan: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  minHeight: "40px",
                  padding: 0,
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
                onClick={() => {
                  if (typeof (window as any).simpanNamaKelas === "function") {
                    (window as any).simpanNamaKelas();
                  }
                }}
                title="Simpan Nama Kelas"
              >
                <i className="fa-solid fa-floppy-disk"></i>
              </button>

              {/* Option Tambah Lagi 1 Kelas (Maks. 2 Kelas) */}
              <button
                id="btn-tambah-kelas-guru"
                type="button"
                className="neo-btn bg-green"
                style={{
                  color: "white",
                  height: "40px",
                  minHeight: "40px",
                  padding: "0 14px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                }}
                onClick={() => {
                  if (typeof (window as any).tambahKelasBaharu === "function") {
                    (window as any).tambahKelasBaharu();
                  }
                }}
                title="Tambah 1 Kelas Baharu (Maksimum 2 Kelas)"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tambah Kelas</span>
              </button>
            </div>
          </div>

          {/* Kad 2: Tambah Murid Baharu (Kecil & Padat di sebelah input) */}
          <div
            className="neo-box"
            style={{
              backgroundColor: "#ffffff",
              padding: "14px 18px",
              borderRadius: "14px",
              textAlign: "left",
            }}
          >
            {/* Tajuk Highlight Warna Oren: Sama macam reka bentuk tajuk Pengurusan Murid & Kelas */}
            <div
              className="neo-btn bg-orange"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "var(--color-orange, #ea580c)",
                color: "white",
                padding: "6px 16px",
                borderRadius: "12px",
                border: "2.5px solid var(--color-dark, #10182f)",
                boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                marginBottom: "12px",
                pointerEvents: "none",
              }}
            >
              <i className="fa-solid fa-user-plus" style={{ fontSize: "0.9rem" }}></i>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: "0.92rem",
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                }}
              >
                Tambah Murid Baharu
              </span>
            </div>

            {/* Input + Butang Icon Tambah Murid Betul-betul Di Sebelah Ruang Input */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                id="input-nama-murid-baru"
                className="neo-input"
                placeholder="cth: SITI AISHAH, MUHAMMAD AMIR, NUR FATIN..."
                style={{
                  flex: 1,
                  fontSize: "0.9rem",
                  padding: "0 12px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxSizing: "border-box",
                  margin: 0,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (typeof (window as any).tambahMuridBaru === "function") {
                      (window as any).tambahMuridBaru();
                    }
                  }
                }}
              />
              {/* Butang Tambah Murid: HANYA ICON SAHAJA */}
              <button
                type="button"
                className="neo-btn bg-orange"
                style={{
                  color: "white",
                  backgroundColor: "var(--color-orange, #ea580c)",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  minHeight: "40px",
                  padding: 0,
                  borderRadius: "10px",
                  border: "2px solid var(--color-dark, #10182f)",
                  boxShadow: "0 3px 0 var(--color-dark, #10182f)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
                onClick={() => {
                  if (typeof (window as any).tambahMuridBaru === "function") {
                    (window as any).tambahMuridBaru();
                  }
                }}
                title="Tambah Murid"
              >
                <i className="fa-solid fa-user-plus"></i>
              </button>
            </div>
          </div>"""

if old_guru_urus_block in content:
    content = content.replace(old_guru_urus_block, new_guru_urus_block, 1)
    print("Updated guru-urus-murid: titles styled like main title, controls unified.")
else:
    print("Warning: old_guru_urus_block not found in App.tsx")

# 3. Update Kad 3: Senarai Murid Berdaftar filter and search styling for neat alignment
old_kad3_filter = """              {/* Filter Pilih Kelas (TIADA SEMUA KELAS) + Carian Murid */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  id="filter-kelas-senarai-murid"
                  className="neo-btn filter-select"
                  style={{
                    padding: "6px 28px 6px 10px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark)",
                    backgroundColor: "#f8fafc",
                    color: "var(--color-dark)",
                    cursor: "pointer",
                    margin: 0,
                  }}
                  onChange={(e) => {
                    if (typeof (window as any).tukarKelasAktif === "function") {
                      (window as any).tukarKelasAktif(e.target.value);
                    }
                  }}
                  title="Pilih Kelas"
                >
                  {/* Populated dynamically by kemaskiniSemuaDropdownKelas (NO Semua Kelas) */}
                </select>

                {/* Carian Murid */}
                <div
                  style={{
                    position: "relative",
                    minWidth: "160px",
                  }}
                >
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                    }}
                  ></i>
                  <input
                    type="text"
                    id="carian-murid-urus"
                    className="neo-input"
                    placeholder="Cari nama murid..."
                    style={{
                      width: "100%",
                      paddingLeft: "30px",
                      paddingRight: "10px",
                      fontSize: "0.85rem",
                      paddingBlock: "6px",
                      height: "36px",
                    }}"""

new_kad3_filter = """              {/* Filter Pilih Kelas (TIADA SEMUA KELAS) + Carian Murid */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <select
                  id="filter-kelas-senarai-murid"
                  className="neo-btn filter-select"
                  style={{
                    padding: "0 28px 0 10px",
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    border: "2px solid var(--color-dark, #10182f)",
                    backgroundColor: "#f8fafc",
                    color: "var(--color-dark, #10182f)",
                    cursor: "pointer",
                    margin: 0,
                    height: "38px",
                    boxSizing: "border-box",
                  }}
                  onChange={(e) => {
                    if (typeof (window as any).tukarKelasAktif === "function") {
                      (window as any).tukarKelasAktif(e.target.value);
                    }
                  }}
                  title="Pilih Kelas"
                >
                  {/* Populated dynamically by kemaskiniSemuaDropdownKelas (NO Semua Kelas) */}
                </select>

                {/* Carian Murid */}
                <div
                  style={{
                    position: "relative",
                    minWidth: "160px",
                  }}
                >
                  <i
                    className="fa-solid fa-magnifying-glass"
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                      fontSize: "0.82rem",
                    }}
                  ></i>
                  <input
                    type="text"
                    id="carian-murid-urus"
                    className="neo-input"
                    placeholder="Cari nama murid..."
                    style={{
                      width: "100%",
                      paddingLeft: "30px",
                      paddingRight: "10px",
                      fontSize: "0.85rem",
                      height: "38px",
                      borderRadius: "10px",
                      border: "2px solid var(--color-dark, #10182f)",
                      boxSizing: "border-box",
                      margin: 0,
                    }}"""

if old_kad3_filter in content:
    content = content.replace(old_kad3_filter, new_kad3_filter, 1)
    print("Updated Kad 3 filter and search alignment.")
else:
    print("Warning: old_kad3_filter not found in App.tsx")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved src/App.tsx")
