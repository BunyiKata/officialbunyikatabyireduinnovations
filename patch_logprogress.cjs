const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

const target = `                let starCount = 0;
                const starFromLS = Number(localStorage.getItem('stars_' + aktiviti) || 0);
                if (starFromLS > 0) {
                    starCount = Math.min(starFromLS, 3);
                } else if (typeof markah === 'number') {
                    if (markah <= 3) {
                        starCount = Math.min(markah, 3);
                    } else if (maxScore > 0) {
                        const pct = markah / maxScore;
                        if (pct >= 0.9) starCount = 3;
                        else if (pct >= 0.6) starCount = 2;
                        else if (pct > 0) starCount = 1;
                    } else {
                        starCount = Math.min(markah, 3);
                    }
                }
                if (starCount > 0) {
                    studentData[currentStudent].stars[aktiviti] = Math.max(studentData[currentStudent].stars[aktiviti] || 0, Math.min(starCount, 3));
                }`;

const replacement = `                let starCount = 0;
                const isUncappedActivity = aktiviti.startsWith('ar_') || aktiviti.startsWith('arSukuKata_') || aktiviti.startsWith('tandukKata_') || aktiviti.startsWith('cabaran_');
                if (isUncappedActivity) {
                    starCount = typeof markah === 'number' ? markah : 0;
                } else {
                    const starFromLS = Number(localStorage.getItem('stars_' + aktiviti) || 0);
                    if (starFromLS > 0) {
                        starCount = Math.min(starFromLS, 3);
                    } else if (typeof markah === 'number') {
                        if (markah <= 3) {
                            starCount = Math.min(markah, 3);
                        } else if (maxScore > 0) {
                            const pct = markah / maxScore;
                            if (pct >= 0.9) starCount = 3;
                            else if (pct >= 0.6) starCount = 2;
                            else if (pct > 0) starCount = 1;
                        } else {
                            starCount = Math.min(markah, 3);
                        }
                    }
                }
                if (starCount > 0) {
                    const finalStarCount = isUncappedActivity ? starCount : Math.min(starCount, 3);
                    studentData[currentStudent].stars[aktiviti] = Math.max(studentData[currentStudent].stars[aktiviti] || 0, finalStarCount);
                }`;

code = code.replace(target, replacement);
fs.writeFileSync('public/app-logic.js', code);
