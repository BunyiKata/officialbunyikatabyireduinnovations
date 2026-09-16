/**
 * Servis Mod Admin
 *
 * PENTING: Tiada kod admin disimpan dalam fail ini. Fail ini dibundelkan dan
 * dihantar ke pelayar, jadi sebarang kod rahsia di sini akan terdedah kepada
 * sesiapa yang membuka DevTools.
 *
 * Aliran yang selamat:
 *   1. Pengguna menaip kod dalam kotak kod biasa (tiada butang admin khas).
 *   2. Kod dihantar ke POST /api/admin/verify.
 *   3. Pelayan membandingkannya dengan process.env.ADMIN_CODE.
 *   4. Jika sah, pelayan memulangkan Firebase custom token (claim admin: true).
 *   5. Klien signInWithCustomToken() -> auth != null, peraturan RTDB percaya.
 */

import { signInWithCustomToken, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

/**
 * Dapatkan pengguna auth semasa dengan menunggu permulaan Firebase Auth (authStateReady)
 * jika sesi sedang dimuatkan dari storan tempatan (cth. selepas muat semula halaman).
 */
export async function dapatkanPenggunaAuth(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    if (typeof (auth as any).authStateReady === 'function') {
      await (auth as any).authStateReady();
    }
  } catch (e) {}
  if (auth.currentUser) return auth.currentUser;
  return new Promise((resolve) => {
    let selesai = false;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!selesai) {
        selesai = true;
        try { unsub(); } catch (e) {}
        resolve(user);
      }
    });
    setTimeout(() => {
      if (!selesai) {
        selesai = true;
        try { unsub(); } catch (e) {}
        resolve(auth.currentUser);
      }
    }, 4000);
  });
}

export interface HasilAksesAdmin {
  berjaya: boolean;
  mesej?: string;
  /**
   * Benar apabila pelayan menjawab 5xx — iaitu pelayan HIDUP tetapi mod admin
   * belum dikonfigurasikan (cth. ADMIN_CODE tiada, atau Firebase Admin SDK
   * belum diberi kredensial). Ini BERBEZA daripada "kod salah" (401):
   *   401 -> kod itu memang bukan kod admin, teruskan cuba kod kelas/keluarga.
   *   5xx -> server rosak/tak lengkap; jangan senyapkan, beritahu pengguna.
   *
   * Tanpa bendera ini, kegagalan konfigurasi kelihatan sama seperti kod salah,
   * jadi admin di localhost nampak seolah-olah "mod admin tidak berfungsi".
   */
  ralatKonfigurasi?: boolean;
  /**
   * Benar apabila permintaan fetch itu sendiri GAGAL (cth. pelayan dev tidak
   * berjalan, rangkaian terputus, DNS gagal). Ini BERBEZA daripada 401 (kod
   * salah) dan 5xx (konfigurasi pelayan).
   *
   * Tanpa bendera ini, pelayan yang MATI kelihatan seperti "kod tidak sah",
   * yang sangat mengelirukan semasa membangun di localhost.
   */
  ralatSambungan?: boolean;
}

/**
 * Cuba masuk mod admin menggunakan kod yang dimasukkan pengguna.
 *
 * Fungsi ini sengaja "senyap" tentang kegagalan: ia tidak membezakan antara
 * "kod salah" dan "kod ini bukan kod admin", supaya kewujudan mod admin tidak
 * terbongkar kepada pengguna biasa yang tersalah taip kod kelas.
 */
