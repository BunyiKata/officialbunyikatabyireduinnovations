import os

target_dirs = ['BUNYI KATA AUDIO 2027', 'public/audio', 'dist/audio']

for base in target_dirs:
    if os.path.exists(base):
        for root, dirs, files in os.walk(base):
            for f in files:
                if 'garpu' in f.lower() or 'garfu' in f.lower():
                    full_path = os.path.join(root, f)
                    size = os.path.getsize(full_path)
                    print(f"FOUND: {full_path} ({size} bytes)")
