with open("public/styles.css", "r") as f:
    css = f.read()

new_css = """
/* DARK MODE OVERRIDES */
body.dark-mode .island-node {
    background-color: #1e293b !important;
    border-color: #0f172a !important;
    box-shadow: 2px 3px 0px rgba(0,0,0,0.8) !important;
}

body.dark-mode .island-inner-box {
    background-color: #0f172a !important;
    border-color: #020617 !important;
}

body.dark-mode .island-inner-box.locked {
    background-color: #334155 !important;
    border-color: #020617 !important;
    filter: grayscale(100%) brightness(0.6) !important;
}

body.dark-mode .island-title-text,
body.dark-mode .island-inner-text {
    color: #f8fafc !important;
}

body.dark-mode .module-lock-icon {
    color: #e2e8f0 !important;
    text-shadow: 0px 2px 4px rgba(0,0,0,0.9) !important;
}

body.dark-mode .island-node:not(.locked):hover {
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.6), 2px 3px 0px rgba(0,0,0,0.8) !important;
}

body.dark-mode .neo-box {
    background-color: #1e293b !important;
    color: #f8fafc !important;
    border-color: #0f172a !important;
}

body.dark-mode .neo-box h1,
body.dark-mode .neo-box h2,
body.dark-mode .neo-box h3,
body.dark-mode .neo-box p,
body.dark-mode .neo-box span {
    color: #f8fafc !important;
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
