with open("public/styles.css", "r") as f:
    css = f.read()

import re

# Remove the bad padding fix for view-belajar-huruf
css = re.sub(r'#view-belajar-huruf \.map-top-bar \{ margin-top: 30px !important; \}', '', css)

# Replace the flex styles of map-top-bar with grid
orig_map_top_bar = """\.map-top-bar \{
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    position: relative !important;
    min-height: 60px !important;
    margin-bottom: 20px !important;
    padding: 10px 0 !important;
    flex-wrap: nowrap !important;
\}"""

new_map_top_bar = """.map-top-bar {
    display: grid !important;
    grid-template-columns: 1fr auto 1fr !important;
    align-items: center !important;
    position: relative !important;
    min-height: 60px !important;
    margin-bottom: 20px !important;
    padding: 10px 20px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}"""

css = re.sub(orig_map_top_bar, new_map_top_bar, css)

# Fix back-icon-btn
orig_back = """\.map-top-bar \.back-icon-btn \{
    position: absolute !important;
    left: clamp\(10px, 2vw, 24px\) !important;
    top: 50% !important;
    transform: translateY\(-50%\) !important;
    z-index: 40 !important;
    margin: 0 !important;
    display: inline-flex !important;
\}"""

new_back = """.map-top-bar .back-icon-btn {
    position: static !important;
    transform: none !important;
    margin: 0 !important;
    justify-self: start !important;
    z-index: 40 !important;
    display: inline-flex !important;
}"""
css = re.sub(orig_back, new_back, css)

orig_back2 = """\.map-top-bar \.back-icon-btn \{ display: inline-flex !important; position: absolute !important; left: clamp\(10px, 2vw, 24px\) !important; top: 50% !important; transform: translateY\(-50%\) !important; z-index: 40 !important; margin: 0 !important; \}"""
css = re.sub(orig_back2, new_back.replace('\n', ' '), css)

# Fix help-btn
orig_help = """\.map-top-bar \.help-btn \{
    position: absolute !important;
    right: clamp\(10px, 2vw, 24px\) !important;
    top: 50% !important;
    transform: translateY\(-50%\) !important;
    z-index: 40 !important;
    margin: 0 !important;
\}"""

new_help = """.map-top-bar .help-btn {
    position: static !important;
    transform: none !important;
    margin: 0 !important;
    justify-self: end !important;
    z-index: 40 !important;
    display: inline-flex !important;
}"""
css = re.sub(orig_help, new_help, css)

# Fix page-title and others
orig_title = """\.map-top-bar > \.neo-btn:not\(\.back-icon-btn\):not\(\.help-btn\):not\(\.match-option\):not\(\.tarikgaris-btn\),
\.map-top-bar \.page-title \{
    position: relative !important;
    left: auto !important;
    top: auto !important;
    
    margin: 0 auto !important;
    max-width: min\(70vw, 620px\) !important;
    white-space: nowrap !important;
    text-align: center !important;
    flex: 0 1 auto !important;
\}"""

new_title = """.map-top-bar > .neo-btn:not(.back-icon-btn):not(.help-btn):not(.match-option):not(.tarikgaris-btn),
.map-top-bar .page-title {
    position: static !important;
    margin: 0 !important;
    justify-self: center !important;
    max-width: min(70vw, 620px) !important;
    white-space: nowrap !important;
    text-align: center !important;
}"""
css = re.sub(orig_title, new_title, css)

with open("public/styles.css", "w") as f:
    f.write(css)
