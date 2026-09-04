const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/display: grid !important;/g, function(match, offset, string) {
    // Only replace the one inside #student-global-nav
    const surroundingContext = string.substring(Math.max(0, offset - 100), offset + 100);
    if (surroundingContext.includes('#student-global-nav')) {
        return 'display: none !important; /* Will be overridden by active screens */';
    }
    return match;
});

const correctStudentGrid = `
@media (max-width: 720px) {
    body:not(.teacher-mode):has(#main-menu-screen.active) #student-global-nav,
    body:not(.teacher-mode):has(#profile-screen.active) #student-global-nav,
    body:not(.teacher-mode):has(#leaderboard-screen.active) #student-global-nav,
    body:not(.teacher-mode):has(#lencana-screen.active) #student-global-nav {
        display: grid !important;
    }
}
`;

css += correctStudentGrid;
fs.writeFileSync('src/index.css', css);
console.log('Fixed student nav display issue on mobile');
