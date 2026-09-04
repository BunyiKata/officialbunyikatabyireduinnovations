with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_init = """        var savedStudentData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
        var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));
        Object.values(studentData).forEach(data => { const defaults = studentRecord(); data.belajar = { ...defaults.belajar, ...(data.belajar || {}) }; data.latihan = { ...defaults.latihan, ...(data.latihan || {}) }; data.scores = { ...defaults.scores, ...(data.scores || {}) }; data.loginData = { ...defaults.loginData, ...(data.loginData || {}) }; data.avatar = data.avatar || defaults.avatar; data.badges = Array.isArray(data.badges) ? data.badges : []; data.newBadges = Array.isArray(data.newBadges) ? data.newBadges : []; data.history = Array.isArray(data.history) ? data.history : []; });"""

new_init = """        var savedStudentData = JSON.parse(localStorage.getItem('bunyiKataStudentData') || '{}');
        var studentData = Object.fromEntries(studentNames.map(name => [name, { ...studentRecord(), ...(savedStudentData[name] || {}) }]));
        Object.entries(studentData).forEach(([name, data]) => {
            const defaults = studentRecord();
            data.belajar = { ...defaults.belajar, ...(data.belajar || {}) };
            data.latihan = { ...defaults.latihan, ...(data.latihan || {}) };
            data.scores = { ...defaults.scores, ...(data.scores || {}) };
            data.loginData = { ...defaults.loginData, ...(data.loginData || {}) };
            
            // assign specific dummy avatars
            if (name === "Ali Bin Abu" && !savedStudentData[name]) {
                data.avatar = 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
            } else if (name === "Siti Aminah" && !savedStudentData[name]) {
                data.avatar = 'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png';
            } else {
                data.avatar = data.avatar || defaults.avatar;
            }
            
            data.badges = Array.isArray(data.badges) ? data.badges : [];
            data.newBadges = Array.isArray(data.newBadges) ? data.newBadges : [];
            data.history = Array.isArray(data.history) ? data.history : [];
        });"""

content = content.replace(old_init, new_init)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
