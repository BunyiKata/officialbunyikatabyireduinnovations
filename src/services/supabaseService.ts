import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ClassRecord {
  id: string;
  guru_id?: string;
  nama_sekolah: string;
  nama_kelas: string;
  kod_kelas: string;
  nama_guru?: string;
  avatar_sekolah?: string;
  aktif: boolean;
  dicipta_pada: string;
}

export interface FamilyRecord {
  id: string;
  parent_id?: string;
  nama_keluarga: string;
  kod_keluarga: string;
  nama_ibubapa?: string;
  no_telefon?: string;
  aktif: boolean;
  dicipta_pada: string;
}

export interface StudentRecord {
  id: string;
  nama: string;
  no_mykid?: string;
  kelas_id?: string;
  keluarga_id?: string;
  avatar_url?: string;
  total_bintang: number;
  pin_keselamatan?: string;
  catatan?: string;
  dicipta_pada?: string;
}

export interface ScoreRecord {
  id?: number;
  student_id: string;
  modul: string;
  aktiviti_nama: string;
  skor: number;
  bintang: number;
  data_tambahan?: any;
  tarikh?: string;
}

export interface CertificateRecord {
  id: string;
  student_id?: string;
  no_siri: string;
  nama_murid: string;
  nama_sekolah?: string;
  nama_kelas?: string;
  nama_guru?: string;
  status: 'menunggu' | 'diluluskan' | 'dibatalkan';
  tarikh_keluar: string;
  metadata?: any;
}

/**
 * Menguji sambungan langsung ke Supabase
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Kunci Supabase belum dikonfigurasikan dalam .env (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)',
    };
  }

  try {
    const { data, error } = await supabase.from('classes').select('id, kod_kelas, nama_kelas').limit(1);
    if (error) {
      return { success: false, message: `Ralat Supabase: ${error.message}` };
    }
    return {
      success: true,
      message: 'Berjaya bersambung ke Supabase!',
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Ralat sambungan: ${err?.message || 'Tidak diketahui'}`,
    };
  }
}

/**
 * Mendapatkan maklumat kelas berdasarkan kod kelas (contoh: KELAS#01)
 */
export async function getClassByCode(kodKelas: string): Promise<ClassRecord | null> {
  if (!isSupabaseConfigured || !kodKelas) return null;

  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .ilike('kod_kelas', kodKelas.trim())
      .eq('aktif', true)
      .single();

    if (error || !data) {
      console.warn('[Supabase] Kelas tidak dijumpai:', error?.message);
      return null;
    }
    return data as ClassRecord;
  } catch (err) {
    console.error('[Supabase] Ralat mendapatkan kelas:', err);
    return null;
  }
}

/**
 * Mendapatkan maklumat keluarga berdasarkan kod keluarga (contoh: FAM@2026)
 */
export async function getFamilyByCode(kodKeluarga: string): Promise<FamilyRecord | null> {
  if (!isSupabaseConfigured || !kodKeluarga) return null;

  try {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .ilike('kod_keluarga', kodKeluarga.trim())
      .eq('aktif', true)
      .single();

    if (error || !data) {
      console.warn('[Supabase] Keluarga tidak dijumpai:', error?.message);
      return null;
    }
    return data as FamilyRecord;
  } catch (err) {
    console.error('[Supabase] Ralat mendapatkan keluarga:', err);
    return null;
  }
}

/**
 * Mendapatkan senarai murid bagi sesuatu kelas
 */
export async function getStudentsByClassId(kelasId: string): Promise<StudentRecord[]> {
  if (!isSupabaseConfigured || !kelasId) return [];

  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('kelas_id', kelasId)
      .order('nama', { ascending: true });

    if (error) {
      console.error('[Supabase] Ralat mendapatkan murid kelas:', error);
      return [];
    }
    return (data as StudentRecord[]) || [];
  } catch (err) {
    console.error('[Supabase] Ralat murid kelas:', err);
    return [];
  }
}

/**
 * Mendapatkan senarai murid bagi sesuatu keluarga
 */
