import re
with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's see how many table-responsive there are
import sys
# just print it for now
