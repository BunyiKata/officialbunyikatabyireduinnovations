import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { tangkapKodRujukan } from './config/contactAdmin';
import * as coreAudio from './utils/coreAudio';
import { installUiSfxUnlocker } from './utils/uiSfx';
import { installUiSfxBridge } from './utils/uiSfxBridge';
// Audio peneguhan (MP3 sebenar) — mengimportnya di sini supaya jambatan global
// window.playPeneguhanCorrect/Wrong/Popup* terpasang untuk app-logic.js (AR).
import './utils/peneguhanAudio';

// Fasa 2: tangkap ?ref= SEBELUM React dimuatkan, supaya kod affiliate tidak
// hilang apabila URL dibersihkan oleh navigasi/pelayar.
tangkapKodRujukan();

// Kongsi enjin audio React dengan app-logic.js supaya SATU AudioContext sahaja
// digunakan seluruh app (elak had ~6 ctx & bunyi senyap/dobel pada mobile).
(window as any).coreAudio = coreAudio;
(window as any).getGlobalAudioContext = coreAudio.getCoreAudioContext;
// NOTA: JANGAN tetapkan __reactNavSoundInstalled. Handler klik global
// app-logic.js (playBubble) kekal AKTIF sebagai satu-satunya enjin bunyi klik,
// dan komponen React memanggil window.playBubble() yang SAMA supaya tak double.

// Buka kunci audio pada gesture PERTAMA (iOS/Android) + resume ctx.
coreAudio.installCoreAudioUnlocker();

// Buka kunci bunyi UI (uisfx, pack boleh tukar; kini "minimal") pada gesture pertama TANPA
// autoplay, dan dedahkan API semantik pada window untuk kod JS lama.
installUiSfxUnlocker();
installUiSfxBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
