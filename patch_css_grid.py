with open("public/styles.css", "r") as f:
    css = f.read()

new_css = """
/* Grid Huruf Container */
#grid-huruf-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
    gap: 15px;
    margin-top: 20px;
    padding: 20px;
    background: rgba(255,255,255,0.8);
    border: 3px solid var(--color-dark);
    border-radius: 20px;
    box-shadow: var(--shadow-hard-sm);
}

.btn-huruf-grid {
    font-size: 2rem;
    font-weight: bold;
    padding: 10px 5px;
    min-height: 65px;
    min-width: 0;
}

@media (max-width: 768px) {
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
}
"""

css += new_css

with open("public/styles.css", "w") as f:
    f.write(css)
