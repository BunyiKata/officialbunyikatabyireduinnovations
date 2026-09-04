import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import './index.css';", "import './index.css';\nimport { motion, AnimatePresence } from 'motion/react';")

with open('src/App.tsx', 'w') as f:
    f.write(content)
