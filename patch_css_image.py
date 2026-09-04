with open("public/styles.css", "r") as f:
    css = f.read()

new_css = """
.island-inner-image {
    width: 100%;
    height: 100%;
    min-height: 80px;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.island-inner-box {
    padding: 0 !important;
    overflow: hidden;
}
.island-inner-box.locked {
    padding: 10px !important;
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
