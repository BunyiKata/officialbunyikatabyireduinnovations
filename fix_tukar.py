import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the select dropdown
old_tukar = """                        <div className="ibubapa-tukar-anak-input-box" style={{"position":"relative", "display": "flex", "alignItems": "center", "gap": "8px"}}>
                            <i className="fa-solid fa-users ibubapa-tukar-anak-icon" style={{"display":"none", "position":"absolute", "top":"50%", "left":"50%", "transform":"translate(-50%, -50%)", "color":"var(--color-dark)", "fontSize":"1.1rem", "zIndex":1}}></i>
                            <select id="ibubapa-dashboard-child-select" className="neo-input century-gothic-font" style={{"position":"relative", "zIndex":2, "padding":"6px 10px","fontSize":"0.85rem","fontWeight":"bold","borderRadius":"10px","border":"2px solid var(--color-dark)","background":"white","color":"var(--color-dark)","fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif"}} onChange={(e) => { (window as any).tukarAnakIbuBapa && (window as any).tukarAnakIbuBapa(e.target.value); }}>
                                {/* Dynamically populated */}
                            </select>"""

new_tukar = """                        <div className="ibubapa-tukar-anak-input-box" style={{"position":"relative", "display": "flex", "alignItems": "center", "gap": "8px"}}>
                            <button 
                                className="neo-btn bg-white" 
                                onClick={(e) => { 
                                    const modal = document.getElementById('modal-pilih-anak');
                                    if(modal) {
                                        modal.style.display = 'flex';
                                        if ((window as any).bukaModalPilihAnak) (window as any).bukaModalPilihAnak();
                                    }
                                }} 
                                style={{padding: '6px 12px', fontSize: '1.2rem', borderRadius: '10px'}}
                                title="Tukar Anak"
                            >
                                <i className="fa-solid fa-users"></i>
                            </button>"""

content = content.replace(old_tukar, new_tukar)

# Add Profil button to parent-sticky-nav
old_nav = """    {/* Navigasi Sticky Mod Ibu Bapa */}
    <nav id="parent-sticky-nav" className="teacher-sticky-nav parent-sticky-nav" aria-label="Navigasi mod ibu bapa" style={{"display":"none"}}>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('ibubapa-dashboard') }}><i className="fa-solid fa-chart-line"></i> <span>Dashboard</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span></button>
    </nav>"""

new_nav = """    {/* Navigasi Sticky Mod Ibu Bapa */}
    <nav id="parent-sticky-nav" className="teacher-sticky-nav parent-sticky-nav" aria-label="Navigasi mod ibu bapa" style={{"display":"none"}}>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('ibubapa-dashboard') }}><i className="fa-solid fa-chart-line"></i> <span>Dashboard</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('guru-senarai-perkataan') }}><i className="fa-solid fa-book"></i> <span>Perkataan</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { paparSkrin('profile-screen') }}><i className="fa-regular fa-id-badge"></i> <span>Profil</span></button>
        <button className="neo-btn bg-white" onClick={(e) => { bukaModalAksesGuru() }}><i className="fa-solid fa-unlock-keyhole"></i> <span>Akses</span></button>
    </nav>"""

content = content.replace(old_nav, new_nav)


with open('src/App.tsx', 'w') as f:
    f.write(content)
