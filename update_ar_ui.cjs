const fs = require('fs');

// 1. Update src/App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const oldFilterSelector = /<div className="ar-filter-selector[\s\S]*?<\/div>/;

const newFilterSelector = `<div className="ar-filter-selector flex items-center justify-center bg-slate-900/85 backdrop-blur-md text-white rounded-full px-3 py-1.5 border-2 border-slate-700 shadow-xl z-30">
              <button
                type="button"
                id="btn_tukar_filter"
                className="ar-filter-btn neo-btn bg-yellow text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => (window as any).tukarARFilter && (window as any).tukarARFilter()}
                title="Tukar Filter AR"
              >
                <i className="fa-solid fa-rotate text-sm"></i>
                <span id="label_current_filter" className="font-bold">🐻 Beruang</span>
              </button>
            </div>`;

appTsx = appTsx.replace(oldFilterSelector, newFilterSelector);
fs.writeFileSync('src/App.tsx', appTsx);
console.log("Updated src/App.tsx with single Change Filter button!");

// 2. Update public/styles.css
let css = fs.readFileSync('public/styles.css', 'utf8');

// Update media query for ar-word-card and ar-word-text
css = css.replace(
    /height:\s*140px\s*!important;\s*min-height:\s*140px\s*!important;\s*max-height:\s*140px\s*!important;/g,
    'height: 100px !important;\n        min-height: 100px !important;\n        max-height: 100px !important;'
);

css = css.replace(
    /font-size:\s*clamp\(2\.2rem,\s*8vw,\s*3\.5rem\)\s*!important;/g,
    'font-size: clamp(2.8rem, 10vw, 4.2rem) !important;'
);

fs.writeFileSync('public/styles.css', css);
console.log("Updated public/styles.css with lower card height (100px) and bigger font size!");

// 3. Update public/app-logic.js
let logic = fs.readFileSync('public/app-logic.js', 'utf8');

// Replace tukarARFilter function definition
const oldTukarARFilterReg = /window\.tukarARFilter\s*=\s*function\(filterName\)[\s\S]*?\};/;

const newTukarARFilter = `window.currentARFilter = 'bear';
const arFilterList = [
    { id: 'bear', name: '🐻 Beruang' },
    { id: 'cat', name: '🐱 Kucing' },
    { id: 'dog', name: '🐶 Anjing' }
];

window.tukarARFilter = function(filterName) {
    if (filterName) {
        window.currentARFilter = filterName;
    } else {
        const currentIndex = arFilterList.findIndex(f => f.id === window.currentARFilter);
        const nextIndex = (currentIndex + 1) % arFilterList.length;
        window.currentARFilter = arFilterList[nextIndex].id;
    }

    const currentObj = arFilterList.find(f => f.id === window.currentARFilter) || arFilterList[0];
    const labelEl = document.getElementById('label_current_filter');
    if (labelEl) {
        labelEl.innerText = currentObj.name;
    }
};`;

if (logic.includes('window.tukarARFilter')) {
    logic = logic.replace(oldTukarARFilterReg, newTukarARFilter);
}

// Replace startBtn.innerText = "BERHENTI" with pause icon
logic = logic.replace(
    'startBtn.innerText = "BERHENTI";',
    'startBtn.innerHTML = \'<i class="fa-solid fa-pause text-2xl"></i>\';'
);

fs.writeFileSync('public/app-logic.js', logic);
console.log("Updated public/app-logic.js with cycled filter and pause icon for stop button!");
