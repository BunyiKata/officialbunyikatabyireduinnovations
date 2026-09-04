with open("public/app.js", "r") as f:
    js = f.read()

js = js.replace("btn.style.fontSize = '2.5rem';", "btn.style.fontSize = '2rem';")
js = js.replace("btn.style.padding = '20px';", "btn.style.padding = '10px 5px';")
js = js.replace("btn.style.minHeight = '90px';", "btn.style.minHeight = '65px';")
js = js.replace("btn.style.minWidth = '0';", "btn.style.minWidth = '0';") # ensuring minWidth doesn't affect it

with open("public/app.js", "w") as f:
    f.write(js)
