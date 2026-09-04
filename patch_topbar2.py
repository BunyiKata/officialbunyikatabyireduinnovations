import re

with open("public/styles.css", "r") as f:
    css = f.read()

# First we clean up the previous patch's grid styles by appending a strong override at the very end
new_css_override = """
/* --- ULTIMATE MAP TOP BAR ALIGNMENT FIX --- */
.map-top-bar {
    display: grid !important;
    grid-template-columns: 60px 1fr 60px !important;
    align-items: center !important;
    justify-content: center !important;
    min-height: 60px !important;
    padding: 10px 20px !important;
    margin-bottom: 20px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    gap: 10px !important;
}

.map-top-bar .back-icon-btn {
    grid-column: 1 !important;
    justify-self: start !important;
    position: static !important;
    transform: none !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 48px !important;
    height: 48px !important;
    padding: 0 !important;
    border-radius: 50% !important;
}

.map-top-bar .page-title,
.map-top-bar > .neo-btn:not(.back-icon-btn):not(.help-btn):not(.match-option):not(.tarikgaris-btn) {
    grid-column: 2 !important;
    justify-self: center !important;
    position: static !important;
    transform: none !important;
    margin: 0 !important;
    text-align: center !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 10px 20px !important;
    width: auto !important;
    max-width: 100% !important;
    white-space: nowrap !important;
}

.map-top-bar .help-btn, 
.map-top-bar > div:last-child:not(.page-title):not(.back-icon-btn) {
    grid-column: 3 !important;
    justify-self: end !important;
    position: static !important;
    transform: none !important;
    margin: 0 !important;
}

.map-top-bar .help-btn {
    width: 48px !important;
    height: 48px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 50% !important;
}

@media (max-width: 768px) {
    .map-top-bar {
        grid-template-columns: 48px 1fr 48px !important;
        padding: 10px 10px !important;
        gap: 5px !important;
    }
    
    .map-top-bar .page-title,
    .map-top-bar > .neo-btn:not(.back-icon-btn):not(.help-btn):not(.match-option):not(.tarikgaris-btn) {
        font-size: 1.05rem !important;
        padding: 8px 15px !important;
        white-space: normal !important;
    }
}
"""

with open("public/styles.css", "w") as f:
    f.write(css + new_css_override)

