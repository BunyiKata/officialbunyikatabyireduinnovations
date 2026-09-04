const fs = require('fs');
const path = require('path');

// 1. PATCH public/app-logic.js
const appLogicPath = path.join(__dirname, 'public', 'app-logic.js');
let appLogic = fs.readFileSync(appLogicPath, 'utf8');

const targetOld = `        window.sebutAudio = function(teks) {
            if('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const s = new SpeechSynthesisUtterance(teks);
                s.lang = 'ms-MY'; s.rate = 0.85; 
                window.speechSynthesis.speak(s);
            }
        };
        function sebutAudio(teks) {
            window.sebutAudio(teks);
        }`;

const targetNew = `        var currentAudioInstance = null;

        window.getAudioPath = function(text) {
            if (!text) return null;
            var raw = String(text).toLowerCase().trim();
            raw = raw.replace(/^(huruf|vokal|konsonan)\\s+(besar|kecil)\\s+/, '');
            raw = raw.replace(/^suku\\s+kata\\s+/, '');
            raw = raw.trim();

            var clean = raw.replace(/[-|\\s]/g, '').trim();

            var numberWordMap = {
                '0': 'sifar', '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
                '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'lapan', '9': 'sembilan',
                '10': 'sepuluh', '20': 'dua-puluh', '30': 'tiga-puluh', '40': 'empat-puluh',
                '50': 'lima-puluh', '60': 'enam-puluh', '70': 'tujuh-puluh', '80': 'lapan-puluh',
                '90': 'sembilan-puluh', '100': 'seratus',
                'dua puluh': 'dua-puluh', 'tiga puluh': 'tiga-puluh', 'empat puluh': 'empat-puluh',
                'lima puluh': 'lima-puluh', 'enam puluh': 'enam-puluh', 'tujuh puluh': 'tujuh-puluh',
                'lapan puluh': 'lapan-puluh', 'sembilan puluh': 'sembilan-puluh'
            };

            if (numberWordMap[raw]) {
                return '/audio/nombor/' + numberWordMap[raw] + '.mp3';
            }
            if (numberWordMap[clean]) {
                return '/audio/nombor/' + numberWordMap[clean] + '.mp3';
            }

            var knownSukukata = ['alu','api','ayam','bakul','baldi','bank','bas','basikal','beca','beg','belon','bendi','berudu','beruk','betik','biskut','bot','botol','cat','cawan','cempedak','cendawan','cerek','cermin','ciku','cincin','doktor','enam','epal','gajah','garfu','gelas','gitar','gong','ibu','ikan','isi','itik','jag','jam','jambatan','jambu','jari','jem','jet','jong','kapak','kapal','kasut','katil','kek','keladi','kelapa','kelawar','keledek','kemeja','kereta','kerusi','ketam','ketupat','kicap','kilat','kipas','komputer','kuku','kunci','labu','lampu','lembu','lidi','lilin','makan','mancis','marah','masjid','mata','nanas','nasi','obor','oren','otak','pagar','paku','pelita','pembaris','perigi','petani','petola','pintu','piramid','pulasan','raga','rak','rambut','rim','ros','rumput','rusa','sabun','sampah','sampan','sawi','semalu','sepatu','sikat','sudu','sup','tali','tanduk','tayar','tebu','telefon','tempayan','tetikus','tin','tomato','tombol','tong','ubi','ular','ulat','ulu','van','wang','wanita','zink','zirafah'];
            var knownKv = ['ba','be','bi','bo','bu','ca','ce','ci','co','cu','da','de','di','do','du','fa','fe','fi','fo','fu','ga','ge','gi','go','gu','ha','he','hi','ho','hu','ja','je','ji','jo','ju','ka','ke','ki','ko','ku','la','le','li','lo','lu','ma','me','mi','mo','mu','na','ne','ni','no','nu','pa','pe','pi','po','pu'];
            var knownAbc = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            var knownNombor = ['satu','dua','tiga','empat','lima','enam','tujuh','lapan','sembilan','sepuluh','sifar','seratus','dua-puluh','tiga-puluh','empat-puluh','lima-puluh','enam-puluh','tujuh-puluh','lapan-puluh','sembilan-puluh'];

            if (knownSukukata.indexOf(clean) !== -1) return '/audio/sukukata/' + clean + '.mp3';
            if (knownKv.indexOf(clean) !== -1) return '/audio/kv/' + clean + '.mp3';
            if (knownAbc.indexOf(clean) !== -1) return '/audio/abc/' + clean + '.mp3';
            if (knownNombor.indexOf(clean) !== -1) return '/audio/nombor/' + clean + '.mp3';

            var hyphenated = raw.replace(/[-|\\s]+/g, '-');
            if (knownNombor.indexOf(hyphenated) !== -1) return '/audio/nombor/' + hyphenated + '.mp3';
            if (knownSukukata.indexOf(hyphenated) !== -1) return '/audio/sukukata/' + hyphenated + '.mp3';

            return null;
        };

        window.sebutAudio = function(teks, onEnd) {
            if (currentAudioInstance) {
                try {
                    currentAudioInstance.pause();
                    currentAudioInstance.currentTime = 0;
                } catch(e) {}
            }
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
            }

            var audioPath = window.getAudioPath(teks);
            if (audioPath) {
                currentAudioInstance = new Audio(audioPath);
                if (typeof onEnd === 'function') {
                    currentAudioInstance.onended = onEnd;
                    currentAudioInstance.onerror = function() {
                        fallbackTTS(teks, onEnd);
                    };
                }
                currentAudioInstance.play().catch(function(err) {
                    fallbackTTS(teks, onEnd);
                });
            } else {
                fallbackTTS(teks, onEnd);
            }
        };

        function fallbackTTS(teks, onEnd) {
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch(e) {}
                var s = new SpeechSynthesisUtterance(teks);
                s.lang = 'ms-MY'; s.rate = 0.85;
                if (typeof onEnd === 'function') {
                    s.onend = onEnd;
                    s.onerror = onEnd;
                }
                window.speechSynthesis.speak(s);
            } else if (typeof onEnd === 'function') {
                onEnd();
            }
        }
        function sebutAudio(teks, onEnd) {
            window.sebutAudio(teks, onEnd);
        }`;

