with open('public/styles.css', 'r') as f:
    content = f.read()

content = content.replace(
"""        .perkataan-grid .perkataan-card {
            width: calc(12.5% - 12px);
            min-width: 100px;
        }""",
"""        .perkataan-grid .perkataan-card {
            flex: 0 0 auto;
            width: 110px;
        }""")

content = content.replace(
"""        @media (max-width: 900px) {
            .perkataan-grid .perkataan-card { width: calc(16.66% - 12px); }
        }""",
"""        @media (max-width: 900px) {
            .perkataan-grid .perkataan-card { width: 110px; }
        }""")

content = content.replace(
"""        @media (max-width: 720px) {
            .perkataan-grid { gap: 8px !important; }
            .perkataan-grid .perkataan-card { width: calc(25% - 8px) !important; min-width: 75px; }
            .perkataan-grid.grid-kv .perkataan-card { width: calc(16.66% - 8px) !important; }""",
"""        @media (max-width: 720px) {
            .perkataan-grid { gap: 8px !important; }
            .perkataan-grid .perkataan-card { width: 80px !important; }
            .perkataan-grid.grid-kv .perkataan-card { width: 60px !important; }""")

with open('public/styles.css', 'w') as f:
    f.write(content)
print("Updated styles")
