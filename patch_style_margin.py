with open("public/styles.css", "r") as f:
    css = f.read()

# Add specific padding to view-belajar-huruf map-top-bar to push it down
css += "\n\n/* Fix view-belajar-huruf padding */\n#view-belajar-huruf .map-top-bar { margin-top: 30px !important; }\n"

with open("public/styles.css", "w") as f:
    f.write(css)
