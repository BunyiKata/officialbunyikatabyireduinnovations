import re

with open('src/index.css', 'r') as f:
    content = f.read()

target = """@media (max-width: 720px) {
    /* Hide the old bottom teacher nav completely */
    .teacher-sticky-nav {
        display: none !important;
    }
    
    /* Show floating menu button in teacher mode */
    body.teacher-mode:not(:has(#login-screen.active)):not(:has(.modal-overlay[style*="display: flex"])) #guru-mobile-menu-btn {
        #guru-dashboard.active ~ #guru-report-mobile-btn:not(.hidden-by-modal) {
            display: flex !important;
        }
        #guru-dashboard.active ~ #guru-report-mobile-btn {
            display: flex !important;
        }
        display: flex !important;
    }
}"""

if target in content:
    content = content.replace(target, "")
    print("Replaced target in src/index.css")
else:
    print("Target not found")

with open('src/index.css', 'w') as f:
    f.write(content)
print("done")
