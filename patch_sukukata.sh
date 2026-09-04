#!/bin/bash

# Remove existing bs-wrapper/bs-container from styles if any
sed -i '/\/\* Belajar Suku Kata Layout \*\//,$d' public/styles.css

# Append new CSS
cat << 'CSS_EOF' >> public/styles.css
/* Belajar Suku Kata Layout */
.bs-wrapper {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

.bs-container {
    display: flex;
    gap: 30px;
    width: 100%;
    max-width: 900px;
    align-items: stretch;
    justify-content: center;
}

.bs-card-left, .bs-card-right {
    flex: 1;
    min-width: 300px;
    max-width: 400px;
    background-color: #e0f2fe;
    background-image: 
        linear-gradient(to bottom, transparent 40%, #e0f2fe 40%),
        radial-gradient(circle, rgba(16, 24, 47, 0.15) 2px, transparent 2px);
    background-size: 100% 100%, 20px 20px;
    border: 4px solid var(--color-dark);
    border-radius: 20px;
    padding: 40px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
}

.bs-card-right {
    justify-content: center;
    min-height: 250px;
}

.bs-title-sukukata {
    position: absolute;
    top: -25px;
    padding: 10px 40px;
    font-size: 1.5rem;
    font-weight: bold;
    pointer-events: none;
    border-radius: 20px;
    z-index: 5;
}

.bs-type-title {
    position: absolute;
    top: -25px;
    padding: 10px 40px;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    pointer-events: none;
    border-radius: 20px;
    z-index: 5;
}

.bs-list-btn {
    position: absolute;
    top: -15px;
    right: -10px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 10;
}

.bs-arrow {
    display: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    padding: 0;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    z-index: 10;
}

.bs-nav-desktop {
    display: flex;
    gap: 30px;
    margin-top: 30px;
}

.bs-nav-desktop button {
    padding: 15px 25px;
    font-size: 2rem;
    border-radius: 50%;
}

.bs-scene {
    margin: 0;
    width: 100%;
    max-width: 250px;
    height: 250px;
    flex-shrink: 0;
}

.bs-word-container {
    width: 100%;
    background: white;
    border-radius: 15px;
    border: 3px solid var(--color-dark);
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -4px 0 rgba(0,0,0,0.1);
    position: relative;
}

.bs-word-text {
    font-size: 6rem;
    font-weight: 900;
    color: var(--color-dark);
    text-align: center;
    line-height: 1;
    word-break: break-all;
}

.bs-card-content-front, .bs-card-content-back {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-dark);
}

.bs-card-content-front { font-size: 6rem; }
.bs-card-content-back { font-size: 5rem; }


/* MOBILE STYLES */
@media (max-width: 768px) {
    .bs-container {
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 15px;
        background-color: #e0f2fe;
        background-image: 
            linear-gradient(to bottom, transparent 40%, #e0f2fe 40%),
            radial-gradient(circle, rgba(16, 24, 47, 0.15) 2px, transparent 2px);
        background-size: 100% 100%, 20px 20px;
        border: 4px solid var(--color-dark);
        border-radius: 20px;
        padding: 40px 15px 20px;
        box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
        position: relative;
    }

    .bs-card-left, .bs-card-right {
        display: contents;
    }

    .bs-scene {
        grid-column: 2;
        grid-row: 1;
        max-width: 180px;
        height: 180px;
        justify-self: center;
    }

    .bs-arrow.prev {
        display: flex;
        grid-column: 1;
        grid-row: 1;
        align-self: center;
    }

    .bs-arrow.next {
        display: flex;
        grid-column: 3;
        grid-row: 1;
        align-self: center;
    }

    .bs-word-container {
        grid-column: 1 / span 3;
        grid-row: 2;
        margin-top: 10px;
        min-height: 100px;
        padding: 15px;
    }

    .bs-word-text {
        font-size: 3.5rem;
    }

    .bs-nav-desktop {
        display: none;
    }

    .bs-title-sukukata {
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.2rem;
        padding: 5px 20px;
    }

    .bs-type-title {
        /* Put the type title on the word container */
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 1.2rem;
        padding: 5px 20px;
        z-index: 10;
    }
}
CSS_EOF

# Add modal styles
cat << 'CSS_EOF' >> public/styles.css

/* Modal Senarai Suku Kata specific styles */
#modal-senarai-sukukata .modal-content {
    background-color: white !important;
    background-image: radial-gradient(circle, rgba(16, 24, 47, 0.1) 2px, transparent 2px) !important;
    background-size: 20px 20px !important;
}

#modal-senarai-sukukata .bg-red {
    background-color: #ef4444 !important;
    border: 3px solid var(--color-dark) !important;
    box-shadow: 2px 2px 0px rgba(0,0,0,0.2) !important;
}
CSS_EOF
