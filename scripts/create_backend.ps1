# Cipta App Hosting backend untuk Bunyi Kata.
# Semua pilihan sudah ditetapkan sebagai flag supaya picker anak panah
# untuk region TIDAK keluar (elak tersalah pilih us-east4).

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)

Write-Host ''
Write-Host '=====================================================' -ForegroundColor Cyan
Write-Host ' CIPTA BACKEND APP HOSTING - bunyi-kata-official' -ForegroundColor Cyan
Write-Host '=====================================================' -ForegroundColor Cyan
Write-Host ''
Write-Host ' Tetapan yang sudah dikunci (tiada prompt):' -ForegroundColor Gray
Write-Host '   region  = asia-southeast1  (Singapura)'
Write-Host '   backend = bunyikata'
Write-Host '   root    = /'
Write-Host '   runtime = nodejs22'
Write-Host '   web app = 1:275606412587:web:1429636d9601afa285796e'
Write-Host ''
Write-Host ' HANYA 3 perkara akan ditanya:' -ForegroundColor Yellow
Write-Host '   1. Sambung GitHub  -> benarkan dalam browser, pilih repo'
Write-Host '   2. Pilih branch    -> guna anak panah, pilih: main'
Write-Host '   3. Deploy now?     -> taip: n   (WAJIB n, jangan Y)' -ForegroundColor Red
Write-Host ''
Write-Host ' Sebab kena jawab n: backend belum ada kebenaran baca' -ForegroundColor Gray
Write-Host ' ADMIN_CODE. Rollout sekarang = build gagal.' -ForegroundColor Gray
Write-Host ''
Read-Host ' Tekan Enter untuk mula (atau Ctrl+C untuk batal)'
Write-Host ''

npx firebase apphosting:backends:create `
  --project bunyi-kata-official `
  --primary-region asia-southeast1 `
  --backend bunyikata `
  --root-dir / `
  --runtime nodejs22 `
  -a 1:275606412587:web:1429636d9601afa285796e

Write-Host ''
Write-Host '=====================================================' -ForegroundColor Cyan
Write-Host ' Selesai. Beritahu agent supaya jalankan grantaccess' -ForegroundColor Cyan
Write-Host ' untuk ADMIN_CODE sebelum push.' -ForegroundColor Cyan
Write-Host '=====================================================' -ForegroundColor Cyan
Write-Host ''
