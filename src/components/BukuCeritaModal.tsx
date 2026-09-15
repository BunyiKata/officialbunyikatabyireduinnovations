import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getCoreAudioContext } from '../utils/coreAudio';

export interface StoryPage {
  pageNumber: number; // 0 = Cover, 1..5 = Pages
  image: string;
  text: string;
}

export interface StoryBook {
  id: string;
  seriesNumber: number;
  title: string;
  theme: string;
  author: string;
  color: string;
  accentColor: string;
  gradient: string;
  coverImage: string;
  coverEmoji: string;
  synopsis: string;
  pages: StoryPage[];
}

export const KOLEKSI_BUKU_CERITA: StoryBook[] = [
  {
    id: 'buku_1_kucing_comel',
    seriesNumber: 1,
    title: 'Kucing Comel',
    theme: 'Siri 1 — Haiwan Kesayangan',
    author: 'Bunyi Kata',
    color: '#ff7a00',
    accentColor: '#ea580c',
    gradient: 'linear-gradient(135deg, #ff7a00 0%, #f97316 50%, #ea580c 100%)',
    coverImage: '/images/buku/b1coverpage.jpg',
    coverEmoji: '🐱',
    synopsis: 'Kisah Kasih Sayang Ali dan Kucingnya',
    pages: [
      { pageNumber: 0, image: '/images/buku/b1coverpage.jpg', text: '' }, // Cover
      { pageNumber: 1, image: '/images/buku/b1page1.jpg', text: 'Ini Comel. Comel ialah anak kucing yang sangat comel dan manja. Comel tinggal bersama Ali di sebuah rumah yang cantik.' },
      { pageNumber: 2, image: '/images/buku/b1page2.jpg', text: 'Setiap pagi, Comel berlari riang di halaman rumah. Comel suka bermain dan melompat mengejar rama-rama!' },
      { pageNumber: 3, image: '/images/buku/b1page3.jpg', text: '“Miau!” Comel sudah lapar. Ali meletakkan semangkuk ikan segar dan susu putih yang lazat.' },
      { pageNumber: 4, image: '/images/buku/b1page4.jpg', text: 'Slurp! Slurp! Comel makan sampai kenyang. Comel menggesel kepalanya pada kaki Ali tanda terima kasih.' },
      { pageNumber: 5, image: '/images/buku/b1page5.jpg', text: 'Ali memeluk Comel dengan erat. Ali sangat sayang akan Comel, sahabat baiknya!' }
    ]
  },
  {
    id: 'buku_2_hari_sukan_ani',
    seriesNumber: 2,
    title: 'Hari Sukan Ani',
    theme: 'Siri 2 — Aktiviti Sihat',
    author: 'Bunyi Kata',
    color: '#0284c7',
    accentColor: '#0369a1',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #0369a1 100%)',
    coverImage: '/images/buku/b2coverpage.jpg',
    coverEmoji: '🏃‍♀️',
    synopsis: 'Semangat Juang dan Kemenangan!',
    pages: [
      { pageNumber: 0, image: '/images/buku/b2coverpage.jpg', text: '' },
      { pageNumber: 1, image: '/images/buku/b2page1.jpg', text: 'Hari ini Hari Sukan sekolah! Padang sekolah meriah dengan khemah dan bendera berwarna-warni.' },
      { pageNumber: 2, image: '/images/buku/b2page2.jpg', text: 'Murid-murid memakai baju sukan yang cantik. Ani bersedia di garisan mula dengan penuh semangat!' },
      { pageNumber: 3, image: '/images/buku/b2page3.jpg', text: 'Prriittt! Wisel berbunyi. Ani berlari pantas bagai angin menuju garisan penamat!' },
      { pageNumber: 4, image: '/images/buku/b2page4.jpg', text: 'Yay! Ani berjaya menjadi juara dan menerima sebutir pingat emas yang berkilat!' },
      { pageNumber: 5, image: '/images/buku/b2page5.jpg', text: 'Semua kawan bertepuk tangan dan bersorak gembira untuk Ani. Hari Sukan sungguh seronok!' }
    ]
  },
  {
    id: 'buku_3_pasar_bersama_ibu',
    seriesNumber: 3,
    title: 'Pergi ke Pasar Bersama Ibu',
    theme: 'Siri 3 — Keluarga & Masyarakat',
    author: 'Bunyi Kata',
    color: '#10b981',
    accentColor: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    coverImage: '/images/buku/b3coverpage.jpg',
    coverEmoji: '🧺',
    synopsis: 'Kisah Ali Anak yang Rajin',
    pages: [
      { pageNumber: 0, image: '/images/buku/b3coverpage.jpg', text: '' },
      { pageNumber: 1, image: '/images/buku/b3page1.jpg', text: 'Pada pagi Sabtu yang cerah, Ali teruja mengikut ibu pergi ke pasar.' },
      { pageNumber: 2, image: '/images/buku/b3page2.jpg', text: 'Wah, meriahnya pasar! Mereka memilih sayur hijau dan buah-buahan yang manis.' },
      { pageNumber: 3, image: '/images/buku/b3page3.jpg', text: 'Seterusnya, Ali dan ibu pergi ke gerai ikan untuk membeli ikan yang segar.' },
      { pageNumber: 4, image: '/images/buku/b3page4.jpg', text: '“Biar Ali tolong bawa beg ini, ibu!” Ali memegang beg barang dengan cermat.' },
      { pageNumber: 5, image: '/images/buku/b3page5.jpg', text: 'Ali dan ibu berjalan pulang ke rumah dengan hati yang sangat gembira!' }
    ]
  },
  {
    id: 'buku_4_pokok_mangga_amir',
    seriesNumber: 4,
    title: 'Pokok Mangga Amir',
    theme: 'Siri 4 — Alam Semulajadi',
    author: 'Bunyi Kata',
    color: '#eab308',
    accentColor: '#ca8a04',
    gradient: 'linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)',
    coverImage: '/images/buku/b4coverpage.jpg',
    coverEmoji: '🌳',
    synopsis: 'Manisnya Rezeki Bersama Keluarga',
    pages: [
      { pageNumber: 0, image: '/images/buku/b4coverpage.jpg', text: '' },
      { pageNumber: 1, image: '/images/buku/b4page1.jpg', text: 'Di halaman rumah Amir, ada sebatang pokok mangga yang besar dan rendang.' },
      { pageNumber: 2, image: '/images/buku/b4page2.jpg', text: 'Setiap tahun, pokok mangga itu berbuah dengan sangat lebat!' },
      { pageNumber: 3, image: '/images/buku/b4page3.jpg', text: 'Amir suka membantu memetik buah mangga yang manis dan masak ranum.' },
      { pageNumber: 4, image: '/images/buku/b4page4.jpg', text: 'Ibu membawa buah mangga ke dapur untuk membuat jeruk mangga yang sedap.' },
      { pageNumber: 5, image: '/images/buku/b4page5.jpg', text: 'Sekeluarga menikmati hidangan mangga bersama-sama di anjung rumah dengan gembira!' }
    ]
  },
  {
    id: 'buku_5_kelas_ceria_cikgu_nur',
    seriesNumber: 5,
    title: 'Kelas Ceria Cikgu Nur',
    theme: 'Siri 5 — Sekolah & Ilmu',
    author: 'Bunyi Kata',
    color: '#8b5cf6',
    accentColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
    coverImage: '/images/buku/b5coverpage.jpg',
    coverEmoji: '🏫',
    synopsis: 'Belajar dan Riang Bersama di Prasekolah',
    pages: [
      { pageNumber: 0, image: '/images/buku/b5coverpage.jpg', text: '' },
      { pageNumber: 1, image: '/images/buku/b5page1.jpg', text: 'Cikgu Nur mengajar kelas prasekolah setiap hari dengan penuh mesra.' },
      { pageNumber: 2, image: '/images/buku/b5page2.jpg', text: 'Murid-murid belajar membaca dan menyanyi bersama-sama dengan penuh semangat.' },
      { pageNumber: 3, image: '/images/buku/b5page3.jpg', text: 'Ali dan Ani sangat suka membaca pelbagai buku di sudut bacaan.' },
      { pageNumber: 4, image: '/images/buku/b5page4.jpg', text: 'Cikgu Nur sentiasa sabar dan lemah-lembut membimbing murid-muridnya membaca cerita.' },
      { pageNumber: 5, image: '/images/buku/b5page5.jpg', text: 'Kelas itu sentiasa ceria, riang dan dipenuhi gelak tawa setiap hari!' }
    ]
  }
];

