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
