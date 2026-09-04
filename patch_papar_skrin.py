with open('public/app.js', 'r') as f:
    js = f.read()

js = js.replace("""        function paparSkrin(screenId) {
            if (screenId !== 'view-belajar-sukukata' && typeof flashcardAttentionTimer !== 'undefined') {
                clearInterval(flashcardAttentionTimer);
            }""", """        function paparSkrin(screenId) {
            if (typeof flashcardAttentionTimer !== 'undefined') {
                clearInterval(flashcardAttentionTimer);
            }""")

with open('public/app.js', 'w') as f:
    f.write(js)
