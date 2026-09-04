import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """<select id="guru-dashboard-tahap-select" className="neo-btn bg-orange filter-select" style={{padding:"6px 10px", fontSize:"0.85rem", fontWeight:"bold", fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", borderRadius:"12px", border:"2px solid var(--color-dark)", cursor:"pointer", margin:"0", backgroundColor:"var(--color-orange)", backgroundImage: "linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)", backgroundSize: "100% 100%, 15px 15px", color:"white", flex:"1 1 50%", width:"50%", minWidth:"0", boxSizing:"border-box"}}"""

replacement1 = """<select id="guru-dashboard-tahap-select" className="neo-btn bg-orange filter-select" style={{appearance: "none", WebkitAppearance: "none", MozAppearance: "none", padding:"6px 32px 6px 10px", fontSize:"0.85rem", fontWeight:"bold", fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", borderRadius:"12px", border:"2px solid var(--color-dark)", cursor:"pointer", margin:"0", backgroundColor:"var(--color-orange)", backgroundImage: "url(\\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\\"), linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)", backgroundSize: "16px, 100% 100%, 15px 15px", backgroundPosition: "right 10px center, 0 0, 0 0", backgroundRepeat: "no-repeat, repeat, repeat", color:"white", flex:"1 1 50%", width:"50%", minWidth:"0", boxSizing:"border-box"}}"""

target2 = """<select id="guru-dashboard-peta-select" className="neo-btn bg-orange filter-select" style={{padding:"6px 12px", fontSize:"0.85rem", fontWeight:"bold", fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", borderRadius:"12px", border:"2px solid var(--color-dark)", cursor:"pointer", margin:"0", backgroundColor:"var(--color-orange)", backgroundImage: "linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)", backgroundSize: "100% 100%, 15px 15px", color:"white", flex:"1 1 50%", width:"50%", minWidth:"0", boxSizing:"border-box"}}"""

replacement2 = """<select id="guru-dashboard-peta-select" className="neo-btn bg-orange filter-select" style={{appearance: "none", WebkitAppearance: "none", MozAppearance: "none", padding:"6px 32px 6px 12px", fontSize:"0.85rem", fontWeight:"bold", fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", borderRadius:"12px", border:"2px solid var(--color-dark)", cursor:"pointer", margin:"0", backgroundColor:"var(--color-orange)", backgroundImage: "url(\\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\\"), linear-gradient(to bottom, transparent 50%, var(--color-orange) 100%), radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)", backgroundSize: "16px, 100% 100%, 15px 15px", backgroundPosition: "right 10px center, 0 0, 0 0", backgroundRepeat: "no-repeat, repeat, repeat", color:"white", flex:"1 1 50%", width:"50%", minWidth:"0", boxSizing:"border-box"}}"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced target1")
else:
    print("Target1 not found")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target2")
else:
    print("Target2 not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)

