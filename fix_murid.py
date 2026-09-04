import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_murid = """window.masukModMurid = function() {
    window.modGuruAktif = false;
    if (typeof modGuruAktif !== 'undefined') modGuruAktif = false;
    window.modIbuBapaAktif = false;
    if (typeof modIbuBapaAktif !== 'undefined') modIbuBapaAktif = false;
    
    // default student
    window.namaMuridAktif = "Murid";
    if (!window.selectedAvatarIcon) {
        window.selectedAvatarIcon = "https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png";
    }
    
    // ensure studentData has this user
    if(typeof window.studentData !== 'undefined') {
        if(!window.studentData["Murid"]) {
            window.studentData["Murid"] = typeof studentRecord === 'function' ? studentRecord() : { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon };
        } else {
            window.studentData["Murid"].avatar = window.selectedAvatarIcon;
        }
        if (typeof saveStudentData === 'function') saveStudentData();
    }"""

new_murid = """window.masukModMurid = function(namaAnak) {
    window.modGuruAktif = false;
    if (typeof modGuruAktif !== 'undefined') modGuruAktif = false;
    window.modIbuBapaAktif = false;
    if (typeof modIbuBapaAktif !== 'undefined') modIbuBapaAktif = false;
    
    // default student
    const studentName = namaAnak || "Murid";
    window.namaMuridAktif = studentName;
    if (!window.selectedAvatarIcon) {
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
    }"""

content = content.replace(old_murid, new_murid)

old_murid2 = """    var namaPapar = document.getElementById('nama-murid-papar');
    if(namaPapar) namaPapar.innerText = "Murid";
    
    var profilNamaBesar = document.getElementById('profil-nama-besar');
    if(profilNamaBesar) profilNamaBesar.innerText = "Murid";
    
    if(typeof updateProfilUI === 'function') updateProfilUI();
    
    if(typeof window.paparSkrin === 'function') {
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && document.getElementById(initialHash) && initialHash !== 'login-screen') {
            window.paparSkrin(initialHash, true);
        } else {
            window.paparSkrin('main-menu-screen');
        }
    }
    if(typeof window.sebutAudio === 'function') {
        window.sebutAudio("Selamat datang Murid");
    }"""

new_murid2 = """    var namaPapar = document.getElementById('nama-murid-papar');
    if(namaPapar) namaPapar.innerText = studentName;
    
    var profilNamaBesar = document.getElementById('profil-nama-besar');
    if(profilNamaBesar) profilNamaBesar.innerText = studentName;
    
    if(typeof updateProfilUI === 'function') updateProfilUI();
    
    if(typeof window.paparSkrin === 'function') {
        window.paparSkrin('main-menu-screen');
    }
    if(typeof window.sebutAudio === 'function') {
        window.sebutAudio("Selamat datang " + studentName);
    }"""

content = content.replace(old_murid2, new_murid2)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
