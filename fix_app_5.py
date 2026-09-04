import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Hide "Perkataan" on mobile for teacher nav bottom
# The current HTML for teacher nav is:
# <button className="neo-btn bg-white desktop-nav-only" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>
# Wait, let's just make it completely hidden on mobile by ensuring desktop-nav-only is not overridden, 
# or just change class to include `hide-on-mobile` and define it.
content = content.replace('desktop-nav-only" onClick={(e) => { paparSkrin(\'guru-senarai-perkataan\') }}', 'desktop-nav-only hide-on-mobile" onClick={(e) => { paparSkrin(\'guru-senarai-perkataan\') }}')
content = content.replace('desktop-nav-only" onClick={(e) => { bukaModalAksesGuru() }}', 'desktop-nav-only hide-on-mobile" onClick={(e) => { bukaModalAksesGuru() }}')

# 2. PDF and CSV buttons in floating dial
# Change <span className="cara-belajar-btn-text-short">Eksport PDF</span> to <span>PDF</span>
# Change <span className="cara-belajar-btn-text-short">Eksport CSV</span> to <span>CSV</span>
content = content.replace('<span className="cara-belajar-btn-text-short">Eksport PDF</span>', '<span style={{fontWeight: "bold", marginLeft: "4px"}}>PDF</span>')
content = content.replace('<span className="cara-belajar-btn-text-short">Eksport CSV</span>', '<span style={{fontWeight: "bold", marginLeft: "4px"}}>CSV</span>')

# 3. Edit maklumat kelas modal background and button color
# In modal JSX:
# <div style={{
#    backgroundColor: 'white', borderRadius: '16px', padding: '24px', ...
# Add pattern to background
old_modal_bg = "backgroundColor: 'white', borderRadius: '16px', padding: '24px',"
new_modal_bg = "backgroundColor: 'white', backgroundImage: 'radial-gradient(rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)', backgroundSize: '15px 15px', borderRadius: '16px', padding: '24px',"
content = content.replace(old_modal_bg, new_modal_bg)

# Button color: backgroundColor: 'var(--color-green)' to backgroundColor: '#168f81'
old_btn_color = "backgroundColor: 'var(--color-green)',\n                            border: '2px solid var(--color-dark)'"
new_btn_color = "backgroundColor: '#168f81',\n                            border: '2px solid var(--color-dark)'"
content = content.replace(old_btn_color, new_btn_color)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/index.css', 'r') as f:
    css_content = f.read()

# Add hide-on-mobile
css_content += "\n@media (max-width: 768px) {\n    .hide-on-mobile { display: none !important; }\n}\n"

# 4. Make table fit 10 students - reduce padding
css_content = css_content.replace('padding: 6px 10px;\n            border-bottom: 1.5px solid #e2e8f0;', 'padding: 4px 8px;\n            border-bottom: 1.5px solid #e2e8f0;')
css_content = css_content.replace('padding: 6px 8px;\n            top: 30px;', 'padding: 4px 6px;\n            top: 30px;')
css_content = css_content.replace('height: 30px;', 'height: 28px;')

# Ensure page scroll
css_content = css_content.replace('overflow-y: auto !important;\n    height: 100% !important;\n    flex: 1 !important;', 'overflow-y: auto !important;\n    height: 100% !important;\n    flex: 1 !important;\n    min-height: 0;')
css_content = css_content.replace('overflow-y: visible !important;\n    height: auto !important;', 'overflow-y: visible !important;\n    height: auto !important;\n    flex-grow: 1;')

with open('src/index.css', 'w') as f:
    f.write(css_content)

print("done")