export async function cubaAksesAdmin(kod: string): Promise<HasilAksesAdmin> {
  const bersih = (kod || '').trim().toUpperCase();
  if (!bersih) return { berjaya: false };

  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kod: bersih }),
    });

    // 401 bermakna bukan kod admin — ini normal, biarkan pemanggil mencuba
    // laluan kod kelas / kod keluarga seperti biasa.
    if (res.status === 401) {
      return { berjaya: false };
    }

    if (!res.ok) {
      let mesej = 'Mod admin tidak tersedia buat masa ini.';
      try {
        const data = await res.json();
        if (data?.message) mesej = data.message;
      } catch {
        /* biarkan mesej lalai */
      }
      const ralatKonfigurasi = res.status >= 500;
      console.warn('[Admin] Pengesahan gagal:', res.status, mesej);
      return { berjaya: false, mesej, ralatKonfigurasi };
    }

    const data = await res.json();
    if (!data?.success || !data?.token) {
      return { berjaya: false };
    }

    // Log masuk sebenar ke Firebase Auth menggunakan custom token.
    // Tangkap ralat signInWithCustomToken secara BERASINGAN supaya kegagalan
    // Firebase Auth (cth. authDomain salah, token tamat) tidak dikelirukan
    // dengan kegagalan sambungan fetch ke pelayan.
    try {
      await signInWithCustomToken(auth, data.token);
    } catch (firebaseErr: any) {
      const kodRalat = firebaseErr?.code || '';
      const mesejFirebase = firebaseErr?.message || String(firebaseErr);
      console.error('[Admin] signInWithCustomToken gagal:', kodRalat, mesejFirebase);

      // Token Firebase tidak sah atau konfigurasi salah
      if (kodRalat === 'auth/invalid-custom-token' || kodRalat === 'auth/argument-error') {
        return {
          berjaya: false,
          mesej: 'Token admin tidak sah. Sila hubungi pentadbir sistem.',
          ralatKonfigurasi: true,
        };
      }

      // Masalah rangkaian ke Firebase Auth server
      return {
        berjaya: false,
        mesej: `Tidak dapat menghubungi Firebase Auth. (${kodRalat || mesejFirebase})`,
        ralatSambungan: true,
      };
    }

    return { berjaya: true };
  } catch (err: any) {
    // Tangkap ralat fetch / rangkaian ke pelayan kita sendiri.
    console.error('[Admin] Ralat sambungan ke pelayan pengesahan:', err?.message || err);
    return {
      berjaya: false,
      mesej: 'Tidak dapat menghubungi pelayan pengesahan.',
      ralatSambungan: true,
    };
  }
}

// ---------------------------------------------------------------------------
// API PENGURUSAN AKAUN (cipta akaun, reset kata laluan, panjang tempoh)
//
// Semua panggilan ini perlukan sesi admin yang sah. Selepas cubaAksesAdmin()
// berjaya, auth.currentUser wujud (custom token ditukar kepada ID token oleh
// Firebase), jadi getIdToken() boleh digunakan sebagai bukti kebenaran.
// Pelayan mengesahkan token itu melalui middleware requireAdmin.
// ---------------------------------------------------------------------------

export type PerananPengguna = 'guru' | 'ibubapa' | 'affiliate';
export type KunciPakej = '1bulan' | '3bulan' | '1tahun';

export interface InputCiptaAkaun {
  nama: string;
  email: string;
  peranan: PerananPengguna;
  no_telefon?: string;
  nama_sekolah?: string;
  nama_keluarga?: string;
  planKey: KunciPakej;
  /** Kosongkan untuk jana kata laluan sementara di pelayan. */
  password?: string;
  /** Fasa 2: kod affiliate (6 aksara) yang merujuk pembelian ini, jika ada. */
  kod_rujukan?: string;
}

export interface MaklumatPakej {
  key: string;
  name: string;
  days: number;
}

export interface HasilCiptaAkaun {
  berjaya: boolean;
  mesej?: string;
  uid?: string;
  email?: string;
  nama?: string;
  /** Dipulangkan SEKALI sahaja — tidak disimpan di pelayan. */
  password?: string;
  plan?: MaklumatPakej;
  tarikh_mula?: string;
  tarikh_tamat?: string;
}

export interface HasilResetKataLaluan {
  berjaya: boolean;
  mesej?: string;
  uid?: string;
  password?: string;
}

export interface HasilPanjangTempoh {
  berjaya: boolean;
  mesej?: string;
  uid?: string;
  plan?: MaklumatPakej;
  tarikh_tamat?: string;
}

