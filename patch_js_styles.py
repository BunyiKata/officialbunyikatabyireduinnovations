with open("public/app.js", "r") as f:
    js = f.read()

orig_js = """        btn.className = 'neo-btn bg-purple';
        btn.style.fontSize = '2rem';
        btn.style.fontWeight = 'bold';
        btn.style.padding = '10px 5px';
        btn.style.minHeight = '65px';
        btn.style.minWidth = '0';"""

new_js = """        btn.className = 'neo-btn bg-purple btn-huruf-grid';"""

js = js.replace(orig_js, new_js)

with open("public/app.js", "w") as f:
    f.write(js)
