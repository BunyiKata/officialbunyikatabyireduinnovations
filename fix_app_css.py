import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update grid layout for popup profiles
old_grid = '''<div id="ibubapa-profiles-container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px', justifyContent: 'center'}}>'''
new_grid = '''<div id="ibubapa-profiles-container" className="ibubapa-profiles-grid">'''
content = content.replace(old_grid, new_grid)


# Add Delete Button to Dashboard
old_select_box = '''                        <div className="ibubapa-tukar-anak-input-box" style={{"position":"relative"}}>
                            <i className="fa-solid fa-users ibubapa-tukar-anak-icon" style={{"display":"none", "position":"absolute", "top":"50%", "left":"50%", "transform":"translate(-50%, -50%)", "color":"var(--color-dark)", "fontSize":"1.1rem", "zIndex":1}}></i>
                            <select id="ibubapa-dashboard-child-select" className="neo-input century-gothic-font" style={{"position":"relative", "zIndex":2, "padding":"6px 10px","fontSize":"0.85rem","fontWeight":"bold","borderRadius":"10px","border":"2px solid var(--color-dark)","background":"white","color":"var(--color-dark)","fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif"}} onChange={(e) => { (window as any).tukarAnakIbuBapa && (window as any).tukarAnakIbuBapa(e.target.value); }}>
                                {/* Dynamically populated */}
                            </select>
                        </div>
                    </div>
                </div>'''

new_select_box = '''                        <div className="ibubapa-tukar-anak-input-box" style={{"position":"relative", "display": "flex", "alignItems": "center", "gap": "8px"}}>
                            <i className="fa-solid fa-users ibubapa-tukar-anak-icon" style={{"display":"none", "position":"absolute", "top":"50%", "left":"50%", "transform":"translate(-50%, -50%)", "color":"var(--color-dark)", "fontSize":"1.1rem", "zIndex":1}}></i>
                            <select id="ibubapa-dashboard-child-select" className="neo-input century-gothic-font" style={{"position":"relative", "zIndex":2, "padding":"6px 10px","fontSize":"0.85rem","fontWeight":"bold","borderRadius":"10px","border":"2px solid var(--color-dark)","background":"white","color":"var(--color-dark)","fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif"}} onChange={(e) => { (window as any).tukarAnakIbuBapa && (window as any).tukarAnakIbuBapa(e.target.value); }}>
                                {/* Dynamically populated */}
                            </select>
                            <button 
                                onClick={(e) => { (window as any).padamProfilAnakIbuBapa && (window as any).padamProfilAnakIbuBapa(); }} 
                                style={{"background":"#ef4444","border":"2px solid var(--color-dark)","borderRadius":"10px","padding":"6px 10px","color":"white","cursor":"pointer","boxShadow":"1px 1px 0 var(--color-dark)","fontWeight":"bold","fontSize":"0.85rem"}}
                                title="Padam Profil Anak"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>'''
content = content.replace(old_select_box, new_select_box)

with open('src/App.tsx', 'w') as f:
    f.write(content)

# Add CSS for .ibubapa-profiles-grid
with open('src/index.css', 'r') as f:
    css_content = f.read()

new_css = """
.ibubapa-profiles-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    justify-content: center;
}

@media (max-width: 480px) {
    .ibubapa-profiles-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
"""
css_content = css_content + new_css

# Fix centering for main button
css_content = css_content.replace(
    '''    #mode-buttons-container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100%;
        margin-top: 15px !important;
    }''',
    '''    #mode-buttons-container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100% !important;
        margin-top: 15px !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }'''
)

with open('src/index.css', 'w') as f:
    f.write(css_content)

