const fs = require('fs');
const path = require('path');

// 1. PATCH App.tsx
const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appTsx = fs.readFileSync(appTsxPath, 'utf8');

// Login screen logo
appTsx = appTsx.replace(
  'src="https://i.postimg.cc/cHTb186H/Copy-of-BUNYI-KATA-APPS-(2).png"',
  'src="/images/sampingan/logo-login-screen.png"'
);

// Main menu screen logo (was incorrectly avatar1.png)
appTsx = appTsx.replace(
  'src="/images/avatar/avatar1.png"',
  'src="/images/sampingan/logo-main-screen.png"'
);

// Peta select images in modal-pilih-peta
appTsx = appTsx.replace(
  'src="https://i.postimg.cc/tRLgqDPN/Copy-of-BUNYI-KATA-APPS.png"',
  'src="/images/sampingan/peta-misi-huruf.png"'
);
appTsx = appTsx.replace(
  'src="https://i.postimg.cc/sgJfJrLP/Copy-of-BUNYI-KATA-APPS-(1).png"',
  'src="/images/sampingan/peta-misi-suku-kata-asas.png"'
);
appTsx = appTsx.replace(
  'src="https://i.postimg.cc/FKW92xNL/Copy-of-BUNYI-KATA-APPS-(2).png"',
  'src="/images/sampingan/peta-misi-suku-kata-hero.png"'
);
appTsx = appTsx.replace(
  'src="https://i.postimg.cc/sfZVNS8F/Copy-of-BUNYI-KATA-APPS-(3).png"',
  'src="/images/sampingan/peta-misi-bacaan-bergred.png"'
);

fs.writeFileSync(appTsxPath, appTsx, 'utf8');
console.log('✅ App.tsx updated with GAMBAR SAMPINGAN assets');

// 2. PATCH public/app-logic.js
const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
let appLogic = fs.readFileSync(appLogicPath, 'utf8');

// Replace any remaining logo URL
appLogic = appLogic.replace(
  /https:\/\/i\.postimg\.cc\/cHTb186H\/Copy-of-BUNYI-KATA-APPS-\(2\)\.png/g,
  '/images/sampingan/logo-main-screen.png'
);

// Update bukaModalPilihPeta function to change image src dynamically based on mode (belajar vs latihan)
const oldBukaModal = `        function bukaModalPilihPeta(mod) {
            modSemasa = mod;
            const petaTajuk = document.getElementById('modal-pilih-peta-tajuk'); 
            if(petaTajuk) {
                petaTajuk.innerText = mod === 'belajar' ? 'PILIH PETA KEMBARA' : 'PILIH PETA LATIHAN';
                if (mod === 'latihan') {
                    petaTajuk.classList.remove('bg-orange');
                    petaTajuk.classList.add('bg-purple');
                } else {
                    petaTajuk.classList.remove('bg-purple');
                    petaTajuk.classList.add('bg-orange');
                }
            }
            
            const btnTexts = document.querySelectorAll('#modal-pilih-peta .map-select-text');
            const titles = ['Huruf', 'Suku Kata Asas', 'Suku Kata Hero', 'Bacaan Bergred'];
            btnTexts.forEach((btn, index) => {
                if(titles[index]) {
                    btn.innerText = (mod === 'belajar' ? 'Misi ' : 'Cabaran ') + titles[index];
                }
            });

            document.getElementById('modal-pilih-peta').style.display = 'flex';
        }`;

const newBukaModal = `        function bukaModalPilihPeta(mod) {
            modSemasa = mod;
            const petaTajuk = document.getElementById('modal-pilih-peta-tajuk'); 
            if(petaTajuk) {
                petaTajuk.innerText = mod === 'belajar' ? 'PILIH PETA KEMBARA' : 'PILIH PETA LATIHAN';
                if (mod === 'latihan') {
                    petaTajuk.classList.remove('bg-orange');
                    petaTajuk.classList.add('bg-purple');
                } else {
                    petaTajuk.classList.remove('bg-purple');
                    petaTajuk.classList.add('bg-orange');
                }
            }
            
            const btnTexts = document.querySelectorAll('#modal-pilih-peta .map-select-text');
            const mapImgs = document.querySelectorAll('#modal-pilih-peta .map-select-btn img');
            const titles = ['Huruf', 'Suku Kata Asas', 'Suku Kata Hero', 'Bacaan Bergred'];
            const kembaraImgs = [
                '/images/sampingan/peta-misi-huruf.png',
                '/images/sampingan/peta-misi-suku-kata-asas.png',
                '/images/sampingan/peta-misi-suku-kata-hero.png',
                '/images/sampingan/peta-misi-bacaan-bergred.png'
            ];
            const latihanImgs = [
                '/images/sampingan/peta-cabaran-huruf.png',
                '/images/sampingan/peta-cabaran-suku-kata-asas.png',
                '/images/sampingan/peta-cabaran-suku-kata-hero.png',
                '/images/sampingan/peta-cabaran-bacaan-bergred.png'
            ];

            btnTexts.forEach((btn, index) => {
                if(titles[index]) {
                    btn.innerText = (mod === 'belajar' ? 'Misi ' : 'Cabaran ') + titles[index];
                }
            });

            mapImgs.forEach((img, index) => {
                if (img) {
                    img.src = mod === 'belajar' ? kembaraImgs[index] : latihanImgs[index];
                }
            });

            document.getElementById('modal-pilih-peta').style.display = 'flex';
        }`;

if (appLogic.includes(oldBukaModal)) {
  appLogic = appLogic.replace(oldBukaModal, newBukaModal);
  console.log('✅ bukaModalPilihPeta in app-logic.js updated for dynamic map images');
} else {
  console.log('⚠️ Could not match oldBukaModal in app-logic.js');
}

fs.writeFileSync(appLogicPath, appLogic, 'utf8');
console.log('✅ public/app-logic.js updated');
