with open("src/App.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'padamProfilAnakIbuBapa()' in line:
        # We know this is inside the delete button block.
        # Let's find the start of <button and end of </button> around it
        start = i - 1
        end = i + 5
        print(f"Found at line {i}, removing lines {start} to {end}")
        del lines[start:end+1]
        break

with open("src/App.tsx", "w") as f:
    f.writelines(lines)
