const fs = require('fs');
let cabaran = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const newPlaySoundEffect = `  const playSoundEffect = (type: 'correct' | 'wrong') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      if (!(window as any).reactAudioCtx) {
        (window as any).reactAudioCtx = new AudioCtx();
      }
      const ctx = (window as any).reactAudioCtx;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.25, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.25);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      console.log('Audio Context error', e);
    }
  };`;

cabaran = cabaran.replace(/const playSoundEffect = \(type: 'correct' \| 'wrong'\) => \{[\s\S]*?\};/, newPlaySoundEffect);

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', cabaran);
