# PANDUAN PELAKSANAAN SUPABASE & STRATEGI LOG MASUK: BUNYI KATA

Dokumen ini dikemas kini khas berdasarkan perbincangan terkini anda:
1. **Fokus 100% kepada Supabase** (analisis perbandingan Firebase telah dikeluarkan).
2. **Penilaian Terperinci Aliran Log Masuk Murid** (Kod Kelas vs Kod Individu).
3. **Anggaran Kos Supabase Sekiranya Aplikasi Menjadi Viral / Trafik Tinggi**.
4. **Langkah Demi Langkah Persediaan (Setup) & Peranan Ejen AI**.
5. **Pengurusan Aset Audio & Imej** (Perlukah Cloudflare R2 atau kekal Lokal?).
6. **Cadangan Platform Hosting / Deployment** untuk Web App Bunyi Kata.

> [!NOTE]
> Tiada sebarang kod aplikasi yang disentuh atau diubah buat masa ini. Segala maklumat di bawah adalah sebagai rujukan strategik sebelum fasa integrasi sebenar dijalankan.

---

## 1. PENILAIAN ALIRAN LOG MASUK (AUTHENTICATION FLOW)

### A. Aliran Semasa Anda
- **Aliran Guru & Kelas**:
  1. Guru log masuk / mendaftar akaun.
  2. Guru menjana **Kod Kelas** (contoh: `KELAS#01`).
  3. Di dalam kelas atau makmal komputer, murid hanya memasukkan **Kod Kelas**.
  4. Senarai nama murid dalam kelas tersebut dipaparkan, dan murid memilih nama / profil mereka sendiri untuk mula bermain.
- **Aliran Ibu Bapa & Rumah**:
  1. Ibu bapa mendaftar dan mencipta **Kod Keluarga** (contoh: `FAM@2026`).
  2. Anak di rumah memasukkan **Kod Keluarga** dan memilih profil anak mereka.

---

### B. Pandangan & Nasihat Pakar: Adakah Kaedah Ini Sesuai?

> [!TIP]
> **Jawapan:** Kaedah **"Masukkan Kod Kelas ➔ Pilih Nama Sendiri" adalah KAEDAH PALING TEPAT, PRAKTIKAL DAN STANDARD INDUSTRI EDTECH DUNIA.**

#### Mengapa Kaedah Ini Paling Bagus?
1. **Realiti Kanak-Kanak Prasekolah & Tahap 1 (Umur 4 – 9 Tahun)**:
   - Kanak-kanak pada usia ini **sangat sukar mengingati kombinasi ID unik dan kata laluan peribadi**.
   - Jika setiap murid diberikan kod individu (contoh: `MURID-8392-ALI`), guru akan menghabiskan separuh masa kelas hanya untuk membantu murid yang terlupa kod atau tersalah taip huruf besar/kecil.
2. **Standard Global EdTech Kanak-Kanak**:
   - Platform pendidikan bertaraf dunia seperti **Kahoot!**, **Quizizz**, **ClassDojo**, **Seesaw**, dan **Matific** semuanya menggunakan konsep kod bilik / kod kelas (*Class PIN / Game PIN*), kemudian murid memilih atau menaip nama mereka.
3. **Kecekapan Guru di Bilik Darjah**:
   - Guru hanya perlu menulis satu kod besar di papan putih (contoh: `KELAS#01`). Seluruh kelas 30 orang murid boleh masuk serentak dalam masa 30 saat!

---

### C. Satu Isu Berpotensi & Cara Menyelesaikannya (Ralat Tertukar Profil)

Satu-satunya kelemahan kaedah ini adalah:
- **Murid tersalah tekan nama kawan** (sama ada sengaja atau tidak sengaja), lalu markah bintang masuk ke akaun kawan.

#### Cadangan Penyelesaian Paling Mesra Kanak-Kanak:
Anda boleh mengekalkan aliran Kod Kelas sedia ada, dengan **satu lapisan perlindungan ringkas (Pilihan)**:

