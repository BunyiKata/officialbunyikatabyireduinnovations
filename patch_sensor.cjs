const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// 1. Modify requestSensorPermissionAndStart definition
code = code.replace(
    'function requestSensorPermissionAndStart(type) {',
    'function requestSensorPermissionAndStart(type, arg) {'
);

// 2. Modify startScene router inside requestSensorPermissionAndStart
const oldRouter = `        const startScene = () => {
            console.log('Starting scene:', type);
            if (type === 'vr') startVRScene();
            else if (type === 'vr-nombor') startVRNomborScene();
            else startARScene();
        };`;
        
const newRouter = `        const startScene = () => {
            console.log('Starting scene:', type);
            if (type === 'vr') startVRScene();
            else if (type === 'vr-nombor') startVRNomborScene();
            else if (type === 'ar') startARScene();
            else if (type === 'ar-sukukata') {
                if (window.bukaARSukuKataKemahiranSebenar) {
                    window.bukaARSukuKataKemahiranSebenar(arg);
                } else {
                    console.error("bukaARSukuKataKemahiranSebenar not found!");
                }
            }
        };`;
code = code.replace(oldRouter, newRouter);

fs.writeFileSync('public/app-logic.js', code);
console.log("Patched requestSensorPermissionAndStart");
