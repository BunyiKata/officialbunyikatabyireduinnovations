with open('src/App.tsx', 'r') as f:
    content = f.read()

old_use = """  React.useEffect(() => {
    const v = new Date().getTime();
    const script = document.createElement('script');
    script.src = `/app-logic.js?v=${v}`;
    script.async = true;
    document.body.appendChild(script);
"""

new_use = """  React.useEffect(() => {
    if (document.getElementById('app-logic-script')) return;
    const v = new Date().getTime();
    const script = document.createElement('script');
    script.id = 'app-logic-script';
    script.src = `/app-logic.js?v=${v}`;
    script.async = true;
    document.body.appendChild(script);
"""
content = content.replace(old_use, new_use)

with open('src/App.tsx', 'w') as f:
    f.write(content)
