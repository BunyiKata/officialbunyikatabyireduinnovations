with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make sure main button is centered
content = content.replace(
    '''<div id="mode-buttons-container" className="mode-buttons-container" style={{"display":"flex","justifyContent":"center", "marginBottom": "20px"}}>''',
    '''<div id="mode-buttons-container" className="mode-buttons-container" style={{"display":"flex","justifyContent":"center", "marginBottom": "20px", "width": "100%"}}>'''
)

content = content.replace(
    '''<button className="neo-btn bg-yellow" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"var(--color-dark)", "animation":"pulse-scale 3s infinite", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)"}}''',
    '''<button className="neo-btn bg-yellow" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"var(--color-dark)", "animation":"pulse-scale 3s infinite", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)", "margin": "0 auto"}}'''
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
