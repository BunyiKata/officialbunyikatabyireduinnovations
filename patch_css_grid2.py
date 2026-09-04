with open("public/styles.css", "r") as f:
    css = f.read()

orig_css = """@media (max-width: 768px) {
    #grid-huruf-container {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 10px;
        padding: 15px;
    }
    
    .btn-huruf-grid {
        font-size: 1.5rem !important;
        min-height: 55px;
        padding: 5px;
    }
}"""

new_css = """@media (max-width: 768px) {
    #grid-huruf-container {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 8px;
        padding: 12px;
    }
    
    .btn-huruf-grid {
        font-size: 1.25rem !important;
        min-height: 48px;
        padding: 4px;
        border-width: 2px !important;
        border-bottom-width: 4px !important;
    }
}"""

css = css.replace(orig_css, new_css)

with open("public/styles.css", "w") as f:
    f.write(css)
