# Laporan Penambahbaikan Jadual Affiliate & WhatsApp

1. Kolum WhatsApp dipindahkan ke Tindakan
2. Butang salin link ikon sahaja dan sebaris kod
3. Butang gantung dan padam ikon sahaja
4. Popup modal in-app confirm padam
5. Templat WhatsApp dengan pautan affiliate

---

# Laporan Audit Supabase & Penambahbaikan Sistem Bunyi Kata

## 1. Audit Jadual SQL Supabase (Melalui MCP)

Pemeriksaan penuh telah dijalankan secara langsung ke atas pangkalan data Supabase (`ngugkvoahpaymhdtzxtn`):

| Jadual | Status & Struktur | Catatan |
|---|---|---|
| `public.profiles` | Sempurna & Dikemaskini | Kolum `email`, `langganan`, `tarikh_tamat`, `no_telefon`, `nama_sekolah` lengkap dengan RLS policy update/delete. |
| `public.classes` | Sempurna & Dikemaskini | Kolum `kod_kelas`, `nama_kelas`, `nama_sekolah`, `nama_guru`, `guru_id`, `bilangan_murid`. Relasi `guru_id` merujuk `profiles(id)`. |
| `public.families` | Sempurna & Dikemaskini | Kolum `kod_keluarga`, `nama_keluarga`, `ibu_bapa_id`. Relasi `ibu_bapa_id` merujuk `profiles(id)`. |
| `public.students` | Sempurna | Kolum `kelas_id`, `keluarga_id`, `nama`, `avatar`. |
| `public.activity_scores` | Sempurna | Mengesan aktiviti latihan/belajar murid secara langsung. |
| `public.badges` & `certificates` | Sempurna | Rekod pencapaian dan sijil murid. |
| `supabase_realtime` | Diaktifkan untuk kesemua 8 jadual | Membolehkan kemas kini data secara *realtime*. |

---

## 2. Penyelesaian Masalah Info Modal Admin (Guru & Ibu Bapa)

# Ringkasan Penambahbaikan & Pembaikan Bug (Mod Guru & Mod Admin)

Semua 5 isu dan maklum balas daripada rakaman audio dan tangkap layar pengguna telah berjaya diselesaikan sepenuhnya.

---

## 1. Isu & Tindakan Pembaikan

### 📌 1. Banner Dashboard Guru Papar `Kod Kelas: -` Selepas Refresh (Audio 1)
- **Punca:** Elemen `#guru-dashboard-kod-kelas-title` tidak dikemas kini oleh fungsi `window.kemaskiniSemuaDropdownKelas()` apabila halaman dimuatkan semula atau ditukar kelas aktif.
- **Tindakan:**
  - Dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js), fungsi `window.kemaskiniSemuaDropdownKelas()` kini mengemas kini `#guru-dashboard-kod-kelas-title` dengan `window.getKodBagiKelas(active) || localStorage.getItem('bunyiKataKodKelas') || '-'`.
  - Mengemas kini tajuk sekolah dan nama guru secara serentak agar paparan sentiasa segar dan konsisten.
  - Memastikan [src/App.tsx](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/App.tsx) memaparkan kod kelas semasa secara reaktif dari storan tempatan.

### 📌 2. Kebocoran Sesi Melalui Kod Contoh `KELAS#01` (Audio 1)
- **Punca:** Skrin "Masukkan Kod" mempunyai logik sandaran (*fallback*) `localStorage.getItem("bunyiKataKodKelas") || "KELAS#01"` dan kod demo `KELAS123` / `KELUARGA123`. Sesiapa yang memasukkan kod contoh `KELAS#01` secara automatik log masuk ke akaun guru pengguna tempatan.
- **Tindakan:**
  - Membuang semua kod lalai / *fallback* statik (`KELAS#01`, `FAM@2026`, `KELAS123`, `KELUARGA123`) dalam [src/App.tsx](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/App.tsx) dan [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js).
  - Pengesahan kod kini wajib disahkan secara teliti terhadap pangkalan data Supabase (`getClassByCode` dan `getFamilyByCode`) tanpa kebocoran sesi tempatan.