if (appLogic.includes(targetOld)) {
  appLogic = appLogic.replace(targetOld, targetNew);
  fs.writeFileSync(appLogicPath, appLogic, 'utf8');
  console.log('✅ app-logic.js updated with MP3 audio engine!');
} else {
  console.log('⚠️ Could not match targetOld in app-logic.js!');
}

// 2. UPDATE CabaranSukuKataGame.tsx
const cabaranPath = path.join(__dirname, 'src', 'components', 'CabaranSukuKataGame.tsx');
let cabaranCode = fs.readFileSync(cabaranPath, 'utf8');

const cabaranAudioOld = `  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };`;

const cabaranAudioNew = `  const playAudio = (text: string) => {
    if (typeof (window as any).sebutAudio === 'function') {
      (window as any).sebutAudio(text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ms-MY';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };`;

if (cabaranCode.includes(cabaranAudioOld)) {
  cabaranCode = cabaranCode.replace(cabaranAudioOld, cabaranAudioNew);
  fs.writeFileSync(cabaranPath, cabaranCode, 'utf8');
  console.log('✅ CabaranSukuKataGame.tsx updated to use sebutAudio!');
}

// 3. UPDATE PerpustakaanGame.tsx
const perpPath = path.join(__dirname, 'src', 'components', 'PerpustakaanGame.tsx');
let perpCode = fs.readFileSync(perpPath, 'utf8');

const perpSpeakOld = `    const speakWord = (text: string): Promise<void> => {
        return new Promise((resolve) => {
            setSpeakerAnim(text);
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ms-MY';
                utterance.rate = 0.9;
                utterance.onend = () => {
                    setSpeakerAnim(null);
                    setTimeout(resolve, 400); // Jeda sebelum sambung perkataan seterusnya
                };
                utterance.onerror = () => {
                    setSpeakerAnim(null);
                    resolve();
                };
                window.speechSynthesis.speak(utterance);
            } else {
                setTimeout(() => {
                    setSpeakerAnim(null);
                    resolve();
                }, 1000);
            }
        });
    };`;

const perpSpeakNew = `    const speakWord = (text: string): Promise<void> => {
        return new Promise((resolve) => {
            setSpeakerAnim(text);
            const onFinish = () => {
                setSpeakerAnim(null);
                setTimeout(resolve, 400);
            };
            if (typeof (window as any).sebutAudio === 'function') {
                (window as any).sebutAudio(text, onFinish);
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ms-MY';
                utterance.rate = 0.9;
                utterance.onend = onFinish;
                utterance.onerror = onFinish;
                window.speechSynthesis.speak(utterance);
            } else {
                setTimeout(onFinish, 1000);
            }
        });
    };`;

if (perpCode.includes(perpSpeakOld)) {
  perpCode = perpCode.replace(perpSpeakOld, perpSpeakNew);
  fs.writeFileSync(perpPath, perpCode, 'utf8');
  console.log('✅ PerpustakaanGame.tsx updated to use sebutAudio!');
}
