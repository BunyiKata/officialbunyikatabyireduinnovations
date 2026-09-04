#!/bin/bash

# We will modify styles.css
# 1. Update background of bs-card-left, bs-card-right and bs-container
sed -i 's/background-image:.*linear-gradient.*radial-gradient.*/background-image: radial-gradient(circle, rgba(16, 24, 47, 0.11) 2px, transparent 2px);/g' public/styles.css
sed -i 's/background-size: 100% 100%, 20px 20px;/background-size: 20px 20px;/g' public/styles.css

# 2. Update bs-nav-desktop buttons
sed -i 's/\.bs-nav-desktop button {/.bs-nav-desktop button { background-color: var(--color-purple) !important; color: white !important; border-radius: 12px !important;/g' public/styles.css

# 3. Update bs-type-title to hide on mobile
cat << 'CSS_EOF' >> public/styles.css

@media (max-width: 768px) {
    .bs-wrapper {
        margin-top: 10px !important;
    }
    .bs-type-title {
        display: none !important;
    }
    .bs-list-btn {
        top: -20px !important;
        right: -10px !important;
    }
    #modal-senarai-sukukata .bg-red {
        color: white !important;
        font-size: 1.5rem !important;
    }
}
CSS_EOF