### 📌 3. Butang "Simpan Kod" di Skrin Urus Murid Guru (Audio 1)
- **Punca:** Butang sebelum ini mempunyai teks `<span>Simpan Kod</span>` yang mengambil ruang berlebihan dan tidak selaras dengan butang ikon lain.
- **Tindakan:**
  - Dalam [src/App.tsx](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/App.tsx) (`#guru-urus-murid`), butang disimpan sebagai butang ikon petak sahaja:
    - Saiz: `40px × 40px`, `padding: 0`.
    - Ikon: `<i className="fa-solid fa-floppy-disk"></i>` tanpa teks `<span>Simpan Kod</span>`.
    - Reka bentuk neo-brutalist yang kemas dan selari dengan butang bersebelahan.

### 📌 4. Kad Statistik "BILANGAN ANAK" di Dashboard Admin (Audio 2)
- **Punca:** Line 4620 dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js) menetapkan nilai `admin-jumlah-anak` kepada `totalStudents` (murid sekolah), menyebabkan bilangan anak menunjukkan angka walaupun tiada akaun ibu bapa berdaftar.
- **Tindakan:**
  - Dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js), nilai kad `admin-jumlah-anak` dikira terus daripada jumlah anak yang dimiliki oleh akaun ibu bapa (`currentParents.reduce((sum, p) => sum + (Number(p.anak) || 0), 0)`).
  - Dalam [src/services/supabaseService.ts](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/services/supabaseService.ts), fungsi `fetchAdminDataFromSupabase` kini turut mengemas kini kad `admin-jumlah-anak` secara langsung dari data Supabase.

### 📌 5. Dropdown "JENIS LANGGANAN" & Modal Pengesahan Tersuai (Audio 2)
- **Punca:**
  - Teks pelan langganan seperti `1 Bulan (Biasa)` turun ke baris kedua kerana kelebaran kotak select terlalu sempit dan tiada `white-space: nowrap`.
  - Penukaran langganan menggunakan dialog pelayar asli (`confirm()` & `alert()`) yang kurang kemas dan tidak sepadan dengan reka bentuk aplikasi.
- **Tindakan:**
  - Menetapkan `white-space: nowrap`, `min-width: 145px`, dan kelebaran lajur `min-width: 155px` pada semua jadual langganan (Guru & Ibu Bapa) dalam kedua-dua mod Dashboard dan Pengurusan Admin.
  - Menggantikan `confirm()` dan `alert()` dengan modal aplikasi tema Bunyi Kata (`window.showAppModalConfirm` dan `window.showAppModalAlert`).

---

## 2. Pengesahan & Ujian
- `node --check public/app-logic.js` — **Lulus (Tiada ralat sintaks)**.
- `npx tsc --noEmit` — **Lulus (Tiada ralat TypeScript)**.

---

## 3. Sistem Pengewangan & Kawalan Akses (Monetization & Access Control)

### Alur Mula (Entry Choice Modal):
- Menekan **MULA KEMBARA** membuka modal pilihan:
  1. **Ada Kod Kelas / Keluarga (PRO)**: Membuka input kod untuk akses penuh.
  2. **Cuba Percuma (PERCUMA)**: Terus membuka Peta 1 (Asas Bunyi Kata).

### Kawalan Peta & Lencana Versi Pro:
- Pengguna percuma (Trial) boleh meneroka **Peta 1 (Asas Bunyi Kata)** secara percuma.
- **Peta 2, 3, dan 4** dipaparkan dengan lencana merah **Versi Pro** berserta ikon mangga (lock). Menekan peta berkenaan akan mencetuskan modal paparan pakej langganan.