/**
 * Pembantu dalaman: hantar permintaan POST ke endpoint admin dengan ID token
 * semasa. Memulangkan objek JSON, atau objek gagal yang seragam jika sesi
 * tidak aktif / rangkaian bermasalah.
 */
async function panggilAdmin<T extends { berjaya: boolean }>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  try {
    const pengguna = await dapatkanPenggunaAuth();
    if (!pengguna) {
      return { berjaya: false, mesej: 'Sesi admin tidak aktif. Sila berhubung dengan admin.' } as unknown as T;
    }

    const token = await pengguna.getIdToken();
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return {
        berjaya: false,
        mesej: data?.message || 'Operasi gagal. Sila cuba lagi.',
      } as unknown as T;
    }

    // Pelayan memulangkan { success: true, ... } — tukar kepada bentuk klien.
    const { success, ...baki } = data;
    return { berjaya: true, ...baki } as unknown as T;
  } catch (err: any) {
    console.error('[Admin API] Ralat:', path, err?.message || err);
    return { berjaya: false, mesej: 'Tidak dapat menghubungi pelayan.' } as unknown as T;
  }
}

/** Cipta akaun guru / ibu bapa baharu dalam Firebase Auth + RTDB. */
export async function ciptaAkaunAdmin(input: InputCiptaAkaun): Promise<HasilCiptaAkaun> {
  return panggilAdmin<HasilCiptaAkaun>('/api/admin/create-account', {
    nama: input.nama,
    email: input.email,
    peranan: input.peranan,
    no_telefon: input.no_telefon || '',
    nama_sekolah: input.nama_sekolah || '',
    nama_keluarga: input.nama_keluarga || '',
    planKey: input.planKey,
    password: input.password || '',
    kod_rujukan: input.kod_rujukan || '',
  });
}

/** Set semula kata laluan pengguna (jana sendiri jika tidak diberi). */
export async function resetKataLaluanAdmin(
  uid: string,
  password?: string,
  email?: string,
): Promise<HasilResetKataLaluan> {
  return panggilAdmin<HasilResetKataLaluan>('/api/admin/reset-password', {
    uid,
    // Emel pilihan: pelayan guna ini untuk mencari profil jika `uid` bukan UID
    // Firebase sebenar (cth. kekunci profil berasaskan emel daripada aliran lama).
    email: email || '',
    password: password || '',
  });
}

/**
 * Lanjutkan tempoh langganan pengguna.
 *
 * Sama ada `planKey` (pakej tetap) ATAU `hari` (bilangan hari budi bicara
 * admin) boleh diberi. Jika `hari` diberi, ia mengatasi `planKey` — ini
 * membolehkan admin menambah cth. 10 hari walaupun cikgu membayar 1 bulan.
 */
export async function panjangkanTempohAdmin(
  uid: string,
  planKey?: KunciPakej | string,
  hari?: number,
  email?: string,
): Promise<HasilPanjangTempoh> {
  return panggilAdmin<HasilPanjangTempoh>('/api/admin/extend-expiry', {
    uid,
    planKey: planKey || '',
    hari: Number.isFinite(hari) ? hari : 0,
    email: email || '',
  });
}

export interface PakejPenuh {
  key: KunciPakej;
  name: string;
  days: number;
  priceCents: number;
  harga: string;
}

const PAKEJ_LALAI: PakejPenuh[] = [
  { key: "1bulan", name: "1 Bulan (Pro)", days: 30, priceCents: 1500, harga: "RM15" },
  { key: "3bulan", name: "3 Bulan (Pro)", days: 90, priceCents: 4000, harga: "RM40" },
  { key: "1tahun", name: "1 Tahun (Pro)", days: 365, priceCents: 6900, harga: "RM69" },
];

let cachePakej: PakejPenuh[] | null = null;
let janjiPakej: Promise<PakejPenuh[]> | null = null;

