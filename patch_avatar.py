import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

# 1. Update claimAvatar
old_claim = """        window.claimAvatar = function(icon, reqStars) {
            const curStudent = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : null;
            if (!curStudent) return;
            
            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
                if (typeof saveStudentData === 'function') saveStudentData();
            }
            
            if (!curStudent.claimedAvatars.includes(icon)) {
                curStudent.claimedAvatars.push(icon);
                saveStudentData();
            }"""

new_claim = """        window.claimAvatar = function(icon, reqStars) {
            const curStudent = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : null;
            if (!curStudent) return;
            
            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
                if (typeof saveStudentData === 'function') saveStudentData();
            }
            
            if (!curStudent.claimedAvatars.includes(icon)) {
                curStudent.claimedAvatars.push(icon);
                if (!curStudent.spentStars) curStudent.spentStars = 0;
                curStudent.spentStars += reqStars;
                saveStudentData();
            }"""
            
content = content.replace(old_claim, new_claim)

# 2. Update renderAvatarOptions
old_render = """        function renderAvatarOptions() {
            const container = document.getElementById('avatar-options');
            if (!container) return;
            
            const curStudent = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : {};
            const totalStars = typeof jumlahMarkah === 'function' ? jumlahMarkah(curStudent) : 0;
            
            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
                if (typeof saveStudentData === 'function') saveStudentData();
            }
            const claimedList = curStudent.claimedAvatars || [];
            
            const starBadge = document.getElementById('avatar-modal-stars-badge');
            if (starBadge) {
                starBadge.innerHTML = `<i class="fa-solid fa-star" style="color:#ffc107;"></i> ${totalStars} Bintang Diperoleh`;
            }
            
            container.innerHTML = AVATAR_CONFIG.map((cfg) => {
                const icon = cfg.icon;
                const reqStars = cfg.reqStars;
                const isClaimed = claimedList.includes(icon) || reqStars === 0;
                const canClaim = !isClaimed && totalStars >= reqStars;"""

new_render = """        function renderAvatarOptions() {
            const container = document.getElementById('avatar-options');
            if (!container) return;
            
            const curStudent = (namaMuridAktif && studentData[namaMuridAktif]) ? studentData[namaMuridAktif] : {};
            const totalStars = typeof jumlahMarkah === 'function' ? jumlahMarkah(curStudent) : 0;
            const spentStars = curStudent.spentStars || 0;
            const currentBalance = totalStars - spentStars;
            
            if (!curStudent.claimedAvatars || !curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) {
                if (!curStudent.claimedAvatars) curStudent.claimedAvatars = [];
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[0].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[0].icon);
                if (!curStudent.claimedAvatars.includes(AVATAR_CONFIG[1].icon)) curStudent.claimedAvatars.push(AVATAR_CONFIG[1].icon);
                if (typeof saveStudentData === 'function') saveStudentData();
            }
            const claimedList = curStudent.claimedAvatars || [];
            
            const starBadge = document.getElementById('avatar-modal-stars-badge');
            if (starBadge) {
                starBadge.innerHTML = `<i class="fa-solid fa-star" style="color:#ffc107;"></i> ${currentBalance} Bintang Baki Semasa`;
            }
            
            container.innerHTML = AVATAR_CONFIG.map((cfg) => {
                const icon = cfg.icon;
                const reqStars = cfg.reqStars;
                const isClaimed = claimedList.includes(icon) || reqStars === 0;
                const canClaim = !isClaimed && currentBalance >= reqStars;"""

content = content.replace(old_render, new_render)


with open('public/app-logic.js', 'w') as f:
    f.write(content)
print("Done patching claim and render")
