import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "Pilih nama anak anda untuk melihat statistik &amp; laporan",
    "Pilih profil anak anda untuk melihat statistik &amp; laporan"
)
content = content.replace(
    "Sila Pilih Nama Anak:",
    "Sila Pilih Profil Anak:"
)
with open('src/App.tsx', 'w') as f:
    f.write(content)
