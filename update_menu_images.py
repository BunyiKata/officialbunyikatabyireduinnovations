import os
import shutil

source_dir = os.path.join(os.getcwd(), "GAMBAR MENU")
target_public_dir = os.path.join(os.getcwd(), "public", "images", "menu")
target_dist_dir = os.path.join(os.getcwd(), "dist", "images", "menu")

os.makedirs(target_public_dir, exist_ok=True)
os.makedirs(target_dist_dir, exist_ok=True)

files = os.listdir(source_dir)
print(f"Found {len(files)} files in {source_dir}")

for file in files:
    src_file = os.path.join(source_dir, file)
    if os.path.isfile(src_file):
        pub_dest = os.path.join(target_public_dir, file)
        shutil.copy2(src_file, pub_dest)
        dist_dest = os.path.join(target_dist_dir, file)
        shutil.copy2(src_file, dist_dest)
        print(f"Copied: {file}")

print("All menu images copied successfully!")
