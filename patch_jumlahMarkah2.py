import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# Replace the specific block safely
old_code = """            if (data && data.scores) {
                Object.keys(data.scores).forEach(key => {
                    if (key.startsWith('tandukKata_')) {
                        totalStars += data.scores[key];
                    }
                });
            } else if (data && data.scores) {
                totalStars = Object.values(data.scores).reduce((total, markah) => total + Number(markah || 0), 0);
            }
            return totalStars;"""

new_code = """            } else if (data && data.scores) {
                totalStars = Object.values(data.scores).reduce((total, markah) => total + Number(markah || 0), 0);
            }
            
            if (data && data.scores) {
                Object.keys(data.scores).forEach(key => {
                    if (key.startsWith('tandukKata_')) {
                        totalStars += data.scores[key];
                    }
                });
            }
            return totalStars;"""

content = content.replace(old_code, new_code)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched jumlahMarkah in public")
