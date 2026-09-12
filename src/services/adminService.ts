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
