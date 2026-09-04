with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_sebut = """        function sebutAudio(teks) {
            playBubble();
            if('speechSynthesis' in window) {"""
new_sebut = """        function sebutAudio(teks) {
            if('speechSynthesis' in window) {"""
content = content.replace(old_sebut, new_sebut)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