### Pakej Langganan:
- **Pakej Guru**:
  - *Bulanan Biasa (RM15/bln)*: 1 Kelas (maksimum 40 murid).
  - *Bulanan Pro (RM30/bln)*: 2 Kelas (maksimum 80 murid).
  - *Tahunan Pro (RM69/thn)*: 2 Kelas (365 hari, penjimatan maksimum).
- **Pakej Ibu Bapa**:
  - *Bulanan Biasa (RM15/bln)*: 1 Profil Anak.
  - *Bulanan Pro (RM30/bln)*: Sehingga 3 Orang Anak.
  - *Tahunan Pro (RM69/thn)*: Sehingga 3 Orang Anak (365 hari, penjimatan maksimum).

## 4. Mod Cuba Percuma (Tetamu) - Reset Bersih & Perlindungan Pangkalan Data

### Keperluan Pengguna:
1. Pengguna mod cuba percuma / tetamu tidak boleh menyimpan sebarang markah atau rekod ke dalam pangkalan data Supabase.
2. Setiap kali login / masuk mod cuba percuma, semua status aktiviti mesti direset sepenuhnya daripada kosong (0 aktiviti selesai, 0 markah, 0 bintang, 0 lencana, 0 bar indikator hijau pada kad huruf).
3. Peta 1: Modul "Kenali Huruf" dan "Vokal & Konsonan" **dibuka siap-siap (unlocked)** untuk boleh ditekan, namun **TIDAK ditandakan selesai (`completed-level`) secara automatik**.
4. Tiada aktiviti dikesan selesai secara automatik atau tiba-tiba.

### Pelaksanaan & Pembaikan:
- **Peta 1 (Kenali Huruf & Vokal Konsonan Dibuka Siap-Siap)**:
  - Pada `public/app-logic.js` (`bukaPeta`):
    - Ditetapkan bahawa bagi `window.currentPeta === 1`, modul `moduleIndex === 0` (Kenali Huruf) dan `moduleIndex === 1` (Vokal & Konsonan) sentiasa **`isLocked = false`** (dibuka siap-siap untuk boleh diakses terus).
    - Menyahgandingkan (*decouple*) status `isLocked` dan `completedClass`: sesuatu modul dalam mod belajar hanya diberi kelas `completed-level` sekiranya ia telah disiapkan secara eksplisit oleh murid (`window.completedBelajarModules[modul.id]`), dan bukan secara automatik hanya kerana ia dibuka.
- **Pembersihan Bar Indikator Hijau & Tanda Selesai Aktiviti Huruf / Fonik**:
  - Punca sebelum ini: Kad huruf `a`, `b`, `c`, `h` memaparkan tanda semak (*check*), bintang oren, dan palang indikator hijau kerana fail `src/components/FonikAbcGame.tsx` dan `NomborGame.tsx` menggunakan kunci storan global `bunyikata_huruf_progress_v2`, `bunyikata_vokal_progress_v2`, dan `bunyikata_phonics_progress_v2` yang mengandungi sisa data ujian lama di pelayar.
  - Tindakan:
    1. Ditambah fungsi `getPhonicsStorageKey` dan `getNomborStorageKey` yang mengasingkan simpanan kemajuan mengikut nama murid (`_namaMurid`), dan bagi mod percuma (`trial` / `Tetamu`), kemajuan diasingkan kepada sesi tetamu dan sentiasa direset kepada 6 palang kelabu/kosong (`[false, false, false, false, false, false]`).
    2. Pada fungsi `purgeLegacyMockData` dan `window.resetTrialGuestProgress`, semua kunci legasi `bunyikata_huruf_*`, `bunyikata_vokal_*`, `bunyikata_phonics_*`, `bunyikata_nombor_*`, `bunyikata_siri_*`, `bunyikata_tambah_*`, `bunyikata_tolak_*`, `bunyikata_math_*`, `puzzle_completed_*`, dan `cantum_completed_*` dipadam sepenuhnya daripada storan lokal.
    3. Apabila skrin Fonik ABC dibuka dalam mod percuma, ia secara automatik memuatkan rekod kosong bersih tanpa sebarang palang hijau atau lencana selesai.
