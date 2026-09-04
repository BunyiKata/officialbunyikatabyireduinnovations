with open('public/styles.css', 'r') as f:
    content = f.read()

content = content.replace(
"""        .perkataan-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 12px;
            width: 100%;
        }""",
"""        .perkataan-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            width: 100%;
        }
        .perkataan-grid .perkataan-card {
            width: calc(12.5% - 12px);
            min-width: 100px;
        }""")

content = content.replace(
"""        @media (max-width: 900px) {
            .perkataan-grid { grid-template-columns: repeat(6, 1fr); }
        }""",
"""        @media (max-width: 900px) {
            .perkataan-grid .perkataan-card { width: calc(16.66% - 12px); }
        }""")

content = content.replace(
"""        @media (max-width: 720px) {
            .perkataan-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
            .perkataan-grid.grid-kv { grid-template-columns: repeat(6, 1fr) !important; }""",
"""        @media (max-width: 720px) {
            .perkataan-grid { gap: 8px !important; }
            .perkataan-grid .perkataan-card { width: calc(25% - 8px) !important; min-width: 75px; }
            .perkataan-grid.grid-kv .perkataan-card { width: calc(16.66% - 8px) !important; }""")

with open('public/styles.css', 'w') as f:
    f.write(content)
print("Updated public/styles.css")
