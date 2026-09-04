with open("public/styles.css", "r") as f:
    css = f.read()

new_css = """
/* MODERN NAV BUTTONS */
.student-nav-bar .nav-item.nav-modern {
    background-color: #ffffff;
    color: var(--color-dark);
    border: 3px solid var(--color-dark);
    box-shadow: 2px 3px 0 var(--color-dark);
}
.student-nav-bar .nav-item.nav-modern:active {
    box-shadow: 0px 1px 0px 0px var(--color-dark);
    transform: translate(2px, 2px);
}
body.dark-mode .student-nav-bar .nav-item.nav-modern {
    background-color: #1e293b !important;
    color: #f8fafc !important;
    border-color: #0f172a !important;
    box-shadow: 2px 3px 0 #0f172a !important;
}
body.theme-pink .student-nav-bar .nav-item.nav-modern {
    background-color: #fff0f6;
}
body.theme-green .student-nav-bar .nav-item.nav-modern {
    background-color: #f0fdf4;
}
body.theme-blue .student-nav-bar .nav-item.nav-modern {
    background-color: #eff6ff;
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
