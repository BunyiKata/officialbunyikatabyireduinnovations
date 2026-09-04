import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

target = """        window.sebutAudio = function(teks) {
            if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setTimeout(() => {
                    const s = new SpeechSynthesisUtterance(teks);
                    s.lang = 'ms-MY'; s.rate = 0.85; window.speechSynthesis.speak(s);
                }, 50);
            }
        };"""

replacement = """        window.sebutAudio = function(teks) {
            if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const s = new SpeechSynthesisUtterance(teks);
                s.lang = 'ms-MY'; s.rate = 0.85; 
                window.speechSynthesis.speak(s);
            }
        };"""

content = content.replace(target, replacement)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched sebutAudio")