- **Perlindungan Pangkalan Data (Zero-Database Guard)**:
  - `src/services/supabaseService.ts`: Menambah semakan ketat pada `syncStudentToSupabase`, `recordStudentActivity`, `recordStudentBadge`, dan `saveCertificate`. Sekiranya pengguna berada dalam mod `trial` atau `isGuestMode`, sistem tidak akan membuat sebarang panggilan ke jadual Supabase.
  - `public/app-logic.js`: `saveStudentData` dan `logProgress` disekat daripada memanggil penyegerakan Supabase untuk pengguna `trial` atau berstatus `'Tetamu'`.

---

## 6. Kemas Kini Peta 1, Reka Bentuk Pakej Pro & Tipografi Tajuk Utama

### Keperluan Pengguna (Berdasarkan 3 Audio & Gambar Terbaharu):
1. **Peta 1 (Fonik ABC Di-Unlock)**: Kad modul **Fonik ABC** (indeks 2) pada Peta 1 (Misi Asas Bunyi Kata) mesti dibuka siap-siap (*unlocked* dari awal) bersama-sama modul Kenali Huruf dan Vokal & Konsonan.
2. **Penyeragaman Modal Pakej Pro**:
   - Menghapuskan kekeliruan dua paparan pakej pro berbeza.
   - Menggunakan reka bentuk paparan Pakej Pro Bunyi Kata yang terdapat pada skrin Pilih Mod / Log Masuk (mempunyai animasi, *shine sweep*, jalur pemasa kira detik, diskaun coret harga, dan seksyen Soalan Lazim/FAQ).
   - Mengemaskini butiran senarai faedah pakej terkini mengikut pelan strategi:
     - **Pakej Guru**: Bulanan Biasa (RM15/bln - 1 Kelas), Bulanan Pro (RM30/bln - 2 Kelas, Popular 🔥), Tahunan Pro (RM69/thn - 2 Kelas 365 Hari, Paling Jimat ⭐).
     - **Pakej Ibu Bapa**: Bulanan Biasa (RM15/bln - 1 Profil Anak), Bulanan Pro (RM30/bln - 3 Profil Anak, Popular 🔥), Tahunan Pro (RM69/thn - 3 Profil Anak 365 Hari, Paling Jimat ⭐).
   - Memastikan saiz modal lebih kompak (maksimum `840px`), mesra paparan telefon pintar (*mobile responsive*), dan tidak terlalu besar.
3. **Pengurangan Kesan Blur**:
   - Mengurangkan kepekatan kabur (*blur effect*) pada kad peta dan butang "Versi Pro" daripada `blur(2px)` kepada `blur(0.8px)` dan ketelusan gelap dikurangkan kepada `0.40` supaya ilustrasi peta di belakang kekal jelas dan sedap dipandang.
4. **Penyelarasan Huruf Tajuk Utama (*Title Case*)**:
   - Memastikan semua tajuk utama hanya menggunakan huruf besar pada huruf pertama setiap perkataan sahaja (bukan SEMUA HURUF BESAR).
   - Contoh: `Pilih Peta Kembara`, `Pilih Peta Latihan`, `Misi Asas Bunyi Kata`, `Cabaran Asas Bunyi Kata`, `Misi Suku Kata Asas`, dsb.

### Status Pengesahan & Ujian:
- **TypeScript**: `npx tsc --noEmit` -> **0 ralat**.
- **Production Build**: `npm run build` -> **Berjaya (Exit code 0)**.

---

## 7. Kemas Kini Avatar Selector, Pengurangan Kegelapan & Label Versi Pro pada Profil