export async function ambilSenaraiPakej(): Promise<PakejPenuh[]> {
  if (cachePakej) return cachePakej;
  if (janjiPakej) return janjiPakej;
  janjiPakej = (async () => {
    try {
      const res = await fetch("/api/plans", { method: "GET" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && Array.isArray(data.plans) && data.plans.length) {
        cachePakej = data.plans as PakejPenuh[];
        return cachePakej;
      }
    } catch (err) {
      console.warn("[Admin API] Gagal /api/plans, guna nilai lalai.", err);
    }
    cachePakej = PAKEJ_LALAI;
    return cachePakej;
  })();
  return janjiPakej;
}

export interface RekodAudit {
  id: string;
  tindakan: string;
  butiran?: Record<string, unknown>;
  oleh?: string;
  tarikh?: string;
}

// ---------------------------------------------------------------------------
// Fasa 2: affiliate (kod rujukan) — jenis & panggilan API
// ---------------------------------------------------------------------------

export interface Affiliate {
  kod: string;
  nama: string;
  whatsapp: string;
  /** Fasa 3: emel log masuk affiliate (Firebase Auth). */
  email?: string;
  /** Fasa 3: uid Firebase Auth affiliate. */
  uid?: string;
  status: 'aktif' | 'gantung' | string;
  dicipta_pada?: string;
  // Agregat (dikira di pelayan daripada referrals):
  jualan_bil?: number;
  jumlah_jualan_sen?: number;
  komisen_keseluruhan_sen?: number;
  dibayar_sen?: number;
  baki_sen?: number;
  tarikh_bayar_terakhir?: string;
}

export interface HasilAffiliate {
  berjaya: boolean;
  mesej?: string;
  affiliate?: Affiliate;
  kod?: string;
  status?: string;
  /** Fasa 3: emel log masuk yang didaftarkan (dipulangkan sekali). */
  email?: string;
  /** Fasa 3: kata laluan sementara (dipulangkan SEKALI sahaja). */
  password?: string;
}

export interface BarisKomisen {
  kod: string;
  id: string;
  nama_affiliate?: string;
  pelanggan_nama?: string;
  pelanggan_emel?: string;
  nama_pakej?: string;
  harga_sen?: number;
  komisen_sen?: number;
  status?: string;
  tarikh_beli?: string;
  tarikh_bayar?: string;
}

export interface RingkasanBayaran {
  kod: string;
  nama: string;
  bil: number;
  jumlah_sen: number;
}

export interface HasilLaporanBayaran {
  berjaya: boolean;
  mesej?: string;
  tempoh_tahan_hari?: number;
  ringkasan?: RingkasanBayaran[];
  layak?: BarisKomisen[];
  belum_matang?: BarisKomisen[];
  jumlah_layak_sen?: number;
}

async function panggilAdminGet<T extends { berjaya: boolean }>(
  path: string,
  labelSesi = 'Sesi admin',
): Promise<T> {
  try {
    const pengguna = await dapatkanPenggunaAuth();
    if (!pengguna) {
      return { berjaya: false, mesej: `${labelSesi} tidak aktif. Sila berhubung dengan admin.` } as unknown as T;
    }
    const token = await pengguna.getIdToken();
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    const savedAffCode = typeof localStorage !== 'undefined' ? localStorage.getItem('bunyiKataAffiliateKod') || '' : '';
    if (savedAffCode) {
      headers['x-affiliate-kod'] = savedAffCode;
    }
    const res = await fetch(path, { method: 'GET', headers });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return { berjaya: false, mesej: data?.message || 'Operasi gagal.' } as unknown as T;
    }
    const { success, ...baki } = data;
    return { berjaya: true, ...baki } as unknown as T;
  } catch (err: any) {
    console.error('[Admin API GET] Ralat:', path, err?.message || err);
    return { berjaya: false, mesej: 'Tidak dapat menghubungi pelayan.' } as unknown as T;
  }
}

