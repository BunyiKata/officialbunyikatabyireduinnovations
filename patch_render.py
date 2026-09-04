with open('public/app.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "function renderBelajarSukuKata()" in lines[i]:
        # the next few lines are:
        # startFlashcardAttentionTimer();
        # const card = document.querySelector('.scene.bs-scene');
        # if (card) card.classList.remove('is-flipped');
        
        # We need to change that specific line back to getElementById
        if "document.querySelector('.scene.bs-scene')" in lines[i+2]:
            lines[i+2] = lines[i+2].replace("document.querySelector('.scene.bs-scene')", "document.getElementById('sukukata-k3d-card')")

with open('public/app.js', 'w') as f:
    f.writelines(lines)
