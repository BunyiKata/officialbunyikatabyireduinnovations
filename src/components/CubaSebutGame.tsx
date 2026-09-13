import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export interface SebutItem {
  id: string;
  text: string;
  syllables?: string[];
  audio?: string;
  category: string;
}

export interface CubaSebutGameProps {
  mode: 'sebut' | 'baca';
  categoryKey: string;
  categoryLabel: string;
  onClose: () => void;
  onChooseOtherSkill?: () => void;
}

// Database of items
const SEBUT_DATABASE: Record<string, SebutItem[]> = {
  // --- SUKU KATA ASAS ---
  'kv': [
    { id: 'ba', text: 'ba', syllables: ['ba'], audio: '/audio/kv/ba.mp3', category: 'kv' },
    { id: 'bi', text: 'bi', syllables: ['bi'], audio: '/audio/kv/bi.mp3', category: 'kv' },
    { id: 'bu', text: 'bu', syllables: ['bu'], audio: '/audio/kv/bu.mp3', category: 'kv' },
    { id: 'ca', text: 'ca', syllables: ['ca'], audio: '/audio/kv/ca.mp3', category: 'kv' },
    { id: 'ci', text: 'ci', syllables: ['ci'], audio: '/audio/kv/ci.mp3', category: 'kv' },
    { id: 'cu', text: 'cu', syllables: ['cu'], audio: '/audio/kv/cu.mp3', category: 'kv' },
    { id: 'da', text: 'da', syllables: ['da'], audio: '/audio/kv/da.mp3', category: 'kv' },
    { id: 'di', text: 'di', syllables: ['di'], audio: '/audio/kv/di.mp3', category: 'kv' },
    { id: 'du', text: 'du', syllables: ['du'], audio: '/audio/kv/du.mp3', category: 'kv' },
    { id: 'ga', text: 'ga', syllables: ['ga'], audio: '/audio/kv/ga.mp3', category: 'kv' },
    { id: 'gi', text: 'gi', syllables: ['gi'], audio: '/audio/kv/gi.mp3', category: 'kv' },
    { id: 'gu', text: 'gu', syllables: ['gu'], audio: '/audio/kv/gu.mp3', category: 'kv' },
    { id: 'ja', text: 'ja', syllables: ['ja'], audio: '/audio/kv/ja.mp3', category: 'kv' },
    { id: 'ji', text: 'ji', syllables: ['ji'], audio: '/audio/kv/ji.mp3', category: 'kv' },
    { id: 'ju', text: 'ju', syllables: ['ju'], audio: '/audio/kv/ju.mp3', category: 'kv' },
    { id: 'ka', text: 'ka', syllables: ['ka'], audio: '/audio/kv/ka.mp3', category: 'kv' },
    { id: 'ki', text: 'ki', syllables: ['ki'], audio: '/audio/kv/ki.mp3', category: 'kv' },
    { id: 'ku', text: 'ku', syllables: ['ku'], audio: '/audio/kv/ku.mp3', category: 'kv' },
    { id: 'la', text: 'la', syllables: ['la'], audio: '/audio/kv/la.mp3', category: 'kv' },
    { id: 'li', text: 'li', syllables: ['li'], audio: '/audio/kv/li.mp3', category: 'kv' },
    { id: 'lu', text: 'lu', syllables: ['lu'], audio: '/audio/kv/lu.mp3', category: 'kv' },
    { id: 'ma', text: 'ma', syllables: ['ma'], audio: '/audio/kv/ma.mp3', category: 'kv' },
    { id: 'mi', text: 'mi', syllables: ['mi'], audio: '/audio/kv/mi.mp3', category: 'kv' },
    { id: 'mu', text: 'mu', syllables: ['mu'], audio: '/audio/kv/mu.mp3', category: 'kv' },
    { id: 'na', text: 'na', syllables: ['na'], audio: '/audio/kv/na.mp3', category: 'kv' },
    { id: 'ni', text: 'ni', syllables: ['ni'], audio: '/audio/kv/ni.mp3', category: 'kv' },
    { id: 'nu', text: 'nu', syllables: ['nu'], audio: '/audio/kv/nu.mp3', category: 'kv' },
    { id: 'pa', text: 'pa', syllables: ['pa'], audio: '/audio/kv/pa.mp3', category: 'kv' },
    { id: 'pi', text: 'pi', syllables: ['pi'], audio: '/audio/kv/pi.mp3', category: 'kv' },
    { id: 'pu', text: 'pu', syllables: ['pu'], audio: '/audio/kv/pu.mp3', category: 'kv' }
  ],
  'kvkv': [
    { id: 'beca', text: 'beca', syllables: ['be', 'ca'], audio: '/audio/sukukata/beca.mp3', category: 'kvkv' },
    { id: 'ciku', text: 'ciku', syllables: ['ci', 'ku'], audio: '/audio/sukukata/ciku.mp3', category: 'kvkv' },
    { id: 'jari', text: 'jari', syllables: ['ja', 'ri'], audio: '/audio/sukukata/jari.mp3', category: 'kvkv' },
    { id: 'kuku', text: 'kuku', syllables: ['ku', 'ku'], audio: '/audio/sukukata/kuku.mp3', category: 'kvkv' },
    { id: 'labu', text: 'labu', syllables: ['la', 'bu'], audio: '/audio/sukukata/labu.mp3', category: 'kvkv' },
    { id: 'lidi', text: 'lidi', syllables: ['li', 'di'], audio: '/audio/sukukata/lidi.mp3', category: 'kvkv' },
    { id: 'mata', text: 'mata', syllables: ['ma', 'ta'], audio: '/audio/sukukata/mata.mp3', category: 'kvkv' },
    { id: 'nasi', text: 'nasi', syllables: ['na', 'si'], audio: '/audio/sukukata/nasi.mp3', category: 'kvkv' },
    { id: 'paku', text: 'paku', syllables: ['pa', 'ku'], audio: '/audio/sukukata/paku.mp3', category: 'kvkv' },
    { id: 'raga', text: 'raga', syllables: ['ra', 'ga'], audio: '/audio/sukukata/raga.mp3', category: 'kvkv' },
    { id: 'rusa', text: 'rusa', syllables: ['ru', 'sa'], audio: '/audio/sukukata/rusa.mp3', category: 'kvkv' },
    { id: 'sawi', text: 'sawi', syllables: ['sa', 'wi'], audio: '/audio/sukukata/sawi.mp3', category: 'kvkv' },
    { id: 'sudu', text: 'sudu', syllables: ['su', 'du'], audio: '/audio/sukukata/sudu.mp3', category: 'kvkv' },
    { id: 'tali', text: 'tali', syllables: ['ta', 'li'], audio: '/audio/sukukata/tali.mp3', category: 'kvkv' },
    { id: 'tebu', text: 'tebu', syllables: ['te', 'bu'], audio: '/audio/sukukata/tebu.mp3', category: 'kvkv' }
  ],
  'v_kv': [
    { id: 'alu', text: 'alu', syllables: ['a', 'lu'], audio: '/audio/sukukata/alu.mp3', category: 'v_kv' },
    { id: 'api', text: 'api', syllables: ['a', 'pi'], audio: '/audio/sukukata/api.mp3', category: 'v_kv' },
    { id: 'ibu', text: 'ibu', syllables: ['i', 'bu'], audio: '/audio/sukukata/ibu.mp3', category: 'v_kv' },
    { id: 'isi', text: 'isi', syllables: ['i', 'si'], audio: '/audio/sukukata/isi.mp3', category: 'v_kv' },
    { id: 'ubi', text: 'ubi', syllables: ['u', 'bi'], audio: '/audio/sukukata/ubi.mp3', category: 'v_kv' },
    { id: 'ulu', text: 'ulu', syllables: ['u', 'lu'], audio: '/audio/sukukata/ulu.mp3', category: 'v_kv' }
  ],
  'kvkvkv': [
    { id: 'berudu', text: 'berudu', syllables: ['be', 'ru', 'du'], audio: '/audio/sukukata/berudu.mp3', category: 'kvkvkv' },
    { id: 'keladi', text: 'keladi', syllables: ['ke', 'la', 'di'], audio: '/audio/sukukata/keladi.mp3', category: 'kvkvkv' },
    { id: 'kelapa', text: 'kelapa', syllables: ['ke', 'la', 'pa'], audio: '/audio/sukukata/kelapa.mp3', category: 'kvkvkv' },
    { id: 'kemeja', text: 'kemeja', syllables: ['ke', 'me', 'ja'], audio: '/audio/sukukata/kemeja.mp3', category: 'kvkvkv' },
    { id: 'kereta', text: 'kereta', syllables: ['ke', 're', 'ta'], audio: '/audio/sukukata/kereta.mp3', category: 'kvkvkv' },
    { id: 'kerusi', text: 'kerusi', syllables: ['ke', 'ru', 'si'], audio: '/audio/sukukata/kerusi.mp3', category: 'kvkvkv' },
    { id: 'pelita', text: 'pelita', syllables: ['pe', 'li', 'ta'], audio: '/audio/sukukata/pelita.mp3', category: 'kvkvkv' },
    { id: 'perigi', text: 'perigi', syllables: ['pe', 'ri', 'gi'], audio: '/audio/sukukata/perigi.mp3', category: 'kvkvkv' },
    { id: 'petani', text: 'petani', syllables: ['pe', 'ta', 'ni'], audio: '/audio/sukukata/petani.mp3', category: 'kvkvkv' },
    { id: 'petola', text: 'petola', syllables: ['pe', 'to', 'la'], audio: '/audio/sukukata/petola.mp3', category: 'kvkvkv' },
    { id: 'semalu', text: 'semalu', syllables: ['se', 'ma', 'lu'], audio: '/audio/sukukata/semalu.mp3', category: 'kvkvkv' },
    { id: 'sepatu', text: 'sepatu', syllables: ['se', 'pa', 'tu'], audio: '/audio/sukukata/sepatu.mp3', category: 'kvkvkv' },
    { id: 'tomato', text: 'tomato', syllables: ['to', 'ma', 'to'], audio: '/audio/sukukata/tomato.mp3', category: 'kvkvkv' },
    { id: 'wanita', text: 'wanita', syllables: ['wa', 'ni', 'ta'], audio: '/audio/sukukata/wanita.mp3', category: 'kvkvkv' }
  ],
  'kvk': [
    { id: 'bas', text: 'bas', syllables: ['bas'], audio: '/audio/sukukata/bas.mp3', category: 'kvk' },
    { id: 'beg', text: 'beg', syllables: ['beg'], audio: '/audio/sukukata/beg.mp3', category: 'kvk' },
    { id: 'bot', text: 'bot', syllables: ['bot'], audio: '/audio/sukukata/bot.mp3', category: 'kvk' },
    { id: 'cat', text: 'cat', syllables: ['cat'], audio: '/audio/sukukata/cat.mp3', category: 'kvk' },
    { id: 'jag', text: 'jag', syllables: ['jag'], audio: '/audio/sukukata/jag.mp3', category: 'kvk' },
    { id: 'jam', text: 'jam', syllables: ['jam'], audio: '/audio/sukukata/jam.mp3', category: 'kvk' },
    { id: 'jem', text: 'jem', syllables: ['jem'], audio: '/audio/sukukata/jem.mp3', category: 'kvk' },
    { id: 'jet', text: 'jet', syllables: ['jet'], audio: '/audio/sukukata/jet.mp3', category: 'kvk' },
    { id: 'kek', text: 'kek', syllables: ['kek'], audio: '/audio/sukukata/kek.mp3', category: 'kvk' },
    { id: 'kot', text: 'kot', syllables: ['kot'], audio: '/audio/sukukata/kot.mp3', category: 'kvk' },
    { id: 'pam', text: 'pam', syllables: ['pam'], audio: '/audio/sukukata/pam.mp3', category: 'kvk' },
    { id: 'pen', text: 'pen', syllables: ['pen'], audio: '/audio/sukukata/pen.mp3', category: 'kvk' },
    { id: 'pil', text: 'pil', syllables: ['pil'], audio: '/audio/sukukata/pil.mp3', category: 'kvk' },
    { id: 'pin', text: 'pin', syllables: ['pin'], audio: '/audio/sukukata/pin.mp3', category: 'kvk' },
    { id: 'rak', text: 'rak', syllables: ['rak'], audio: '/audio/sukukata/rak.mp3', category: 'kvk' }
  ],
  'v_kvk': [
    { id: 'ayam', text: 'ayam', syllables: ['a', 'yam'], audio: '/audio/sukukata/ayam.mp3', category: 'v_kvk' },
    { id: 'enam', text: 'enam', syllables: ['e', 'nam'], audio: '/audio/sukukata/enam.mp3', category: 'v_kvk' },
    { id: 'epal', text: 'epal', syllables: ['e', 'pal'], audio: '/audio/sukukata/epal.mp3', category: 'v_kvk' },
    { id: 'ikan', text: 'ikan', syllables: ['i', 'kan'], audio: '/audio/sukukata/ikan.mp3', category: 'v_kvk' },
    { id: 'itik', text: 'itik', syllables: ['i', 'tik'], audio: '/audio/sukukata/itik.mp3', category: 'v_kvk' },
    { id: 'obor', text: 'obor', syllables: ['o', 'bor'], audio: '/audio/sukukata/obor.mp3', category: 'v_kvk' },
    { id: 'oren', text: 'oren', syllables: ['o', 'ren'], audio: '/audio/sukukata/oren.mp3', category: 'v_kvk' },
    { id: 'otak', text: 'otak', syllables: ['o', 'tak'], audio: '/audio/sukukata/otak.mp3', category: 'v_kvk' },
    { id: 'ular', text: 'ular', syllables: ['u', 'lar'], audio: '/audio/sukukata/ular.mp3', category: 'v_kvk' },
    { id: 'ulat', text: 'ulat', syllables: ['u', 'lat'], audio: '/audio/sukukata/ulat.mp3', category: 'v_kvk' }
  ],

  // --- SUKU KATA HERO ---
  'kv_kvk': [
    { id: 'bakul', text: 'bakul', syllables: ['ba', 'kul'], audio: '/audio/sukukata/bakul.mp3', category: 'kv_kvk' },
    { id: 'belon', text: 'belon', syllables: ['be', 'lon'], audio: '/audio/sukukata/belon.mp3', category: 'kv_kvk' },
    { id: 'beruk', text: 'beruk', syllables: ['be', 'ruk'], audio: '/audio/sukukata/beruk.mp3', category: 'kv_kvk' },
    { id: 'betik', text: 'betik', syllables: ['be', 'tik'], audio: '/audio/sukukata/betik.mp3', category: 'kv_kvk' },
    { id: 'botol', text: 'botol', syllables: ['bo', 'tol'], audio: '/audio/sukukata/botol.mp3', category: 'kv_kvk' },
    { id: 'cawan', text: 'cawan', syllables: ['ca', 'wan'], audio: '/audio/sukukata/cawan.mp3', category: 'kv_kvk' },
    { id: 'cerek', text: 'cerek', syllables: ['ce', 'rek'], audio: '/audio/sukukata/cerek.mp3', category: 'kv_kvk' },
    { id: 'gajah', text: 'gajah', syllables: ['ga', 'jah'], audio: '/audio/sukukata/gajah.mp3', category: 'kv_kvk' },
    { id: 'gelas', text: 'gelas', syllables: ['ge', 'las'], audio: '/audio/sukukata/gelas.mp3', category: 'kv_kvk' },
    { id: 'gitar', text: 'gitar', syllables: ['gi', 'tar'], audio: '/audio/sukukata/gitar.mp3', category: 'kv_kvk' },
    { id: 'katil', text: 'katil', syllables: ['ka', 'til'], audio: '/audio/sukukata/katil.mp3', category: 'kv_kvk' }
  ],
  'kvk_kv': [
    { id: 'baldi', text: 'baldi', syllables: ['bal', 'di'], audio: '/audio/sukukata/baldi.mp3', category: 'kvk_kv' },
    { id: 'bendi', text: 'bendi', syllables: ['ben', 'di'], audio: '/audio/sukukata/bendi.mp3', category: 'kvk_kv' },
    { id: 'garfu', text: 'garfu', syllables: ['gar', 'fu'], audio: '/audio/sukukata/garfu.mp3', category: 'kvk_kv' },
    { id: 'garpu', text: 'garpu', syllables: ['gar', 'pu'], audio: '/audio/sukukata/garpu.mp3', category: 'kvk_kv' },
    { id: 'jambu', text: 'jambu', syllables: ['jam', 'bu'], audio: '/audio/sukukata/jambu.mp3', category: 'kvk_kv' },
    { id: 'kunci', text: 'kunci', syllables: ['kun', 'ci'], audio: '/audio/sukukata/kunci.mp3', category: 'kvk_kv' },
    { id: 'lampu', text: 'lampu', syllables: ['lam', 'pu'], audio: '/audio/sukukata/lampu.mp3', category: 'kvk_kv' },
    { id: 'lembu', text: 'lembu', syllables: ['lem', 'bu'], audio: '/audio/sukukata/lembu.mp3', category: 'kvk_kv' },
    { id: 'pintu', text: 'pintu', syllables: ['pin', 'tu'], audio: '/audio/sukukata/pintu.mp3', category: 'kvk_kv' }
  ],
  'kvk_kvk': [
    { id: 'biskut', text: 'biskut', syllables: ['bis', 'kut'], audio: '/audio/sukukata/biskut.mp3', category: 'kvk_kvk' },
    { id: 'cermin', text: 'cermin', syllables: ['cer', 'min'], audio: '/audio/sukukata/cermin.mp3', category: 'kvk_kvk' },
    { id: 'cincin', text: 'cincin', syllables: ['cin', 'cin'], audio: '/audio/sukukata/cincin.mp3', category: 'kvk_kvk' },
    { id: 'doktor', text: 'doktor', syllables: ['dok', 'tor'], audio: '/audio/sukukata/doktor.mp3', category: 'kvk_kvk' },
    { id: 'mancis', text: 'mancis', syllables: ['man', 'cis'], audio: '/audio/sukukata/mancis.mp3', category: 'kvk_kvk' },
    { id: 'masjid', text: 'masjid', syllables: ['mas', 'jid'], audio: '/audio/sukukata/masjid.mp3', category: 'kvk_kvk' },
    { id: 'rambut', text: 'rambut', syllables: ['ram', 'but'], audio: '/audio/sukukata/rambut.mp3', category: 'kvk_kvk' },
    { id: 'rumput', text: 'rumput', syllables: ['rum', 'put'], audio: '/audio/sukukata/rumput.mp3', category: 'kvk_kvk' },
    { id: 'sampah', text: 'sampah', syllables: ['sam', 'pah'], audio: '/audio/sukukata/sampah.mp3', category: 'kvk_kvk' },
    { id: 'sampan', text: 'sampan', syllables: ['sam', 'pan'], audio: '/audio/sukukata/sampan.mp3', category: 'kvk_kvk' }
  ],
  'kvkk': [
    { id: 'bank', text: 'bank', syllables: ['bank'], audio: '/audio/sukukata/bank.mp3', category: 'kvkk' },
    { id: 'gong', text: 'gong', syllables: ['gong'], audio: '/audio/sukukata/gong.mp3', category: 'kvkk' },
    { id: 'jong', text: 'jong', syllables: ['jong'], audio: '/audio/sukukata/jong.mp3', category: 'kvkk' },
    { id: 'tong', text: 'tong', syllables: ['tong'], audio: '/audio/sukukata/tong.mp3', category: 'kvkk' },
    { id: 'wang', text: 'wang', syllables: ['wang'], audio: '/audio/sukukata/wang.mp3', category: 'kvkk' },
    { id: 'zink', text: 'zink', syllables: ['zink'], audio: '/audio/sukukata/zink.mp3', category: 'kvkk' }
  ],
  'kv_kv_kvk': [
    { id: 'basikal', text: 'basikal', syllables: ['ba', 'si', 'kal'], audio: '/audio/sukukata/basikal.mp3', category: 'kv_kv_kvk' },
    { id: 'kelawar', text: 'kelawar', syllables: ['ke', 'la', 'war'], audio: '/audio/sukukata/kelawar.mp3', category: 'kv_kv_kvk' },
    { id: 'keledek', text: 'keledek', syllables: ['ke', 'le', 'dek'], audio: '/audio/sukukata/keledek.mp3', category: 'kv_kv_kvk' },
    { id: 'ketupat', text: 'ketupat', syllables: ['ke', 'tu', 'pat'], audio: '/audio/sukukata/ketupat.mp3', category: 'kv_kv_kvk' },
    { id: 'piramid', text: 'piramid', syllables: ['pi', 'ra', 'mid'], audio: '/audio/sukukata/piramid.mp3', category: 'kv_kv_kvk' },
    { id: 'pulasan', text: 'pulasan', syllables: ['pu', 'la', 'san'], audio: '/audio/sukukata/pulasan.mp3', category: 'kv_kv_kvk' },
    { id: 'telefon', text: 'telefon', syllables: ['te', 'le', 'fon'], audio: '/audio/sukukata/telefon.mp3', category: 'kv_kv_kvk' },
    { id: 'tetikus', text: 'tetikus', syllables: ['te', 'ti', 'kus'], audio: '/audio/sukukata/tetikus.mp3', category: 'kv_kv_kvk' },
    { id: 'zirafah', text: 'zirafah', syllables: ['zi', 'ra', 'fah'], audio: '/audio/sukukata/zirafah.mp3', category: 'kv_kv_kvk' }
  ],
  'kvk_kv_kvk': [
    { id: 'cempedak', text: 'cempedak', syllables: ['cem', 'pe', 'dak'], audio: '/audio/sukukata/cempedak.mp3', category: 'kvk_kv_kvk' },
    { id: 'cendawan', text: 'cendawan', syllables: ['cen', 'da', 'wan'], audio: '/audio/sukukata/cendawan.mp3', category: 'kvk_kv_kvk' },
    { id: 'jambatan', text: 'jambatan', syllables: ['jam', 'ba', 'tan'], audio: '/audio/sukukata/jambatan.mp3', category: 'kvk_kv_kvk' },
    { id: 'komputer', text: 'komputer', syllables: ['kom', 'pu', 'ter'], audio: '/audio/sukukata/komputer.mp3', category: 'kvk_kv_kvk' },
    { id: 'pembaris', text: 'pembaris', syllables: ['pem', 'ba', 'ris'], audio: '/audio/sukukata/pembaris.mp3', category: 'kvk_kv_kvk' },
    { id: 'tempayan', text: 'tempayan', syllables: ['tem', 'pa', 'yan'], audio: '/audio/sukukata/tempayan.mp3', category: 'kvk_kv_kvk' }
  ],

  // --- BACAAN BERGRED ---
  'ayat_pendek': [
    { id: 'ap_1', text: 'Saya suka makan nasi.', audio: '/audio/bacaan-bergred/audio ayat pendek/saya suka makan nasi.mp3', category: 'ayat_pendek' },
    { id: 'ap_2', text: 'Ibu memasak di dapur.', audio: '/audio/bacaan-bergred/audio ayat pendek/ibu memasak di dapur.mp3', category: 'ayat_pendek' },
    { id: 'ap_3', text: 'Kucing itu sangat comel.', audio: '/audio/bacaan-bergred/audio ayat pendek/kucing itu sangat comel.mp3', category: 'ayat_pendek' },
    { id: 'ap_4', text: 'Adik saya suka bermain.', audio: '/audio/bacaan-bergred/audio ayat pendek/adik saya suka bermain.mp3', category: 'ayat_pendek' },
    { id: 'ap_5', text: 'Bapa pergi ke pejabat.', audio: '/audio/bacaan-bergred/audio ayat pendek/bapa pergi ke pejabat.mp3', category: 'ayat_pendek' },
    { id: 'ap_6', text: 'Kakak membaca buku cerita.', audio: '/audio/bacaan-bergred/audio ayat pendek/kakak membaca buku cerita.mp3', category: 'ayat_pendek' },
    { id: 'ap_7', text: 'Kami pergi ke sekolah.', audio: '/audio/bacaan-bergred/audio ayat pendek/kami pergi ke sekolah.mp3', category: 'ayat_pendek' },
    { id: 'ap_8', text: 'Burung itu terbang tinggi.', audio: '/audio/bacaan-bergred/audio ayat pendek/burung itu terbang tinggi.mp3', category: 'ayat_pendek' },
    { id: 'ap_9', text: 'Saya minum air kosong.', audio: '/audio/bacaan-bergred/audio ayat pendek/saya minum air kosong.mp3', category: 'ayat_pendek' },
    { id: 'ap_10', text: 'Kami makan bersama.', audio: '/audio/bacaan-bergred/audio ayat pendek/kami makan bersama.mp3', category: 'ayat_pendek' }
  ],
  'ayat_panjang': [
    { id: 'aj_1', text: 'Ibu memasak nasi lemak untuk sarapan pagi ini.', audio: '/audio/bacaan-bergred/audio ayat panjang/ibu memasak nasi lemak untuk sarapan pagi ini.mp3', category: 'ayat_panjang' },
    { id: 'aj_2', text: 'Kami pergi ke taman permainan pada hari Sabtu.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami pergi ke taman permainan pada hari sabtu.mp3', category: 'ayat_panjang' },
    { id: 'aj_3', text: 'Bapa membeli buah-buahan segar di pasar tani.', audio: '/audio/bacaan-bergred/audio ayat panjang/bapa membeli buah buahan segar di pasar tani.mp3', category: 'ayat_panjang' },
    { id: 'aj_4', text: 'Kucing kecil itu bermain dengan bola di halaman rumah.', audio: '/audio/bacaan-bergred/audio ayat panjang/kucing kecil itu bermain dengan bola di halam.mp3', category: 'ayat_panjang' },
    { id: 'aj_5', text: 'Adik saya belajar membaca buku cerita setiap malam.', audio: '/audio/bacaan-bergred/audio ayat panjang/adik saya belajar membaca buku cerita setiap .mp3', category: 'ayat_panjang' },
    { id: 'aj_6', text: 'Guru mengajar kami menulis huruf abjad dengan rapi.', audio: '/audio/bacaan-bergred/audio ayat panjang/guru mengajar kami menulis huruf abjad dengan.mp3', category: 'ayat_panjang' },
    { id: 'aj_7', text: 'Kami menyanyi lagu sambil bertepuk tangan dengan gembira.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami menyanyi lagu sambil bertepuk tangan den.mp3', category: 'ayat_panjang' },
    { id: 'aj_8', text: 'Burung kecil itu terbang tinggi di langit biru.', audio: '/audio/bacaan-bergred/audio ayat panjang/burung kecil itu terbang tinggi di langit bir.mp3', category: 'ayat_panjang' },
    { id: 'aj_9', text: 'Kakak membantu ibu membasuh pinggan selepas makan malam.', audio: '/audio/bacaan-bergred/audio ayat panjang/kakak membantu ibu membasuh pinggan selepas m.mp3', category: 'ayat_panjang' },
    { id: 'aj_10', text: 'Kami berkumpul di padang sekolah untuk beriadah pagi.', audio: '/audio/bacaan-bergred/audio ayat panjang/kami berkumpul di padang sekolah untuk beriad.mp3', category: 'ayat_panjang' }
  ],
  'petikan_1': [
    { id: 'p1_1', text: 'Ini kereta bapa. Kereta bapa biru. Bapa bawa kereta laju.', audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 kereta.mp3', category: 'petikan_1' },
    { id: 'p1_2', text: 'Ini bola saya. Bola saya merah. Saya baling bola jauh.', audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 bola.mp3', category: 'petikan_1' },
    { id: 'p1_3', text: 'Ini topi adik. Topi adik kuning. Adik pakai topi elok.', audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 topi.mp3', category: 'petikan_1' },
    { id: 'p1_4', text: 'Ini beg kakak. Beg kakak hijau. Kakak bawa beg berat.', audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 beg.mp3', category: 'petikan_1' },
    { id: 'p1_5', text: 'Ini basikal abang. Basikal abang hitam. Abang kayuh basikal laju.', audio: '/audio/bacaan-bergred/audio petikan tahap 1/petikan tahap 1 basikal.mp3', category: 'petikan_1' }
  ],
  'petikan_2': [
    { id: 'p2_1', text: 'Ini rumah saya. Rumah saya besar. Saya tinggal di rumah besar bersama keluarga.', audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 rumah.mp3', category: 'petikan_2' },
    { id: 'p2_2', text: 'Ini sekolah kami. Sekolah kami ceria. Kami belajar di sekolah ceria setiap hari.', audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 sekolah.mp3', category: 'petikan_2' },
    { id: 'p2_3', text: 'Ini kucing saya. Kucing saya comel. Saya bermain dengan kucing comel setiap petang.', audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 kucing.mp3', category: 'petikan_2' },
    { id: 'p2_4', text: 'Ini taman kami. Taman kami luas. Kami berlari di taman luas pada waktu pagi.', audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 taman.mp3', category: 'petikan_2' },
    { id: 'p2_5', text: 'Ini dapur ibu. Dapur ibu bersih. Ibu memasak di dapur bersih setiap petang.', audio: '/audio/bacaan-bergred/audio petikan tahap 2/petikan tahap 2 dapur.mp3', category: 'petikan_2' }
  ],
  'cerita_pendek': [
    { id: 'cp_1', text: 'Comel ialah seekor kucing kecil. Comel tinggal bersama Ali di rumah. Setiap pagi, Comel bermain di halaman rumah. Comel suka makan ikan dan minum susu. Ali sangat sayang akan Comel.', audio: '/audio/cerita-pendek/cerita-pendek-comel.mp3', category: 'cerita_pendek' },
    { id: 'cp_2', text: 'Hari ini sekolah mengadakan hari sukan. Murid-murid memakai baju sukan berwarna-warni. Ani berlari pantas dalam pertandingan lari. Ani berjaya memenangi hadiah pertama. Semua murid bertepuk tangan dengan gembira.', audio: '/audio/cerita-pendek/cerita-pendek-hari-sukan.mp3', category: 'cerita_pendek' },
    { id: 'cp_3', text: 'Pada hari Sabtu, ibu pergi ke pasar. Ali turut serta bersama ibu ke pasar. Mereka membeli sayur, buah dan ikan segar. Ali membantu ibu membawa beg barang. Mereka pulang ke rumah dengan gembira.', audio: '/audio/cerita-pendek/cerita-pendek-pasar.mp3', category: 'cerita_pendek' },
    { id: 'cp_4', text: 'Di halaman rumah Ali, ada sebatang pokok mangga. Setiap tahun, pokok itu berbuah lebat. Ali suka memetik buah mangga yang masak. Ibu memasak jeruk mangga yang sedap. Sekeluarga menikmati mangga bersama-sama.', audio: '/audio/cerita-pendek/cerita-pendek-pokok-mangga.mp3', category: 'cerita_pendek' },
    { id: 'cp_5', text: 'Cikgu Nur mengajar kelas prasekolah setiap hari. Murid-murid belajar membaca dan menyanyi bersama. Ali dan Ani suka bermain di sudut buku. Cikgu Nur sentiasa sabar mengajar murid-muridnya. Kelas itu sentiasa ceria dan gembira.', audio: '/audio/cerita-pendek/cerita-pendek-cikgu-nur.mp3', category: 'cerita_pendek' }
  ]
};

// Utility to shuffle array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Audio Synth Helper for Celebratory Star Sound (+1 Bintang!)
function playPopConfettiSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = (window as any).globalAudioCtx || new AudioContextClass();
    (window as any).globalAudioCtx = ctx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;

    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(650, now);
    popOsc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

    popGain.gain.setValueAtTime(0.45, now);
    popGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);

    popOsc.start(now);
    popOsc.stop(now + 0.09);

    [523.25, 659.25, 783.99, 1046.50].forEach((freq: number, idx: number) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, now + 0.04 + idx * 0.06);
      chimeGain.gain.setValueAtTime(0.3, now + 0.04 + idx * 0.06);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.06);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.04 + idx * 0.06);
      chimeOsc.stop(now + 0.45 + idx * 0.06);
    });
  } catch (e) {}
}

function getNextKVSebutItems(rawPool: SebutItem[], mode: string): SebutItem[] {
  const STORAGE_KEY = `cubasebut_used_kv_${mode}`;
  let usedIds: string[] = [];
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) usedIds = JSON.parse(saved);
  } catch (e) {}

  let available = rawPool.filter(item => !usedIds.includes(item.id || item.text));
  if (available.length < 10) {
    usedIds = [];
    available = [...rawPool];
  }

  const chosen = shuffle(available).slice(0, 10);
  const newUsed = [...usedIds, ...chosen.map(c => c.id || c.text)];
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newUsed));
  } catch (e) {}

  return chosen;
}

