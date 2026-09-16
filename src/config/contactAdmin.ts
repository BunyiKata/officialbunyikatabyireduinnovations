/**
 * Konfigurasi hubungan admin (WhatsApp).
 *
 * Tukar WHATSAPP_ADMIN_NOMBOR kepada nombor WhatsApp admin sebenar.
 * Format: kod negara tanpa '+' dan tanpa sengkang, contoh: "60123456789".
 * Biarkan kosong ("") untuk menyembunyikan butang hubungi admin.
 */
export const WHATSAPP_ADMIN_NOMBOR = "60173955657";

/** Mesej lalai apabila pelawat ingin melanggan pakej. */
export const WHATSAPP_MESEJ_DEFAULT =
  "Hai admin Bunyi Kata, saya berminat untuk melanggan pakej Pro. Boleh saya dapatkan maklumat lanjut?";

/** Kunci storan untuk kod rujukan affiliate yang ditangkap dari URL (?ref=). */
const KUNCI_REF = "bunyiKataRef";

/**
 * Tangkap kod rujukan dari URL (`?ref=BK7X2K`) dan simpan.
 *
 * URL kehilangan `?ref=` apabila pengguna menekan butang Daftar (React router /
 * overlay tidak mengekalkan query), jadi kita simpan kod pada muat pertama.
 * Dipanggil sekali dari main.tsx.
 */
export function tangkapKodRujukan(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const kod = (params.get("ref") || "").trim().toUpperCase();
    if (!kod) return;
    // Sahkan bentuk: 6 aksara huruf/nombor (huruf besar).
    if (!/^[A-Z0-9]{6}$/.test(kod)) return;
    window.localStorage.setItem(KUNCI_REF, kod);
    window.sessionStorage.setItem(KUNCI_REF, kod);
  } catch {
    /* storan tidak tersedia — abaikan, bukan kritikal */
  }
}

/** Ambil kod rujukan yang disimpan (session dahulu, kemudian local). */
export function ambilKodRujukan(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      window.sessionStorage.getItem(KUNCI_REF) ||
      window.localStorage.getItem(KUNCI_REF) ||
      ""
    );
  } catch {
    return "";
  }
}

/** Buang kod rujukan (cth. selepas digunakan). */
export function kosongkanKodRujukan(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KUNCI_REF);
    window.localStorage.removeItem(KUNCI_REF);
  } catch {
    /* abaikan */
  }
}

/**
 * Bina mesej pendaftaran mengikut EJAAN RASMI yang dipersetujui:
 *   Saya berminat dapatkan Bunyi Kata Pakej "3 Bulan (Pro)" 🙌 (Bunyi Kata - BK7X2K)
 * Jika tiada kod rujukan, kurungan di hujung DIGUGURKAN sepenuhnya:
 *   Saya berminat dapatkan Bunyi Kata Pakej "3 Bulan (Pro)" 🙌
 *
 * NOTA emoji: guna "🙌" TANPA pengubah warna kulit (skin-tone). Versi "🙌🏻"
 * (U+1F64C U+1F3FB) muncul sebagai dua aksara / kotak rosak pada sesetengah
 * peranti, jadi kita kekalkan emoji asas yang disokong meluas.
 */
export function mesejDaftarPakej(namaPakej: string, kodRujukan?: string): string {
  const nama = (namaPakej || "").trim();
  const kod = (kodRujukan ?? ambilKodRujukan()).trim().toUpperCase();
  const asas = `Saya berminat dapatkan Bunyi Kata Pakej "${nama}" 🙌`;
  return kod ? `${asas} (Bunyi Kata - ${kod})` : asas;
}

/** Mesej rasmi pendaftaran Pakej Affiliate (sama gaya seperti pakej pro, khas affiliate). */
export function mesejDaftarAffiliate(kodRujukan?: string): string {
  const kod = (kodRujukan ?? ambilKodRujukan()).trim().toUpperCase();
  const asas = "Saya berminat daftar Pakej Affiliate Bunyi Kata (RM5) 🙌";
  return kod ? `${asas} (Bunyi Kata - ${kod})` : asas;
}

/**
 * Bina pautan WhatsApp ke admin.
 * Mengembalikan null jika nombor belum ditetapkan.
 */
export function pautanWhatsappAdmin(mesej?: string): string | null {
  if (!WHATSAPP_ADMIN_NOMBOR) return null;
  const teks = encodeURIComponent(mesej || WHATSAPP_MESEJ_DEFAULT);
  return `https://wa.me/${WHATSAPP_ADMIN_NOMBOR}?text=${teks}`;
}

/** Buka WhatsApp admin dalam tab baharu. Mengembalikan false jika belum dikonfigurasi. */
export function hubungiAdminWhatsapp(mesej?: string): boolean {
  const pautan = pautanWhatsappAdmin(mesej);
  if (!pautan) return false;
  if (typeof window !== "undefined") {
    window.open(pautan, "_blank", "noopener,noreferrer");
  }
  return true;
}
