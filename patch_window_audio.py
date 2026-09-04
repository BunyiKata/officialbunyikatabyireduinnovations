import re

with open('public/app.js', 'r') as f:
    js = f.read()

js = js.replace("function mainAudioSukuKataSemasa() {", "window.mainAudioSukuKataSemasa = function() {")

with open('public/app.js', 'w') as f:
    f.write(js)
