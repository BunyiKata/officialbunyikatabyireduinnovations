import re

# 1. Update index.html
with open('index.html', 'r') as f:
    html = f.read()

html = html.replace(
    '''<div class="scene bs-scene" onclick="this.querySelector('.card').classList.toggle('is-flipped')">''',
    '''<div class="scene bs-scene" onclick="flipFlashcard(this)">'''
)

with open('index.html', 'w') as f:
    f.write(html)

# 2. Update public/app.js
with open('public/app.js', 'r') as f:
    app_js = f.read()

timer_logic = """
        let flashcardAttentionTimer = null;

        function flipFlashcard(sceneEl) {
            const card = sceneEl.querySelector('.card');
            if(card) {
                card.classList.toggle('is-flipped');
                resetFlashcardAttentionTimer();
            }
        }

        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const card = document.getElementById('sukukata-k3d-card');
                if (card && document.getElementById('view-belajar-sukukata').style.display !== 'none') {
                    card.classList.add('attention-pulse-glow');
                    setTimeout(() => card.classList.remove('attention-pulse-glow'), 1000);
                }
            }, 5000);
        }

        function resetFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            startFlashcardAttentionTimer();
        }
"""

# Insert timer logic before renderBelajarSukuKata
app_js = app_js.replace("function renderBelajarSukuKata() {", timer_logic + "\n        function renderBelajarSukuKata() {")

# Call start in renderBelajarSukuKata
render_func_replacement = """        function renderBelajarSukuKata() {
            startFlashcardAttentionTimer();"""

app_js = app_js.replace("function renderBelajarSukuKata() {", render_func_replacement)

# When leaving the screen, we should clear it. Or just let it run but it checks for view-belajar-sukukata display.
# But it's better to clear it in paparSkrin if it's not view-belajar-sukukata.
# Let's add clear to paparSkrin.
papar_skrin_old = "        function paparSkrin(screenId) {"
papar_skrin_new = """        function paparSkrin(screenId) {
            if (screenId !== 'view-belajar-sukukata' && typeof flashcardAttentionTimer !== 'undefined') {
                clearInterval(flashcardAttentionTimer);
            }"""

app_js = app_js.replace(papar_skrin_old, papar_skrin_new)

with open('public/app.js', 'w') as f:
    f.write(app_js)

