import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_murid = """    if (!window.selectedAvatarIcon) {
        window.selectedAvatarIcon = "https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png";
    }
    
    // ensure studentData has this user
    if(typeof window.studentData !== 'undefined') {
        if(!window.studentData[studentName]) {
            window.studentData[studentName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon };
        } else {
            window.studentData[studentName].avatar = window.selectedAvatarIcon;
        }
        if (typeof saveStudentData === 'function') saveStudentData();
    }
    if (typeof studentData !== 'undefined') {
        if(!studentData[studentName]) {
            studentData[studentName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon };
        } else {
            studentData[studentName].avatar = window.selectedAvatarIcon;
        }
    }"""

new_murid = """    // ensure studentData has this user
    if (typeof window.studentData !== 'undefined') {
        if (!window.studentData[studentName]) {
            window.studentData[studentName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png' };
        }
        // Sync selectedAvatarIcon to match the student's existing avatar
        window.selectedAvatarIcon = window.studentData[studentName].avatar;
        
        if (typeof saveStudentData === 'function') saveStudentData();
    }
    if (typeof studentData !== 'undefined') {
        if (!studentData[studentName]) {
            studentData[studentName] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon || 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png' };
        }
        window.selectedAvatarIcon = studentData[studentName].avatar;
    }
    if (!window.selectedAvatarIcon) {
        window.selectedAvatarIcon = "https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png";
    }"""

content = content.replace(old_murid, new_murid)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
