// Ujian penerimaan terhadap backend App Hosting yang sudah hidup.
const BASE = "https://bunyikata--bunyi-kata-official.asia-southeast1.hosted.app";

function lulus(ok) {
  return ok ? "LULUS" : "GAGAL <-- PERIKSA";
}

// 1) Halaman utama mesti dilayan oleh Express + Vite build.
{
  const res = await fetch(BASE + "/");
  const html = await res.text();
  const adaRoot = html.includes('id="root"');
  const adaAsset = /\/assets\/index-[\w-]+\.js/.test(html);
  console.log("1) GET /");
  console.log("   status      = " + res.status + "  " + lulus(res.status === 200));
  console.log("   div#root    = " + lulus(adaRoot));
  console.log("   bundle JS   = " + lulus(adaAsset));
  // Rahsia TIDAK BOLEH muncul dalam HTML.
  console.log("   tiada rahsia= " + lulus(!/sk_|SECRET/i.test(html)));
  console.log("");
}

// 2) Kod admin salah mesti ditolak, dan JANGAN 500 (500 = SA tak boleh sign).
{
  const res = await fetch(BASE + "/api/admin/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kod: "kod-salah-sengaja-12345" }),
  });
  const json = await res.json().catch(() => ({}));
  console.log("2) POST /api/admin/verify  (kod SALAH)");
  console.log("   status      = " + res.status + "  " + lulus(res.status === 401));
  console.log("   success     = " + json.success + "  " + lulus(json.success === false));
  console.log("   bukan 500   = " + lulus(res.status !== 500));
  console.log("   mesej       = " + (json.message || "-"));
  console.log("");
}

// 3) Laluan audio warisan mesti masih berfungsi.
{
  const res = await fetch(BASE + "/AUDIO%20FONIK/", { redirect: "manual" });
  console.log("3) Middleware audio warisan");
  console.log("   status      = " + res.status + "  (bukan 5xx = OK)");
  console.log("   " + lulus(res.status < 500));
  console.log("");
}

// 4) Fallback SPA: laluan tak dikenali mesti pulangkan index.html, bukan 404.
{
  const res = await fetch(BASE + "/laluan-rekaan-untuk-ujian");
  const html = await res.text();
  console.log("4) Fallback SPA");
  console.log("   status      = " + res.status + "  " + lulus(res.status === 200));
  console.log("   div#root    = " + lulus(html.includes('id="root"')));
}