### Keperluan Pengguna (Berdasarkan 4 Audio & 3 Gambar):
1. **Audio 1 (Keluaran Popup Pakej Pro Apabila Klik Avatar / Butang Versi Pro)**:
   - Pada pemilih avatar skrin log masuk, apabila murid menekan avatar yang mempunyai lencana mangga "Versi Pro" atau menekan butang "MULA" ketika watak terkunci dipilih:
   - Sistem kini terus membuka modal **Pakej Pro Bunyi Kata** (`openPakejProModal('guru')`) tanpa sebarang `alert` teks biasa yang membosankan.
2. **Audio 2 (Kurangkan Kegelapan Avatar Pro pada Skrin Log Masuk)**:
   - Mengurangkan kegelapan latar belakang kad avatar terkunci daripada hitam pekat (`#1e293b` / `#111827`) kepada warna lutsinar lembut (`rgba(30, 41, 59, 0.45)`).
   - Meningkatkan kecerahan dan kejelasan watak daripada `brightness(20%) opacity(0.35)` kepada `brightness(75%) opacity(0.75)` supaya seni watak di belakang ikon mangga kelihatan jelas dan menarik.
3. **Audio 3 (Pembuangan Tag POPULAR dan PALING JIMAT pada Pakej Pro)**:
   - Membuang tag `POPULAR 🔥` daripada kad Bulanan Pro.
   - Membuang tag `PALING JIMAT ⭐` dan pelekat `Lebih Jimat` daripada kad Tahunan Pro.
   - Memastikan susun atur tajuk dan pengenalan kad pakej kemas, bersih, dan mematuhi reka bentuk pilihan pengguna.
4. **Audio 4 (Label "Versi Pro" pada Modal Edit Profil & Avatar bagi Mod Percuma)**:
   - Pada modal **Edit Profil & Avatar** (`modal-pilih-avatar`):
     - Bagi pengguna/murid dalam mod percuma (`cuba percuma` / `trial` / `Tetamu`), watak-watak berbayar (Lelaki 2, Perempuan 1, Hero 1, Hero 2) kini secara jelas memaparkan ikon mangga dan **lencana merah "Versi Pro"**.
     - Apabila murid menekan watak Versi Pro tersebut dalam mod percuma, ia secara automatik membuka modal **Pakej Pro Bunyi Kata** untuk memberi galakan langganan.
     - Hanya selepas pengguna melanggan Versi Pro, watak-watak tersebut akan beralih kepada mod tuntutan bintang (`20 ⭐`, `40 ⭐`, `60 ⭐`) seperti biasa.

### Status Pengesahan & Ujian:
- **TypeScript**: `npx tsc --noEmit` -> **0 ralat**.
- **Production Build**: `npm run build` -> **Berjaya 100% (Exit code 0)**.

---

## 8. Peralihan 100% ke Firebase Realtime Database & Pemadaman Penuh Firestore

### Ringkasan Tindakan & Penyelesaian:
1. **Pemadaman Penuh Pangkalan Data Firestore di Firebase Cloud**:
   - Pangkalan data Firestore `(default)` di Firebase Cloud projek `bunyi-kata-official` telah dipadam sepenuhnya melalui Firebase Admin API (`firestore_delete_database`).
   - Tiada sebarang koleksi atau pangkalan data Firestore yang aktif lagi pada projek Firebase.

2. **Pembersihan Fail Kod Sumber Firestore Tempatan**:
   - Fail `firestore.rules` dan `firestore.indexes.json` telah dipadam dari projek.
   - Fail `firebase.json` telah dikemaskini dengan membuang konfigurasi Firestore dan mengarahkan peraturan pangkalan data ke `database.rules.json`.
   - Sebarang rujukan import modul `firebase/firestore` telah digantikan 100% dengan `firebase/database`.

3. **Penyediaan Firebase Realtime Database (RTDB)**:
   - Fail `database.rules.json` dikonfigurasi untuk pangkalan data Realtime Database.
   - `src/lib/firebase.ts`, `src/services/authService.ts`, dan `src/services/firebaseService.ts` beroperasi sepenuhnya dengan Realtime Database secara realtime.
