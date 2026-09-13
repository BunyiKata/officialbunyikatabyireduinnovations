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

import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

export interface HasilAksesAdmin {
  berjaya: boolean;
  mesej?: string;
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
      console.warn('[Admin] Pengesahan gagal:', res.status, mesej);
      return { berjaya: false, mesej };
    }

    const data = await res.json();
    if (!data?.success || !data?.token) {
      return { berjaya: false };
    }

    // Log masuk sebenar ke Firebase Auth menggunakan custom token.
    await signInWithCustomToken(auth, data.token);

    return { berjaya: true };
  } catch (err: any) {
    console.error('[Admin] Ralat semasa mengesahkan kod admin:', err?.message || err);
    return { berjaya: false, mesej: 'Tidak dapat menghubungi pelayan pengesahan.' };
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

export type PerananPengguna = 'guru' | 'ibubapa';
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
    const pengguna = auth.currentUser;
    if (!pengguna) {
      return { berjaya: false, mesej: 'Sesi admin tidak aktif. Sila masuk semula.' } as unknown as T;
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
  });
}

/** Set semula kata laluan pengguna (jana sendiri jika tidak diberi). */
export async function resetKataLaluanAdmin(
  uid: string,
  password?: string,
): Promise<HasilResetKataLaluan> {
  return panggilAdmin<HasilResetKataLaluan>('/api/admin/reset-password', {
    uid,
    password: password || '',
  });
}

/** Panjangkan tempoh langganan pengguna mengikut pakej yang dipilih. */
export async function panjangkanTempohAdmin(
  uid: string,
  planKey: KunciPakej,
): Promise<HasilPanjangTempoh> {
  return panggilAdmin<HasilPanjangTempoh>('/api/admin/extend-expiry', {
    uid,
    planKey,
  });
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
