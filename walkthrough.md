# Ringkasan Penambahbaikan Terkini Mod AR

Penambahbaikan tambahan telah berjaya dilaksanakan mengikut maklum balas terkini:

---

### 1. Paparan Soalan AR Nombor Menggunakan Gambar Biskut
- **Penggantian Gambar**: Gambar itik/epal terdahulu telah digantikan sepenuhnya dengan gambar biskut coklat 3D yang kemas (`/images/nombor/biskut.png`).
- **Susunan 1 atau Maksimum 2 Baris**:
  - **1 hingga 5 biskut**: Disusun dalam **1 baris** di tengah ruangan putih dengan saiz biskut yang besar dan jelas (62px – 88px).
  - **6 hingga 10 biskut**: Disusun dalam **tepat 2 baris** (tidak melebihi 2 baris):
    - 6 biskut: 3 atas, 3 bawah (56px)
    - 7 biskut: 4 atas, 3 bawah (56px)
    - 8 biskut: 4 atas, 4 bawah (56px)
    - 9 biskut: 5 atas, 4 bawah (50px)
    - 10 biskut: 5 atas, 5 bawah (50px)
- **Responsif**: Memastikan susunan muat dengan elok di dalam kotak putih tanpa terkeluar atau terpotong pada paparan komputer mahupun telefon pintar (*mobile*).

---

### 2. Pembuangan Teks `(1 - 10)` Pada Lencana Tajuk AR
- Pada bahagian tajuk kemahiran atas kotak soalan (lencana kuning):
  - **AR Tambah**: Kini memaparkan `<i class="fa-solid fa-plus"></i> AR Tambah` sahaja.
  - **AR Tolak**: Kini memaparkan `<i class="fa-solid fa-minus"></i> AR Tolak` sahaja.
  - **AR Nombor**: Kini memaparkan `<i class="fa-solid fa-hand"></i> AR Nombor` sahaja.
- Teks dalam kurungan `(1 - 10)` telah dikeluarkan sepenuhnya daripada ketiga-tiga mod.

---

### 3. Pembuangan Tagging / Lencana Kecil AR Pada Pop-up "Pilih Mod AR"
- Tagging / lencana kecil `AR` di bucu kanan atas setiap kad telah dibuang dari kesemua 4 kad (**AR ABC**, **AR Nombor**, **AR Tambah**, dan **AR Tolak**).
- Reka bentuk kini kelihatan lebih bersih, kemas, dan seimbang dengan jubin beranimasi serta bintang berkilau.

---

### 4. Pengesahan Binaan
- Binaan pengeluaran `npm run build` berjaya dihasilkan tanpa sebarang ralat (exit code 0).
