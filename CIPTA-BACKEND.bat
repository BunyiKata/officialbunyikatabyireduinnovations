@echo off
cd /d "%~dp0"
title Cipta Backend App Hosting - bunyi-kata-official

echo =====================================================
echo   CIPTA BACKEND APP HOSTING - bunyi-kata-official
echo =====================================================
echo.
echo  Tetapan sudah DIKUNCI (tiada soalan region lagi):
echo     region  = asia-southeast1  (Singapura)
echo     backend = bunyikata
echo     root    = /
echo     runtime = nodejs22
echo.
echo  KALI INI LEBIH MUDAH - sambungan GitHub sudah tersimpan.
echo  Yang akan ditanya hanyalah:
echo     1. Akaun GitHub    -^> pilih: BunyiKata            lalu Enter
echo     2. Repo            -^> officialbunyikatabyireduinnovations
echo     3. Branch          -^> main                        lalu Enter
echo     4. Deploy now?     -^> taip huruf: n   lalu Enter   (WAJIB n, JANGAN Y)
echo.
echo  Sebab kena jawab n: backend belum ada kebenaran baca
echo  ADMIN_CODE dan CHIP_SECRET_KEY. Kalau deploy sekarang, build GAGAL.
echo.
echo  TANDA BERJAYA yang kena cari di skrin:
echo     "Successfully created backend"
echo     dan satu URL berakhir dengan .hosted.app
echo.
echo =====================================================
echo  Tekan mana-mana kekunci untuk MULA...
echo =====================================================
pause >nul
echo.

call npx firebase apphosting:backends:create --project bunyi-kata-official --primary-region asia-southeast1 --backend bunyikata --root-dir / --runtime nodejs22 -a 1:275606412587:web:1429636d9601afa285796e

echo.
echo =====================================================
echo  SELESAI. Sekarang beritahu agent: "dah siap"
echo  supaya agent boleh jalankan grantaccess sebelum push.
echo =====================================================
echo.
pause
