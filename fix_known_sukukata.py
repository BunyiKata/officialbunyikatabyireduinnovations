import os

app_logic_path = os.path.join('public', 'app-logic.js')
with open(app_logic_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Locate var knownSukukata = [...];
start_marker = "var knownSukukata = ["
end_marker = "];"

start_idx = code.find(start_marker)
if start_idx != -1:
    end_idx = code.find(end_marker, start_idx)
    if end_idx != -1:
        known_list_str = code[start_idx + len(start_marker):end_idx]
        items = [x.strip().strip("'").strip('"') for x in known_list_str.split(',') if x.strip()]
        
        # Add new target words if missing
        new_words = ['pin', 'pam', 'pen', 'kot', 'pil', 'garpu']
        for w in new_words:
            if w not in items:
                items.append(w)
                print(f"Added {w} to knownSukukata")
        
        # Sort items
        items = sorted(list(set(items)))
        
        new_known_str = "var knownSukukata = [" + ",".join([f"'{x}'" for x in items]) + "];"
        
        code = code[:start_idx] + new_known_str + code[end_idx + len(end_marker):]
        
        with open(app_logic_path, 'w', encoding='utf-8') as f:
            f.write(code)
        print("Successfully updated knownSukukata in public/app-logic.js!")
    else:
        print("End marker ]; not found")
else:
    print("Start marker var knownSukukata not found")
