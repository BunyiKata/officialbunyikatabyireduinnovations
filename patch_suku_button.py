with open('index.html', 'r') as f:
    html = f.read()

old_html = """                    <div class="bs-word-container">
                        <div id="sukukata-word" class="bs-word-text">bot</div>
                    </div>"""

new_html = """                    <button class="bs-word-container neo-btn" style="background: white; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 20px; width: 100%; border-radius: 20px; cursor: pointer; text-transform: none; padding: 15px;" onclick="mainAudioSukuKataSemasa()">
                        <span id="sukukata-word" class="bs-word-text">bot</span>
                        <div class="neo-btn bg-blue" style="min-width: 50px; width: 50px; height: 50px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; pointer-events: none;"><i class="fa-solid fa-volume-high" style="color: white; font-size: 1.5rem;"></i></div>
                    </button>"""

if old_html in html:
    html = html.replace(old_html, new_html)
else:
    print("Old HTML not found.")

with open('index.html', 'w') as f:
    f.write(html)
