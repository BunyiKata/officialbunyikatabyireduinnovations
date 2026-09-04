const fs = require('fs');
const content = `
window.masukModMurid = function() {
    // default student
    window.namaMuridAktif = "Murid";
    window.selectedAvatarIcon = "fa-child-reaching";
    
    // ensure studentData has this user
    if(typeof window.studentData !== 'undefined') {
        if(!window.studentData["Murid"]) {
            window.studentData["Murid"] = { coins: 0, badges: [], mapsUnlocked: 1, avatar: window.selectedAvatarIcon };
        }
    }
    
    // UI Updates
    document.body.classList.remove('teacher-mode');
    
    const namaPapar = document.getElementById('nama-murid-papar');
    if(namaPapar) namaPapar.innerText = "Murid";
    
    const menuAvatar = document.getElementById('menu-avatar-icon');
    if(menuAvatar) menuAvatar.className = "fa-solid " + window.selectedAvatarIcon;
    
    const profilNamaBesar = document.getElementById('profil-nama-besar');
    if(profilNamaBesar) profilNamaBesar.innerText = "Murid";
    
    const profileAvatar = document.getElementById('profil-avatar-icon');
    if(profileAvatar) profileAvatar.className = "fa-solid " + window.selectedAvatarIcon;
    
    if(typeof window.paparSkrin === 'function') {
        window.paparSkrin('main-menu-screen');
    }
    if(typeof window.sebutAudio === 'function') {
        window.sebutAudio("Selamat datang Murid");
    }
}
`;

fs.appendFileSync('public/app-logic.js', content);