export const CubaSebutGame: React.FC<CubaSebutGameProps> = ({
  mode,
  categoryKey,
  categoryLabel,
  onClose,
  onChooseOtherSkill
}) => {
  // 1. Prepare randomized questions
  const initialItems = useMemo(() => {
    const raw = SEBUT_DATABASE[categoryKey] || SEBUT_DATABASE['kvkv'] || [];
    // If KV, take 10 random unlearned items from the pool with rotation
    if (categoryKey.toLowerCase() === 'kv') {
      return getNextKVSebutItems(raw, mode);
    }
    return shuffle(raw);
  }, [categoryKey, mode]);

  const [items, setItems] = useState<SebutItem[]>(initialItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const [isStarPopping, setIsStarPopping] = useState(false);
  const [floatingStarActive, setFloatingStarActive] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(true);

  // Mobile detection
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchStatus, setMatchStatus] = useState<'idle' | 'listening' | 'success' | 'retry'>('idle');
  const [isCompleted, setIsCompleted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isHoldingRef = useRef(false);
  const isProcessingSuccessRef = useRef(false);

  const currentItem = items[currentIndex] || items[0];
  const isLastQuestion = currentIndex >= items.length - 1;

  // Sound playback helper
  const playSoundEffect = (type: 'ding' | 'star' | 'pop') => {
    try {
      if (type === 'ding' && typeof (window as any).playDing === 'function') {
        (window as any).playDing();
      } else if (type === 'star' && typeof (window as any).playSyabas === 'function') {
        (window as any).playSyabas();
      } else if (typeof (window as any).playBubble === 'function') {
        (window as any).playBubble();
      }
    } catch (e) {}
  };

  // Play model pronunciation audio
  const playModelAudio = () => {
    if (!currentItem) return;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (currentItem.audio) {
      const a = new Audio(currentItem.audio);
      currentAudioRef.current = a;
      a.play().catch(() => {
        // Fallback to speech synthesis
        speakFallback(currentItem.text);
      });
    } else {
      speakFallback(currentItem.text);
    }
  };

  const speakFallback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ms-MY';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Check speech match against target
  const checkSpeechMatch = (spokenText: string) => {
    if (!currentItem || !spokenText) return false;
    const target = currentItem.text.toLowerCase().trim();
    const spoken = spokenText.toLowerCase().trim();

    // 1. Direct match
    if (spoken === target) return true;

    // 2. Clean punctuation match
    const cleanTarget = target.replace(/[\s\-_.,!?]+/g, '');
    const cleanSpoken = spoken.replace(/[\s\-_.,!?]+/g, '');
    if (cleanTarget === cleanSpoken) return true;

    // 3. Use global checkMalayWordMatch if available
    if (typeof (window as any).checkMalayWordMatch === 'function') {
      const matched = (window as any).checkMalayWordMatch([spokenText, spoken, cleanSpoken], currentItem.text);
      if (matched) return true;
    }

    // 4. Substring contains for sentence reading (e.g. at least 70% of words matched)
    if (mode === 'baca') {
      const targetWords = target.replace(/[\-_.,!?]+/g, '').split(/\s+/).filter(Boolean);
      const spokenWords = spoken.replace(/[\-_.,!?]+/g, '').split(/\s+/).filter(Boolean);
      if (targetWords.length > 0) {
        let matchCount = 0;
        targetWords.forEach(tw => {
          if (spokenWords.some(sw => sw === tw || sw.includes(tw) || tw.includes(sw))) {
            matchCount++;
          }
        });
        if (matchCount / targetWords.length >= 0.7) {
          return true;
        }
      }
    }

    return false;
  };

  // Handle successful match
  const handleSuccess = () => {
    if (isProcessingSuccessRef.current) return;
    isProcessingSuccessRef.current = true;

    setMatchStatus('success');
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {}
    }

    // Trigger rewards and floating +1 Bintang animation!
    setStarCount(prev => prev + 1);
    setIsStarPopping(true);
    setTimeout(() => setIsStarPopping(false), 800);

    // Auto-update student profile stars immediately
    if (typeof (window as any).tambahBintangGlobal === 'function') {
      (window as any).tambahBintangGlobal(mode === 'baca' ? 'cubaBaca_' + categoryKey : 'cubaSebut_' + categoryKey, 1);
    }

    setFloatingStarActive(true);
    playPopConfettiSound();
    playSoundEffect('star');

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
    });

    // Advance to next question only AFTER star animation displays
    setTimeout(() => {
      setFloatingStarActive(false);
      isProcessingSuccessRef.current = false;
      if (isLastQuestion) {
        setIsCompleted(true);
        playPopConfettiSound();
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 99999
        });
        if (typeof (window as any).playTada === 'function') {
          (window as any).playTada();
        } else {
          playSoundEffect('star');
        }
      } else {
        setCurrentIndex(prev => prev + 1);
        setTranscript('');
        setMatchStatus('idle');
      }
    }, 1600);
  };

  // Start Speech Recognition
  const startRecognition = () => {
    if (isProcessingSuccessRef.current || matchStatus === 'success') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTranscript('Pelayar ini tidak menyokong rakaman suara langsung. Sila gunakan Google Chrome.');
      setMatchStatus('retry');
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = 'ms-MY';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 3;

      rec.onstart = () => {
        setIsRecording(true);
        setMatchStatus('listening');
      };

      rec.onresult = (event: any) => {
        if (isProcessingSuccessRef.current) return;
        let currentTranscript = '';
        const candidateList: string[] = [];
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res[0]) {
            currentTranscript = res[0].transcript;
            for (let j = 0; j < res.length; j++) {
              if (res[j].transcript) candidateList.push(res[j].transcript);
            }
          }
        }

        setTranscript(currentTranscript);

        // Check each candidate
        let isMatched = checkSpeechMatch(currentTranscript);
        if (!isMatched) {
          for (const cand of candidateList) {
            if (checkSpeechMatch(cand)) {
              isMatched = true;
              break;
            }
          }
        }

        if (isMatched && !isProcessingSuccessRef.current) {
          handleSuccess();
        }
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setTranscript('Akses mikrofon tidak dibenarkan. Sila benarkan akses dalam pelayar.');
          setMatchStatus('retry');
        } else if (event.error === 'no-speech') {
          if (!isHoldingRef.current) {
            setMatchStatus('retry');
          }
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
        // If holding button ended and not yet matched
        if (!isHoldingRef.current && matchStatus === 'listening' && !isProcessingSuccessRef.current) {
          setTimeout(() => {
            setMatchStatus(prev => {
              if (prev === 'listening') {
                return 'retry';
              }
              return prev;
            });
          }, 350);
        }
      };

      rec.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsRecording(false);
    }
  };

  // Stop Speech Recognition
  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Push-to-talk (Hold to record) handlers
  const handleRecordDown = () => {
    if (isProcessingSuccessRef.current) return;
    isHoldingRef.current = true;
    startRecognition();
  };

  const handleRecordUp = () => {
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      setTimeout(() => {
        stopRecognition();
      }, 350);
    }
  };

  // Toggle click fallback for mouse/accessibility
  const handleRecordClick = () => {
    if (isProcessingSuccessRef.current) return;
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  // Restart category with new shuffle
  const handleRestart = () => {
    isProcessingSuccessRef.current = false;
    const raw = SEBUT_DATABASE[categoryKey] || SEBUT_DATABASE['kvkv'] || [];
    const fresh = categoryKey.toLowerCase() === 'kv' ? getNextKVSebutItems(raw, mode) : shuffle(raw);
    setItems(fresh);
    setCurrentIndex(0);
    setStarCount(0);
    setIsCompleted(false);
    setFloatingStarActive(false);
    setTranscript('');
    setMatchStatus('idle');
  };

  const isMountedRef = useRef(false);
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    const raw = SEBUT_DATABASE[categoryKey] || SEBUT_DATABASE['kvkv'] || [];
    const fresh = categoryKey.toLowerCase() === 'kv' ? getNextKVSebutItems(raw, mode) : shuffle(raw);
    setItems(fresh);
    setCurrentIndex(0);
    setStarCount(0);
    setIsCompleted(false);
    setFloatingStarActive(false);
    setTranscript('');
    setMatchStatus('idle');
  }, [categoryKey, mode]);

  // Sync stars to Student Profile & Trigger celebratory confetti upon completion
  useEffect(() => {
    if (isCompleted) {
      // 1. Log progress to student profile
      try {
        const gameId = mode === 'baca' ? `cubaBaca_${categoryKey}` : `cubaSebut_${categoryKey}`;
        if (typeof (window as any).logProgress === 'function') {
          (window as any).logProgress(gameId, 'latihan', starCount, mode === 'baca' ? 'cubaBaca' : 'cubaSebut');
        }
        if (typeof (window as any).updateProfilUI === 'function') {
          (window as any).updateProfilUI();
        }
      } catch (e) {
        console.warn('Failed to update student profile progress:', e);
      }

      // 2. Play celebratory sound
      playPopConfettiSound();
      if (typeof (window as any).playTada === 'function') {
        (window as any).playTada();
      } else {
        playSoundEffect('star');
      }

      // 3. Fire vibrant multi-angle celebratory confetti bursts
      const triggerCelebrationConfetti = () => {
        if (typeof (window as any).triggerConfettiEffect === 'function') {
          (window as any).triggerConfettiEffect(true);
        } else if (typeof confetti === 'function') {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            zIndex: 999999
          });
          setTimeout(() => {
            confetti({
              particleCount: 70,
              angle: 60,
              spread: 60,
              origin: { x: 0.1, y: 0.55 },
              zIndex: 999999
            });
            confetti({
              particleCount: 70,
              angle: 120,
              spread: 60,
              origin: { x: 0.9, y: 0.55 },
              zIndex: 999999
            });
          }, 250);
        }
      };

      // Initial burst
      triggerCelebrationConfetti();
      // Second burst after modal finishes spring entrance
      const timer = setTimeout(triggerCelebrationConfetti, 400);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  // Clean up audio & recognition on unmount
  useEffect(() => {
    return () => {
      isProcessingSuccessRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

  // Determine font size dynamically for words and sentences - enlarged significantly for Cuba Sebut
  const getTextFontSize = (text: string, isMob: boolean) => {
    if (mode === 'sebut') {
      if (isMob) {
        if (text.length <= 3) return 'clamp(5.2rem, 22vw, 7.2rem)'; // e.g. ca, ba, bu
        if (text.length <= 5) return 'clamp(4.4rem, 18vw, 5.8rem)'; // e.g. beca, ciku
        if (text.length <= 8) return 'clamp(3.8rem, 15vw, 4.8rem)'; // e.g. kereta, cempedak
        if (text.length <= 12) return 'clamp(3.2rem, 12vw, 4.2rem)'; // e.g. cendawan
        return 'clamp(2.6rem, 10vw, 3.5rem)';
      }
      // Laptop & Desktop View (mode === 'sebut')
      if (text.length <= 3) return 'clamp(5.5rem, 12vw, 7.5rem)';
      if (text.length <= 5) return 'clamp(4.6rem, 9.5vw, 6.2rem)';
      if (text.length <= 8) return 'clamp(4.0rem, 8vw, 5.2rem)';
      if (text.length <= 12) return 'clamp(3.4rem, 6.8vw, 4.4rem)';
      return 'clamp(2.8rem, 5.5vw, 3.6rem)';
    }

    // mode === 'baca' (Reading sentences & paragraphs)
    if (isMob) {
      if (text.length <= 8) return 'clamp(3.2rem, 12vw, 4.2rem)';
      if (text.length <= 16) return 'clamp(2.5rem, 8.5vw, 3.2rem)';
      if (text.length <= 38) return 'clamp(1.75rem, 5.8vw, 2.3rem)';
      return 'clamp(1.4rem, 4.6vw, 1.8rem)';
    }
    if (text.length <= 8) return 'clamp(3rem, 9vw, 4.4rem)';
    if (text.length <= 16) return 'clamp(2.3rem, 6.8vw, 3.4rem)';
    if (text.length <= 35) return 'clamp(1.65rem, 5vw, 2.4rem)';
    return 'clamp(1.3rem, 3.8vw, 1.8rem)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'var(--bg-cream, #fff8ec)',
        backgroundImage: "url('/images/sampingan/background-utama.png')",
        backgroundSize: 'cover',
        backgroundPosition: isMobile ? 'left center' : 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'AtlantaRounded, sans-serif',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box',
        paddingTop: isMobile ? 'max(14px, env(safe-area-inset-top, 14px))' : '26px'
      }}
    >
      {/* Embedded CSS for smooth keyframe pulse animation without React re-render stutter */}
      <style>{`
        @keyframes recordPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 6px 0 #9a3412, 0 0 0 rgba(239, 68, 68, 0);
          }
          50% {
            transform: scale(1.035);
            box-shadow: 0 6px 0 #9a3412, 0 0 22px rgba(239, 68, 68, 0.65);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 6px 0 #9a3412, 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>

      {/* ================= TOP HEADER BAR ================= */}
      <header
        className="map-top-bar"
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: isMobile ? '0 auto 6px auto' : '0 auto 16px auto',
          padding: isMobile ? '8px 16px 4px 16px' : '16px 24px 10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Back Button (Orange circular button with arrow-left) */}
        <button
          type="button"
          onClick={onClose}
          className="neo-btn bg-orange back-icon-btn cursor-pointer"
          style={{
            width: isMobile ? '42px' : '48px',
            height: isMobile ? '42px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            color: '#ffffff',
            border: '3px solid #10182f',
            boxShadow: '0 4px 0 #10182f',
            flexShrink: 0
          }}
          aria-label="Kembali"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>

        {/* Center Title (Orange pill badge matching AR Suku Kata) */}
        <div
          className="neo-btn bg-orange page-title"
          style={{
            pointerEvents: 'none',
            fontSize: 'clamp(1.05rem, 3.8vw, 1.35rem)',
            fontWeight: 900,
            color: '#ffffff',
            border: '3px solid #10182f',
            boxShadow: '0 4px 0 #10182f',
            borderRadius: '16px',
            padding: isMobile ? '6px 20px' : '8px 28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            whiteSpace: 'nowrap',
            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
          }}
        >
          <i className={`fa-solid ${mode === 'baca' ? 'fa-book-open-reader' : 'fa-microphone-lines'}`} style={{ color: '#ffffff', fontSize: isMobile ? '1.05rem' : '1.2rem' }}></i>
          <span>{mode === 'baca' ? 'CUBA BACA' : 'CUBA SEBUT'}</span>
        </div>

        {/* Right Panduan Button (Orange circular button with lightbulb icon) */}
        <button
          type="button"
          onClick={() => {
            try { if (typeof (window as any).playBubble === 'function') (window as any).playBubble(); } catch (e) {}
            setShowGuideModal(true);
          }}
          className="neo-btn bg-orange help-btn info-icon-btn cursor-pointer"
          style={{
            width: isMobile ? '42px' : '48px',
            height: isMobile ? '42px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '1.15rem' : '1.3rem',
            color: '#ffffff',
            border: '3px solid #10182f',
            boxShadow: '0 4px 0 #10182f',
            flexShrink: 0
          }}
          title="Panduan Belajar"
          aria-label="Panduan Belajar"
        >
          <i className="fa-solid fa-lightbulb"></i>
        </button>
      </header>

      {/* Floating Star Popup (+1 Bintang! ⭐) - Matching Tanduk Kata & Puzzle Suku Kata */}
      <AnimatePresence>
        {floatingStarActive && (
          <div
            style={{
              position: 'fixed',
              top: '32%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999999,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <motion.div
              initial={{ y: 25, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1.2 }}
              exit={{ y: -35, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(2.3rem, 7.5vw, 4rem)',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                fontWeight: 900,
                color: '#fbbf24',
                textShadow: '0 4px 14px rgba(0, 0, 0, 0.95), 0 0 24px rgba(251, 191, 36, 0.9)',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <span>+ 1 Bintang!</span>
              <span style={{ filter: 'drop-shadow(0 0 10px #fbbf24)' }}>⭐</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MAIN INTERACTIVE BODY ================= */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-start' : 'center',
          padding: isMobile ? '0px 14px 20px' : '8px 20px 32px',
          maxWidth: '860px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        {/* Mobile View ONLY: Category Tagging OUTSIDE & ABOVE green frame, centered, ORANGE background */}
        {isMobile && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '4px',
              marginBottom: '10px',
              width: '100%'
            }}
          >
            <div
              className="neo-btn bg-orange"
              style={{
                backgroundColor: '#ea580c',
                border: '3px solid #10182f',
                borderRadius: '999px',
                padding: '6px 20px',
                boxShadow: '0 4px 0 #10182f',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 900,
                color: '#ffffff',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}
            >
              <i className="fa-solid fa-tag" style={{ fontSize: '0.85rem', color: '#ffffff' }}></i>
              <span>{categoryLabel}</span>
            </div>
          </div>
        )}

        {/* GREEN DOTTED FRAME (Bingkai Hijau Latar Belakang Pattern Dot-Dot) */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#168f81',
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.28) 2.4px, transparent 2.4px)',
            backgroundSize: '22px 22px',
            border: '4px solid #10182f',
            borderRadius: '30px',
            boxShadow: '0 8px 0 #10182f',
            padding: isMobile ? '16px 14px 22px' : '20px 22px 26px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '14px' : '16px',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
          {/* Top Row Inside Green Frame:
              - Desktop:
                  - Left: Category subtitle badge (e.g. KV + KV)
                  - Center: 1 / 15 Progress Pill
                  - Right: Total Bintang counter
              - Mobile:
                  - Left: 1 / 15 Progress Pill
                  - Right: Total Bintang counter
          */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            {/* Category tag / badge - DESKTOP ONLY */}
            {!isMobile && (
              <div
                style={{
                  background: '#ffffff',
                  border: '3px solid #10182f',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  boxShadow: '0 3px 0 #10182f',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.92rem',
                  fontWeight: 900,
                  color: '#ea580c',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                }}
              >
                <i className="fa-solid fa-tag" style={{ fontSize: '0.8rem' }}></i>
                <span>{categoryLabel}</span>
              </div>
            )}

            {/* 1 / 15 Progress Indicator with White Background - NO ICON */}
            <div
              style={{
                background: '#ffffff',
                border: '3px solid #10182f',
                borderRadius: '999px',
                padding: isMobile ? '6px 20px' : '6px 22px',
                boxShadow: '0 3px 0 #10182f',
                fontSize: isMobile ? '1rem' : '1.05rem',
                fontWeight: 900,
                color: '#10182f',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}
            >
              <span>{currentIndex + 1} / {items.length}</span>
            </div>

            {/* Total Bintang counter inside the green frame - NO RESTART BUTTON */}
            <motion.div
              animate={isStarPopping ? { scale: [1, 1.35, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
              style={{
                background: '#ffffff',
                border: '3px solid #10182f',
                borderRadius: '999px',
                padding: isMobile ? '6px 16px' : '6px 16px',
                boxShadow: '0 3px 0 #10182f',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 900,
                fontSize: isMobile ? '0.95rem' : '1rem',
                color: '#d97706',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}
            >
              <i className="fa-solid fa-star" style={{ color: '#f59e0b', fontSize: isMobile ? '1.05rem' : '1.15rem' }}></i>
              <span style={{ color: '#10182f' }}>{starCount}</span>
            </motion.div>
          </div>

          {/* ================= 1. WHITE CARD: TARGET WORD / SENTENCE ================= */}
          <motion.div
            key={currentItem ? currentItem.id : 'card'}
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            style={{
              width: '100%',
              background: '#ffffff',
              borderRadius: '26px',
              border: '4px solid #10182f',
              boxShadow: '0 6px 0 #10182f',
              padding: isMobile ? '24px 14px 20px' : '28px 24px',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              minHeight: mode === 'sebut' ? (isMobile ? '165px' : '190px') : (isMobile ? '150px' : '170px')
            }}
          >
            {/* Audio Listen Button - Smaller on mobile view to avoid clashing with text */}
            <button
              onClick={playModelAudio}
              title="Dengar Sebutan Semula"
              className="neo-btn bg-yellow cursor-pointer"
              style={{
                position: 'absolute',
                top: isMobile ? '12px' : '16px',
                right: isMobile ? '12px' : '16px',
                backgroundColor: '#ffe24a',
                border: isMobile ? '2.5px solid #10182f' : '3px solid #10182f',
                borderRadius: '50%',
                width: isMobile ? '36px' : '46px',
                height: isMobile ? '36px' : '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10182f',
                fontSize: isMobile ? '0.95rem' : '1.25rem',
                boxShadow: isMobile ? '0 3px 0 #10182f' : '0 4px 0 #10182f',
                zIndex: 10
              }}
              aria-label="Dengar sebutan"
            >
              <i className="fa-solid fa-volume-high"></i>
            </button>

            {/* Word / Sentence Display (Direct display without instruction subtitle, larger font) */}
            <div
              style={{
                display: 'inline-flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: getTextFontSize(currentItem ? currentItem.text : '', isMobile),
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                lineHeight: mode === 'baca' ? 1.55 : 1.15,
                wordBreak: 'break-word',
                maxWidth: isMobile ? '86%' : '92%',
                padding: isMobile && mode === 'baca' ? '12px 4px' : '4px'
              }}
            >
              {(() => {
                if (!currentItem) return null;

                // If category is KV, whole syllable is black as requested by user
                if (categoryKey === 'kv') {
                  return (
                    <span style={{ color: '#10182f' }}>
                      {currentItem.text}
                    </span>
                  );
                }

                // If word has syllables defined, alternate Black (#10182f) and Red (#ef4444)
                if (currentItem.syllables && currentItem.syllables.length > 0) {
                  return currentItem.syllables.map((syl, i) => (
                    <span
                      key={i}
                      style={{
                        color: i % 2 === 0 ? '#10182f' : '#ef4444'
                      }}
                    >
                      {syl}
                    </span>
                  ));
                }

                // For Reading Sentences: Format using alternating black & red syllables
                if (typeof (window as any).formatSukuKataTeks === 'function') {
                  return (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (window as any).formatSukuKataTeks(currentItem.text, 'center')
                      }}
                    />
                  );
                }

                return (
                  <span style={{ color: '#10182f' }}>
                    {currentItem.text}
                  </span>
                );
              })()}
            </div>
          </motion.div>

          {/* ================= 2. SPEECH RECOGNITION STATUS & TRANSCRIPT ================= */}
          <div
            style={{
              width: '100%',
              minHeight: '80px',
              background: matchStatus === 'success' ? '#dcfce7' : matchStatus === 'retry' ? '#fee2e2' : '#ffffff',
              borderRadius: '22px',
              border: `3.5px solid ${matchStatus === 'success' ? '#16a34a' : matchStatus === 'retry' ? '#ef4444' : '#10182f'}`,
              boxShadow: '0 4px 0 #10182f',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              boxSizing: 'border-box',
              textAlign: 'center',
              transition: 'background-color 0.25s, border-color 0.25s'
            }}
          >
            {matchStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: [0.85, 1.15, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#15803d',
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 900
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ fontSize: '1.7rem', color: '#16a34a' }}></i>
                <span>Tepat!</span>
              </motion.div>
            ) : isRecording ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ea580c',
                    fontWeight: 800,
                    fontSize: '0.92rem'
                  }}
                >
                  <i className="fa-solid fa-circle-dot fa-fade" style={{ color: '#ea580c' }}></i>
                  <span>Sedang mendengar suara anda...</span>
                </div>
                {transcript ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: '#10182f',
                      fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                    }}
                  >
                    {transcript}
                  </p>
                ) : null}
              </div>
            ) : matchStatus === 'retry' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div style={{ color: '#b91c1c', fontWeight: 800, fontSize: '0.92rem' }}>
                  <i className="fa-solid fa-circle-exclamation"></i> Awak sebut: <b style={{ color: '#10182f' }}>"{transcript}"</b>
                </div>
                <span style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 700 }}>
                  Hampir tepat! Tekan butang di bawah & cuba sebut sekali lagi.
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#94a3b8',
                    fontSize: '1.3rem',
                    letterSpacing: '4px'
                  }}
                >
                  <span>●</span><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span><span>●</span>
                </div>
                <span style={{ color: '#64748b', fontSize: '0.86rem', fontWeight: 700 }}>
                  Sedia... Tekan tahan butang di bawah & sebut perkataan ini.
                </span>
              </div>
            )}
          </div>

          {/* ================= 3. PUSH-TO-TALK / CLICK RECORD BUTTON ================= */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <motion.button
              type="button"
              onMouseDown={handleRecordDown}
              onMouseUp={handleRecordUp}
              onTouchStart={handleRecordDown}
              onTouchEnd={handleRecordUp}
              onClick={handleRecordClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: isMobile ? '14px 18px' : '16px 22px',
                borderRadius: '999px',
                border: '4px solid #10182f',
                boxShadow: isRecording ? '0 6px 0 #9a3412' : '0 6px 0 #10182f',
                background: isRecording
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #ff751f 0%, #ea580c 100%)',
                color: '#ffffff',
                fontSize: 'clamp(1.05rem, 3.8vw, 1.3rem)',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
                animation: isRecording ? 'recordPulse 0.9s ease-in-out infinite' : 'none',
                transition: 'background 0.2s'
              }}
            >
              <i
                className={`fa-solid ${isRecording ? 'fa-microphone-lines' : 'fa-microphone'}`}
                style={{ fontSize: '1.35rem' }}
              ></i>
              <span>
                {isRecording ? 'Sedang merakam... Lepaskan' : 'Tekan tahan untuk merakam'}
              </span>
            </motion.button>

            {/* Secondary manual pass / skip button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <button
                onClick={handleSuccess}
                title="Luluskan sebutan secara manual"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '4px 8px',
                  fontFamily: 'AtlantaRounded, sans-serif'
                }}
              >
                <i className="fa-solid fa-forward-step" style={{ marginRight: '4px' }}></i>
                Luluskan / Soalan Seterusnya
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ================= POPUP PANDUAN BELAJAR (MATCHING PUZZLE SUKU KATA) ================= */}
      {showGuideModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            padding: '16px',
            fontFamily: 'AtlantaRounded, sans-serif'
          }}
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="neo-box"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px 22px',
              textAlign: 'center',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
              border: '4px solid #f97316',
              fontFamily: 'AtlantaRounded, sans-serif',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                color: '#ffffff',
                backgroundColor: '#ea580c',
                padding: '6px 28px',
                borderRadius: '16px',
                display: 'inline-block',
                margin: '0 0 14px 0',
                fontWeight: 900,
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                border: '3px solid #c2410c'
              }}
            >
              {mode === 'baca' ? 'Panduan Cuba Baca' : 'Panduan Cuba Sebut'}
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#1e293b',
                margin: '0 0 20px 0',
                lineHeight: 1.6,
                fontWeight: 800,
                fontFamily: 'AtlantaRounded, sans-serif'
              }}
            >
              {mode === 'baca'
                ? 'Baca ayat atau petikan dengan lancar, tekan dan tahan butang mikrofon untuk merakam suara anda, dan kumpul bintang ganjaran!'
                : 'Dengar contoh sebutan, tekan dan tahan butang mikrofon, sebut perkataan dengan tepat untuk kumpul bintang ganjaran!'}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '22px',
                padding: '14px 8px',
                backgroundColor: 'rgba(248, 250, 252, 0.95)',
                borderRadius: '16px',
                border: '2px solid #cbd5e1'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className={`fa-solid ${mode === 'baca' ? 'fa-book-open' : 'fa-volume-high'}`} style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    fontFamily: 'AtlantaRounded, sans-serif'
                  }}
                >
                  {mode === 'baca' ? '1. Baca Teks' : '1. Dengar Contoh'}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-microphone-lines" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    fontFamily: 'AtlantaRounded, sans-serif'
                  }}
                >
                  2. Tekan & Sebut
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '6px' }}>
                  <i className="fa-solid fa-star" style={{ fontSize: '1.6rem', color: '#ea580c' }}></i>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#1e293b',
                    fontFamily: 'AtlantaRounded, sans-serif'
                  }}
                >
                  3. Kumpul Bintang
                </div>
              </div>
            </div>

            <button
              type="button"
              className="neo-btn cursor-pointer"
              style={{
                backgroundColor: '#168f81',
                color: '#ffffff',
                fontSize: '1.05rem',
                padding: '12px 32px',
                width: '100%',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                fontWeight: 900,
                justifyContent: 'center',
                textTransform: 'none',
                borderRadius: '16px',
                border: '3px solid #10182f',
                boxShadow: '0 4px 0 #10182f'
              }}
              onClick={() => {
                try {
                  if (typeof (window as any).playBubble === 'function') {
                    (window as any).playBubble();
                  }
                } catch (e) {}
                setShowGuideModal(false);
              }}
            >
              Mula Belajar
            </button>
          </div>
        </div>
      )}

      {/* ================= VICTORY MODAL (MATCHING TANDUK KATA & CABARAN SUKU KATA) ================= */}
      <AnimatePresence>
        {isCompleted && (() => {
          const isFullStars = starCount >= 10 || (items.length > 0 && starCount === items.length);
          const star1Gold = starCount >= 1;
          const star2Gold = starCount >= Math.ceil(items.length * 0.4) || starCount >= 5;
          const star3Gold = starCount >= Math.ceil(items.length * 0.75) || starCount >= 10;
          const headerText = isFullStars ? 'Tahniah Anda Hebat!' : 'Cuba Lagi!';

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}
            >
              <motion.div
                initial={{ scale: 0.8, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                style={{
                  backgroundColor: '#ffffff',
                  backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.06) 1.5px, transparent 1.5px)',
                  backgroundSize: '15px 15px',
                  padding: '28px 20px 22px',
                  borderRadius: '24px',
                  textAlign: 'center',
                  border: '4px solid var(--color-dark, #10182f)',
                  boxShadow: '0 12px 0 var(--color-dark, #10182f), 0 20px 30px rgba(0,0,0,0.25)',
                  maxWidth: '430px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  boxSizing: 'border-box',
                  fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                }}
              >
                {/* Top Purple 3D Banner */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  style={{
                    position: 'relative',
                    marginTop: '-4px',
                    display: 'inline-block'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#a855f7',
                      backgroundImage: 'linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)',
                      border: '3.5px solid #0f172a',
                      borderRadius: '18px',
                      boxShadow: '0 5px 0 #0f172a',
                      padding: '3px',
                      display: 'inline-block'
                    }}
                  >
                    <div
                      style={{
                        border: '2.5px solid #4c1d95',
                        borderRadius: '12px',
                        backgroundColor: '#a855f7',
                        backgroundImage: 'linear-gradient(180deg, #c084fc 0%, #a855f7 45%, #9333ea 100%)',
                        padding: '8px 28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <h2
                        style={{
                          fontSize: 'clamp(1.35rem, 5vw, 1.9rem)',
                          whiteSpace: 'nowrap',
                          color: '#ffffff',
                          fontWeight: '900',
                          margin: 0,
                          fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                          textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {headerText}
                      </h2>
                    </div>
                  </div>
                </motion.div>

                {/* 3 Animated Stars Row (Top) */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', margin: '4px 0 0' }}>
                  {/* Left Star */}
                  <motion.div
                    initial={{ y: -30, opacity: 0, rotate: -25 }}
                    animate={{ y: 0, opacity: 1, rotate: -15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
                    style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                  >
                    <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <linearGradient id="starGold_cs_1" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                          {star1Gold ? (
                            <>
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="35%" stopColor="#fbbf24" />
                              <stop offset="75%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#f8fafc" />
                              <stop offset="50%" stopColor="#e2e8f0" />
                              <stop offset="100%" stopColor="#cbd5e1" />
                            </>
                          )}
                        </linearGradient>
                      </defs>
                      <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_cs_1)" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
                      <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                    </svg>
                  </motion.div>

                  {/* Center Star (Bigger) */}
                  <motion.div
                    initial={{ y: -40, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.18 }}
                    style={{ filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.25))', zIndex: 2 }}
                  >
                    <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <linearGradient id="starGold_cs_2" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                          {star2Gold ? (
                            <>
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="35%" stopColor="#fbbf24" />
                              <stop offset="75%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#f8fafc" />
                              <stop offset="50%" stopColor="#e2e8f0" />
                              <stop offset="100%" stopColor="#cbd5e1" />
                            </>
                          )}
                        </linearGradient>
                      </defs>
                      <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_cs_2)" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
                      <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                    </svg>
                  </motion.div>

                  {/* Right Star */}
                  <motion.div
                    initial={{ y: -30, opacity: 0, rotate: 25 }}
                    animate={{ y: 0, opacity: 1, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.26 }}
                    style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                  >
                    <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <linearGradient id="starGold_cs_3" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                          {star3Gold ? (
                            <>
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="35%" stopColor="#fbbf24" />
                              <stop offset="75%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#f8fafc" />
                              <stop offset="50%" stopColor="#e2e8f0" />
                              <stop offset="100%" stopColor="#cbd5e1" />
                            </>
                          )}
                        </linearGradient>
                      </defs>
                      <path d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z" fill="url(#starGold_cs_3)" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
                      <path d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z" fill="rgba(255,255,255,0.4)" />
                    </svg>
                  </motion.div>
                </div>

                {/* Dashed Score Box with Outline Glow */}
                <div
                  style={{
                    width: '100%',
                    border: '2.5px dashed #94a3b8',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: '900',
                      color: '#0f172a',
                      letterSpacing: '0.5px',
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                      marginBottom: '6px'
                    }}
                  >
                    ANDA MENDAPAT
                  </div>
                  <div
                    className="score-box-glow-pulse"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '3px solid #0f172a',
                      borderRadius: '16px',
                      padding: '4px 34px',
                      margin: '6px 0',
                      width: '100%',
                      maxWidth: '170px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: '900',
                        color: '#0f172a',
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif",
                        lineHeight: 1
                      }}
                    >
                      {starCount}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: '900',
                      color: '#0f172a',
                      letterSpacing: '1px',
                      fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                    }}
                  >
                    <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                    BINTANG
                    <span style={{ color: '#f59e0b', margin: '0 4px' }}>•••••</span>
                  </div>
                </div>

                {/* Motivation Info Card with Bulb Icon */}
                <div
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '2.5px solid #0f172a',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    boxShadow: '0 4px 0 #0f172a',
                    boxSizing: 'border-box'
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      backgroundColor: '#fef9c3',
                      border: '2px solid #0f172a',
                      boxShadow: '0 2px 0 #0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" fill="#facc15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 21H15" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 9L12 7L14 9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        fontWeight: '900',
                        fontSize: '0.88rem',
                        color: '#0f172a',
                        lineHeight: 1.2,
                        fontFamily: "'AtlantaRoundedBlack', 'AtlantaRounded', sans-serif"
                      }}
                    >
                      {isFullStars ? 'Tahniah, Anda Hebat!' : 'Teruskan usaha anda!'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600', marginTop: '2px', lineHeight: 1.2 }}>
                      {mode === 'baca'
                        ? 'Bacaan lancar akan menjadikan anda lebih yakin.'
                        : 'Sebutan yang tepat akan menjadikan anda lebih mahir.'}
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Action Buttons matching Tanduk Kata (No purple award button) */}
                <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '4px' }}>
                  {/* 1. Red Main Semula Button */}
                  <button
                    className="neo-btn bg-red cursor-pointer"
                    title="Ulang Semula"
                    aria-label="Ulang Semula"
                    onClick={handleRestart}
                    style={{
                      padding: '14px 20px',
                      fontSize: '1.4rem',
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '16px',
                      border: '3px solid #0f172a',
                      boxShadow: '0 4px 0 #0f172a'
                    }}
                  >
                    <i className="fa-solid fa-rotate-right"></i>
                  </button>

                  {/* 2. Orange Menu / Pilih Kemahiran Lain Button */}
                  <button
                    className="neo-btn bg-orange cursor-pointer"
                    title={onChooseOtherSkill ? "Pilih Kemahiran Lain" : "Menu Utama"}
                    aria-label={onChooseOtherSkill ? "Pilih Kemahiran Lain" : "Menu Utama"}
                    onClick={() => {
                      if (onChooseOtherSkill) {
                        onChooseOtherSkill();
                      } else {
                        onClose();
                      }
                    }}
                    style={{
                      padding: '14px 20px',
                      fontSize: '1.4rem',
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      backgroundColor: '#f97316',
                      color: '#ffffff',
                      borderRadius: '16px',
                      border: '3px solid #0f172a',
                      boxShadow: '0 4px 0 #0f172a'
                    }}
                  >
                    <i className="fa-solid fa-house"></i>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
