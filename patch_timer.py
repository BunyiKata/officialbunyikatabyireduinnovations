import re

with open('public/app.js', 'r') as f:
    js = f.read()

# Replace the timer function
old_timer_logic = """        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const card = document.querySelector('.scene.bs-scene');
                if (card && document.getElementById('view-belajar-sukukata').style.display !== 'none') {
                    card.classList.add('attention-pulse-glow');
                    setTimeout(() => card.classList.remove('attention-pulse-glow'), 1000);
                }
            }, 5000);
        }"""

new_timer_logic = """        function startFlashcardAttentionTimer() {
            clearInterval(flashcardAttentionTimer);
            flashcardAttentionTimer = setInterval(() => {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen) {
                    const sceneEl = activeScreen.querySelector('.scene');
                    if (sceneEl) {
                        sceneEl.classList.add('attention-pulse-glow');
                        setTimeout(() => sceneEl.classList.remove('attention-pulse-glow'), 1000);
                    }
                }
            }, 5000);
        }"""

js = js.replace(old_timer_logic, new_timer_logic)

# Add to flipCardAndSync
js = js.replace("function flipCardAndSync() {", "function flipCardAndSync() {\n            resetFlashcardAttentionTimer();")

# Add to initBelajarSukuKata? No, startFlashcardAttentionTimer is already called in renderBelajarSukuKata.
# Wait, what about view-belajar-huruf? We should call startFlashcardAttentionTimer in `renderFlashcard` (which renders the huruf card).
js = js.replace("function renderFlashcard() {", "function renderFlashcard() {\n            startFlashcardAttentionTimer();")


with open('public/app.js', 'w') as f:
    f.write(js)
