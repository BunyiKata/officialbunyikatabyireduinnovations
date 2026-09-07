-- ==============================================================================
-- SKEMA PANGKALAN DATA SUPABASE: BUNYI KATA
-- ==============================================================================
-- Arahan:
-- 1. Buka dashboard projek Supabase anda di https://supabase.com
-- 2. Pergi ke menu 'SQL Editor' di sebelah kiri.
-- 3. Cipta 'New query', tampal (paste) semua kod di bawah ini.
-- 4. Klik 'Run' untuk membina semua jadual, fungsi, dan polisi RLS secara automatik.
-- ==============================================================================

-- Aktifkan ekstensi UUID (biasanya aktif secara lalai di Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. JADUAL PROFIL PENGGUNA (Guru, Ibu Bapa, Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    peranan TEXT NOT NULL CHECK (peranan IN ('guru', 'ibubapa', 'admin')),
    nama_sekolah TEXT,
    no_telefon TEXT,
    avatar_url TEXT,
    dicipta_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    dikemaskini_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 2. JADUAL KELAS (Dicipta oleh Guru / Admin)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guru_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nama_sekolah TEXT NOT NULL DEFAULT 'SK BUKIT BERUANG',
    nama_kelas TEXT NOT NULL DEFAULT '1 CEMERLANG',
    kod_kelas TEXT UNIQUE NOT NULL, -- Contoh: KELAS#01
    nama_guru TEXT,
    avatar_sekolah TEXT,
    aktif BOOLEAN DEFAULT true,
    dicipta_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index carian pantas mengikut kod kelas
CREATE INDEX IF NOT EXISTS idx_classes_kod_kelas ON public.classes(kod_kelas);

-- ------------------------------------------------------------------------------
-- 3. JADUAL KELUARGA (Dicipta oleh Ibu Bapa)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    nama_keluarga TEXT NOT NULL,
    kod_keluarga TEXT UNIQUE NOT NULL, -- Contoh: FAM@2026
    nama_ibubapa TEXT,
    no_telefon TEXT,
    aktif BOOLEAN DEFAULT true,
    dicipta_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Index carian pantas mengikut kod keluarga
CREATE INDEX IF NOT EXISTS idx_families_kod_keluarga ON public.families(kod_keluarga);

-- ------------------------------------------------------------------------------
-- 4. JADUAL MURID (Pelajar di bawah Kelas atau Keluarga)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    no_mykid TEXT,
    kelas_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    keluarga_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
    avatar_url TEXT DEFAULT 'pelajar_lelaki',
    total_bintang INTEGER DEFAULT 0,
    pin_keselamatan TEXT, -- Pilihan: 2 atau 4 angka jika mahu kunci profil
    catatan TEXT,
    dicipta_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    dikemaskini_pada TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_students_kelas_id ON public.students(kelas_id);
CREATE INDEX IF NOT EXISTS idx_students_keluarga_id ON public.students(keluarga_id);
CREATE INDEX IF NOT EXISTS idx_students_nama ON public.students(nama);

-- ------------------------------------------------------------------------------
-- 5. JADUAL REKOD SKOR & AKTIVITI MURID
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_scores (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    modul TEXT NOT NULL, -- 'fonik', 'sukukata_asas', 'sukukata_hero', 'bacaan', 'nombor', 'cantum_kata'
    aktiviti_nama TEXT NOT NULL,
    skor INTEGER DEFAULT 0,
    bintang INTEGER DEFAULT 0,
    data_tambahan JSONB DEFAULT '{}'::jsonb,
    tarikh TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_scores_student_id ON public.activity_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_scores_modul ON public.activity_scores(modul);

-- ------------------------------------------------------------------------------
-- 6. JADUAL LENCANA PENCAPAIAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.badges (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    nama_lencana TEXT NOT NULL, -- 'wira_pulau', 'kapten_harta_karun', 'pemburu_suku_kata', dll.
    ikon TEXT,
    tarikh_capai TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(student_id, nama_lencana)
);

CREATE INDEX IF NOT EXISTS idx_badges_student_id ON public.badges(student_id);

-- ------------------------------------------------------------------------------
-- 7. JADUAL SIJIL DIGITAL PENGHARGAAN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    no_siri TEXT UNIQUE NOT NULL, -- Contoh: BK-2026-0001
    nama_murid TEXT NOT NULL,
    nama_sekolah TEXT,
    nama_kelas TEXT,
    nama_guru TEXT,
    status TEXT DEFAULT 'diluluskan' CHECK (status IN ('menunggu', 'diluluskan', 'dibatalkan')),
    tarikh_keluar TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_certificates_no_siri ON public.certificates(no_siri);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON public.certificates(student_id);

-- ------------------------------------------------------------------------------
-- 8. JADUAL MAKLUM BALAS & RATING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id BIGSERIAL PRIMARY KEY,
    nama_pengguna TEXT,
    peranan TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    komen TEXT,
    tarikh TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- KESELAMATAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 1. POLISI KELAS & KELUARGA (Boleh dicari menggunakan kod oleh murid)
CREATE POLICY "Sesiapa sahaja boleh melihat kelas aktif" ON public.classes
    FOR SELECT USING (aktif = true);

CREATE POLICY "Guru boleh menguruskan kelas sendiri" ON public.classes
    FOR ALL USING (auth.uid() = guru_id);

CREATE POLICY "Sesiapa sahaja boleh melihat keluarga aktif" ON public.families
    FOR SELECT USING (aktif = true);

CREATE POLICY "Ibu bapa boleh menguruskan keluarga sendiri" ON public.families
    FOR ALL USING (auth.uid() = parent_id);

-- 2. POLISI PROFIL PENGGUNA
CREATE POLICY "Pengguna boleh membaca profil sendiri" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Pengguna boleh mengemaskini profil sendiri" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Sistem boleh cipta profil baru semasa pendaftaran" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. POLISI MURID
CREATE POLICY "Sesiapa sahaja boleh membaca senarai murid" ON public.students
    FOR SELECT USING (true);

CREATE POLICY "Guru atau Ibu Bapa boleh menambah/kemaskini murid" ON public.students
    FOR ALL USING (true) WITH CHECK (true);

-- 4. POLISI SKOR & AKTIVITI (Murid boleh rekod skor tanpa perlu login email)
CREATE POLICY "Murid boleh simpan rekod skor aktiviti" ON public.activity_scores
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Sesiapa boleh membaca rekod skor murid" ON public.activity_scores
    FOR SELECT USING (true);

-- 5. POLISI LENCANA
CREATE POLICY "Sesiapa boleh melihat lencana murid" ON public.badges
    FOR SELECT USING (true);

CREATE POLICY "Sistem boleh merekodkan lencana baru" ON public.badges
    FOR INSERT WITH CHECK (true);

-- 6. POLISI SIJIL
CREATE POLICY "Sesiapa boleh mengesahkan sijil dengan no siri" ON public.certificates
    FOR SELECT USING (true);

CREATE POLICY "Guru dan sistem boleh menjana sijil" ON public.certificates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guru dan sistem boleh mengemaskini sijil" ON public.certificates
    FOR UPDATE USING (true);

-- 7. POLISI MAKLUM BALAS
CREATE POLICY "Sesiapa boleh menghantar maklum balas" ON public.feedbacks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin atau guru boleh membaca maklum balas" ON public.feedbacks
    FOR SELECT USING (true);

-- ==============================================================================
-- DATA CONTOH AWAL (SEED DATA)
-- ==============================================================================
-- Masukkan Kelas Default (KELAS#01)
INSERT INTO public.classes (nama_sekolah, nama_kelas, kod_kelas, nama_guru, avatar_sekolah)
VALUES (
    'SK BUKIT BERUANG',
    '1 CEMERLANG',
    'KELAS#01',
    'MUHAMMAD IZZAT BIN RAZAK',
    'https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=ffffff'
) ON CONFLICT (kod_kelas) DO NOTHING;

-- Masukkan Keluarga Default (FAM@2026)
INSERT INTO public.families (nama_keluarga, kod_keluarga, nama_ibubapa)
VALUES (
    'KELUARGA BAHAGIA',
    'FAM@2026',
    'ENCIK AHMAD & PUAN SITI'
) ON CONFLICT (kod_keluarga) DO NOTHING;

-- Masukkan Murid-Murid Contoh untuk KELAS#01
DO $$
DECLARE
    v_kelas_id UUID;
BEGIN
    SELECT id INTO v_kelas_id FROM public.classes WHERE kod_kelas = 'KELAS#01' LIMIT 1;
    
    IF v_kelas_id IS NOT NULL THEN
        INSERT INTO public.students (nama, no_mykid, kelas_id, avatar_url, total_bintang)
        VALUES
            ('MUHAMMAD ABU BIN ATAN', '170512-10-5432', v_kelas_id, 'pelajar_lelaki', 15),
            ('NUR SYAFIQAH BINTI ZULKIFLI', '170823-14-6120', v_kelas_id, 'pelajar_perempuan', 18),
            ('DANISH HAZIQ BIN KHAIRUDDIN', '170314-10-7789', v_kelas_id, 'pelajar_lelaki', 12),
            ('AISYAH HUMAIRA BINTI ABDUL', '171109-08-5544', v_kelas_id, 'pelajar_perempuan', 20),
            ('CHONG WEI JIAN', '170205-14-8833', v_kelas_id, 'pelajar_lelaki', 14),
            ('DIVYASHINI A/P RAMANATHAN', '170617-10-9922', v_kelas_id, 'pelajar_perempuan', 16),
            ('MUHAMMAD FARHAN BIN ROSLI', '170928-10-3344', v_kelas_id, 'pelajar_lelaki', 10),
            ('SARAH ADRIANA BINTI KAMAL', '170411-14-1188', v_kelas_id, 'pelajar_perempuan', 22),
            ('ADAM RAYYAN BIN MOKHTAR', '171201-01-4455', v_kelas_id, 'pelajar_lelaki', 17),
            ('NUR AMANI BINTI FAIZAL', '170719-10-2211', v_kelas_id, 'pelajar_perempuan', 19)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
