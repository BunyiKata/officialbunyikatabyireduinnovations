const fs = require('fs');

// 1. Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const oldFilterHtml = /<div className="ar-filter-selector[\s\S]*?<\/div>/;

const newFilterHtml = `<div className="ar-filter-selector">
              <button
                type="button"
                id="btn_tukar_filter"
                className="ar-filter-btn neo-btn bg-yellow cursor-pointer hover:scale-110 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
                title="Tukar Filter AR"
                aria-label="Tukar Filter AR"
              >
                <i className="fa-solid fa-rotate text-lg"></i>
              </button>
            </div>`;

appTsx = appTsx.replace(oldFilterHtml, newFilterHtml);
fs.writeFileSync('src/App.tsx', appTsx);
console.log("Updated src/App.tsx: filter button now only contains rotation icon.");

// 2. Update public/styles.css
let css = fs.readFileSync('public/styles.css', 'utf8');

// Replace .ar-filter-selector and .ar-filter-btn rules
const oldFilterCss = /\.ar-filter-selector\s*\{[\s\S]*?\}\s*\.ar-filter-btn\s*\{[\s\S]*?\}/;

const newFilterCss = `.ar-filter-selector {
    position: absolute !important;
    bottom: 16px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 35 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
.ar-filter-btn {
    width: 48px !important;
    height: 48px !important;
    border-radius: 50% !important;
    border: 3px solid #10182f !important;
    background-color: #facc15 !important;
    color: #10182f !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
    font-size: 1.25rem !important;
    cursor: pointer !important;
    padding: 0 !important;
}`;

css = css.replace(oldFilterCss, newFilterCss);

// Update mobile .ar-start-btn in @media (max-width: 768px)
const oldMobileStartBtn = /\.ar-start-btn\s*\{[^}]*margin-bottom:[^}]*\}/;

const newMobileStartBtn = `.ar-start-btn {
        margin-bottom: 76px !important;
        padding: 10px 24px !important;
        font-size: 1.35rem !important;
        font-weight: 900 !important;
        min-height: 50px !important;
        width: 75% !important;
        max-width: 240px !important;
        border-radius: 50px !important;
        border: 3px solid var(--color-dark, #10182f) !important;
        box-shadow: 0 5px 0 var(--color-dark, #10182f) !important;
        letter-spacing: 1px !important;
    }`;

css = css.replace(oldMobileStartBtn, newMobileStartBtn);

fs.writeFileSync('public/styles.css', css);
console.log("Updated public/styles.css with round rotation icon filter button and smaller mobile start button.");

// 3. Update public/app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

const oldTukarARFilterReg = /window\.tukarARFilter\s*=\s*function\(filterName\)[\s\S]*?\};/;

const newTukarARFilter = `window.currentARFilter = 'bear';
const arFilterList = ['bear', 'cat', 'dog'];

window.tukarARFilter = function(filterName) {
    if (filterName) {
        window.currentARFilter = filterName;
    } else {
        const currentIndex = arFilterList.indexOf(window.currentARFilter);
        const nextIndex = (currentIndex + 1) % arFilterList.length;
        window.currentARFilter = arFilterList[nextIndex];
    }
};`;

logic = logic.replace(oldTukarARFilterReg, newTukarARFilter);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Updated public/app-logic.js for clean icon-only filter toggle.");
