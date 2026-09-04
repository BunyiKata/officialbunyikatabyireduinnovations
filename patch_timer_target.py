with open('public/app.js', 'r') as f:
    js = f.read()

# The timer targets 'sukukata-k3d-card' right now.
js = js.replace(
    "const card = document.getElementById('sukukata-k3d-card');",
    "const card = document.querySelector('.scene.bs-scene');"
)

with open('public/app.js', 'w') as f:
    f.write(js)
