import re
with open('src/index.css', 'r') as f:
    content = f.read()

content = re.sub(r'/\* Force guru dashboard.*', '', content, flags=re.DOTALL)

content += """/* Force guru dashboard and table to allow page scrolling instead of internal table scrolling */
#guru-dashboard {
    overflow-y: auto !important;
    height: 100% !important;
    flex: 1 !important;
}
#guru-dashboard .table-responsive {
    max-height: none !important;
    overflow-y: visible !important;
    height: auto !important;
}
"""

with open('src/index.css', 'w') as f:
    f.write(content)
print("fixed")