// Exact dictionary mapping for perfect Malay suku kata syllable breakdown
const SYLLABLE_DICTIONARY: Record<string, string[]> = {
  // Common & B1
  'ini': ['i', 'ni'],
  'ali': ['a', 'li'],
  'ada': ['a', 'da'],
  'kucing': ['ku', 'cing'],
  'comel': ['co', 'mel'],
  'ialah': ['ia', 'lah'],
  'anak': ['a', 'nak'],
  'yang': ['yang'],
  'sangat': ['sa', 'ngat'],
  'dan': ['dan'],
  'manja': ['man', 'ja'],
  'tinggal': ['ting', 'gal'],
  'bersama': ['ber', 'sa', 'ma'],
  'di': ['di'],
  'sebuah': ['se', 'bu', 'ah'],
  'rumah': ['ru', 'mah'],
  'cantik': ['can', 'tik'],
  'setiap': ['se', 'tiap'],
  'pagi': ['pa', 'gi'],
  'berlari': ['ber', 'la', 'ri'],
  'riang': ['riang'],
  'halaman': ['ha', 'la', 'man'],
  'suka': ['su', 'ka'],
  'bermain': ['ber', 'ma', 'in'],
  'melompat': ['me', 'lom', 'pat'],
  'mengejar': ['me', 'nge', 'jar'],
  'rama-rama': ['ra', 'ma', '-', 'ra', 'ma'],
  'miau': ['miau'],
  'sudah': ['su', 'dah'],
  'lapar': ['la', 'par'],
  'meletakkan': ['me', 'le', 'tak', 'kan'],
  'semangkuk': ['se', 'mang', 'kuk'],
  'ikan': ['i', 'kan'],
  'segar': ['se', 'gar'],
  'susu': ['su', 'su'],
  'putih': ['pu', 'tih'],
  'lazat': ['la', 'zat'],
  'slurp': ['slurp'],
  'makan': ['ma', 'kan'],
  'sampai': ['sam', 'pai'],
  'kenyang': ['ke', 'nyang'],
  'menggesel': ['meng', 'ge', 'sel'],
  'kepalanya': ['ke', 'pa', 'la', 'nya'],
  'pada': ['pa', 'da'],
  'kaki': ['ka', 'ki'],
  'tanda': ['tan', 'da'],
  'terima': ['te', 'ri', 'ma'],
  'kasih': ['ka', 'sih'],
  'memeluk': ['me', 'me', 'luk'],
  'dengan': ['de', 'ngan'],
  'erat': ['e', 'rat'],
  'sayang': ['sa', 'yang'],
  'akan': ['a', 'kan'],
  'sahabat': ['sa', 'ha', 'bat'],
  'baiknya': ['ba', 'ik', 'nya'],

  // B2
  'hari': ['ha', 'ri'],
  'sukan': ['su', 'kan'],
  'sekolah': ['se', 'ko', 'lah'],
  'padang': ['pa', 'dang'],
  'meriah': ['me', 'riah'],
  'khemah': ['khe', 'mah'],
  'bendera': ['ben', 'de', 'ra'],
  'berwarna-warni': ['ber', 'war', 'na', '-', 'war', 'ni'],
  'murid-murid': ['mu', 'rid', '-', 'mu', 'rid'],
  'memakai': ['me', 'ma', 'kai'],
  'baju': ['ba', 'ju'],
  'ani': ['a', 'ni'],
  'bersedia': ['ber', 'se', 'di', 'a'],
  'garisan': ['ga', 'ri', 'san'],
  'mula': ['mu', 'la'],
  'penuh': ['pe', 'nuh'],
  'semangat': ['se', 'ma', 'ngat'],
  'prriittt': ['prriittt'],
  'priiit': ['priiit'],
  'wisel': ['wi', 'sel'],
  'berbunyi': ['ber', 'bu', 'nyi'],
  'pantas': ['pan', 'tas'],
  'bagai': ['ba', 'gai'],
  'angin': ['a', 'ngin'],
  'menuju': ['me', 'nu', 'ju'],
  'penamat': ['pe', 'na', 'mat'],
  'yay': ['yay'],
  'berjaya': ['ber', 'ja', 'ya'],
  'menjadi': ['men', 'ja', 'di'],
  'juara': ['ju', 'a', 'ra'],
  'menerima': ['me', 'ne', 'ri', 'ma'],
  'sebutir': ['se', 'bu', 'tir'],
  'pingat': ['pi', 'ngat'],
  'emas': ['e', 'mas'],
  'berkilat': ['ber', 'ki', 'lat'],
  'semua': ['se', 'mu', 'a'],
  'kawan': ['ka', 'wan'],
  'bertepuk': ['ber', 'te', 'puk'],
  'tangan': ['ta', 'ngan'],
  'bersorak': ['ber', 'so', 'rak'],
  'gembira': ['gem', 'bi', 'ra'],
  'untuk': ['un', 'tuk'],
  'sungguh': ['sung', 'guh'],
  'seronok': ['se', 'ro', 'nok'],

  // B3
  'sabtu': ['sab', 'tu'],
  'cerah': ['ce', 'rah'],
  'teruja': ['te', 'ru', 'ja'],
  'mengikut': ['me', 'ngi', 'kut'],
  'ibu': ['i', 'bu'],
  'pergi': ['per', 'gi'],
  'ke': ['ke'],
  'pasar': ['pa', 'sar'],
  'wah': ['wah'],
  'meriahnya': ['me', 'riah', 'nya'],
  'mereka': ['me', 're', 'ka'],
  'memilih': ['me', 'mi', 'lih'],
  'sayur': ['sa', 'yur'],
  'hijau': ['hi', 'jau'],
  'buah': ['buah'],
  'buah-buahan': ['buah', '-', 'bua', 'han'],
  'manis': ['ma', 'nis'],
  'seterusnya': ['se', 'te', 'rus', 'nya'],
  'gerai': ['ge', 'rai'],
  'membeli': ['mem', 'be', 'li'],
  'biar': ['bi', 'ar'],
  'tolong': ['to', 'long'],
  'bawa': ['ba', 'wa'],
  'beg': ['beg'],
  'memegang': ['me', 'me', 'gang'],
  'barang': ['ba', 'rang'],
  'cermat': ['cer', 'mat'],
  'berjalan': ['ber', 'ja', 'lan'],
  'pulang': ['pu', 'lang'],
  'hati': ['ha', 'ti'],

  // B4
  'amir': ['a', 'mir'],
  'sebatang': ['se', 'ba', 'tang'],
  'pokok': ['po', 'kok'],
  'mangga': ['mang', 'ga'],
  'besar': ['be', 'sar'],
  'rendang': ['ren', 'dang'],
  'tahun': ['ta', 'hun'],
  'berbuah': ['ber', 'bu', 'ah'],
  'lebat': ['le', 'bat'],
  'membantu': ['mem', 'ban', 'tu'],
  'memetik': ['me', 'me', 'tik'],
  'masak': ['ma', 'sak'],
  'ranum': ['ra', 'num'],
  'dapur': ['da', 'pur'],
  'membuat': ['mem', 'bu', 'at'],
  'jeruk': ['je', 'ruk'],
  'sedap': ['se', 'dap'],
  'sekeluarga': ['se', 'ke', 'lu', 'ar', 'ga'],
  'menikmati': ['me', 'nik', 'ma', 'ti'],
  'hidangan': ['hi', 'da', 'ngan'],
  'bersama-sama': ['ber', 'sa', 'ma', '-', 'sa', 'ma'],
  'anjung': ['an', 'jung'],

  // B5
  'cikgu': ['cik', 'gu'],
  'nur': ['nur'],
  'mengajar': ['me', 'nga', 'jar'],
  'kelas': ['ke', 'las'],
  'prasekolah': ['pra', 'se', 'ko', 'lah'],
  'mesra': ['mes', 'ra'],
  'menyanyi': ['me', 'nya', 'nyi'],
  'pelbagai': ['pel', 'ba', 'gai'],
  'buku': ['bu', 'ku'],
  'sudut': ['su', 'dut'],
  'bacaan': ['ba', 'ca', 'an'],
  'sentiasa': ['sen', 'tia', 'sa'],
  'sabar': ['sa', 'bar'],
  'lemah-lembut': ['le', 'mah', '-', 'lem', 'but'],
  'membimbing': ['mem', 'bim', 'bing'],
  'murid-muridnya': ['mu', 'rid', '-', 'mu', 'rid', 'nya'],
  'membaca': ['mem', 'ba', 'ca'],
  'cerita': ['ce', 'ri', 'ta'],
  'ceria': ['ce', 'ri', 'a'],
  'dipenuhi': ['di', 'pe', 'nu', 'hi'],
  'gelak': ['ge', 'lak'],
  'tawa': ['ta', 'wa'],

  // Kosa kata tambahan Bacaan Bergred & Cerita Pendek
  'abang': ['a', 'bang'],
  'abjad': ['ab', 'jad'],
  'adik': ['a', 'dik'],
  'air': ['a', 'ir'],
  'baling': ['ba', 'ling'],
  'bapa': ['ba', 'pa'],
  'basikal': ['ba', 'si', 'kal'],
  'belajar': ['be', 'la', 'jar'],
  'berat': ['be', 'rat'],
  'beriadah': ['ber', 'ia', 'dah'],
  'berkumpul': ['ber', 'kum', 'pul'],
  'bersih': ['ber', 'sih'],
  'biru': ['bi', 'ru'],
  'bola': ['bo', 'la'],
  'burung': ['bu', 'rung'],
  'dalam': ['da', 'lam'],
  'elok': ['e', 'lok'],
  'guru': ['gu', 'ru'],
  'hadiah': ['ha', 'diah'],
  'hitam': ['hi', 'tam'],
  'huruf': ['hu', 'ruf'],
  'itu': ['i', 'tu'],
  'jauh': ['ja', 'uh'],
  'kakak': ['ka', 'kak'],
  'kami': ['ka', 'mi'],
  'kayuh': ['ka', 'yuh'],
  'kecil': ['ke', 'cil'],
  'keluarga': ['ke', 'lu', 'ar', 'ga'],
  'kereta': ['ke', 're', 'ta'],
  'kosong': ['ko', 'song'],
  'kuning': ['ku', 'ning'],
  'lagu': ['la', 'gu'],
  'laju': ['la', 'ju'],
  'langit': ['la', 'ngit'],
  'lari': ['la', 'ri'],
  'lemak': ['le', 'mak'],
  'luas': ['lu', 'as'],
  'malam': ['ma', 'lam'],
  'memasak': ['me', 'ma', 'sak'],
  'membasuh': ['mem', 'ba', 'suh'],
  'membawa': ['mem', 'ba', 'wa'],
  'memenangi': ['me', 'me', 'na', 'ngi'],
  'mengadakan': ['me', 'nga', 'da', 'kan'],
  'menulis': ['me', 'nu', 'lis'],
  'merah': ['me', 'rah'],
  'minum': ['mi', 'num'],
  'murid': ['mu', 'rid'],
  'nasi': ['na', 'si'],
  'pakai': ['pa', 'kai'],
  'pejabat': ['pe', 'ja', 'bat'],
  'permainan': ['per', 'ma', 'i', 'nan'],
  'pertama': ['per', 'ta', 'ma'],
  'pertandingan': ['per', 'tan', 'di', 'ngan'],
  'petang': ['pe', 'tang'],
  'pinggan': ['ping', 'gan'],
  'rapi': ['ra', 'pi'],
  'sambil': ['sam', 'bil'],
  'sarapan': ['sa', 'ra', 'pan'],
  'saya': ['sa', 'ya'],
  'seekor': ['se', 'e', 'kor'],
  'selepas': ['se', 'le', 'pas'],
  'serta': ['ser', 'ta'],
  'taman': ['ta', 'man'],
  'tani': ['ta', 'ni'],
  'terbang': ['ter', 'bang'],
  'tinggi': ['ting', 'gi'],
  'topi': ['to', 'pi'],
  'turut': ['tu', 'rut'],
  'waktu': ['wak', 'tu']
};

