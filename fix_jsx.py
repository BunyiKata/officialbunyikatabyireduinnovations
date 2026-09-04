import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix <style>
style_match = re.search(r'<style>([\s\S]*?)</style>', content)
if style_match:
    style_content = style_match.group(1)
    with open('src/index.css', 'a') as f:
        f.write("\n" + style_content)
    content = content.replace(style_match.group(0), '')

# Fix <br>
content = content.replace('<br>', '<br />')

with open('src/App.tsx', 'w') as f:
    f.write(content)
