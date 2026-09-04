import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

target = """    document.getElementById('btn-allow-sensor').onclick = () => {
        const m = document.getElementById('sensor-permission-modal');
        if(m) m.remove();
        
        const startScene = () => {"""

replacement = """    document.getElementById('btn-allow-sensor').onclick = () => {
        const m = document.getElementById('sensor-permission-modal');
        if(m) m.remove();
        
        // Unlock speech synthesis on user interaction!
        if (window.sebutAudio) {
            window.sebutAudio('');
        }
        
        const startScene = () => {"""

content = content.replace(target, replacement)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched sensor click to unlock audio")