export async function getStudentsByFamilyId(keluargaId: string): Promise<StudentRecord[]> {
  if (!isSupabaseConfigured || !keluargaId) return [];

  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('keluarga_id', keluargaId)
      .order('nama', { ascending: true });

    if (error) {
      console.error('[Supabase] Ralat mendapatkan anak keluarga:', error);
      return [];
    }
    return (data as StudentRecord[]) || [];
  } catch (err) {
    console.error('[Supabase] Ralat anak keluarga:', err);
    return [];
  }
}

/**
 * Menyimpan rekod skor aktiviti murid ke pangkalan data
 */
export async function recordStudentActivity(
  studentId: string,
  modul: string,
  aktivitiNama: string,
  skor: number,
  bintang: number,
  dataTambahan?: any
): Promise<boolean> {
  if (!isSupabaseConfigured || !studentId) return false;

  try {
    // 1. Simpan rekod aktiviti
    const { error: scoreErr } = await supabase.from('activity_scores').insert({
      student_id: studentId,
      modul,
      aktiviti_nama: aktivitiNama,
      skor,
      bintang,
      data_tambahan: dataTambahan || {},
    });

    if (scoreErr) {
      console.error('[Supabase] Ralat rekod skor:', scoreErr);
      return false;
    }

    // 2. Kemas kini jumlah bintang terkumpul murid (jika ada bintang diperoleh)
    if (bintang > 0) {
      const { data: student } = await supabase
        .from('students')
        .select('total_bintang')
        .eq('id', studentId)
        .single();

      if (student) {
        const newTotal = (student.total_bintang || 0) + bintang;
        await supabase
          .from('students')
          .update({ total_bintang: newTotal, dikemaskini_pada: new Date().toISOString() })
          .eq('id', studentId);
      }
    }

    return true;
  } catch (err) {
    console.error('[Supabase] Ralat menyimpan rekod aktiviti:', err);
    return false;
  }
}

/**
 * Merekodkan lencana pencapaian murid
 */
export async function recordStudentBadge(
  studentId: string,
  namaLencana: string,
  ikon?: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !studentId) return false;

  try {
    const { error } = await supabase.from('badges').upsert(
      {
        student_id: studentId,
        nama_lencana: namaLencana,
        ikon: ikon || '',
        tarikh_capai: new Date().toISOString(),
      },
      { onConflict: 'student_id,nama_lencana' }
    );

    if (error) {
      console.error('[Supabase] Ralat menyimpan lencana:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Ralat menyimpan lencana:', err);
    return false;
  }
}

/**
 * Menyemak dan mengesahkan sijil melalui Nombor Siri
 */
export async function verifyCertificateBySerial(noSiri: string): Promise<CertificateRecord | null> {
  if (!isSupabaseConfigured || !noSiri) return null;

  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .ilike('no_siri', noSiri.trim())
      .single();

    if (error || !data) {
      return null;
    }
    return data as CertificateRecord;
  } catch (err) {
    console.error('[Supabase] Ralat menyemak sijil:', err);
    return null;
  }
}

/**
 * Merekodkan sijil baharu ke dalam pangkalan data
 */
export async function saveCertificate(cert: {
  noSiri: string;
  namaMurid: string;
  namaSekolah?: string;
  namaKelas?: string;
  namaGuru?: string;
  studentId?: string;
  metadata?: any;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('certificates').upsert(
      {
        no_siri: cert.noSiri.trim(),
        nama_murid: cert.namaMurid.trim().toUpperCase(),
        nama_sekolah: cert.namaSekolah,
        nama_kelas: cert.namaKelas,
        nama_guru: cert.namaGuru,
        student_id: cert.studentId || null,
        status: 'diluluskan',
        metadata: cert.metadata || {},
      },
      { onConflict: 'no_siri' }
    );

    if (error) {
      console.error('[Supabase] Ralat menyimpan sijil:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase] Ralat menyimpan sijil:', err);
    return false;
  }
}

/**
 * Menghantar maklum balas pengguna
 */
export async function submitUserFeedback(feedback: {
  namaPengguna?: string;
  peranan?: string;
  rating: number;
  komen: string;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('feedbacks').insert({
      nama_pengguna: feedback.namaPengguna || 'Pengguna',
      peranan: feedback.peranan || 'Murid',
      rating: feedback.rating,
      komen: feedback.komen,
    });

    return !error;
  } catch (err) {
    console.error('[Supabase] Ralat menghantar maklum balas:', err);
    return false;
  }
}
