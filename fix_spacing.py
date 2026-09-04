import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# I need to ensure it's changed.
old_main_action = '<div className="main-action-buttons" style={{"marginTop":"40px"}}>'
new_main_action = '<div className="main-action-buttons" style={{"marginTop":"60px", "gap":"30px"}}>'
content = content.replace(old_main_action, new_main_action)

# For "Mula Bermain" button, add slow pulse-scale
old_mula = '<button className="neo-btn bg-yellow" style={{"width":"100%","marginTop":"10px","fontSize":"1.2rem","padding":"15px"}} onClick={(e) => { logMasukMurid() }}>'
new_mula = '<button className="neo-btn bg-yellow" style={{"width":"100%","marginTop":"10px","fontSize":"1.2rem","padding":"15px", "animation":"pulse-scale 4s infinite"}} onClick={(e) => { logMasukMurid() }}>'
content = content.replace(old_mula, new_mula)

with open('src/App.tsx', 'w') as f:
    f.write(content)
