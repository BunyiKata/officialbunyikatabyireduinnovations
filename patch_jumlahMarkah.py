import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_code = """                        if (st === 0 && data && data.scores && data.scores[key] !== undefined) {
                            const maxScore = typeof getMaxScore === 'function' ? getMaxScore(key) : 10;
                            const sc = data.scores[key];
                            if (sc >= maxScore) st = 3;
                            else if (sc >= maxScore * 0.6) st = 2;
                            else if (sc > 0) st = 1;
                        }
                        totalStars += st;
                    });
                });
            }"""

new_code = """                        if (st === 0 && data && data.scores && data.scores[key] !== undefined) {
                            const maxScore = typeof getMaxScore === 'function' ? getMaxScore(key) : 10;
                            const sc = data.scores[key];
                            if (sc >= maxScore) st = 3;
                            else if (sc >= maxScore * 0.6) st = 2;
                            else if (sc > 0) st = 1;
                        }
                        totalStars += st;
                    });
                });
            }
            if (data && data.scores) {
                Object.keys(data.scores).forEach(key => {
                    if (key.startsWith('tandukKata_')) {
                        totalStars += data.scores[key];
                    }
                });
            }"""

content = content.replace(old_code, new_code)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched jumlahMarkah in public")
