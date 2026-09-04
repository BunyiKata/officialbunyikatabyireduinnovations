const fs = require('fs');
let code = fs.readFileSync('public/app-logic.js', 'utf8');

// 1. Update klikModul
code = code.replace(
    `            if(modSemasa === 'belajar') {
                if (['kenali_huruf', 'huruf_vokal', 'huruf_konsonan', 'fonik_abc'].includes(id)) {
                    bukaModalPilihJenisHuruf(id);
                    return;
                }`,
    `            if(modSemasa === 'belajar') {
                if (id === 'vokal_konsonan') {
                    document.getElementById('modal-pilih-vokal-konsonan').style.display = 'flex';
                    return;
                }
                if (id === 'pengenalan_nombor') {
                    document.getElementById('modal-pilih-jenis-nombor').style.display = 'flex';
                    return;
                }
                if (id === 'konsep_tambah' || id === 'konsep_penolakan') {
                    initBelajarSukuKata(id, title);
                    return;
                }
                if (['kenali_huruf', 'huruf_vokal', 'huruf_konsonan', 'fonik_abc'].includes(id)) {
                    bukaModalPilihJenisHuruf(id);
                    return;
                }`
);

// 2. Update Map 1 modules
const oldMap1_1066 = `                        { id: "kenali_huruf", title: "Cabaran Kenali Huruf" },
                        { id: "huruf_vokal", title: "Cabaran Huruf Vokal" },
                        { id: "huruf_konsonan", title: "Cabaran Huruf Konsonan" },
                        { id: "fonik_abc", title: "Cabaran Fonik ABC" }`;
const newMap1_1066 = `                        { id: "kenali_huruf", title: "Cabaran Kenali Huruf" },
                        { id: "vokal_konsonan", title: "Cabaran Vokal dan Konsonan" },
                        { id: "fonik_abc", title: "Cabaran Fonik ABC" },
                        { id: "pengenalan_nombor", title: "Cabaran Pengenalan Nombor" },
                        { id: "konsep_tambah", title: "Cabaran Konsep Tambah" },
                        { id: "konsep_penolakan", title: "Cabaran Konsep Penolakan" }`;
code = code.replace(oldMap1_1066, newMap1_1066);

const oldMap1_2082 = `                    { id: "kenali_huruf", title: "Cabaran Kenali Huruf", desc: "Mengenal huruf A-Z", icon: "fa-font", color: "#90b562" },
                    { id: "huruf_vokal", title: "Cabaran Huruf Vokal", desc: "Mengenal vokal A, E, I, O, U", icon: "fa-v", color: "#90b562" },
                    { id: "huruf_konsonan", title: "Cabaran Huruf Konsonan", desc: "Mengenal konsonan B, C, D...", icon: "fa-bold", color: "#90b562" },
                    { id: "fonik_abc", title: "Cabaran Fonik ABC", desc: "Mengenal bunyi fonik", icon: "fa-volume-high", color: "#90b562" }`;
const newMap1_2082 = `                    { id: "kenali_huruf", title: "Cabaran Kenali Huruf", desc: "Mengenal huruf A-Z", icon: "fa-font", color: "#90b562" },
                    { id: "vokal_konsonan", title: "Cabaran Vokal dan Konsonan", desc: "Mengenal vokal dan konsonan", icon: "fa-v", color: "#90b562" },
                    { id: "fonik_abc", title: "Cabaran Fonik ABC", desc: "Mengenal bunyi fonik", icon: "fa-volume-high", color: "#90b562" },
                    { id: "pengenalan_nombor", title: "Cabaran Pengenalan Nombor", desc: "Mengenal nombor", icon: "fa-list-ol", color: "#90b562" },
                    { id: "konsep_tambah", title: "Cabaran Konsep Tambah", desc: "Menambah nombor", icon: "fa-plus", color: "#90b562" },
                    { id: "konsep_penolakan", title: "Cabaran Konsep Penolakan", desc: "Menolak nombor", icon: "fa-minus", color: "#90b562" }`;
code = code.replace(oldMap1_2082, newMap1_2082);

const oldMap1_2461 = `                        { id: "kenali_huruf", title: "Kenali Huruf" },
                        { id: "huruf_vokal", title: "Huruf Vokal" },
                        { id: "huruf_konsonan", title: "Huruf Konsonan" },
                        { id: "fonik_abc", title: "Fonik ABC" }`;
const newMap1_2461 = `                        { id: "kenali_huruf", title: "Kenali Huruf" },
                        { id: "vokal_konsonan", title: "Vokal dan Konsonan" },
                        { id: "fonik_abc", title: "Fonik ABC" },
                        { id: "pengenalan_nombor", title: "Pengenalan Nombor" },
                        { id: "konsep_tambah", title: "Konsep Tambah" },
                        { id: "konsep_penolakan", title: "Konsep Penolakan" }`;
code = code.replace(oldMap1_2461, newMap1_2461);

const oldMap1_2710 = `                    { id: "kenali_huruf", title: "Cabaran Kenali Huruf", content: "A a B b", image: "https://i.postimg.cc/W32TBcmP/Copy-of-BUNYI-KATA-APPS-(7).png", color: "#90b562" },
                    { id: "huruf_vokal", title: "Cabaran Huruf Vokal", content: "A E I O U", image: "https://i.postimg.cc/ZnQmv911/Copy-of-BUNYI-KATA-APPS-(6).png", color: "#90b562" },
                    { id: "huruf_konsonan", title: "Cabaran Huruf Konsonan", content: "B C D F G", image: "https://i.postimg.cc/MZ3qF4nk/Copy-of-BUNYI-KATA-APPS-(5).png", color: "#90b562" },
                    { id: "fonik_abc", title: "Cabaran Fonik ABC", content: "a b c", image: "https://i.postimg.cc/PrLTs4Dx/Copy-of-BUNYI-KATA-APPS-(8).png", color: "#90b562" }`;
const newMap1_2710 = `                    { id: "kenali_huruf", title: "Cabaran Kenali Huruf", content: "A a B b", image: "https://i.postimg.cc/W32TBcmP/Copy-of-BUNYI-KATA-APPS-(7).png", color: "#90b562" },
                    { id: "vokal_konsonan", title: "Cabaran Vokal & Konsonan", content: "A B C", image: "https://i.postimg.cc/ZnQmv911/Copy-of-BUNYI-KATA-APPS-(6).png", color: "#90b562" },
                    { id: "fonik_abc", title: "Cabaran Fonik ABC", content: "a b c", image: "https://i.postimg.cc/PrLTs4Dx/Copy-of-BUNYI-KATA-APPS-(8).png", color: "#90b562" },
                    { id: "pengenalan_nombor", title: "Cabaran Pengenalan Nombor", content: "1 2 3", image: "https://i.postimg.cc/k47vBdf0/Copy-of-BUNYI-KATA-APPS-27.png", color: "#90b562" },
                    { id: "konsep_tambah", title: "Cabaran Konsep Tambah", content: "+", image: "https://i.postimg.cc/2j5P7Y5N/Copy-of-BUNYI-KATA-APPS-28.png", color: "#90b562" },
                    { id: "konsep_penolakan", title: "Cabaran Konsep Penolakan", content: "-", image: "https://i.postimg.cc/T3yB2hH4/Copy-of-BUNYI-KATA-APPS-29.png", color: "#90b562" }`;
code = code.replace(oldMap1_2710, newMap1_2710);

fs.writeFileSync('public/app-logic.js', code);
console.log('Done mapping.');
