import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Define patterns to remove
screens_to_remove = [
    r'<div id="murid-menu-belajar" className="screen">.*?<div id="murid-menu-latihan" className="screen">',
    r'<div id="murid-menu-latihan" className="screen">.*?<div id="view-learn-1" className="screen">',
    r'<div id="view-learn-1" className="screen">.*?<div id="view-learn-2" className="screen">',
    r'<div id="view-learn-2" className="screen">.*?<div id="view-latihan-1" className="screen">',
    r'<div id="view-latihan-1" className="screen">.*?<div id="view-latihan-2" className="screen">',
    r'<div id="view-latihan-2" className="screen">.*?<div id="view-latihan-5" className="screen">',
    r'<div id="view-latihan-5" className="screen">.*?<div id="view-learn-4" className="screen">',
    r'<div id="view-learn-4" className="screen">.*?<div id="view-latihan-3" className="screen">',
    r'<div id="view-latihan-3" className="screen">.*?<div id="view-latihan-4" className="screen">',
    r'<div id="view-latihan-4" className="screen">.*?<div id="view-latihan-carikata" className="screen">',
    r'<div id="view-latihan-carikata" className="screen">.*?<div id="view-latihan-tarikgaris" className="screen">',
    r'<div id="view-latihan-tarikgaris" className="screen">.*?<div id="view-latihan-kuizaudio" className="screen">',
    r'<div id="view-latihan-kuizaudio" className="screen">.*?<div id="view-latihan-susunkata" className="screen">',
    r'<div id="view-latihan-susunkata" className="screen">.*?<div id="leaderboard-screen" className="screen">'
]

for pattern in screens_to_remove:
    # Use re.DOTALL to match across newlines
    content = re.sub(pattern, '<div id="' + pattern.split('"')[1] + '" className="screen">', content, flags=re.DOTALL)
    # Wait, the above logic removes everything BETWEEN the start of one and the start of the next,
    # BUT it leaves the starting tag of the next one.
    
# Actually it's easier to just match from <div id="murid-menu-belajar" ... to <div id="leaderboard-screen" ...
# Because they are contiguous!
full_pattern = r'<div id="murid-menu-belajar" className="screen">.*?<div id="leaderboard-screen" className="screen">'
content = re.sub(full_pattern, '<div id="leaderboard-screen" className="screen">', content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Removed old screens!")