4. **Penguatkuasaan 1 Emel Hanya 1 Pendaftaran (Guru vs Ibu Bapa)**:
   - Emel yang didaftarkan dalam Mod Guru tidak boleh didaftarkan semula dalam Mod Ibu Bapa, dan sebaliknya.
   - Semakan silang dilakukan pada peringkat pangkalan data (`profiles`), Firebase Authentication (`auth/email-already-in-use`), dan pra-semakan antaramuka klien sebelum borang dihantar dengan mesej amaran jelas.
   - Sesi log masuk kini secara automatik mengekalkan peranan pendaftaran asal pengguna (`user.peranan`).

---

## 9. Penambahbaikan Mod Affiliate: Akses Penuh (Versi Pro) Tanpa Rekod Database & Pembaikan Navigasi

### Keperluan Pengguna:
1. **Akses Penuh Mod Affiliate**:
   - Mod Affiliate mesti mendapat akses penuh kepada semua kandungan pembelajaran (Peta 1, 2, 3, 4), semua permainan, suku kata, dan aktiviti interaktif sama seperti akaun berbayar / Mod Guru / Mod Ibu Bapa.
   - Tetapi sebarang aktiviti dalam mod ini **TIDAK** direkodkan ke dalam pangkalan data (Firebase Realtime Database) untuk bintang, skor, lencana, sijil, atau rekod murid.
2. **Pembaikan Pertindihan Navigasi (Top Nav & Student Nav)**:
   - Navigasi murid (`[ i ] [ Profil ] [ Lencana ] [ Kedudukan ] [ Keluar ]`) tidak boleh muncul di belakang atau bertindih dengan bar navigasi affiliate (`[ Affiliate ] [ Rujukan ] [ Kod ] [ Akses ] [ Keluar ]`).
   - Paparan Mod Affiliate mesti bersih dan konsisten dengan Mod Guru dan Mod Ibu Bapa: banner atas ungu bertulis `[ 🏢 MOD AFFILIATE ]` dan bar navigasi lekat affiliate sahaja.

### Tindakan Pembaikan:
1. **Akses Penuh untuk Mod Affiliate**:
   - Dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js):
     - `window.isEffectiveTrial` dan `window.checkIsTrial()` mengembalikan `false` (bukan trial / akses Pro penuh) apabila mod affiliate aktif (`modAffiliateAktif` / `role === 'affiliate'`).
     - `bukaModalAksesGuru()` menetapkan tahap akses ke `pro` dan `bunyiKataAccessLevel = 'pro'` apabila affiliate membuka skrin menu utama atau latihan.
     - `renderLatihanLocks()` membuka kunci kesemua modul latihan (`latihanSequence.length`) untuk mod affiliate.
   - Dalam [src/App.tsx](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/App.tsx):
     - Memperkenalkan pembolehubah `isAffiliateRole` yang menganggap pelan affiliate sebagai pelan berbayar penuh (`isPaidPlan = true`, `efektifTrialState = false`).
     - Menambah pendengar acara `affiliate-mode-change` dalam `useEffect` supaya status akses segera disegerakkan ke seluruh aplikasi.
2. **Penyekatan Simpanan ke Pangkalan Data & Storan Murid**:
   - Dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js):
     - `saveStudentData()` mengembalikan nilai serta-merta tanpa menyimpan atau menyegerakkan sebarang data ke Firebase apabila mod affiliate aktif.
     - `logProgress()` dan `window.tambahBintangGlobal()` menyekat sebarang penambahan bintang atau aktiviti apabila mod affiliate aktif.
   - Dalam [src/services/firebaseService.ts](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/services/firebaseService.ts):
     - Menambah pembantu `isAffiliateActiveSession()`.
     - Melindungi fungsi `syncStudentToFirebase`, `saveScoreToFirebase`, `recordStudentBadge`, dan `saveCertificate` dengan sekatan awal jika mod affiliate dikesan.
