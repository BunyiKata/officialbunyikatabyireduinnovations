import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

target = """            let totalSelesai = 0;
            let totalStudents = Object.keys(studentData).length;
            for (const [nama, data] of Object.entries(studentData)) {
                mapObj.modules.forEach(mod => {
                    const stars = Number(localStorage.getItem('stars_' + mod.id) || 0);
                    const score = (data.scores && data.scores[mod.id] !== undefined) ? data.scores[mod.id] : (stars * 10);
                    const isDone = Boolean((data.latihan && data.latihan[mod.id]) || stars > 0 || score > 0);
                    if(isDone) totalSelesai++;
                });
            }"""

replacement = """            let totalSelesai = 0;
            let totalStudents = Object.keys(studentData).length;
            for (const [nama, data] of Object.entries(studentData)) {
                // Calculate across all MAP_CHALLENGES if available
                if (typeof MAP_CHALLENGES !== 'undefined') {
                    Object.values(MAP_CHALLENGES).forEach(map => {
                        map.modules.forEach(mod => {
                            const stars = Number(localStorage.getItem('stars_' + mod.id) || 0);
                            const score = (data.scores && data.scores[mod.id] !== undefined) ? data.scores[mod.id] : (stars * 10);
                            const isDone = Boolean((data.latihan && data.latihan[mod.id]) || stars > 0 || score > 0);
                            if(isDone) totalSelesai++;
                        });
                    });
                }
            }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target in public/app-logic.js")
else:
    print("Target not found")

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("done")
