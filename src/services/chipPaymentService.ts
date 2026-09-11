// @ts-nocheck
/**
 * Chip Payment Gateway Service
 * Mengendalikan pautan pembayaran dan integrasi Chip Collect API
 * Menyokong autofill maklumat pelanggan (Nama Guru / Keluarga & Emel)
 */

export interface ChipPlanMapping {
  id: string;
  name: string;
  price: number;
  period: string;
  category: "guru" | "ibubapa";
  paymentUrl: string;
}

// Konfigurasi awam Chip Collect.
// PENTING: Secret key TIDAK boleh berada di sini kerana fail ini
// dibundel dan dihantar ke pelayar. Semua panggilan yang memerlukan
// secret key mesti melalui pelayan (/api/chip/*).
export const CHIP_CONFIG = {
  brandId: (import.meta as any).env?.VITE_CHIP_BRAND_ID || "",
  apiBaseUrl: "https://gate.chip-in.asia/api/v1",
};


// Pautan Pembayaran Rasmi Chip Collect bagi setiap pakej
export const CHIP_PAYMENT_LINKS: Record<string, string> = {
  // Pakej 1 Bulan (RM15)
  guru_1bulan: "https://pay.chip-in.asia/OrIq99wvEblwINrvy1",
  ibubapa_1bulan: "https://pay.chip-in.asia/OrIq99wvEblwINrvy1",

  // Pakej 3 Bulan (RM40)
  guru_3bulan: "https://pay.chip-in.asia/KEYaDENqQLmY2hPOB8",
  ibubapa_3bulan: "https://pay.chip-in.asia/KEYaDENqQLmY2hPOB8",

  // Pakej 1 Tahun (RM69)
  guru_1tahun: "https://pay.chip-in.asia/TwKkEzjuVqJaqTcG3x",
  ibubapa_1tahun: "https://pay.chip-in.asia/TwKkEzjuVqJaqTcG3x",
};

/**
 * Membuka pautan pembayaran Chip untuk pengguna dengan maklumat nama & emel yang diautofill
 * @param planInfo Maklumat pakej yang dipilih
 * @param userEmail Emel pengguna (pilihan - dikesan automatik jika tidak diberikan)
 * @param userName Nama guru atau keluarga (pilihan - dikesan automatik jika tidak diberikan)
 */
