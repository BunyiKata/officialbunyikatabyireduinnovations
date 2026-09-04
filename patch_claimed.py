import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# find:
#            if (!curStudent.claimedAvatars) {
#                curStudent.claimedAvatars = [AVATAR_CONFIG[0].icon, AVATAR_CONFIG[1].icon];
#            }
# replace with:
#            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
#                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
#                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
#                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
#            }

old_code = """            if (!curStudent.claimedAvatars) {
                curStudent.claimedAvatars = [AVATAR_CONFIG[0].icon, AVATAR_CONFIG[1].icon];
            }"""

new_code = """            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
                if (typeof saveStudentData === 'function') saveStudentData();
            }"""

content = content.replace(old_code, new_code)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Patched claimed check")
