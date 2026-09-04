import os
import shutil

src = os.path.join('BUNYI KATA AUDIO 2027', 'AUDIO SUKU KATA', 'AUDIO MISI SUKU KATA HERO', 'KVK+KV', 'garpu.mp3')
dest1 = os.path.join('public', 'audio', 'sukukata', 'garpu.mp3')
dest2 = os.path.join('public', 'audio', 'sukukata', 'garfu.mp3')
dest3 = os.path.join('dist', 'audio', 'sukukata', 'garpu.mp3')
dest4 = os.path.join('dist', 'audio', 'sukukata', 'garfu.mp3')

for d in [dest1, dest2, dest3, dest4]:
    os.makedirs(os.path.dirname(d), exist_ok=True)
    shutil.copy2(src, d)
    print(f"Verified & Copied -> {d} ({os.path.getsize(d)} bytes)")