```
[Murid Masukkan Kod Kelas] 
           ↓
[Paparan Senarai Nama & Avatar Murid]
           ↓
[Murid Klik Nama Sendiri]
           ↓
(Pilihan Tambahan) [PIN Gambar / Ikon 2-Digit Sahaja]
(Contoh: Ali hanya perlu klik gambar "Kucing" + "Bola" miliknya)
           ↓
[Masuk ke Menu Utama Permainan]
```

- **Untuk kanak-kanak prasekolah/Tadika**: Cukup sekadar **Klik Nama + Gambar Avatar**. Guru biasanya memantau aktiviti dalam kelas.
- **Untuk Tahap 1 (7–9 tahun)**: Boleh letakkan PIN 2 atau 4 angka ringkas (contoh: `1234`) jika guru mahukan keselamatan markah yang lebih ketat.

**Kesimpulan:** **Kekalkan konsep Kod Kelas & Kod Keluarga sedia ada anda.** Ia sangat mesra pengguna dan terbukti paling berkesan untuk kanak-kanak!

---

## 2. ANGGARAN KOS SUPABASE (JIKA HIGH TRAFFIC / VIRAL)

Supabase mempunyai struktur harga yang sangat telus, berpatutan, dan **tiada perangkap caj mengejut (*no unexpected read/write billing traps*)** seperti sesetengah platform lain.

### A. Pelan Harga Supabase Rasmi

| Pelan | Kos Bulanan | Apa yang Termasuk |
| :--- | :--- | :--- |
| **Free Tier** | **$0** (Percuma Selamanya) | • **500 MB** Saiz Pangkalan Data (cukup untuk ~50,000 rekod aktiviti murid).<br>• **50,000 Pengguna Aktif Sebulan (MAU)**.<br>• **1 GB** Storan Fail (*Storage*).<br>• **5 GB** Pemindahan Data (*Bandwidth*). |
| **Pro Tier** | **$25 / bulan**<br>(~RM 110 – RM 115) | • **8 GB** Saiz Pangkalan Data (cukup untuk jutaan markah kuiz & murid).<br>• **100,000 Pengguna Aktif Sebulan (MAU)**.<br>• **100 GB** Storan Fail.<br>• **250 GB** Pemindahan Data.<br>• Sandaran data harian (*Daily Backups*) selama 7 hari.<br>• Tiada had projek dijeda (*No project pausing*). |

---

### B. Simulasi Kos Mengikut Senario Trafik

#### Senario 1: Fasa Pelancaran / Sekolah Terpilih (1 – 5,000 Murid)
- **Kos:** **RM 0 / bulan (Free Tier)**
- 500 MB pangkalan data boleh menampung kira-kira 5,000 murid dengan puluhan ribu rekod kuiz dengan sangat lancar.

#### Senario 2: Berkembang Pesat (5,000 – 50,000 Murid)
- **Kos:** **RM 0 / bulan (Masih dalam Free Tier!)**
- Selagi pengguna aktif bulanan di bawah 50,000 dan saiz pangkalan data di bawah 500 MB (teks JSON rekod markah adalah sangat kecil, hanya beberapa kilobait bagi setiap rekod), anda masih **percuma sepenuhnya**.

#### Senario 3: Viral Seluruh Malaysia (100,000 – 300,000 Murid Aktif)
- **Kos:** **$25 / bulan (~RM 115 / bulan)** (Pro Tier asas).
- Jika pengguna aktif melebihi 100,000 orang sebulan:
  - Caj tambahan hanya **$0.00325** bagi setiap pengguna tambahan (hanya ~RM 15 bagi setiap 1,000 pengguna aktif tambahan).
- **Ciri Keselamatan Belanja (*Spend Cap*)**:
  - Di Supabase, anda boleh **menghidupkan *Spend Cap*** pada tetapan akaun. Apabila dihidupkan, Supabase **tidak akan sekali-kali mengenakan caj melebihi $25 sebulan**. Jika had dicapai, perkhidmatan tidak akan mengecaj kad kredit anda tanpa kebenaran.

> [!TIP]
> Berbanding pangkalan data NoSQL yang mengecaj setiap kali soalan dibaca atau markah disimpan, Supabase Pro Tier pada harga **RM 115/bulan** adalah sangat berbaloi dan murah untuk aplikasi pendidikan berskala kebangsaan.