3. **Penyelesaian Pertindihan Navigasi Murid (CSS & JS)**:
   - Dalam [public/styles.css](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/styles.css) dan [src/index.css](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/index.css):
     - Menambah sekatan spesifik `body:not(.affiliate-mode):has(#main-menu-screen.active) #student-global-nav` supaya nav murid tidak diaktifkan.
     - Menambah peraturan tegas `body.affiliate-mode #student-global-nav, body.affiliate-mode #student-global-nav * { display: none !important; visibility: hidden !important; pointer-events: none !important; }`.
     - Memastikan padding atas pada skrin menu dan papan pemuka affiliate teratur dengan kemas tanpa bertindih.
   - Dalam [public/app-logic.js](file:///c:/Users/User/Desktop/bunyi-kata-offcial/public/app-logic.js):
     - Fungsi `paparSkrin()` memastikan `sNav.style.display = 'none'` setiap kali paparan beralih dalam mod affiliate.

### Pengesahan & Ujian:
- `npx tsc --noEmit` — **Lulus (0 ralat TypeScript)**.

---

## 10. Kemas Kini Landing Page: Gambar "Rupa Dalam Aplikasi" & Gambar Dashboard "Maklumat Ikut Mod"

### Keperluan Pengguna:
1. **Rupa Dalam Aplikasi (Landing Page)**:
   - Gantikan gambar pratonton dengan kesemua 10 tangkap layar sebenar dalam aplikasi dari folder `public/images/preview/rupa-dalam-aplikasi/`.
   - Nama kapsyen mengikut nama fail tangkap layar dalam subfolder berkenaan.
   - Kekalkan senarai kad sebelah kanan untuk paparan laptop (`Misi Kenal Huruf`, `Misi Suku Kata Asas`, `Misi Suku Kata Hero`, `Misi Bacaan Bergred`, `Fonik ABC`) tanpa dipanjangkan berlebihan.
2. **Maklumat Ikut Mod (Mod Guru, Mod Ibu Bapa, Mod Affiliate)**:
   - Gantikan latar belakang kad mod dengan tangkap layar papan pemuka sebenar dari folder `public/images/preview/`:
     - **Mod Guru**: `preview-dashboard-guru.png`
     - **Mod Ibu Bapa**: `preview-dashboard-ibubapa.png`
     - **Mod Affiliate**: `preview-dashboard-affiliate.png`
3. **Skop Terhad**:
   - Perubahan hanya diaplikasikan pada Landing Page (`src/components/screens/LandingScreen.tsx`).

### Tindakan Pembaikan:
- Di [src/components/screens/LandingScreen.tsx](file:///c:/Users/User/Desktop/bunyi-kata-offcial/src/components/screens/LandingScreen.tsx):
  - Mengemas kini array `mods` dengan imej papan pemuka sebenar bagi setiap mod.
  - Memasukkan 10 gambar `appPreviews` dari `public/images/preview/rupa-dalam-aplikasi/` dengan kapsyen padanan:
    1. `Misi Asas Bunyi Kata` (`misi-asas-bunyi-kata.png`)
    2. `Misi Suku Kata Asas` (`misi-suku-kata-asas.png`)
    3. `Misi Suku Kata Hero` (`misi-suku-kata-hero.png`)
    4. `Misi Bacaan Bergred` (`misi-bacaan-bergred.png`)
    5. `Cuba Sebut` (`cuba-sebut.png`)
    6. `Kad Imbasan` (`kad-imbasan.png`)
    7. `Tanduk Kata` (`tanduk-kata.png`)
    8. `Puzzle` (`puzzle.png`)
    9. `Rak Buku` (`rak-buku.png`)
    10. `Pencapaian` (`pencapian.png`)
  - Mengasingkan senarai kad paparan komputer riba (`appPreviewFeatures`) untuk mengekalkan 5 senarai kad asal yang padat di sebelah kanan.

### Status Ujian:
- `npx tsc --noEmit` — **0 ralat (Lulus Bersih)**.
- Dev server Vite menyegerakkan HMR secara langsung di `http://localhost:3000`.
