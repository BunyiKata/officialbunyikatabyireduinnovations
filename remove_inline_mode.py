import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r'<div className="neo-box" id="mode-selection-card" style=\{\{"width":"90%","maxWidth":"485px","textAlign":"center","backgroundColor":"#168f81"[^\}]+\}\}>.*?</button>\s*</div>\s*</div>'

# Let's replace the whole card with nothing or just remove it.
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