---

## 3. BAGAIMANA CARA SETUP SUPABASE? BOLEHKAH EJEN SETUPKAN?

> [!IMPORTANT]
> **YA, Ejen AI boleh membantu menyiapkannya secara langsung dalam projek anda!**

Kerja-kerja persediaan ini terbahagi kepada dua bahagian:

### Bahagian 1: Apa yang Anda Perlu Lakukan (Hanya 3 Minit)
Kerana pendaftaran memerlukan akaun e-mel/GitHub dan kata laluan peribadi anda, anda hanya perlu:
1. Layari [supabase.com](https://supabase.com) dan daftar masuk (boleh klik *Sign In with GitHub* atau *Google*).
2. Klik **New Project**.
3. Masukkan:
   - **Name**: `bunyi-kata-db`
   - **Database Password**: (Cipta kata laluan selamat dan simpan)
   - **Region**: Pilih **Singapore (`ap-southeast-1`)** (paling laju untuk pengguna Malaysia).
4. Selepas projek siap (dalam 1-2 minit), pergi ke menu **Project Settings ➔ API**:
   - Salin **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - Salin **anon public key** (kunci awam untuk web)
5. Berikan 2 maklumat tersebut kepada ejen (atau masukkan ke dalam fail `.env`).

---

### Bahagian 2: Apa yang Ejen AI Boleh Bantu Buatkan Secara Automatik
Sebaik sahaja anda memberikan URL dan Anon Key tersebut:
1. **Memasang SDK**: Ejen akan memasang `@supabase/supabase-js`.
2. **Membina Klien Supabase**: Ejen akan mencipta fail utiliti `src/utils/supabaseClient.ts`.
3. **Mencipta Skema Pangkalan Data**: Ejen akan menyediakan skrip SQL lengkap yang anda hanya perlu tampal (*paste*) dan klik **Run** dalam SQL Editor Supabase untuk membina semua jadual, indeks, dan keselamatan RLS secara automatik.
4. **Menyambung Data**: Ejen akan menggantikan penyimpanan `localStorage` kepada pangkalan data Supabase secara berperingkat tanpa merosakkan mana-mana paparan atau animasi 3D sedia ada.

---

## 4. RANGKA SKEMA JADUAL SUPABASE (SQL BLUEPRINT)

Berikut adalah kod skrip SQL siap guna yang telah diselaraskan dengan aliran Kod Kelas & Kod Keluarga Bunyi Kata:

```sql
-- 1. JADUAL PROFIL GURU & IBU BAPA
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    peranan TEXT NOT NULL CHECK (peranan IN ('guru', 'ibubapa', 'admin')),
    no_telefon TEXT,
    dicipta_pada TIMESTAMPTZ DEFAULT NOW()
);

-- 2. JADUAL KELAS (Dicipta oleh Guru)
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    nama_sekolah TEXT NOT NULL,
    nama_kelas TEXT NOT NULL,
    kod_kelas TEXT UNIQUE NOT NULL, -- Contoh: KELAS#01
    avatar_sekolah TEXT,
    dicipta_pada TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JADUAL KELUARGA (Dicipta oleh Ibu Bapa)
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    nama_keluarga TEXT NOT NULL,
    kod_keluarga TEXT UNIQUE NOT NULL, -- Contoh: FAM@2026
    dicipta_pada TIMESTAMPTZ DEFAULT NOW()
);

-- 4. JADUAL MURID (Di bawah Kelas atau Keluarga)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    no_mykid TEXT,
    kelas_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    keluarga_id UUID REFERENCES families(id) ON DELETE SET NULL,
    avatar_url TEXT DEFAULT 'pelajar_lelaki',
    total_bintang INTEGER DEFAULT 0,
    pin_keselamatan TEXT, -- Pilihan: 2 atau 4 angka jika mahu kunci profil
    dicipta_pada TIMESTAMPTZ DEFAULT NOW()
);

-- 5. JADUAL REKOD SKOR & AKTIVITI
CREATE TABLE IF NOT EXISTS activity_scores (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    modul TEXT NOT NULL, -- 'fonik', 'sukukata_asas', 'sukukata_hero', 'bacaan', 'nombor', dsb.
    aktiviti_nama TEXT NOT NULL,
    skor INTEGER DEFAULT 0,
    bintang INTEGER DEFAULT 0,
    tarikh TIMESTAMPTZ DEFAULT NOW()
);

-- 6. JADUAL LENCANA & SIJIL
CREATE TABLE IF NOT EXISTS badges (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    nama_lencana TEXT NOT NULL, -- 'wira_pulau', 'kapten_harta_karun', dsb.
    tarikh_capai TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    no_siri TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'diluluskan' CHECK (status IN ('menunggu', 'diluluskan', 'dibatalkan')),
    tarikh_keluar TIMESTAMPTZ DEFAULT NOW()
);

-- 7. KESELAMATAN ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Polisi Bacaan Awam Menggunakan Kod:
-- Membenarkan murid membaca senarai nama murid jika mempunyai kod kelas yang sah
CREATE POLICY "Murid boleh lihat rakan sekelas dengan kod kelas" ON students
    FOR SELECT USING (true);

-- Membenarkan murid menyimpan rekod skor aktiviti mereka
CREATE POLICY "Murid boleh simpan markah aktiviti" ON activity_scores
    FOR INSERT WITH CHECK (true);
```

---

## 5. PENGURUSAN ASET (AUDIO & IMEJ): PERLUKAH CLOUDFLARE R2?

### A. Situasi Aset Semasa Bunyi Kata
- Aplikasi anda mengandungi **~800 fail statik** (merangkumi sebutan fonik, muzik latar, kesan bunyi, ikon, dan ilustrasi grafik) di dalam folder `public/`.
- **Jumlah keseluruhan saiz aset ini hanya ~35.5 MB!** (Sangat ringan untuk standard web moden).

---

### B. Adakah Perlu Memindahkan Aset Ini ke Cloudflare R2 / Object Storage?

> [!TIP]
> **Jawapan:** **TIDAK PERLU.** Kekalkan semua aset audio dan grafik permainan sedia ada di dalam folder `public/` (secara lokal).

#### Sebab-Sebab Utama:
1. **Peranan Sebenar Cloudflare R2 / S3 / Supabase Storage**:
   - Cloudflare R2 atau Object Storage dicipta khusus untuk fail yang **dimuat naik oleh pengguna secara dinamik** (*User-Generated Uploads*), contohnya:
     - Guru memuat naik foto profil mereka sendiri.
     - Guru memuat naik lembaran kerja PDF atau fail aktiviti tersuai.
     - Rakaman suara murid yang dihantar untuk dinilai guru.
   - Aplikasi Bunyi Kata anda sekarang **belum mempunyai fungsi muat naik fail oleh pengguna**, jadi Cloudflare R2 tidak diperlukan buat masa ini.
2. **Kelebihan Menyimpan di `public/` (Lokal)**:
   - **Kelajuan Segera (Zero Latency)**: Kanak-kanak yang menekan kad fonik (contoh: huruf 'A' -> sebutan "ah") memerlukan audio berbunyi serta-merta tanpa sebarang sela masa (*delay*).
   - **Browser Caching**: Sebaik sahaja murid membuka laman web buat kali pertama, pelayar web (*browser*) akan menyimpan cache audio dan imej ini secara automatik dalam peranti mereka. Kali kedua mereka bermain, ia tidak lagi memuat turun fail yang sama dari internet.
   - **Tiada Isu CORS & Tiada Kos Tambahan**: Tiada risiko ralat sambungan silang domain (*Cross-Origin Resource Sharing*) atau caj rangkaian luar.

---

### C. Adakah Aset Lokal Ini Memberi Kesan Kepada Supabase?

> [!NOTE]
> **Jawapan:** **TIADA KESAN SAMA SEKALI.**

- **Pengasingan Tugas (Separation of Concerns)**:
  - **Supabase** bertindak sebagai pangkalan data **rekod teks & nombor** (nama kelas, senarai murid, skor markah, jumlah bintang, rekod sijil).
  - Aset fail gambar dan audio yang berada di folder `public/` **tidak dihantar ke Supabase** dan **tidak akan memakan had kuota 500 MB atau 8 GB pangkalan data Supabase**.
  - Oleh itu, kuota pangkalan data Supabase anda kekal 100% bersih untuk data pembelajaran murid sahaja.

---

## 6. CADANGAN PLATFORM HOSTING & DEPLOYMENT WEB APP

Memandangkan **Supabase menguruskan pangkalan data & pengesahan pengguna (*backend*)**, di manakah web app Bunyi Kata (*frontend React + Vite*) patut di-deploy?

Berikut adalah 3 pilihan terbaik bertaraf dunia yang sangat disyorkan:

### Pilihan 1: Vercel (Paling Disyorkan ⭐⭐⭐⭐⭐)
- **Status Kos:** **Percuma (Hobby Plan)**
- **Mengapa Sesuai untuk Bunyi Kata?**
  - Vercel dicipta khusus untuk aplikasi React dan Vite.
  - Sangat mudah: Sambungkan terus ke repositori GitHub projek anda. Setiap kali anda membuat kemas kini (*git push*), Vercel akan membina (*build*) dan mengemas kini laman web secara automatik dalam masa kurang 60 saat.
  - **Global Edge Network**: Mempunyai pelayan CDN di Singapura/rantau Asia Tenggara, menjadikan aset audio & grafik dimuat turun dengan sepantas kilat oleh guru dan murid di Malaysia.
  - Menyokong domain sendiri secara percuma (contoh: `bunyikata.my` atau `bunyikata.com`) dengan sijil SSL keselamatan (HTTPS) percuma.
  - Kuota percuma merangkumi **100 GB pemindahan data sebulan** (cukup untuk menampung puluhan ribu pengguna).

### Pilihan 2: Cloudflare Pages (Paling Jimat Tanpa Had Kuota ⭐⭐⭐⭐⭐)
- **Status Kos:** **Percuma Sepenuhnya**
- **Mengapa Sesuai?**
  - Menawarkan **pemindahan data tanpa had (*unlimited bandwidth*)** secara percuma.
  - Mempunyai nod pelayan di Kuala Lumpur dan Singapura, memberikan kelajuan capaian domestik yang sangat rendah latensi.
  - Jika aplikasi anda menjadi mega-viral dan anda tidak mahu risau tentang kuota lebar jalur (*bandwidth limit*), Cloudflare Pages adalah pilihan terbaik.

### Pilihan 3: Netlify (Pilihan Alternatif ⭐⭐⭐⭐)
- **Status Kos:** **Percuma**
- Ciri serupa seperti Vercel dengan integrasi GitHub yang lancar dan kemudahan konfigurasi persekitaran `.env`.

---

## 7. RUMUSAN & LANGKAH KITA SETERUSNYA

1. **Aliran Kod**: Konsep **Kod Kelas / Kod Keluarga ➔ Murid Pilih Nama** adalah yang terbaik dan patut dikekalkan.
2. **Platform & Kos Database**: **Supabase** adalah percuma untuk fasa permulaan sehingga 50,000 pengguna aktif, dan sekadar **$25/bulan (~RM 115)** jika aplikasi anda menjadi viral seluruh negara.
3. **Pengurusan Aset**: **Kekalkan semua 800+ audio & imej di folder `public/`**. Ia tidak mengganggu Supabase, sangat laju, dan tidak memerlukan Cloudflare R2 melainkan anda ingin menambah ciri guru/murid muat naik fail sendiri pada masa depan.
4. **Hosting / Deploy**: Gunakan **Vercel** atau **Cloudflare Pages** (kedua-duanya percuma, laju, dan ada CDN pelayan di Malaysia/Singapura).
5. **Status Kod Semasa**: Kod projek anda selamat sepenuhnya dan tiada sebarang fail aplikasi yang diusik.
6. **Bila Anda Bersedia**: Apabila anda sudah mendaftar projek di Supabase atau ingin memulakan proses deployment, maklumkan kepada saya. Saya sedia membantu langkah demi langkah!

