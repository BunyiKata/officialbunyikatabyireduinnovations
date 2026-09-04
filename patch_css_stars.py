with open("public/styles.css", "r") as f:
    css = f.read()

# Update .stars-container
css = css.replace(".stars-container { display: flex; gap: 4px; position: absolute; top: -22px; z-index: 5; }", 
                  ".stars-container { display: flex; gap: 4px; position: absolute; top: -14px; z-index: 10; left: 50%; transform: translateX(-50%); }")

with open("public/styles.css", "w") as f:
    f.write(css)
