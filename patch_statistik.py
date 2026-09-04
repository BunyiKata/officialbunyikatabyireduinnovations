import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                        <select 
                            id="statistik-bar-filter" 
                            className="bar-chart-filter-select neo-btn bg-orange" 
                            style={{
                                "padding":"4px 8px", 
                                "fontSize":"0.75rem", 
                                "fontWeight":"bold", 
                                "fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif", 
                                "borderRadius":"8px", 
                                "border":"1.5px solid var(--color-dark)", 
                                "color":"white",
                                "backgroundColor":"var(--color-orange)",
                                "cursor":"pointer"
                            }}"""

replacement = """                        <select 
                            id="statistik-bar-filter" 
                            className="bar-chart-filter-select neo-btn bg-orange" 
                            style={{
                                "appearance": "none",
                                "WebkitAppearance": "none",
                                "MozAppearance": "none",
                                "padding":"4px 28px 4px 8px", 
                                "fontSize":"0.75rem", 
                                "fontWeight":"bold", 
                                "fontFamily":"'Century Gothic', CenturyGothic, AppleGothic, sans-serif", 
                                "borderRadius":"8px", 
                                "border":"1.5px solid var(--color-dark)", 
                                "color":"white",
                                "backgroundColor":"var(--color-orange)",
                                "backgroundImage": 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'white\\' stroke-width=\\'3\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3E%3Cpolyline points=\\'6 9 12 15 18 9\\'%3E%3C/polyline%3E%3C/svg%3E")',
                                "backgroundRepeat": "no-repeat",
                                "backgroundPosition": "right 8px center",
                                "backgroundSize": "14px",
                                "cursor":"pointer"
                            }}"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in src/App.tsx")
else:
    print("Target not found")

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("done")
