import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="neo-btn" style={{"width":"100%", "maxWidth":"250px", "fontSize":"2rem", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px",  "color":"white"}}', 
'className="neo-btn bg-red" style={{"width":"100%", "maxWidth":"250px", "fontSize":"2rem", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"white"}}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