interface ParsedWord {
  prefix: string;
  syllables: string[];
  suffix: string;
  isAllBlack: boolean;
}

function parseStoryWord(rawWord: string): ParsedWord {
  const match = rawWord.match(/^([^a-zA-ZÀ-ÿ0-9]*)([a-zA-ZÀ-ÿ0-9\-]+)([^a-zA-ZÀ-ÿ0-9]*)$/);
  if (!match) {
    return { prefix: '', syllables: [rawWord], suffix: '', isAllBlack: true };
  }
  const [, prefix, cleanWord, suffix] = match;

  const key = cleanWord.toLowerCase();
  const isAllBlack = key === 'miau' || key === 'slurp' || key === 'yay' || key === 'prriittt' || key === 'priiit' || key === 'pritt';

  let parts: string[] = [];

  if (SYLLABLE_DICTIONARY[key]) {
    const dictParts = SYLLABLE_DICTIONARY[key];
    let cursor = 0;
    parts = dictParts.map(dp => {
      const seg = cleanWord.substring(cursor, cursor + dp.length);
      cursor += dp.length;
      return seg;
    });
    if (cursor < cleanWord.length) {
      parts.push(cleanWord.substring(cursor));
    }
  } else if (cleanWord.includes('-')) {
    const subWords = cleanWord.split('-');
    const subParts: string[] = [];
    subWords.forEach((sw, idx) => {
      if (idx > 0) subParts.push('-');
      subParts.push(...splitWordToSyllables(sw));
    });
    parts = subParts;
  } else if (/^\d+$/.test(cleanWord)) {
    parts = [cleanWord];
  } else {
    // Algorithmic Malay syllabification fallback
    const regex = /(?:[^aeiouAEIOU]*[aeiouAEIOU]+(?:ng|ny|sy|kh|gh|[bcdfghjklmnpqrstvwxyz](?=[^aeiouAEIOU\s]|$))?)/gi;
    const matched = cleanWord.match(regex);
    if (matched && matched.join('') === cleanWord) {
      parts = matched;
    } else {
      parts = [cleanWord];
    }
  }

  return {
    prefix,
    syllables: parts.length > 0 ? parts : [cleanWord],
    suffix,
    isAllBlack
  };
}