/** Fasa 2: senarai affiliate (fail-safe: [] jika gagal). */
export async function ambilSenaraiAffiliate(): Promise<Affiliate[]> {
  const hasil = await panggilAdminGet<{ berjaya: boolean; affiliates?: Affiliate[] }>(
    '/api/admin/affiliate/list',
  );
  return Array.isArray(hasil.affiliates) ? hasil.affiliates : [];
}

/** Fasa 2/3: daftar affiliate baharu -> kod dijana di pelayan + akaun Auth. */
export async function ciptaAffiliate(nama: string, email: string, whatsapp: string): Promise<HasilAffiliate> {
  return panggilAdmin<HasilAffiliate>('/api/admin/affiliate/create', { nama, email, whatsapp });
}

/** Fasa 2: tukar status affiliate (aktif / gantung). */
export async function tukarStatusAffiliate(kod: string, status: 'aktif' | 'gantung'): Promise<HasilAffiliate> {
  return panggilAdmin<HasilAffiliate>('/api/admin/affiliate/status', { kod, status });
}

/** Fasa 2: padam affiliate (pelayan blok jika ada baki belum dibayar). */
export async function padamAffiliate(kod: string): Promise<HasilAffiliate> {
  return panggilAdmin<HasilAffiliate>('/api/admin/affiliate/delete', { kod });
}

/** Fasa 2: laporan pembayaran komisen (kitaran 2 minggu). */
export async function ambilLaporanBayaran(): Promise<HasilLaporanBayaran> {
  return panggilAdminGet<HasilLaporanBayaran>('/api/admin/affiliate/payments');
}

/** Fasa 2: tanda baris komisen sudah dibayar. */
export async function tandaKomisenDibayar(
  items: Array<{ kod: string; id: string }>,
): Promise<{ berjaya: boolean; mesej?: string; dibayar_bil?: number; jumlah_sen?: number }> {
  return panggilAdmin('/api/admin/affiliate/mark-paid', { items });
}

// ---------------------------------------------------------------------------
// Fasa 3: Affiliate Login — API sisi affiliate (guna sendiri)
//
// Kod affiliate TIDAK dihantar dari klien: pelayan membacanya daripada claim
// `affiliate_kod` dalam ID token. Klien hanya perlu membawa ID token Firebase
// yang sah (selepas login email/kata laluan).
// ---------------------------------------------------------------------------

export interface RingkasanAffiliate {
  jualan_bil: number;
  jumlah_jualan_sen: number;
  komisen_keseluruhan_sen: number;
  dibayar_sen: number;
  baki_sen: number;
}

export interface ProfilAffiliate {
  nama: string;
  kod: string;
  email: string;
  whatsapp: string;
  status: string;
  dicipta_pada?: string;
}

export interface HasilProfilAffiliate {
  berjaya: boolean;
  mesej?: string;
  affiliate?: ProfilAffiliate;
  ringkasan?: RingkasanAffiliate;
}

export interface ReferralAffiliate {
  id: string;
  pelanggan_nama: string;
  nama_pakej: string;
  harga_sen: number;
  komisen_sen: number;
  status: string;
  tarikh_beli: string;
  tarikh_bayar: string;
}

/** Fasa 3: profil + ringkasan prestasi affiliate yang sedang log masuk. */
export async function ambilProfilAffiliate(kod?: string): Promise<HasilProfilAffiliate> {
  const k = kod || (typeof localStorage !== "undefined" ? localStorage.getItem("bunyiKataAffiliateKod") || "" : "");
  const qs = k ? `?kod=${encodeURIComponent(k)}` : "";
  return panggilAdminGet<HasilProfilAffiliate>(`/api/affiliate/me${qs}`, 'Sesi affiliate');
}

/** Fasa 3: senarai baris rujukan affiliate sendiri (fail-safe: []). */
export async function ambilReferralSendiri(kod?: string): Promise<ReferralAffiliate[]> {
  const k = kod || (typeof localStorage !== "undefined" ? localStorage.getItem("bunyiKataAffiliateKod") || "" : "");
  const qs = k ? `?kod=${encodeURIComponent(k)}` : "";
  const hasil = await panggilAdminGet<{ berjaya: boolean; referrals?: ReferralAffiliate[] }>(
    `/api/affiliate/referrals${qs}`,
    'Sesi affiliate',
  );
  return Array.isArray(hasil.referrals) ? hasil.referrals : [];
}

