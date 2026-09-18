# Panduan Deploy Peraturan Keselamatan (S5) — Bunyi Kata

> ## ✅ STATUS: SUDAH DIDEPLOY
> Peraturan S5 **telah dideploy ke Firebase** pada projek `bunyi-kata-official`
> (database `bunyi-kata-official-default-rtdb`). Dokumen ini disimpan sebagai
> **rujukan** untuk semakan masa depan, rollback, atau deploy semula.
>
> Cara pantas deploy semula (CLI — disyorkan):
> ```bash
> npx firebase-tools deploy --only database --project bunyi-kata-official
> ```

> **Untuk siapa:** Pemilik / pentadbir projek Bunyi Kata.
> **Tujuan:** Menerbitkan (deploy) peraturan keselamatan Realtime Database (Fail `database.rules.json`) ke Firebase supaya data murid, guru, dan ibu bapa dilindungi.
> **Masa dijangka:** 5–10 minit.
> **Prasyarat:** Akses ke [Firebase Console](https://console.firebase.google.com) dengan akaun yang mempunyai kebenaran pemilik projek.

---

## ⚠️ BACA DULU — Kenapa Ini Penting

Sebelum ini, peraturan pangkalan data mungkin **terbuka** (sesiapa sahaja boleh baca/tulis). Selepas deploy S5:

- ✅ Hanya pengguna yang **sah** boleh baca/tulis data mereka sendiri.
- ✅ Data murid dilindungi daripada akses luar.
- ⚠️ Jika peraturan tersilap, aplikasi boleh **rosak** (guru/ibu bapa tidak dapat log masuk).

**Nasihat:** Uji dahulu di **emulator** atau projek ujian jika anda ragu. Simpan sandaran data sebelum sebarang perubahan besar:

```bash
npm run backup
```

---

## Langkah 1 — Buka Firebase Console

1. Pergi ke 👉 https://console.firebase.google.com
2. **Log masuk** dengan akaun Google yang memiliki projek Bunyi Kata.
3. Pada senarai projek, klik **projek Bunyi Kata** anda.

---

## Langkah 2 — Pergi ke Realtime Database Rules

1. Pada menu kiri, cari **Build** (Ikon bina/atas) → klik **Realtime Database**.
2. Anda akan nampak dua tab di bahagian atas: **Data** dan **Rules**.
3. Klik tab **Rules**.

---

## Langkah 3 — Salin Peraturan S5 dari Projek

1. Buka fail **`database.rules.json`** dalam folder projek Bunyi Kata (gunakan VS Code atau Notepad).
2. **Pilih SEMUA** kandungan fail (Ctrl+A) dan **salin** (Ctrl+C).

> 💡 Fail ini mengandungi peraturan penuh S1–S7 yang telah dikaji. **Jangan** taip sendiri — salin terus supaya tiada kesilapan.

---

## Langkah 4 — Tampal & Terbitkan dalam Firebase

1. Dalam tab **Rules** di Firebase Console, padam semua kandungan kotak editor.
2. **Tampal** (Ctrl+V) peraturan yang disalin.
3. Klik butang **Publish** (biru) di kanan atas.
4. Tunggu sehingga mesej **"Rules published successfully"** muncul. ✅

---

## Langkah 5 — Sahkan Peraturan Berjaya

1. Masih dalam tab **Rules** — pastikan kod yang dipaparkan **sama** dengan fail `database.rules.json` anda.
2. Buka aplikasi Bunyi Kata dan **uji**:
   - Log masuk sebagai **guru** atau **ibu bapa** → pastikan berjaya.
   - Cuba akses data murid → pastikan boleh dibaca oleh akaun yang sah.
3. Jika ada masalah, rujuk **Bahagian Pemulihan** di bawah.

---

## Bahagian Pemulihan — Jika Ada Masalah

### Jika aplikasi rosak selepas deploy

1. Pergi semula ke **Realtime Database → Rules**.
2. Ganti dengan peraturan LAMA (jika anda menyimpan salinan) **ATAU** peraturan minimum sementara:
   ```json
   {
     "rules": {
       ".read": "auth != null",
       ".write": "auth != null"
     }
   }
   ```
   ⚠️ **Hanya untuk pemulihan segera** — jangan biarkan lama.
3. Klik **Publish**.
4. Hubungi pembangun / rujuk semula `database.rules.json`.

### Jika tamat kuota / had

Bila hampir had use Firebase (Spark plan), peraturan masih boleh deploy. Had utama nanti adalah **jumlah data** — kini hanya boleh beroperasi bila dinaik ke Blaze.

---

## Maklumat Rujukan

| Perkara | Lokasi / Nilai |
| --- | --- |
| Fail peraturan | `database.rules.json` (root projek) |
| Skrip sandaran | `npm run backup` → folder `backups/` |
| Firebase Console | https://console.firebase.google.com |
| Rujukan peraturan | https://firebase.google.com/docs/rules |

---

## Senarai Semak Ringkas

- [ ] Log masuk Firebase Console
- [ ] Buka Realtime Database → tab **Rules**
- [ ] Salin `database.rules.json` dari projek
- [ ] Tampal & klik **Publish**
- [ ] Sahkan mesej kejayaan
- [ ] Uji log masuk guru/ibu bapa dalam aplikasi
- [ ] Jalankan `npm run backup` sebagai sandaran

---

*Dokumen ini disediakan sebagai sebahagian daripada persediaan pelancaran Bunyi Kata.*
