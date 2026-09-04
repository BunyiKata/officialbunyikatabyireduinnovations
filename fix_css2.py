import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace(
    '''    .mode-buttons-container {
        flex-direction: column !important;
        gap: 12px !important;
    }''',
    '''    .mode-buttons-container {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100%;
    }'''
)

with open('src/index.css', 'w') as f:
    f.write(content)