function splitWordToSyllables(rawWord: string): string[] {
  const { prefix, syllables, suffix } = parseStoryWord(rawWord);
  const result = [...syllables];
  if (prefix) {
    if (result.length > 0) result[0] = prefix + result[0];
    else result.push(prefix);
  }
  if (suffix) {
    if (result.length > 0) result[result.length - 1] = result[result.length - 1] + suffix;
    else result.push(suffix);
  }
  return result;
}

// Renders Malay story sentence with alternating Black (Hitam) and Red (Merah) syllables per word
function SukuKataStoryText({ text }: { text: string }) {
  // Convert any straight double quotes or incorrectly oriented quotes:
  // Proper Malay quotation marks:
  // Pembuka kata: “ (U+201C, Left Double Quotation Mark)
  // Penutup kata: ” (U+201D, Right Double Quotation Mark)
  let normalizedText = text
    .replace(/(^|[\s(\[{<])["”]/g, '$1“')
    .replace(/["“](?=[\s)\]}>.,!?;:]|$)/g, '”')
    .replace(/"/g, '”');

  const words = normalizedText.split(' ');
  let isRed = false;

  return (
    <span style={{ display: 'inline' }}>
      {words.map((w, wIdx) => {
        const { prefix, syllables, suffix, isAllBlack } = parseStoryWord(w);
        return (
          <span key={wIdx} style={{ display: 'inline-block', marginRight: '0.38em' }}>
            {/* Tanda baca awalan seperti pembuka kata “ (sentiasa warna hitam) */}
            {prefix && (
              <span style={{ color: '#1e293b', fontWeight: 900 }}>
                {prefix}
              </span>
            )}
            {/* Suku kata: hitam & merah berselang-seli secara berterusan merentasi perkataan */}
            {syllables.map((syl, sIdx) => {
              if (syl === '-') {
                return (
                  <span
                    key={sIdx}
                    style={{
                      color: '#1e293b',
                      fontWeight: 900
                    }}
                  >
                    -
                  </span>
                );
              }
              const color = !isAllBlack && isRed ? '#dc2626' : '#1e293b';
              if (!isAllBlack) {
                isRed = !isRed;
              }
              return (
                <span
                  key={sIdx}
                  style={{
                    color,
                    fontWeight: 900
                  }}
                >
                  {syl}
                </span>
              );
            })}
            {/* Tanda baca akhiran seperti penutup kata ”, tanda seru, koma, noktah (sentiasa warna hitam) */}
            {suffix && (
              <span style={{ color: '#1e293b', fontWeight: 900 }}>
                {suffix}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export const STORY_BOOKS = KOLEKSI_BUKU_CERITA;

interface BukuCeritaModalProps {
  onClose: () => void;
  initialBookId?: string | null;
}

export function BukuCeritaModal({ onClose, initialBookId }: BukuCeritaModalProps) {
  const [selectedBook, setSelectedBook] = useState<StoryBook | null>(() => {
    if (initialBookId) {
      return STORY_BOOKS.find(b => b.id === initialBookId) || null;
    }
    return null;
  });
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  // Makluman popup: Rak Buku ini tiada audio (sekali setiap sesi)
  const [showBookNotice, setShowBookNotice] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('rakBukuAudioNoticeSeen') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (initialBookId) {
      const book = STORY_BOOKS.find(b => b.id === initialBookId);
      if (book) {
        setSelectedBook(book);
        setCurrentPageIndex(0);
      }
    }
  }, [initialBookId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Soft subtle click tone without any AI speech / voice words
  const playNavSound = () => {
    try {
      const ctx = getCoreAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  };

  const handleOpenBook = (book: StoryBook) => {
    playNavSound();
    setSelectedBook(book);
    setCurrentPageIndex(0);
    setDirection(1);
  };

  const handleBackToShelf = () => {
    playNavSound();
    setSelectedBook(null);
  };

  const handlePageChange = (newIndex: number) => {
    if (!selectedBook) return;
    if (newIndex < 0 || newIndex >= selectedBook.pages.length) return;
    playNavSound();
    if (typeof (window as any).hentikanAudioSemasa === 'function') {
      (window as any).hentikanAudioSemasa();
    }
    setDirection(newIndex > currentPageIndex ? 1 : -1);
    setCurrentPageIndex(newIndex);
  };

  const getPageText = (book: StoryBook, pageIdx: number): string => {
    return book.pages[pageIdx]?.text || '';
  };

  const handleDismissNotice = () => {
    playNavSound();
    setShowBookNotice(false);
    try {
      sessionStorage.setItem('rakBukuAudioNoticeSeen', '1');
    } catch {}
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedBook) return;
      if (e.key === 'ArrowRight') {
        handlePageChange(currentPageIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        handlePageChange(currentPageIndex - 1);
      } else if (e.key === 'Escape') {
        handleBackToShelf();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBook, currentPageIndex]);

  // Page slide variants
  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isMobile ? 160 : 260) : (isMobile ? -160 : -260),
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 30
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isMobile ? -160 : -260) : (isMobile ? 160 : 260),
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.16,
        ease: 'easeInOut'
      }
    })
  };

  return (
    <div
      id="modal-buku-cerita"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '6px' : '12px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 15 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        style={{
          width: '100%',
          maxWidth: selectedBook ? '720px' : '1080px',
          maxHeight: '94vh',
          background: '#f8fafc',
          backgroundImage: 'radial-gradient(rgba(30, 41, 59, 0.12) 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
          borderRadius: isMobile ? '20px' : '28px',
          border: '4px solid #1e293b',
          boxShadow: '0 8px 0 #1e293b, 0 20px 40px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
          position: 'relative'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: isMobile ? '8px 12px' : '10px 18px',
            background: selectedBook ? selectedBook.gradient : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            borderBottom: '3.5px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            color: 'white',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Shine Sweep Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-150%',
                width: '45%',
                height: '200%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                transform: 'rotate(25deg)',
                animation: 'shineSweepLoop 3.5s infinite ease-in-out'
              }}
            />
          </div>

          {/* Left spacer for optical center balance */}
          <div style={{ width: isMobile ? '36px' : '40px', flexShrink: 0, zIndex: 2 }} />

          {/* Centered Title with Stylish 3D Badge Background & No Text Shadow */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <div
              style={{
                background: '#ffffff',
                color: '#1e293b',
                border: '2.5px solid #1e293b',
                borderRadius: isMobile ? '16px' : '20px',
                padding: isMobile ? '5px 14px' : '7px 22px',
                boxShadow: '0 3px 0 #1e293b, inset 0 -2px 0 rgba(0,0,0,0.06)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '6px' : '9px',
                maxWidth: '92%'
              }}
            >
              <i
                className={selectedBook ? "fa-solid fa-book-open-reader" : "fa-solid fa-book-bookmark"}
                style={{
                  color: selectedBook ? selectedBook.accentColor : '#ea580c',
                  fontSize: isMobile ? '0.95rem' : '1.15rem'
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? '1rem' : '1.25rem',
                  fontWeight: 900,
                  fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                  color: '#1e293b',
                  textShadow: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {selectedBook ? selectedBook.title : 'Buku Bunyi Kata'}
              </h2>
            </div>
          </div>

          {/* Right: Square Red Close Button (goes to shelf first if inside book) */}
          <div style={{ zIndex: 2, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                if (selectedBook) {
                  handleBackToShelf();
                } else {
                  onClose();
                }
              }}
              style={{
                width: isMobile ? '36px' : '40px',
                height: isMobile ? '36px' : '40px',
                borderRadius: '12px',
                background: '#ef4444',
                color: 'white',
                border: '2.5px solid #1e293b',
                boxShadow: '0 2px 0 #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: isMobile ? '1rem' : '1.15rem',
                transition: 'transform 0.1s ease'
              }}
              aria-label="Tutup"
              title={selectedBook ? "Kembali ke Rak Buku" : "Tutup"}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!selectedBook ? (
          /* ========================================================
             1. BOOK SHELF SELECTION VIEW (2 CARDS PER ROW ON MOBILE)
             ======================================================== */
          <div
            style={{
              padding: isMobile ? '12px 10px 20px 10px' : '22px 20px 28px 20px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* 5 Storybooks Grid (2 Cards per row on Mobile!) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: isMobile ? '10px' : '20px',
                width: '100%',
                maxWidth: '960px'
              }}
            >
              {KOLEKSI_BUKU_CERITA.map((book, index) => {
                return (
                  <motion.div
                    key={book.id}
                    initial={{ scale: 0.85, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 20, delay: index * 0.08 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenBook(book)}
                    style={{
                      background: '#ffffff',
                      borderRadius: isMobile ? '16px' : '22px',
                      border: isMobile ? '2.5px solid #1e293b' : '3.5px solid #1e293b',
                      boxShadow: isMobile ? '0 3.5px 0 #1e293b, 0 6px 12px rgba(0,0,0,0.06)' : '0 5px 0 #1e293b, 0 10px 20px rgba(0,0,0,0.06)',
                      padding: isMobile ? '8px 8px 10px 8px' : '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Top Spine Stripe */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: isMobile ? '5px' : '7px',
                        background: book.gradient
                      }}
                    />

                    {/* Book Cover Image Header Card */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: isMobile ? '115px' : '175px',
                        borderRadius: isMobile ? '10px' : '14px',
                        overflow: 'hidden',
                        border: isMobile ? '2px solid #1e293b' : '2.5px solid #1e293b',
                        boxShadow: '0 2px 0 #1e293b',
                        marginBottom: isMobile ? '8px' : '12px',
                        background: book.gradient
                      }}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />

                      {/* Badge Siri / Buku */}
                      <span
                        style={{
                          position: 'absolute',
                          top: isMobile ? '5px' : '8px',
                          left: isMobile ? '5px' : '8px',
                          background: 'rgba(15, 23, 42, 0.88)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          borderRadius: '999px',
                          padding: isMobile ? '2px 7px' : '3px 10px',
                          fontSize: isMobile ? '0.66rem' : '0.74rem',
                          fontWeight: 900,
                          border: '1.5px solid rgba(255,255,255,0.4)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
                          fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
                        }}
                      >
                        Buku {book.seriesNumber}
                      </span>

                      {/* Bottom Title Bar Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.92) 100%)',
                          padding: isMobile ? '16px 6px 6px 6px' : '24px 10px 8px 10px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-start'
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: isMobile ? '0.88rem' : '1.15rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                            lineHeight: 1.2
                          }}
                        >
                          {book.title}
                        </h3>
                      </div>
                    </div>

                    {/* Book Synopsis */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p
                        style={{
                          margin: isMobile ? '0 0 8px 0' : '0 0 10px 0',
                          color: '#64748b',
                          fontSize: isMobile ? '0.72rem' : '0.84rem',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          flex: 1,
                          minHeight: isMobile ? '32px' : 'auto'
                        }}
                      >
                        {book.synopsis}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      style={{
                        background: book.gradient,
                        color: 'white',
                        border: isMobile ? '2px solid #1e293b' : '2.5px solid #1e293b',
                        boxShadow: '0 2.5px 0 #1e293b',
                        borderRadius: isMobile ? '10px' : '12px',
                        padding: isMobile ? '6px 8px' : '9px',
                        fontWeight: 900,
                        fontSize: isMobile ? '0.78rem' : '0.88rem',
                        fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isMobile ? '5px' : '7px'
                      }}
                    >
                      <i className="fa-solid fa-book-open" style={{ fontSize: isMobile ? '0.74rem' : '0.88rem' }}></i>
                      <span>Mula Baca</span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================
             2. INTERACTIVE STORYBOOK READER VIEW (NO SCROLL ON LAPTOP)
             ======================================================== */
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: isMobile ? '8px 6px' : '10px 14px',
              background: '#f8fafc',
              backgroundImage: 'radial-gradient(rgba(30, 41, 59, 0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '650px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box'
              }}
            >
              {/* Book Page Container with Slide Animation */}
              <div
                style={{
                  width: '100%',
                  perspective: '1200px',
                  position: 'relative',
                  marginBottom: '4px'
                }}
              >
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={`${selectedBook.id}_page_${currentPageIndex}`}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      backgroundImage: 'radial-gradient(rgba(30, 41, 59, 0.08) 1.5px, transparent 1.5px)',
                      backgroundSize: '16px 16px',
                      borderRadius: isMobile ? '16px' : '20px',
                      border: '2.5px solid #1e293b',
                      boxShadow: '0 3px 0 #1e293b, 0 6px 14px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      position: 'relative',
                      boxSizing: 'border-box'
                    }}
                  >
                    {currentPageIndex === 0 ? (
                      /* ===================================================
                         COVER PAGE (COMPACT, SNUG & "MULA" BUTTON)
                         =================================================== */
                      <div
                        style={{
                          flex: 1,
                          padding: isMobile ? '8px' : '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Large Book Cover Image */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            maxHeight: isMobile ? '200px' : '255px',
                            aspectRatio: '16/9',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            border: '2.5px solid #1e293b',
                            boxShadow: '0 2.5px 0 #1e293b',
                            marginBottom: '10px',
                            background: selectedBook.gradient
                          }}
                        >
                          <img
                            src={selectedBook.coverImage}
                            alt={selectedBook.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        </div>

                        {/* Title Under Cover */}
                        <h1
                          style={{
                            margin: '0 0 8px 0',
                            fontSize: isMobile ? '1.4rem' : '1.85rem',
                            fontWeight: 900,
                            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                            color: '#1e293b'
                          }}
                        >
                          {selectedBook.title}
                        </h1>

                        {/* Button "Mula" (Follows Book Theme Gradient) */}
                        <button
                          type="button"
                          onClick={() => handlePageChange(1)}
                          style={{
                            background: selectedBook.gradient,
                            color: '#ffffff',
                            border: '3px solid #1e293b',
                            borderRadius: '999px',
                            padding: isMobile ? '7px 22px' : '9px 30px',
                            fontWeight: 900,
                            fontSize: isMobile ? '0.92rem' : '1.1rem',
                            fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                            cursor: 'pointer',
                            boxShadow: '0 3px 0 #1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          <span>Mula</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    ) : (
                      /* ===================================================
                         INSIDE STORY PAGE: DYNAMIC THEMED 1/5 BADGE + AUDIO BTN + SUKU KATA TEXT
                         =================================================== */
                      <div
                        style={{
                          flex: 1,
                          padding: isMobile ? '8px 6px' : '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Page Top Bar: Dynamic Themed 1/5 Badge (Centered, No Audio) */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '6px',
                            padding: '0 2px'
                          }}
                        >
                          {/* 1/5 Badge with Dynamic Book Theme Color */}
                          <span
                            style={{
                              background: selectedBook.color,
                              color: '#ffffff',
                              fontWeight: 900,
                              fontSize: isMobile ? '0.78rem' : '0.88rem',
                              fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif',
                              padding: '2px 12px',
                              borderRadius: '999px',
                              border: '2px solid #1e293b',
                              boxShadow: '0 2px 0 #1e293b',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {currentPageIndex}/5
                          </span>
                        </div>

                        {/* Story Image Frame with Left & Right Side Navigation Buttons */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '8px'
                          }}
                        >
                          {/* Left (Previous) Button - WHITE DEFAULT, BOOK THEME COLOR ON ACTIVE */}
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPageIndex - 1)}
                            aria-label="Sebelumnya"
                            title="Sebelumnya"
                            style={{
                              position: 'absolute',
                              left: isMobile ? '6px' : '10px',
                              top: 'calc(50% - 20px)',
                              zIndex: 20,
                              width: isMobile ? '36px' : '42px',
                              height: isMobile ? '36px' : '42px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              color: '#1e293b',
                              border: '2.5px solid #1e293b',
                              boxShadow: '0 3px 0 #1e293b, 0 4px 8px rgba(0,0,0,0.25)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '0.95rem' : '1.15rem',
                              outline: 'none',
                              userSelect: 'none',
                              transition: 'transform 0.1s ease, background-color 0.1s ease, color 0.1s ease'
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.backgroundColor = selectedBook.color;
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.transform = 'scale(0.92)';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.color = '#1e293b';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.color = '#1e293b';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>

                          {/* Image Box (Compact 16:9 for No-Scroll Laptop Fit) */}
                          <div
                            style={{
                              width: '100%',
                              maxHeight: isMobile ? '195px' : '240px',
                              aspectRatio: '16/9',
                              borderRadius: '14px',
                              overflow: 'hidden',
                              border: '2.5px solid #1e293b',
                              boxShadow: '0 2.5px 0 #1e293b',
                              background: '#0f172a',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={selectedBook.pages[currentPageIndex]?.image}
                              alt={`${selectedBook.title} - ${currentPageIndex}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>

                          {/* Right (Next) Button - WHITE DEFAULT, BOOK THEME COLOR ON ACTIVE */}
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPageIndex + 1)}
                            aria-label="Seterusnya"
                            title="Seterusnya"
                            style={{
                              position: 'absolute',
                              right: isMobile ? '6px' : '10px',
                              top: 'calc(50% - 20px)',
                              zIndex: 20,
                              width: isMobile ? '36px' : '42px',
                              height: isMobile ? '36px' : '42px',
                              borderRadius: '50%',
                              background: '#ffffff',
                              color: '#1e293b',
                              border: '2.5px solid #1e293b',
                              boxShadow: '0 3px 0 #1e293b, 0 4px 8px rgba(0,0,0,0.25)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? '0.95rem' : '1.15rem',
                              outline: 'none',
                              userSelect: 'none',
                              transition: 'transform 0.1s ease, background-color 0.1s ease, color 0.1s ease'
                            }}
                            onMouseDown={(e) => {
                              e.currentTarget.style.backgroundColor = selectedBook.color;
                              e.currentTarget.style.color = '#ffffff';
                              e.currentTarget.style.transform = 'scale(0.92)';
                            }}
                            onMouseUp={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.color = '#1e293b';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.color = '#1e293b';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>

                        {/* Ruangan Teks Cerita SUKU KATA (Plain Solid White Background WITHOUT dots) */}
                        <div
                          style={{
                            background: '#ffffff',
                            backgroundImage: 'none',
                            border: '2.5px solid #1e293b',
                            borderRadius: '14px',
                            padding: isMobile ? '10px 12px' : '12px 18px',
                            boxShadow: '0 2.5px 0 #1e293b',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: isMobile ? '60px' : '72px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: isMobile ? '1.35rem' : '1.75rem',
                              fontWeight: 900,
                              lineHeight: 1.45,
                              fontFamily: 'Poppins, sans-serif',
                              textAlign: 'center'
                            }}
                          >
                            <SukuKataStoryText text={getPageText(selectedBook, currentPageIndex)} />
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Pagination Dots (Active Dot matches Book Theme Color) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '10px',
                  padding: '2px 0 0 0'
                }}
              >
                {selectedBook.pages.map((_, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => handlePageChange(pIdx)}
                    style={{
                      width: pIdx === currentPageIndex ? (isMobile ? '20px' : '26px') : (isMobile ? '7px' : '9px'),
                      height: isMobile ? '7px' : '9px',
                      borderRadius: '999px',
                      backgroundColor: pIdx === currentPageIndex ? selectedBook.color : '#cbd5e1',
                      border: '1.5px solid #1e293b',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={`Muka Surat ${pIdx === 0 ? 'Kulit Depan' : pIdx}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Popup Makluman: Rak Buku Tiada Audio (sekali setiap sesi) */}
      {showBookNotice && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            e.stopPropagation();
            handleDismissNotice();
          }}
          style={{
            display: 'flex',
            zIndex: 10000,
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <div
              style={{
                fontSize: isMobile ? '3rem' : '3.6rem',
                color: '#f59e0b',
                marginBottom: '10px',
                animation: 'float 2s ease-in-out infinite'
              }}
            >
              <i className="fa-solid fa-book-open-reader"></i>
            </div>
            <h2
              style={{
                fontSize: isMobile ? '1.5rem' : '1.8rem',
                marginBottom: '12px',
                color: '#1e293b',
                fontFamily: 'AtlantaRoundedBlack, AtlantaRounded, sans-serif'
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: 'var(--color-orange)',
                  color: '#ffffff',
                  padding: '6px 18px',
                  borderRadius: '12px'
                }}
              >
                Rak Buku Bunyi Kata
              </span>
            </h2>
            <p
              style={{
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                fontWeight: 'bold',
                lineHeight: '1.6',
                color: '#1e293b',
                marginBottom: '20px'
              }}
            >
              Rak Buku ini tiada audio. Murid digalakkan membaca sendiri dengan kuat. Selamat mencuba!
            </p>
            <button
              type="button"
              className="neo-btn bg-orange"
              style={{
                width: '100%',
                fontSize: isMobile ? '1.05rem' : '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={handleDismissNotice}
            >
              <i className="fa-solid fa-thumbs-up"></i> Faham!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
