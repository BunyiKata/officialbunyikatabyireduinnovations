# Menetapkan rahsia sebenar untuk Firebase App Hosting.
#
# MENGAPA SKRIP INI ADA:
#   `firebase apphosting:secrets:set` biasanya bertanya nilai secara
#   interaktif. Itu gagal dalam terminal non-interactive dengan ralat
#   "does not have a default and cannot be answered in non-interactive mode".
#
#   Jalan pintas yang jelas -- `echo nilai | firebase ... --data-file -` --
#   ROSAK secara senyap di Windows: pipeline PowerShell menambah `\r\n`,
#
#   Skrip ini menggunakan [IO.File]::WriteAllText yang TIDAK menambah
#   baris baru, kemudian mengesahkan panjang bait selepas menyimpan.
#
# KESELAMATAN:
#   - Nilai diminta dengan input tersembunyi (tidak muncul di skrin
#     dan tidak masuk ke dalam sejarah PowerShell).
#   - Fail sementara ditulis ke $env:TEMP, kemudian ditimpa dengan sifar
#     dan dibuang dalam blok `finally` supaya ia hilang walaupun berlaku
#     ralat atau Ctrl+C.
#
# CARA JALAN:
#   powershell -ExecutionPolicy Bypass -File scripts/set_secrets.ps1

$ErrorActionPreference = 'Stop'
$projek = 'bunyi-kata-official'

function Set-Rahsia {
    param(
        [string]$Nama,
        [string]$Penerangan
    )

    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host " $Nama" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host $Penerangan
    Write-Host ""

    $selamat = Read-Host -Prompt "Taip nilai (tersembunyi)" -AsSecureString
    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($selamat)
    try {
        $nilai = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }

    if ([string]::IsNullOrWhiteSpace($nilai)) {
        Write-Host "  DILANGKAU: tiada nilai diberi." -ForegroundColor Yellow
        return
    }

    # Amaran jika nilai mengandungi ruang di hujung -- hampir selalu
    # tersalin secara tidak sengaja daripada portal.
    if ($nilai -ne $nilai.Trim()) {
        Write-Host "  AMARAN: nilai ada ruang/baris baru di hujung." -ForegroundColor Yellow
        $jawab = Read-Host "  Buang ruang tersebut? (y/n)"
        if ($jawab -eq 'y') { $nilai = $nilai.Trim() }
    }

    # Amaran khusus: '#' merosakkan laluan RTDB (pepijat yang baru dibetulkan).
    if ($Nama -eq 'ADMIN_CODE' -and $nilai.Contains('#')) {
        Write-Host "  AMARAN: ADMIN_CODE mengandungi '#'." -ForegroundColor Yellow
        Write-Host "  Aksara ini bermasalah dalam laluan RTDB. Pertimbang tukar." -ForegroundColor Yellow
    }

    $panjangDijangka = [Text.Encoding]::UTF8.GetByteCount($nilai)
    $fail = Join-Path $env:TEMP ("bk_" + [Guid]::NewGuid().ToString('N') + ".tmp")

    try {
        # WriteAllText TIDAK menambah baris baru, berbeza dengan
        # Set-Content / Out-File / pipeline `|`.
        [IO.File]::WriteAllText($fail, $nilai, (New-Object Text.UTF8Encoding($false)))

        $ditulis = (Get-Item $fail).Length
        if ($ditulis -ne $panjangDijangka) {
            throw "Panjang fail ($ditulis bait) tidak sepadan dengan nilai ($panjangDijangka bait)."
        }

        Write-Host "  Menghantar $panjangDijangka bait ke Secret Manager..." -ForegroundColor Gray
        & npx --yes firebase apphosting:secrets:set $Nama --project $projek --data-file $fail --force
        if ($LASTEXITCODE -ne 0) { throw "firebase apphosting:secrets:set gagal (kod $LASTEXITCODE)" }
    }
    finally {
        if (Test-Path $fail) {
            # Timpa dengan sifar sebelum buang, supaya nilai tidak
            # tertinggal dalam blok cakera yang dibebaskan.
            try {
                $bilangan = (Get-Item $fail).Length
                [IO.File]::WriteAllBytes($fail, (New-Object byte[] $bilangan))
            } catch { }
            Remove-Item $fail -Force -ErrorAction SilentlyContinue
        }
    }

    # Sahkan: baca balik dan bandingkan panjang bait.
    $dibaca = & npx --yes firebase apphosting:secrets:access $Nama --project $projek
    $dibaca = ($dibaca | Out-String)
    # Buang baris baru yang ditambah oleh pipeline PowerShell semasa membaca,
    # bukan oleh nilai yang disimpan.
    $dibacaBersih = $dibaca -replace "(`r`n|`n)+$", ""
    $panjangDibaca = [Text.Encoding]::UTF8.GetByteCount($dibacaBersih)

    if ($panjangDibaca -eq $panjangDijangka) {
        Write-Host "  OK: disimpan dan disahkan ($panjangDijangka bait, tiada baris baru tambahan)." -ForegroundColor Green
    } else {
        Write-Host "  AMARAN: dijangka $panjangDijangka bait, dibaca $panjangDibaca bait." -ForegroundColor Red
        Write-Host "  Sila periksa nilai ini secara manual." -ForegroundColor Red
    }

    $nilai = $null
}


Write-Host ""
Write-Host "Menetapkan rahsia App Hosting untuk projek: $projek" -ForegroundColor White
Write-Host "Hanya 1 rahsia diperlukan. Yang lain adalah nilai awam" -ForegroundColor Gray
Write-Host "dalam apphosting.yaml (kunci Firebase web memang awam)." -ForegroundColor Gray

Set-Rahsia -Nama 'ADMIN_CODE' -Penerangan @"
Kod admin yang anda taip dalam kotak kod biasa untuk masuk mod admin.
Anda PILIH SENDIRI nilai ini (ia tiada dalam .env).
Elakkan aksara:  #  .  `$  [  ]  /
"@

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Selesai" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Langkah seterusnya:" -ForegroundColor White
Write-Host "  1. Cipta backend:" -ForegroundColor Gray
Write-Host "     npx firebase apphosting:backends:create --project $projek" -ForegroundColor Yellow
Write-Host "     region=asia-southeast1, root=/, branch=main, TOLAK rollout serta-merta" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Beri backend akses kepada rahsia (WAJIB, selepas backend ada):" -ForegroundColor Gray
Write-Host "     npx firebase apphosting:secrets:grantaccess ADMIN_CODE --project $projek --backend <ID>" -ForegroundColor Yellow
Write-Host ""
