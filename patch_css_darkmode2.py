with open("public/styles.css", "r") as f:
    css = f.read()

new_css = """
/* MORE DARK MODE FIXES */
body.dark-mode {
    color: #f8fafc !important;
}

body.dark-mode .screen {
    color: #f8fafc;
}

body.dark-mode h1,
body.dark-mode h2,
body.dark-mode h3,
body.dark-mode h4,
body.dark-mode h5,
body.dark-mode p,
body.dark-mode span {
    color: #f8fafc;
}

body.dark-mode .neo-btn:not(.bg-orange):not(.bg-blue):not(.bg-green):not(.bg-purple):not(.bg-red):not(.bg-yellow) {
    background-color: #334155;
    color: #f8fafc;
    border-color: #0f172a;
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
