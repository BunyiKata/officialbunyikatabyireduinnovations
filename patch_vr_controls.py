import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

target1 = """<a-camera position="0 1.6 0" wasd-controls="acceleration: 15" look-controls="magicWindowTrackingEnabled: true">"""
replacement1 = """<a-camera position="0 1.6 0" look-controls="magicWindowTrackingEnabled: true">"""

content = content.replace(target1, replacement1)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched VR controls")
