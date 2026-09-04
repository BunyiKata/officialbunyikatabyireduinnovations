import re

with open("public/app-logic.js", "r") as f:
    content = f.read()

target = """<a-scene embedded style="width: 100vw; height: 100dvh;">"""
replacement = """<a-scene embedded webxr="referenceSpaceType: local-floor; requiredFeatures: hit-test,local-floor;" style="width: 100vw; height: 100dvh;">"""

content = content.replace(target, replacement)

with open("public/app-logic.js", "w") as f:
    f.write(content)

print("Patched webxr")