export async function bukaBayaranChip(planInfo: any, userEmail?: string, userName?: string) {
  if (!planInfo) {
    console.error("[Chip Payment] Tiada maklumat pakej diberikan.");
    return;
  }

  const category = planInfo.category || "guru";

  // Auto-kesan Emel Pengguna jika tidak diberikan
  let resolvedEmail = (userEmail || "").trim();
  if (!resolvedEmail) {
    const currentUser = typeof window !== "undefined" ? (window as any).currentUser : null;
    resolvedEmail =
      localStorage.getItem("bunyiKataPendingEmail") ||
      (category === "guru"
        ? localStorage.getItem("bunyiKataGuruEmail")
        : localStorage.getItem("bunyiKataIbubapaEmail")) ||
      localStorage.getItem("bunyiKataGuruEmail") ||
      localStorage.getItem("bunyiKataIbubapaEmail") ||
      currentUser?.email ||
      "";
  }

  // Auto-kesan Nama Pengguna jika tidak diberikan
  let resolvedName = (userName || "").trim();
  if (!resolvedName) {
    const currentUser = typeof window !== "undefined" ? (window as any).currentUser : null;
    if (category === "guru") {
      resolvedName =
        localStorage.getItem("bunyiKataNamaGuru") ||
        localStorage.getItem("pdf_guru") ||
        currentUser?.nama ||
        "Guru Bunyi Kata";
    } else {
      resolvedName =
        localStorage.getItem("bunyiKataNamaKeluarga") ||
        currentUser?.nama ||
        "Keluarga Bunyi Kata";
    }
  }

  const planId = planInfo.id || "";
  let paymentUrl = CHIP_PAYMENT_LINKS[planId];

  // Fallback sekiranya planId tidak dipetakan secara langsung
  if (!paymentUrl) {
    if (planInfo.period?.includes("1 Tahun") || planInfo.period?.includes("tahun")) {
      paymentUrl = CHIP_PAYMENT_LINKS.guru_1tahun;
    } else if (planInfo.period?.includes("3 Bulan") || planInfo.period?.includes("3 bulan")) {
      paymentUrl = CHIP_PAYMENT_LINKS.guru_3bulan;
    } else {
      paymentUrl = CHIP_PAYMENT_LINKS.guru_1bulan;
    }
  }

  // Simpan data transaksi menunggu di localStorage untuk disahkan semasa redirect balik
  const pendingData = {
    planId: planInfo.id,
    name: planInfo.name,
    price: planInfo.price,
    period: planInfo.period,
    category: category,
    email: resolvedEmail,
    fullName: resolvedName,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem("bunyiKataPendingPlan", JSON.stringify(pendingData));
    if (resolvedEmail) {
      localStorage.setItem("bunyiKataPendingEmail", resolvedEmail);
      if (category === "guru") {
        localStorage.setItem("bunyiKataGuruEmail", resolvedEmail);
      } else {
        localStorage.setItem("bunyiKataIbubapaEmail", resolvedEmail);
      }
    }
    if (resolvedName) {
      localStorage.setItem("bunyiKataPendingName", resolvedName);
      if (category === "guru") {
        localStorage.setItem("bunyiKataNamaGuru", resolvedName);
      } else {
        localStorage.setItem("bunyiKataNamaKeluarga", resolvedName);
      }
    }
  } catch (err) {
    console.warn("[Chip Payment] Gagal menyimpan pending plan ke localStorage:", err);
  }

  console.log(`[Chip Payment] Memproses bayaran untuk: ${resolvedName} (${resolvedEmail}), Pakej: ${planInfo?.name}`);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://bunyi-kata-official.web.app";

  // 1. Minta pelayan mencipta sesi pembelian.
  //    Hanya pelayan memegang secret key & menetapkan harga rasmi.
  try {
    const res = await fetch("/api/chip/create-purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: resolvedEmail,
        name: resolvedName,
        fullName: resolvedName,
        planInfo,
        redirectOrigin: origin,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.checkout_url) {
        // Simpan purchase_id supaya status boleh disahkan semasa kembali.
        if (result.purchase_id) {
          try {
            localStorage.setItem("bunyiKataPendingPurchaseId", result.purchase_id);
          } catch (e) {}
        }
        window.location.href = result.checkout_url;
        return;
      }
    } else {
      console.warn("[Chip Payment] Pelayan menolak permintaan:", await res.text());
    }
  } catch (e) {
    console.warn("[Chip Payment] Tidak dapat menghubungi pelayan pembayaran:", e);
  }

  // 2. Sandaran: pautan pembayaran Chip yang telah didaftarkan.
  //    Tiada secret key digunakan di sini.
  if (paymentUrl) {
    try {

      const urlObj = new URL(paymentUrl);
      if (resolvedEmail) {
        urlObj.searchParams.set("client_email", resolvedEmail);
        urlObj.searchParams.set("email", resolvedEmail);
        urlObj.searchParams.set("client[email]", resolvedEmail);
      }
      if (resolvedName) {
        urlObj.searchParams.set("client_name", resolvedName);
        urlObj.searchParams.set("name", resolvedName);
        urlObj.searchParams.set("full_name", resolvedName);
        urlObj.searchParams.set("client[full_name]", resolvedName);
        urlObj.searchParams.set("client[name]", resolvedName);
      }
      console.log("[Chip Payment] Mengalihkan ke pautan pembayaran Chip dengan autofill:", urlObj.toString());
      window.location.href = urlObj.toString();
    } catch (urlErr) {
      window.location.href = paymentUrl;
    }
  } else {
    alert("Pautan pembayaran belum tersedia. Sila hubungi pentadbir sistem.");
  }
}

/**
 * Mengesahkan status pembayaran dengan CHIP melalui pelayan.
 *
 * PENTING: Ini satu-satunya cara yang dibenarkan untuk menentukan sama ada
 * pengguna benar-benar telah membayar. Parameter URL seperti `?payment=success`
 * TIDAK boleh dipercayai kerana sesiapa boleh menaipnya sendiri.
 *
 * @returns objek pengesahan; `paid: true` hanya jika CHIP mengesahkannya.
 */
export async function sahkanBayaranChip(purchaseId?: string): Promise<{
  paid: boolean;
  email?: string;
  planName?: string;
  planDays?: number;
  purchaseId?: string;
  amount?: number;
  message?: string;
}> {
  const id =
    (purchaseId || "").trim() ||
    localStorage.getItem("bunyiKataPendingPurchaseId") ||
    "";

  if (!id) {
    return { paid: false, message: "Tiada rujukan pembelian untuk disahkan." };
  }

  try {
    const res = await fetch(`/api/chip/verify-purchase/${encodeURIComponent(id)}`);
    if (!res.ok) {
      return { paid: false, message: "Pelayan tidak dapat mengesahkan pembayaran." };
    }

    const data = await res.json();
    if (!data?.paid) {
      return { paid: false, message: data?.message || "Pembayaran belum disahkan." };
    }

    return {
      paid: true,
      email: data.email || "",
      planName: data.plan?.name,
      planDays: data.plan?.days,
      purchaseId: data.purchase_id,
      amount: data.amount,
    };
  } catch (err: any) {
    return { paid: false, message: err?.message || "Ralat semasa mengesahkan pembayaran." };
  }
}

// Daftarkan ke window global supaya mudah diakses oleh mana-mana komponen
if (typeof window !== "undefined") {
  (window as any).bukaBayaranChip = bukaBayaranChip;
  (window as any).sahkanBayaranChip = sahkanBayaranChip;
  (window as any).CHIP_PAYMENT_LINKS = CHIP_PAYMENT_LINKS;
  (window as any).CHIP_CONFIG = CHIP_CONFIG;
}