/** Fasa 3: kemas kini profil affiliate (nama / whatsapp). */
export async function kemaskiniProfilAffiliate(data: { nama?: string; whatsapp?: string }): Promise<{ berjaya: boolean; mesej?: string }> {
  return panggilAdmin<{ berjaya: boolean; mesej?: string }>(
    '/api/affiliate/update-profile',
    data as Record<string, unknown>
  );
}

/**
 * Fasa 1.6: ambil jejak audit tindakan admin daripada pelayan.
 * Memulangkan senarai kosong jika gagal (fail-safe) - UI hanya tunjuk 'tiada log'.
 */
export async function ambilLogAudit(): Promise<RekodAudit[]> {
  try {
    const pengguna = await dapatkanPenggunaAuth();
    if (!pengguna) return [];
    const token = await pengguna.getIdToken();
    const res = await fetch("/api/admin/audit", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success || !Array.isArray(data.log)) return [];
    return data.log as RekodAudit[];
  } catch (err) {
    console.warn("[Admin Audit] Gagal memuatkan log audit:", err);
    return [];
  }
}


// ---------------------------------------------------------------------------
// JAMBATAN KE public/app-logic.js
//
// app-logic.js ialah JavaScript biasa (bukan modul ES) yang mengendalikan UI
// dalam public/ — cth. popup reset kata laluan & panjang tempoh. Ia TIDAK
// boleh `import` dari src/services, jadi kita dedahkan fungsi ini melalui
// window.__adminApi sebagai satu-satunya titik sambungan yang sah.
// ---------------------------------------------------------------------------
if (typeof window !== 'undefined') {
  (window as any).__adminApi = {
    ciptaAkaunAdmin,
    resetKataLaluanAdmin,
    panjangkanTempohAdmin,
    ambilSenaraiPakej,
    ambilLogAudit,
    // Fasa 2: affiliate
    ambilSenaraiAffiliate,
    ciptaAffiliate,
    tukarStatusAffiliate,
    padamAffiliate,
    ambilLaporanBayaran,
    tandaKomisenDibayar,
  };
}

/**
 * Menetapkan keadaan tempatan bagi sesi admin.
 * Dipisahkan daripada cubaAksesAdmin supaya pemanggil mengawal susunan UI.
 *
 * PENTING: Bendera `adminClaimDisahkan` HANYA wujud dalam memori tab
 * (window). Ia tidak pernah disimpan dalam localStorage, jadi hard refresh
 * tidak boleh menghidupkan semula mod admin secara tidak sengaja.
 */
export function tetapkanSesiAdminTempatan() {
  if (typeof window !== 'undefined') {
    (window as any).adminClaimDisahkan = true;
    (window as any).userAccessLevel = 'pro';
    (window as any).modAdminAktif = true;
    (window as any).isAdminMode = true;
    (window as any).isGuestMode = false;
  }
}

/**
 * Membersihkan SEMUA sisa sesi admin daripada storan setempat.
 *
 * Dipanggil apabila didapati tiada claim admin yang sah (cth selepas
 * pengguna menekan "Keluar", atau selepas hard refresh oleh pelawat awam).
 * Tanpa ini, nilai `bunyiKataUserRole = 'admin'` yang tertinggal akan
 * menyebabkan banner MOD ADMIN muncul kembali dan akses Pro terbuka.
 */
export function bersihkanSisaSesiAdminTempatan() {
  try {
    if (localStorage.getItem('bunyiKataUserRole') === 'admin') {
      localStorage.removeItem('bunyiKataUserRole');
    }
  } catch (e) {}
  if (typeof window !== 'undefined') {
    (window as any).adminClaimDisahkan = false;
    (window as any).modAdminAktif = false;
    (window as any).isAdminMode = false;
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('admin-mode');
    }
  }
}
