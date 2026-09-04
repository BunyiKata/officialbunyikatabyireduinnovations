import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

# Pattern 1
target1 = """        buttons += `<a-entity position="${x} ${y} ${z}"
            animation__mouseenter="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${letter.toLowerCase()}">
            <!-- Cover -->
            <a-box class="clickable" depth="0.15" height="1" width="0.8" color="#0284c7"></a-box>"""

replacement1 = """        buttons += `<a-entity class="clickable" position="${x} ${y} ${z}"
            animation__mouseenter="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${letter.toLowerCase()}">
            <!-- Cover -->
            <a-box depth="0.15" height="1" width="0.8" color="#0284c7"></a-box>"""
content = content.replace(target1, replacement1)


# Pattern 2
target2 = """        buttons += `<a-entity position="${x} ${y} ${z}"
            animation__mouseenter="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${number}">
            <!-- Cover -->
            <a-box class="clickable" depth="0.15" height="1" width="0.8" color="#f59e0b"></a-box>"""

replacement2 = """        buttons += `<a-entity class="clickable" position="${x} ${y} ${z}"
            animation__mouseenter="property: scale; to: 1.15 1.15 1.15; startEvents: mouseenter; dur: 200"
            animation__mouseleave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 200"
            play-on-hover="${number}">
            <!-- Cover -->
            <a-box depth="0.15" height="1" width="0.8" color="#f59e0b"></a-box>"""

content = content.replace(target2, replacement2)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched VR clickable")
