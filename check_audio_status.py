import os

with open(os.path.join('public', 'app-logic.js'), 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find("var knownSukukata = [")
end_idx = code.find("];", start_idx)
known_str = code[start_idx:end_idx+2]

words = ['pin', 'pam', 'pen', 'kot', 'pil', 'garpu', 'cermin']
for w in words:
    in_known = f"'{w}'" in known_str
    file_path = os.path.join('public', 'audio', 'sukukata', f'{w}.mp3')
    exists = os.path.exists(file_path)
    file_size = os.path.getsize(file_path) if exists else 0
    print(f"Word '{w}': in_knownSukukata={in_known}, mp3_exists={exists}, size={file_size} bytes")
