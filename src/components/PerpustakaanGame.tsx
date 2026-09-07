import React, { useState, useEffect, useRef } from 'react';
import { ATLANTA_ROUNDED_SVG_STYLE } from '../utils/atlantaFontBase64';

// Word Card Interface for Reading Shelves
export interface WordCard {
    word: string;
    syllables: string[];
    meaning?: string;
    example?: string;
    color?: string;
}

export interface LibraryShelf {
    id: number;
    title: string;
    subtitle: string;
    color: string;
    accentColor: string;
    words: WordCard[];
}

interface PerpustakaanGameProps {
    onClose?: () => void;
    isHeroMode?: boolean;
}

// -------------------------------------------------------------
// IMAGE MAPPING FROM FOLDERS SUKUKATA ASAS & SUKUKATA HERO
// -------------------------------------------------------------
export const SUKUKATA_ASAS_IMAGES: Record<string, string> = {
    // GAMBAR V+KV
    api: '/images/sukukata-asas/GAMBAR V+KV/api.png',
    ibu: '/images/sukukata-asas/GAMBAR V+KV/ibu.png',
    ubi: '/images/sukukata-asas/GAMBAR V+KV/ubi.png',
    alu: '/images/sukukata-asas/GAMBAR V+KV/alu.png',
    isi: '/images/sukukata-asas/GAMBAR V+KV/isi.png',
    ulu: '/images/sukukata-asas/GAMBAR V+KV/ulu.png',
    // GAMBAR KVKV
    beca: '/images/sukukata-asas/GAMBAR KVKV/beca.png',
    ciku: '/images/sukukata-asas/GAMBAR KVKV/ciku.png',
    jari: '/images/sukukata-asas/GAMBAR KVKV/jari.png',
    kuku: '/images/sukukata-asas/GAMBAR KVKV/kuku.png',
    labu: '/images/sukukata-asas/GAMBAR KVKV/labu.png',
    lidi: '/images/sukukata-asas/GAMBAR KVKV/lidi.png',
    mata: '/images/sukukata-asas/GAMBAR KVKV/mata.png',
    nasi: '/images/sukukata-asas/GAMBAR KVKV/nasi.png',
    paku: '/images/sukukata-asas/GAMBAR KVKV/paku.png',
    raga: '/images/sukukata-asas/GAMBAR KVKV/raga.png',
    rusa: '/images/sukukata-asas/GAMBAR KVKV/rusa.png',
    sawi: '/images/sukukata-asas/GAMBAR KVKV/sawi.png',
    sudu: '/images/sukukata-asas/GAMBAR KVKV/sudu.png',
    tali: '/images/sukukata-asas/GAMBAR KVKV/tali.png',
    tebu: '/images/sukukata-asas/GAMBAR KVKV/tebu.png',
    // GAMBAR KVK
    bas: '/images/sukukata-asas/GAMBAR KVK/bas.png',
    beg: '/images/sukukata-asas/GAMBAR KVK/beg.png',
    bot: '/images/sukukata-asas/GAMBAR KVK/bot.png',
    cat: '/images/sukukata-asas/GAMBAR KVK/cat.png',
    jag: '/images/sukukata-asas/GAMBAR KVK/jag.png',
    jam: '/images/sukukata-asas/GAMBAR KVK/jam.png',
    jem: '/images/sukukata-asas/GAMBAR KVK/jem.png',
    jet: '/images/sukukata-asas/GAMBAR KVK/jet.png',
    kek: '/images/sukukata-asas/GAMBAR KVK/kek.png',
    kot: '/images/sukukata-asas/GAMBAR KVK/kot.png',
    pam: '/images/sukukata-asas/GAMBAR KVK/pam.png',
    pen: '/images/sukukata-asas/GAMBAR KVK/pen.png',
    pil: '/images/sukukata-asas/GAMBAR KVK/pil.png',
    pin: '/images/sukukata-asas/GAMBAR KVK/pin.png',
    rak: '/images/sukukata-asas/GAMBAR KVK/rak.png',
    rim: '/images/sukukata-asas/GAMBAR KVK/rim.png',
    ros: '/images/sukukata-asas/GAMBAR KVK/ros.png',
    sup: '/images/sukukata-asas/GAMBAR KVK/sup.png',
    tin: '/images/sukukata-asas/GAMBAR KVK/tin.png',
    van: '/images/sukukata-asas/GAMBAR KVK/van.png',
    // GAMBAR V+KVK
    ayam: '/images/sukukata-asas/GAMBAR V+KVK/ayam.png',
    enam: '/images/sukukata-asas/GAMBAR V+KVK/enam.png',
    epal: '/images/sukukata-asas/GAMBAR V+KVK/epal.png',
    ikan: '/images/sukukata-asas/GAMBAR V+KVK/ikan.png',
    itik: '/images/sukukata-asas/GAMBAR V+KVK/itik.png',
    obor: '/images/sukukata-asas/GAMBAR V+KVK/obor.png',
    oren: '/images/sukukata-asas/GAMBAR V+KVK/oren.png',
    otak: '/images/sukukata-asas/GAMBAR V+KVK/otak.png',
    ular: '/images/sukukata-asas/GAMBAR V+KVK/ular.png',
    ulat: '/images/sukukata-asas/GAMBAR V+KVK/ulat.png',
    // GAMBAR KV+KV+KV
    berudu: '/images/sukukata-asas/GAMBAR KV+KV+KV/berudu.png',
    keladi: '/images/sukukata-asas/GAMBAR KV+KV+KV/keladi.png',
    kelapa: '/images/sukukata-asas/GAMBAR KV+KV+KV/kelapa.png',
    kemeja: '/images/sukukata-asas/GAMBAR KV+KV+KV/kemeja.png',
    kereta: '/images/sukukata-asas/GAMBAR KV+KV+KV/kereta.png',
    kerusi: '/images/sukukata-asas/GAMBAR KV+KV+KV/kerusi.png',
    pelita: '/images/sukukata-asas/GAMBAR KV+KV+KV/pelita.png',
    perigi: '/images/sukukata-asas/GAMBAR KV+KV+KV/perigi.png',
    petani: '/images/sukukata-asas/GAMBAR KV+KV+KV/petani.png',
    petola: '/images/sukukata-asas/GAMBAR KV+KV+KV/petola.png',
    semalu: '/images/sukukata-asas/GAMBAR KV+KV+KV/semalu.png',
    sepatu: '/images/sukukata-asas/GAMBAR KV+KV+KV/sepatu.png',
    tomato: '/images/sukukata-asas/GAMBAR KV+KV+KV/tomato.png',
    wanita: '/images/sukukata-asas/GAMBAR KV+KV+KV/wanita.png',
};

export const SUKUKATA_HERO_IMAGES: Record<string, string> = {
    // GAMBAR KVK+KV
    baldi: '/images/sukukata-hero/GAMBAR KVK+KV/baldi.png',
    bendi: '/images/sukukata-hero/GAMBAR KVK+KV/bendi.png',
    garfu: '/images/sukukata-hero/GAMBAR KVK+KV/garfu.png',
    garpu: '/images/sukukata-hero/GAMBAR KVK+KV/garpu.png',
    jambu: '/images/sukukata-hero/GAMBAR KVK+KV/jambu.png',
    kunci: '/images/sukukata-hero/GAMBAR KVK+KV/kunci.png',
    lampu: '/images/sukukata-hero/GAMBAR KVK+KV/lampu.png',
    lembu: '/images/sukukata-hero/GAMBAR KVK+KV/lembu.png',
    pintu: '/images/sukukata-hero/GAMBAR KVK+KV/pintu.png',
    // GAMBAR KVK+KVK
    biskut: '/images/sukukata-hero/GAMBAR KVK+KVK/biskut.png',
    cermin: '/images/sukukata-hero/GAMBAR KVK+KVK/cermin.png',
    cincin: '/images/sukukata-hero/GAMBAR KVK+KVK/cincin.png',
    doktor: '/images/sukukata-hero/GAMBAR KVK+KVK/doktor.png',
    mancis: '/images/sukukata-hero/GAMBAR KVK+KVK/mancis.png',
    masjid: '/images/sukukata-hero/GAMBAR KVK+KVK/masjid.png',
    rambut: '/images/sukukata-hero/GAMBAR KVK+KVK/rambut.png',
    rumput: '/images/sukukata-hero/GAMBAR KVK+KVK/rumput.png',
    sampah: '/images/sukukata-hero/GAMBAR KVK+KVK/sampah.png',
    sampan: '/images/sukukata-hero/GAMBAR KVK+KVK/sampan.png',
    tanduk: '/images/sukukata-hero/GAMBAR KVK+KVK/tanduk.png',
    tombol: '/images/sukukata-hero/GAMBAR KVK+KVK/tombol.png',
    // GAMBAR KVKK
    bank: '/images/sukukata-hero/GAMBAR KVKK/bank.png',
    gong: '/images/sukukata-hero/GAMBAR KVKK/gong.png',
    jong: '/images/sukukata-hero/GAMBAR KVKK/jong.png',
    tong: '/images/sukukata-hero/GAMBAR KVKK/tong.png',
    wang: '/images/sukukata-hero/GAMBAR KVKK/wang.png',
    zink: '/images/sukukata-hero/GAMBAR KVKK/zink.png',
    // GAMBAR KV+KVK
    bakul: '/images/sukukata-hero/GAMBAR KV+KVK/bakul.png',
    belon: '/images/sukukata-hero/GAMBAR KV+KVK/belon.png',
    beruk: '/images/sukukata-hero/GAMBAR KV+KVK/beruk.png',
    betik: '/images/sukukata-hero/GAMBAR KV+KVK/betik.png',
    botol: '/images/sukukata-hero/GAMBAR KV+KVK/botol.png',
    cawan: '/images/sukukata-hero/GAMBAR KV+KVK/cawan.png',
    cerek: '/images/sukukata-hero/GAMBAR KV+KVK/cerek.png',
    gajah: '/images/sukukata-hero/GAMBAR KV+KVK/gajah.png',
    gelas: '/images/sukukata-hero/GAMBAR KV+KVK/gelas.png',
    gitar: '/images/sukukata-hero/GAMBAR KV+KVK/gitar.png',
    kapak: '/images/sukukata-hero/GAMBAR KV+KVK/kapak.png',
    kapal: '/images/sukukata-hero/GAMBAR KV+KVK/kapal.png',
    kasut: '/images/sukukata-hero/GAMBAR KV+KVK/kasut.png',
    katil: '/images/sukukata-hero/GAMBAR KV+KVK/katil.png',
    ketam: '/images/sukukata-hero/GAMBAR KV+KVK/ketam.png',
    kicap: '/images/sukukata-hero/GAMBAR KV+KVK/kicap.png',
    kilat: '/images/sukukata-hero/GAMBAR KV+KVK/kilat.png',
    kipas: '/images/sukukata-hero/GAMBAR KV+KVK/kipas.png',
    lilin: '/images/sukukata-hero/GAMBAR KV+KVK/lilin.png',
    makan: '/images/sukukata-hero/GAMBAR KV+KVK/makan.png',
    marah: '/images/sukukata-hero/GAMBAR KV+KVK/marah.png',
    nanas: '/images/sukukata-hero/GAMBAR KV+KVK/nanas.png',
    pagar: '/images/sukukata-hero/GAMBAR KV+KVK/pagar.png',
    sabun: '/images/sukukata-hero/GAMBAR KV+KVK/sabun.png',
    sikat: '/images/sukukata-hero/GAMBAR KV+KVK/sikat.png',
    tayar: '/images/sukukata-hero/GAMBAR KV+KVK/tayar.png',
    // GAMBAR KV+KV+KVK
    basikal: '/images/sukukata-hero/GAMBAR KV+KV+KVK/basikal.png',
    kelawar: '/images/sukukata-hero/GAMBAR KV+KV+KVK/kelawar.png',
    keledek: '/images/sukukata-hero/GAMBAR KV+KV+KVK/keledek.png',
    ketupat: '/images/sukukata-hero/GAMBAR KV+KV+KVK/ketupat.png',
    piramid: '/images/sukukata-hero/GAMBAR KV+KV+KVK/piramid.png',
    pulasan: '/images/sukukata-hero/GAMBAR KV+KV+KVK/pulasan.png',
    telefon: '/images/sukukata-hero/GAMBAR KV+KV+KVK/telefon.png',
    tetikus: '/images/sukukata-hero/GAMBAR KV+KV+KVK/tetikus.png',
    zirafah: '/images/sukukata-hero/GAMBAR KV+KV+KVK/zirafah.png',
    // GAMBAR KVK+KV+KVK
    cempedak: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/cempedak.png',
    cendawan: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/cendawan.png',
    jambatan: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/jambatan.png',
    komputer: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/komputer.png',
    pembaris: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/pembaris.png',
    tempayan: '/images/sukukata-hero/GAMBAR KVK+KV+KVK/tempayan.png',
};

export function getSukuKataImageUrl(word: string, isHero: boolean = false): string {
    const w = word.toLowerCase().trim();
    if (isHero) {
        if (SUKUKATA_HERO_IMAGES[w]) return SUKUKATA_HERO_IMAGES[w];
        if (SUKUKATA_ASAS_IMAGES[w]) return SUKUKATA_ASAS_IMAGES[w];
    } else {
        if (SUKUKATA_ASAS_IMAGES[w]) return SUKUKATA_ASAS_IMAGES[w];
        if (SUKUKATA_HERO_IMAGES[w]) return SUKUKATA_HERO_IMAGES[w];
    }
    return `/images/sukukata/${w}.png`;
}

// -------------------------------------------------------------
// CURATED WORD COLLECTIONS FOR ASAS & HERO (EXACT MATCH TO ASAS & HERO FOLDERS)
// -------------------------------------------------------------
const ASAS_SHELVES: LibraryShelf[] = [
    {
        id: 0,
        title: 'Bilik V + KV',
        subtitle: 'Gabungan Vokal Awal dan KV',
        color: '#0284c7',
        accentColor: '#38bdf8',
        words: [
            { word: 'api', syllables: ['a', 'pi'], meaning: 'Cahaya dan haba panas yang membakar.', example: 'Anggota bomba pantas memadamkan api.' },
            { word: 'ibu', syllables: ['i', 'bu'], meaning: 'Wanita mulia yang mendidik kita.', example: 'Saya amat menyayangi ibu dan bapa saya.' },
            { word: 'ubi', syllables: ['u', 'bi'], meaning: 'Makanan tanaman berakar yang berkhasiat.', example: 'Nenek merebus ubi kayu yang enak dimakan.' },
            { word: 'alu', syllables: ['a', 'lu'], meaning: 'Alat kayu penumbuk lesung tradisional.', example: 'Nenek menumbuk beras pulut menggunakan alu.' },
            { word: 'isi', syllables: ['i', 'si'], meaning: 'Bahagian dalam sesuatu benda atau buah.', example: 'Buah durian mempunyai isi yang manis.' },
            { word: 'ulu', syllables: ['u', 'lu'], meaning: 'Bahagian hulu sungai atau pangkal keris.', example: 'Air jernih mengalir dari ulu sungai ke muara.' },
        ],
    },
    {
        id: 1,
        title: 'Bilik KV + KV',
        subtitle: 'Suku Kata Terbuka Konsonan + Vokal',
        color: '#059669',
        accentColor: '#34d399',
        words: [
            { word: 'mata', syllables: ['ma', 'ta'], meaning: 'Organ deria untuk melihat keindahan alam.', example: 'Mata yang sihat membolehkan kita membaca dengan terang.' },
            { word: 'sudu', syllables: ['su', 'du'], meaning: 'Alat berkepala cekung untuk menyuap makanan.', example: 'Gunakan sudu yang bersih semasa makan sup.' },
            { word: 'tali', syllables: ['ta', 'li'], meaning: 'Utas benang atau serat untuk mengikat.', example: 'Ayah mengikat kotak itu menggunakan tali kemas.' },
            { word: 'rusa', syllables: ['ru', 'sa'], meaning: 'Haiwan bertanduk indah di dalam hutan.', example: 'Rusa bertanduk cantik meragut rumput segar.' },
            { word: 'paku', syllables: ['pa', 'ku'], meaning: 'Bahan logam tajam penyambung kayu.', example: 'Tukang kayu memukul paku ke dinding papan.' },
            { word: 'labu', syllables: ['la', 'bu'], meaning: 'Buah besar bulat berwarna jingga manis.', example: 'Ibu memasak pengat labu yang manis dan enak.' },
            { word: 'beca', syllables: ['be', 'ca'], meaning: 'Kenderaan tiga roda kayuhan tradisional.', example: 'Pelancong menaiki beca mengelilingi bandar bersejarah.' },
        ],
    },
    {
        id: 2,
        title: 'Bilik KV',
        subtitle: 'Suku Kata Terbuka Mudah Konsonan + Vokal',
        color: '#d97706',
        accentColor: '#fbbf24',
        words: [
            { word: 'ciku', syllables: ['ci', 'ku'], meaning: 'Buah manis berkulit coklat lembut.', example: 'Buah ciku matang rasanya manis seperti madu.' },
            { word: 'jari', syllables: ['ja', 'ri'], meaning: 'Bahagian hujung tangan untuk memegang.', example: 'Kita mempunyai sepuluh jari tangan yang cekap.' },
            { word: 'kuku', syllables: ['ku', 'ku'], meaning: 'Lapisan keras pelindung hujung jari.', example: 'Potong kuku tangan supaya sentiasa bersih dan sihat.' },
            { word: 'lidi', syllables: ['li', 'di'], meaning: 'Tulang daun kelapa untuk membuat penyapu.', example: 'Kakak menyapu halaman rumah menggunakan penyapu lidi.' },
            { word: 'nasi', syllables: ['na', 'si'], meaning: 'Beras yang telah dimasak enak dimakan.', example: 'Keluarga kami menikmati nasi putih hangat bersama lauk.' },
            { word: 'raga', syllables: ['ra', 'ga'], meaning: 'Bakul anyaman untuk mengisi barang.', example: 'Ibu membawa raga berisi sayur-sayuran segar dari pasar.' },
            { word: 'sawi', syllables: ['sa', 'wi'], meaning: 'Sayuran hijau yang berkhasiat dan segar.', example: 'Sayur sawi kaya dengan vitamin dan zat besi.' },
            { word: 'tebu', syllables: ['te', 'bu'], meaning: 'Batang manis penghasil gula asli.', example: 'Air tebu segar menghilangkan dahaga di hari panas.' },
        ],
    },
    {
        id: 3,
        title: 'Bilik KVK',
        subtitle: 'Suku Kata Tertutup Konsonan Vokal Konsonan',
        color: '#dc2626',
        accentColor: '#f87171',
        words: [
            { word: 'bas', syllables: ['bas'], meaning: 'Kenderaan awam beroda besar pelbagai penumpang.', example: 'Bas sekolah membawa murid-murid ke perpustakaan.' },
            { word: 'beg', syllables: ['beg'], meaning: 'Bekas berzip untuk membawa buku sekolah.', example: 'Adik menggalas beg sekolah yang kemas ke kelas.' },
            { word: 'cat', syllables: ['cat'], meaning: 'Bahan cecair pewarna untuk menyegarkan dinding.', example: 'Dinding perpustakaan disapu cat warna krim lembut.' },
            { word: 'jam', syllables: ['jam'], meaning: 'Alat penunjuk masa dan waktu harian.', example: 'Jam dinding menunjukkan tepat pukul lapan pagi.' },
            { word: 'kek', syllables: ['kek'], meaning: 'Manisan gebu sempena sambutan istimewa.', example: 'Ibu membakar kek strawberi yang lazat.' },
            { word: 'pen', syllables: ['pen'], meaning: 'Alat tulis berdakwat untuk mencatat nota.', example: 'Murid menggunakan pen untuk menulis karangan.' },
            { word: 'bot', syllables: ['bot'], meaning: 'Kenderaan air meredah sungai dan lautan.', example: 'Nelayan menaiki bot membelah ombak lautan.' },
            { word: 'van', syllables: ['van'], meaning: 'Kenderaan bertutup selesa untuk perjalanan.', example: 'Guru dan murid menaiki van ke muzium negara.' },
        ],
    },
    {
        id: 4,
        title: 'Bilik V + KVK',
        subtitle: 'Vokal Depan Diikuti Suku Kata Tertutup',
        color: '#7c3aed',
        accentColor: '#a78bfa',
        words: [
            { word: 'ayam', syllables: ['a', 'yam'], meaning: 'Haiwan ternakan berbulu pelepah berkokok fajar.', example: 'Ayam jantan berkokok menandakan masuknya waktu pagi.' },
            { word: 'ikan', syllables: ['i', 'kan'], meaning: 'Haiwan akuatik berenang di air tenang.', example: 'Ikan emas berenang riang di dalam akuarium.' },
            { word: 'otak', syllables: ['o', 'tak'], meaning: 'Organ dalam kepala untuk berfikir dan mengingat.', example: 'Membaca buku mengasah ketajaman otak murid.' },
            { word: 'ular', syllables: ['u', 'lar'], meaning: 'Reptilia panjang melingkar tanpa kaki.', example: 'Ular itu menyusup masuk ke dalam semak tebal.' },
            { word: 'ulat', syllables: ['u', 'lat'], meaning: 'Haiwan kecil merayap perlahan di atas dedaun.', example: 'Ulat bulu merayap mencari pucuk daun muda.' },
            { word: 'enam', syllables: ['e', 'nam'], meaning: 'Nombor genap selepas angka lima.', example: 'Adik mempunyai enam batang pensel warna.' },
            { word: 'epal', syllables: ['e', 'pal'], meaning: 'Buah manis rangup yang kaya khasiat.', example: 'Sebiji buah epal sehari menyihatkan badan.' },
            { word: 'itik', syllables: ['i', 'tik'], meaning: 'Unggas air berenang riang di kolam air.', example: 'Kawanan itik berenang riang mengikut ibunya.' },
        ],
    },
    {
        id: 5,
        title: 'Bilik KV + KV + KV',
        subtitle: 'Tiga Suku Kata Terbuka Konsonan Vokal',
        color: '#db2777',
        accentColor: '#f472b6',
        words: [
            { word: 'kereta', syllables: ['ke', 're', 'ta'], meaning: 'Kenderaan empat roda yang dinaiki bersama keluarga.', example: 'Ayah memandu kereta dengan cermat di jalan raya.' },
            { word: 'kerusi', syllables: ['ke', 'ru', 'si'], meaning: 'Perabot tempat duduk selesa untuk belajar.', example: 'Murid duduk di atas kerusi mendengar penerangan guru.' },
            { word: 'kelapa', syllables: ['ke', 'la', 'pa'], meaning: 'Pokok serbaguna dengan buah berair manis.', example: 'Pokok kelapa melambai-lambai ditiup angin pantai.' },
            { word: 'kemeja', syllables: ['ke', 'me', 'ja'], meaning: 'Pakaian berbutang kemas untuk majlis rasmi.', example: 'Abang memakai kemeja biru ke majlis graduasi.' },
            { word: 'tomato', syllables: ['to', 'ma', 'to'], meaning: 'Sayur merah bulat penuh vitamin berkhasiat.', example: 'Ibu memasukkan buah tomato ke dalam sup sayur.' },
            { word: 'pelita', syllables: ['pe', 'li', 'ta'], meaning: 'Lampu tradisional bercahaya api lembut.', example: 'Pelita minyak tanah dipasang menerangi laman rumah.' },
            { word: 'petani', syllables: ['pe', 'ta', 'ni'], meaning: 'Wira pertanian yang rajin bercucuk tanam.', example: 'Pakcik petani menuai hasil padi yang menguning.' },
            { word: 'perigi', syllables: ['pe', 'ri', 'gi'], meaning: 'Lubang sumber air bawah tanah yang jernih.', example: 'Penduduk kampung mengambil air bersih dari perigi lama.' },
        ],
    },
];

const HERO_SHELVES: LibraryShelf[] = [
    {
        id: 0,
        title: 'Bilik KVK + KV',
        subtitle: 'Suku Kata Tertutup Diikuti Terbuka',
        color: '#0284c7',
        accentColor: '#38bdf8',
        words: [
            { word: 'lampu', syllables: ['lam', 'pu'], meaning: 'Alat penyinar cahaya elektrik membaca.', example: 'Lampu meja dinyalakan semasa membaca di bilik.' },
            { word: 'pintu', syllables: ['pin', 'tu'], meaning: 'Laluan berengsel kemas keluar masuk bilik.', example: 'Pintu perpustakaan dibuka seluas-luasnya untuk murid.' },
            { word: 'lembu', syllables: ['lem', 'bu'], meaning: 'Haiwan ternakan berkaki empat peragut rumput.', example: 'Lembu tenusu meragut rumput segar di ladang.' },
            { word: 'kunci', syllables: ['kun', 'ci'], meaning: 'Alat logam pelindung keselamatan pintu bilik.', example: 'Penjaga perpustakaan memegang kunci pintu utama.' },
            { word: 'baldi', syllables: ['bal', 'di'], meaning: 'Bekas bertangkai menampung air bersih.', example: 'Adik mengisi air ke dalam baldi untuk menyiram bunga.' },
            { word: 'bendi', syllables: ['ben', 'di'], meaning: 'Sayur hijau berkhasiat enak dimasak kari.', example: 'Ibu menumis sayur bendi segar kegemaran keluarga.' },
            { word: 'jambu', syllables: ['jam', 'bu'], meaning: 'Buah tropika berair rangup manis rasanya.', example: 'Buah jambu air itu manis dan menyegarkan tekak.' },
            { word: 'garpu', syllables: ['gar', 'pu'], meaning: 'Alat makan berduri besi pencucuk hidangan.', example: 'Gunakan sudu dan garpu dengan tertib semasa makan.' },
        ],
    },
    {
        id: 1,
        title: 'Bilik KVK + KVK',
        subtitle: 'Dua Suku Kata Tertutup Lengkap',
        color: '#059669',
        accentColor: '#34d399',
        words: [
            { word: 'cermin', syllables: ['cer', 'min'], meaning: 'Kaca jernih membalikkan imej bayangan.', example: 'Adik melihat wajahnya di hadapan cermin besar.' },
            { word: 'doktor', syllables: ['dok', 'tor'], meaning: 'Pakar perubatan merawat pesakit di hospital.', example: 'Doktor merawat pesakit dengan penuh dedikasi.' },
            { word: 'rumput', syllables: ['rum', 'put'], meaning: 'Tumbuhan hijau menutup padang lapang.', example: 'Padang rumput kelihatan segar selepas disirami hujan.' },
            { word: 'tanduk', syllables: ['tan', 'duk'], meaning: 'Pertahanan keras pada kepala haiwan.', example: 'Rusa jantan mempunyai tanduk yang bercabang indah.' },
            { word: 'biskut', syllables: ['bis', 'kut'], meaning: 'Kudapan bakar rangup dinikmati bersama susu.', example: 'Nenek menghidangkan biskut coklat untuk cucu-cucunya.' },
            { word: 'cincin', syllables: ['cin', 'cin'], meaning: 'Gelang kecil perhiasan di jari tangan.', example: 'Ibu memakai cincin permata yang berkilauan.' },
            { word: 'mancis', syllables: ['man', 'cis'], meaning: 'Batang kecil penyala api kegunaan dapur.', example: 'Simpan kotak mancis di tempat selamat dan kering.' },
            { word: 'masjid', syllables: ['mas', 'jid'], meaning: 'Tempat ibadat suci yang tenteram dan indah.', example: 'Kubah masjid berkilau disinari cahaya matahari pagi.' },
        ],
    },
    {
        id: 2,
        title: 'Bilik KVKK',
        subtitle: 'Suku Kata Tunggal Empat Huruf Berturutan',
        color: '#d97706',
        accentColor: '#fbbf24',
        words: [
            { word: 'wang', syllables: ['wang'], meaning: 'Alat perniagaan sah urusan jual beli.', example: 'Amalan menabung wang menjamin keselesaan masa depan.' },
            { word: 'tong', syllables: ['tong'], meaning: 'Bekas simpanan silinder besar dan kukuh.', example: 'Kitar semula sisa kertas ke dalam tong khas.' },
            { word: 'bank', syllables: ['bank'], meaning: 'Institusi simpanan kewangan yang selamat.', example: 'Ayah mendepositkan wang simpanan di bank.' },
            { word: 'gong', syllables: ['gong'], meaning: 'Alat muzik tradisional bergema merdu.', example: 'Gong dipalu menandakan bermulanya majlis keraian.' },
            { word: 'zink', syllables: ['zink'], meaning: 'Kepingan logam bumbung pelindung hujan.', example: 'Bumbung zink melindungi bangunan daripada terik suria.' },
            { word: 'jong', syllables: ['jong'], meaning: 'Kapal layar besar pedagang zaman silam.', example: 'Kapal jong belayar megah di pelabuhan Melaka purba.' },
        ],
    },
    {
        id: 3,
        title: 'Bilik KV + KVK',
        subtitle: 'Suku Kata Terbuka Diikuti Suku Kata Tertutup',
        color: '#dc2626',
        accentColor: '#f87171',
        words: [
            { word: 'cawan', syllables: ['ca', 'wan'], meaning: 'Bekas minuman bertangkai elegan.', example: 'Cawan seramik itu dihiasi corak bunga mawar.' },
            { word: 'gajah', syllables: ['ga', 'jah'], meaning: 'Mamalia darat gergasi berbelalai panjang.', example: 'Gajah belalai panjang hidup berkumpulan di rimba.' },
            { word: 'kapal', syllables: ['ka', 'pal'], meaning: 'Kenderaan marin besar meredah lautan luas.', example: 'Kapal berlabuh megah di pelabuhan antarabangsa.' },
            { word: 'katil', syllables: ['ka', 'til'], meaning: 'Tempat perbaringan tidur yang empuk.', example: 'Adik mengemas cadar katilnya setiap pagi.' },
            { word: 'kasut', syllables: ['ka', 'sut'], meaning: 'Alas pelindung tapak kaki semasa melangkah.', example: 'Kasut sekolah disusun kemas di atas rak.' },
            { word: 'botol', syllables: ['bo', 'tol'], meaning: 'Bekas silinder penyimpan air minuman harian.', example: 'Bawa botol air mineral untuk kekal bertenaga.' },
            { word: 'gitar', syllables: ['gi', 'tar'], meaning: 'Alat muzik bertali merdu dimainkan irama.', example: 'Abang memetik tali gitar mendendangkan lagu riang.' },
            { word: 'kipas', syllables: ['ki', 'pas'], meaning: 'Alat penghembus angin sejuk dan nyaman.', example: 'Kipas angin berputar pantas menyejukkan bilik.' },
        ],
    },
    {
        id: 4,
        title: 'Bilik KV + KV + KVK',
        subtitle: 'Pola Tiga Suku Kata Diakhiri Tertutup',
        color: '#7c3aed',
        accentColor: '#a78bfa',
        words: [
            { word: 'basikal', syllables: ['ba', 'si', 'kal'], meaning: 'Kenderaan dua roda kayuhan menyihatkan.', example: 'Kanak-kanak berbasikal di taman rekreasi petang ini.' },
            { word: 'telefon', syllables: ['te', 'le', 'fon'], meaning: 'Alat perhubungan suara jarak jauh canggih.', example: 'Ibu menjawab panggilan telefon daripada nenek.' },
            { word: 'zirafah', syllables: ['zi', 'ra', 'fah'], meaning: 'Haiwan leher jinjang pemakan daun tinggi.', example: 'Zirafah mencapai dedaun di puncak dahan pokok.' },
            { word: 'ketupat', syllables: ['ke', 'tu', 'pat'], meaning: 'Anyaman daun kelapa berisi beras pulut.', example: 'Ketupat enak dimakan bersama kuah kacang lazat.' },
            { word: 'piramid', syllables: ['pi', 'ra', 'mid'], meaning: 'Binaan tiga segi purba yang amat masyhur.', example: 'Piramid berdiri megah di bumi Mesir purba.' },
            { word: 'tetikus', syllables: ['te', 'ti', 'kus'], meaning: 'Alat penuding pergerakan penunjuk skrin komputer.', example: 'Klik butang tetikus untuk memilih jawapan yang betul.' },
            { word: 'kelawar', syllables: ['ke', 'la', 'war'], meaning: 'Mamalia bersayap terbang di malam gelap.', example: 'Kelawar bergantung di siling gua batu kapur.' },
            { word: 'pulasan', syllables: ['pu', 'la', 'san'], meaning: 'Buah manis berambut tebal mirip rambutan.', example: 'Buah pulasan segar dipetik dari dusun buah datuk.' },
        ],
    },
    {
        id: 5,
        title: 'Bilik KVK + KV + KVK',
        subtitle: 'Gabungan Pola Tertutup dan Terbuka Majmuk',
        color: '#db2777',
        accentColor: '#f472b6',
        words: [
            { word: 'cempedak', syllables: ['cem', 'pe', 'dak'], meaning: 'Buah beraroma wangi manis kekuningan.', example: 'Ulas cempedak goreng harum baunya membuka selera.' },
            { word: 'cendawan', syllables: ['cen', 'da', 'wan'], meaning: 'Tumbuhan kulat payung enak berkhasiat.', example: 'Sup cendawan panas sungguh menyelerakan.' },
            { word: 'jambatan', syllables: ['jam', 'ba', 'tan'], meaning: 'Binaan kukuh merentasi sungai lebar.', example: 'Kereta meluncur laju melintasi jambatan gantung.' },
            { word: 'komputer', syllables: ['kom', 'pu', 'ter'], meaning: 'Mesin digital pintar pemproses maklumat.', example: 'Murid belajar menaip menggunakan komputer di makmal.' },
            { word: 'pembaris', syllables: ['pem', 'ba', 'ris'], meaning: 'Alat pengukur panjang dan penanda garis lurus.', example: 'Gunakan pembaris untuk melukis garis yang tepat.' },
            { word: 'tempayan', syllables: ['tem', 'pa', 'yan'], meaning: 'Bekas tanah liat tradisional penyimpan air.', example: 'Tempayan tanah liat menyimpan air sejuk di dapur.' },
        ],
    },
];

// =========================================================================
// PURE ART MUSEUM PAINTINGS (NO LABELS, NO TEXT - PURE ILLUSTRATION)
// =========================================================================
function makePureArtPaintingSvg(word: string, themeColor: string) {
    const w = word.toLowerCase().trim();
    let illustration = '';

    if (w === 'ikan') {
        illustration = `
            <ellipse cx="180" cy="130" rx="80" ry="48" fill="#f97316"/>
            <polygon points="250,130 310,85 300,130 310,175" fill="#ea580c"/>
            <path d="M150,85 Q175,60 210,85" fill="#ea580c"/>
            <path d="M160,175 Q185,195 210,175" fill="#ea580c"/>
            <circle cx="130" cy="120" r="10" fill="#ffffff"/>
            <circle cx="127" cy="120" r="5" fill="#0f172a"/>
            <path d="M165,110 Q155,130 165,150" stroke="#c2410c" stroke-width="4" fill="none"/>
            <circle cx="85" cy="95" r="8" fill="#38bdf8" opacity="0.6"/>
            <circle cx="95" cy="70" r="12" fill="#38bdf8" opacity="0.5"/>
            <circle cx="110" cy="45" r="6" fill="#38bdf8" opacity="0.7"/>
        `;
    } else if (w === 'api') {
        illustration = `
            <path d="M180,45 Q230,110 220,170 Q210,210 180,215 Q150,210 140,170 Q130,110 180,45 Z" fill="#ef4444"/>
            <path d="M180,85 Q215,135 205,180 Q198,210 180,212 Q162,210 155,180 Q145,135 180,85 Z" fill="#f97316"/>
            <path d="M180,125 Q200,160 195,190 Q190,208 180,210 Q170,208 165,190 Q160,160 180,125 Z" fill="#fef08a"/>
            <polygon points="120,215 240,215 225,230 135,230" fill="#78350f"/>
        `;
    } else if (w === 'buku') {
        illustration = `
            <path d="M180,85 Q130,70 70,85 L70,185 Q130,170 180,185 L180,85 Z" fill="#fef9c3" stroke="#b8860b" stroke-width="3"/>
            <path d="M180,85 Q230,70 290,85 L290,185 Q230,170 180,185 L180,85 Z" fill="#fef9c3" stroke="#b8860b" stroke-width="3"/>
            <line x1="180" y1="85" x2="180" y2="195" stroke="#78350f" stroke-width="6"/>
            <line x1="85" y1="105" x2="165" y2="105" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <line x1="85" y1="125" x2="165" y2="125" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <line x1="85" y1="145" x2="165" y2="145" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <line x1="195" y1="105" x2="275" y2="105" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <line x1="195" y1="125" x2="275" y2="125" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <line x1="195" y1="145" x2="275" y2="145" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 4"/>
            <path d="M180,185 Q190,205 200,225" stroke="#dc2626" stroke-width="5" fill="none"/>
        `;
    } else if (w === 'baju') {
        illustration = `
            <polygon points="120,60 240,60 280,110 245,135 230,115 230,220 130,220 130,115 115,135 80,110" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
            <path d="M155,60 Q180,95 205,60 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
            <circle cx="180" cy="120" r="6" fill="#fbbf24"/>
            <circle cx="180" cy="155" r="6" fill="#fbbf24"/>
            <circle cx="180" cy="190" r="6" fill="#fbbf24"/>
        `;
    } else if (w === 'bas') {
        illustration = `
            <rect x="70" y="80" width="220" height="110" rx="18" fill="#0284c7" stroke="#0369a1" stroke-width="4"/>
            <rect x="70" y="145" width="220" height="16" fill="#facc15"/>
            <rect x="85" y="95" width="40" height="35" rx="6" fill="#bae6fd"/>
            <rect x="135" y="95" width="40" height="35" rx="6" fill="#bae6fd"/>
            <rect x="185" y="95" width="40" height="35" rx="6" fill="#bae6fd"/>
            <rect x="235" y="95" width="40" height="35" rx="6" fill="#bae6fd"/>
            <circle cx="120" cy="190" r="22" fill="#1e293b"/>
            <circle cx="120" cy="190" r="10" fill="#94a3b8"/>
            <circle cx="240" cy="190" r="22" fill="#1e293b"/>
            <circle cx="240" cy="190" r="10" fill="#94a3b8"/>
            <circle cx="76" cy="165" r="8" fill="#fef08a"/>
        `;
    } else if (w === 'ayam') {
        illustration = `
            <ellipse cx="180" cy="145" rx="60" ry="45" fill="#f59e0b"/>
            <circle cx="130" cy="105" r="30" fill="#f59e0b"/>
            <polygon points="105,105 85,115 105,125" fill="#f97316"/>
            <circle cx="125" cy="98" r="6" fill="#0f172a"/>
            <path d="M125,75 Q135,55 145,75 Q155,55 160,75" fill="#ef4444"/>
            <path d="M235,130 Q280,105 270,165 Q250,180 235,160" fill="#b45309"/>
            <line x1="160" y1="190" x2="155" y2="225" stroke="#d97706" stroke-width="5"/>
            <line x1="190" y1="190" x2="195" y2="225" stroke="#d97706" stroke-width="5"/>
        `;
    } else if (w === 'bintang') {
        illustration = `
            <polygon points="180,45 198,105 260,105 210,145 228,205 180,170 132,205 150,145 100,105 162,105" fill="#facc15" stroke="#eab308" stroke-width="4"/>
            <circle cx="180" cy="130" r="18" fill="#fef08a"/>
            <polygon points="90,65 96,80 110,80 98,90 102,105 90,95 78,105 82,90 70,80 84,80" fill="#ffffff" opacity="0.8"/>
            <polygon points="270,165 275,178 290,178 278,188 282,200 270,192 258,200 262,188 250,178 265,178" fill="#ffffff" opacity="0.8"/>
        `;
    } else if (w === 'bunga') {
        illustration = `
            <path d="M180,140 Q170,190 180,230" stroke="#16a34a" stroke-width="8" fill="none"/>
            <ellipse cx="145" cy="180" rx="25" ry="12" fill="#22c55e" transform="rotate(-30 145 180)"/>
            <ellipse cx="215" cy="195" rx="25" ry="12" fill="#22c55e" transform="rotate(30 215 195)"/>
            <circle cx="145" cy="115" r="28" fill="#f43f5e"/>
            <circle cx="215" cy="115" r="28" fill="#f43f5e"/>
            <circle cx="180" cy="80" r="28" fill="#f43f5e"/>
            <circle cx="155" cy="145" r="28" fill="#f43f5e"/>
            <circle cx="205" cy="145" r="28" fill="#f43f5e"/>
            <circle cx="180" cy="120" r="25" fill="#fbbf24"/>
        `;
    } else if (w === 'kuda') {
        illustration = `
            <ellipse cx="170" cy="140" rx="70" ry="40" fill="#78350f"/>
            <path d="M120,130 L90,70 L120,65 L150,110 Z" fill="#78350f"/>
            <polygon points="85,65 75,40 100,55" fill="#78350f"/>
            <circle cx="100" cy="65" r="5" fill="#fde68a"/>
            <path d="M125,65 Q140,85 145,115" stroke="#451a03" stroke-width="8" fill="none"/>
            <path d="M230,120 Q265,130 260,175" stroke="#451a03" stroke-width="8" fill="none"/>
            <line x1="120" y1="170" x2="115" y2="230" stroke="#78350f" stroke-width="8"/>
            <line x1="145" y1="170" x2="140" y2="230" stroke="#78350f" stroke-width="8"/>
            <line x1="205" y1="170" x2="210" y2="230" stroke="#78350f" stroke-width="8"/>
            <line x1="225" y1="170" x2="230" y2="230" stroke="#78350f" stroke-width="8"/>
        `;
    } else if (w === 'cawan') {
        illustration = `
            <path d="M110,100 L125,185 Q180,200 235,185 L250,100 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
            <path d="M245,115 Q285,115 280,150 Q275,180 235,175" fill="none" stroke="#ffffff" stroke-width="10"/>
            <ellipse cx="180" cy="205" rx="85" ry="14" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
            <path d="M150,85 Q140,65 155,45" stroke="#e2e8f0" stroke-width="4" fill="none"/>
            <path d="M180,85 Q195,65 185,45" stroke="#e2e8f0" stroke-width="4" fill="none"/>
            <path d="M210,85 Q200,65 215,45" stroke="#e2e8f0" stroke-width="4" fill="none"/>
        `;
    } else if (w === 'emas') {
        illustration = `
            <polygon points="100,165 140,115 260,115 220,165" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
            <polygon points="140,115 260,115 240,85 120,85" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
            <polygon points="260,115 240,85 200,85 220,165" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
            <polygon points="130,210 170,160 290,160 250,210" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
            <polygon points="170,160 290,160 270,130 150,130" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
            <circle cx="190" cy="100" r="14" fill="#ffffff" opacity="0.75"/>
            <circle cx="230" cy="145" r="12" fill="#ffffff" opacity="0.75"/>
        `;
    } else if (w === 'lampu') {
        illustration = `
            <ellipse cx="180" cy="215" rx="55" ry="15" fill="#b8860b"/>
            <path d="M180,210 L180,105" stroke="#b8860b" stroke-width="12"/>
            <path d="M125,115 Q180,75 235,115 Z" fill="#166534" stroke="#14532d" stroke-width="3"/>
            <circle cx="180" cy="122" r="14" fill="#fef08a" opacity="0.9"/>
            <path d="M100,230 L260,230 L230,125 L130,125 Z" fill="#fef08a" opacity="0.15"/>
        `;
    } else if (w === 'hutan' || w === 'pokok') {
        illustration = `
            <polygon points="180,50 140,110 160,110 125,165 235,165 200,110 220,110" fill="#15803d"/>
            <polygon points="115,90 85,135 100,135 70,185 160,185 130,135 145,135" fill="#166534"/>
            <polygon points="245,90 215,135 230,135 200,185 290,185 260,135 275,135" fill="#166534"/>
            <rect x="170" y="165" width="20" height="55" fill="#78350f"/>
        `;
    } else {
        // High quality artistic still life / landscape painting
        illustration = `
            <circle cx="180" cy="130" r="65" fill="${themeColor}" opacity="0.85"/>
            <path d="M70,195 Q180,110 290,195 L290,225 L70,225 Z" fill="#0f172a" opacity="0.3"/>
            <circle cx="230" cy="85" r="22" fill="#fbbf24" opacity="0.9"/>
            <polygon points="180,75 190,105 220,105 195,125 205,155 180,135 155,155 165,125 140,105 170,105" fill="#ffffff" opacity="0.8"/>
        `;
    }

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='360' height='260' viewBox='0 0 360 260'>
        <!-- Ornate Museum Gold & Wood Picture Frame -->
        <rect x='4' y='4' width='352' height='252' rx='18' fill='#3e1a07' stroke='#fbbf24' stroke-width='8'/>
        <rect x='16' y='16' width='328' height='228' rx='10' fill='#0f172a' stroke='#b8860b' stroke-width='3'/>
        <!-- Fine Museum Linen Canvas Background -->
        <rect x='24' y='24' width='312' height='212' rx='6' fill='#1e293b'/>
        <rect x='24' y='24' width='312' height='212' rx='6' fill='${themeColor}' opacity='0.28'/>
        <!-- Pure Art Illustration -->
        ${illustration}
    </svg>`);
}

function generateAtlantaBadgeSvg(studentName: string) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, 512, 96);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const grad = ctx.createLinearGradient(0, 20, 0, 76);
            grad.addColorStop(0, '#fef9c3');
            grad.addColorStop(1, '#fbbf24');

            ctx.font = `900 42px 'AtlantaRounded', 'Arial Rounded MT Bold', sans-serif`;
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.strokeText(studentName, 256, 50);
            ctx.fillStyle = grad;
            ctx.fillText(studentName, 256, 50);

            return canvas.toDataURL('image/png');
        }
    } catch (e) {}

    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='512' height='96'>
        <text x='256' y='55' font-family='sans-serif' font-size='40' font-weight='900' fill='#fbbf24' stroke='#78350f' stroke-width='2' text-anchor='middle'>${studentName}</text>
    </svg>`);
}

function generateCreamWallTexture() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Exact Warm Royal Museum Cream Base (#fef3c7) - Identical to 3D Bunyi Kata
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, 256, 256);

        // Very subtle micro-fine plaster grain (clean & uniform, no harsh dark patches)
        const imgData = ctx.getImageData(0, 0, 256, 256);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 8; // gentle smooth grain
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
        }
        ctx.putImageData(imgData, 0, 0);

        // Soft seamless warm light gleams (only delicate white highlights, NO dirty brown splotches)
        for (let j = 0; j < 16; j++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const r = 30 + Math.random() * 50;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Extremely subtle vertical architectural texture striations
        ctx.strokeStyle = 'rgba(254, 243, 199, 0.4)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 256; x += 16) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 256);
            ctx.stroke();
        }

        return canvas.toDataURL('image/jpeg', 0.92);
    } catch (e) {
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
            <rect width='120' height='120' fill='#fef3c7'/>
        </svg>`);
    }
}

// Floor Tile Pattern
const floorSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>
    <rect width='100' height='100' fill='#1a202c'/>
    <rect width='46' height='46' x='2' y='2' fill='#2d3748' stroke='#4a5568' stroke-width='2.5' rx='3'/>
    <rect width='46' height='46' x='52' y='52' fill='#2d3748' stroke='#4a5568' stroke-width='2.5' rx='3'/>
    <rect width='46' height='46' x='52' y='2' fill='#242c3d' stroke='#4a5568' stroke-width='2.5' rx='3'/>
    <rect width='46' height='46' x='2' y='52' fill='#242c3d' stroke='#4a5568' stroke-width='2.5' rx='3'/>
</svg>`);

// Ceiling Coffered Tile Pattern
const ceilingSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
    <rect width='160' height='160' fill='#fef9c3'/>
    <rect width='152' height='152' x='4' y='4' fill='#fefce8' stroke='#fde047' stroke-width='2.5' rx='6'/>
    <rect width='132' height='132' x='14' y='14' fill='#fffbeb' stroke='#eab308' stroke-width='1.5' stroke-dasharray='4 2' rx='4'/>
    <polygon points='80,30 130,80 80,130 30,80' fill='#fef3c7' stroke='#f59e0b' stroke-width='1.5'/>
    <circle cx='80' cy='80' r='14' fill='#fde047' stroke='#d97706' stroke-width='1.5'/>
    <circle cx='80' cy='80' r='5' fill='#b45309'/>
    <circle cx='24' cy='24' r='4' fill='#eab308'/>
    <circle cx='136' cy='24' r='4' fill='#eab308'/>
    <circle cx='24' cy='136' r='4' fill='#eab308'/>
    <circle cx='136' cy='136' r='4' fill='#eab308'/>
</svg>`);

function makeBuildingTextureSvg(baseColor: string, windowColor: string, isLit = true) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='240'>
        <rect width='160' height='240' fill='${baseColor}'/>
        <rect y='38' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        <rect y='78' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        <rect y='118' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        <rect y='158' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        <rect y='198' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        <rect y='238' width='160' height='4' fill='#0f172a' opacity='0.7'/>
        ${[4, 44, 84, 124, 164, 204].map(y => `
            <rect x='10' y='${y}' width='36' height='28' rx='2' fill='${isLit ? '#fef08a' : windowColor}' stroke='#334155' stroke-width='2'/>
            <rect x='62' y='${y}' width='36' height='28' rx='2' fill='${windowColor}' stroke='#334155' stroke-width='2'/>
            <rect x='114' y='${y}' width='36' height='28' rx='2' fill='${isLit ? '#38bdf8' : windowColor}' stroke='#334155' stroke-width='2'/>
        `).join('')}
    </svg>`);
}

function makeLibrarySideWallSvg() {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
        <rect width='240' height='240' fill='#fef3c7'/>
        <line x1='0' y1='60' x2='240' y2='60' stroke='#d4a574' stroke-width='2'/>
        <line x1='0' y1='120' x2='240' y2='120' stroke='#d4a574' stroke-width='2'/>
        <line x1='0' y1='180' x2='240' y2='180' stroke='#d4a574' stroke-width='2'/>
        <line x1='120' y1='0' x2='120' y2='60' stroke='#d4a574' stroke-width='2'/>
        <line x1='60' y1='60' x2='60' y2='120' stroke='#d4a574' stroke-width='2'/>
        <line x1='180' y1='60' x2='180' y2='120' stroke='#d4a574' stroke-width='2'/>
        <line x1='120' y1='120' x2='120' y2='180' stroke='#d4a574' stroke-width='2'/>
        <line x1='60' y1='180' x2='60' y2='240' stroke='#d4a574' stroke-width='2'/>
        <line x1='180' y1='180' x2='180' y2='240' stroke='#d4a574' stroke-width='2'/>
        <rect x='60' y='65' width='120' height='130' rx='12' fill='#0284c7' opacity='0.75' stroke='#b8860b' stroke-width='5'/>
        <path d='M60,85 Q120,20 180,85' fill='#0284c7' stroke='#b8860b' stroke-width='5'/>
        <line x1='120' y1='38' x2='120' y2='195' stroke='#b8860b' stroke-width='3'/>
        <line x1='60' y1='130' x2='180' y2='130' stroke='#b8860b' stroke-width='3'/>
    </svg>`);
}

function makeVrHeaderSvg(title: string, textColor: string, bgColor: string, width = 720, height = 130) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        ${ATLANTA_ROUNDED_SVG_STYLE}
        <rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="${bgColor}" rx="20" stroke="#fbbf24" stroke-width="4"/>
        <text x="50%" y="54%" font-family="AtlantaRounded, AtlantaRoundedBlack, sans-serif" font-weight="900" font-size="34px" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">${title.toUpperCase()}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// -------------------------------------------------------------
// 3D ARCHITECTURAL BUILDERS
// -------------------------------------------------------------
function vrGrandArchway(px: number, py: number, pz: number, rotY: number, title: string, bannerColor: string) {
    const bannerSvg = makeVrHeaderSvg(title, '#ffffff', bannerColor || '#1e293b', 720, 140);
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <!-- Left Pillar -->
        <a-cylinder position="-3.8 3.8 0" radius="0.45" height="7.6" color="#fef3c7" material="roughness: 0.3;"></a-cylinder>
        <a-box position="-3.8 0.15 0" width="1.2" height="0.3" depth="1.2" color="#b8860b"></a-box>
        <a-box position="-3.8 7.45 0" width="1.2" height="0.3" depth="1.2" color="#b8860b"></a-box>
        <!-- Right Pillar -->
        <a-cylinder position="3.8 3.8 0" radius="0.45" height="7.6" color="#fef3c7" material="roughness: 0.3;"></a-cylinder>
        <a-box position="3.8 0.15 0" width="1.2" height="0.3" depth="1.2" color="#b8860b"></a-box>
        <a-box position="3.8 7.45 0" width="1.2" height="0.3" depth="1.2" color="#b8860b"></a-box>
        <!-- Overhead Arch Beam -->
        <a-box position="0 6.6 0" width="8.8" height="1.4" depth="0.75" color="#d97706"></a-box>
        <a-box position="0 7.4 0" width="9.2" height="0.3" depth="0.95" color="#b8860b"></a-box>
        <!-- Grand Banner Plaque Front & Back -->
        <a-plane position="0 6.6 0.40" width="7.2" height="1.2" material="src: url(${bannerSvg}); transparent: true;"></a-plane>
        <a-plane position="0 6.6 -0.40" rotation="0 180 0" width="7.2" height="1.2" material="src: url(${bannerSvg}); transparent: true;"></a-plane>
    </a-entity>`;
}

function vrGrandChandelier(px: number, py: number, pz: number) {
    return `<a-entity position="${px} ${py} ${pz}">
        <a-cylinder position="0 0.4 0" radius="0.04" height="0.8" color="#b8860b"></a-cylinder>
        <a-cylinder position="0 0.78 0" radius="0.3" height="0.08" color="#d97706"></a-cylinder>
        <a-cylinder position="0 0 0" radius="1.05" height="0.14" color="#b8860b" material="roughness: 0.2; metalness: 0.8;"></a-cylinder>
        <a-ring rotation="-90 0 0" position="0 0.08 0" radius-inner="0.75" radius-outer="1.05" color="#fbbf24"></a-ring>
        <a-octahedron position="0 -0.25 0" radius="0.38" color="#fef08a" material="emissive: #fef08a; emissiveIntensity: 0.85; opacity: 0.95; transparent: true;" animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"></a-octahedron>
        ${[0, 60, 120, 180, 240, 300].map(deg => {
            const rad = deg * Math.PI / 180;
            const lx = Math.cos(rad) * 0.92;
            const lz = Math.sin(rad) * 0.92;
            return `
                <a-cylinder position="${lx} 0 ${lz}" radius="0.035" height="0.24" color="#d97706"></a-cylinder>
                <a-cylinder position="${lx} 0.18 ${lz}" radius="0.1" height="0.18" color="#ffffff" material="emissive: #fffbeb; emissiveIntensity: 0.9; opacity: 0.95; transparent: true;"></a-cylinder>
                <a-sphere position="${lx} 0.32 ${lz}" radius="0.07" color="#f59e0b" material="emissive: #fbbf24; emissiveIntensity: 1;"></a-sphere>
            `;
        }).join('')}
        <a-light type="point" color="#fef08a" intensity="0.5" distance="18" position="0 -0.5 0"></a-light>
    </a-entity>`;
}

function vrGrandFlowerUrn(px: number, py: number, pz: number) {
    return `<a-entity position="${px} ${py} ${pz}">
        <a-cylinder position="0 0.12 0" radius="0.48" height="0.24" color="#b8860b"></a-cylinder>
        <a-cylinder position="0 0.52 0" radius="0.38" height="0.65" color="#78350f"></a-cylinder>
        <a-torus position="0 0.82 0" rotation="90 0 0" radius="0.42" radius-tubular="0.05" color="#b8860b"></a-torus>
        <a-sphere position="0 1.45 0" radius="0.7" color="#166534"></a-sphere>
        <a-sphere position="0.25 1.85 0.18" radius="0.42" color="#22c55e"></a-sphere>
        <a-sphere position="-0.25 1.8 -0.18" radius="0.38" color="#15803d"></a-sphere>
        <a-sphere position="0.18 1.65 -0.25" radius="0.2" color="#f43f5e"></a-sphere>
        <a-sphere position="-0.18 1.72 0.25" radius="0.2" color="#eab308"></a-sphere>
        <a-sphere position="0 1.95 0" radius="0.22" color="#a855f7"></a-sphere>
    </a-entity>`;
}

function vrMuseumBench(px: number, py: number, pz: number, rotY: number) {
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <a-box position="0 0.22 0" width="2.6" height="0.12" depth="0.85" color="#5c2d16"></a-box>
        <a-cylinder position="-1.15 0.11 -0.32" radius="0.05" height="0.22" color="#b8860b"></a-cylinder>
        <a-cylinder position="1.15 0.11 -0.32" radius="0.05" height="0.22" color="#b8860b"></a-cylinder>
        <a-cylinder position="-1.15 0.11 0.32" radius="0.05" height="0.22" color="#b8860b"></a-cylinder>
        <a-cylinder position="1.15 0.11 0.32" radius="0.05" height="0.22" color="#b8860b"></a-cylinder>
        <a-box position="0 0.38 0" width="2.5" height="0.2" depth="0.76" color="#991b1b"></a-box>
        <a-box position="0 0.49 0" width="2.4" height="0.04" depth="0.68" color="#b91c1c"></a-box>
        <a-box position="0 0.28 0" width="2.54" height="0.03" depth="0.78" color="#fbbf24"></a-box>
    </a-entity>`;
}

function vrGrandBookshelf(px: number, py: number, pz: number, rotY: number) {
    const colors1 = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed', '#0284c7', '#e11d48', '#059669', '#ea580c'];
    const heights1 = [0.55, 0.62, 0.58, 0.65, 0.52, 0.64, 0.60, 0.56, 0.62];
    const books = [-0.95, -0.72, -0.48, -0.24, 0.0, 0.24, 0.48, 0.72, 0.95].map((bx, idx) => `
        <a-box position="${bx} ${0.83 + heights1[idx]/2} 0.02" width="0.16" height="${heights1[idx]}" depth="0.32" color="${colors1[idx]}"></a-box>
        <a-box position="${bx} ${0.83 + heights1[idx]/2} 0.17" width="0.14" height="${heights1[idx] - 0.04}" depth="0.03" color="#fef9c3"></a-box>
    `).join('');

    const colors2 = ['#0284c7', '#ea580c', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#059669'];
    const heights2 = [0.58, 0.64, 0.54, 0.66, 0.60, 0.55, 0.62, 0.58, 0.60];
    const books2 = [-0.9, -0.68, -0.45, -0.22, 0.02, 0.25, 0.48, 0.72, 0.92].map((bx, idx) => `
        <a-box position="${bx} ${1.68 + heights2[idx]/2} 0.02" width="0.16" height="${heights2[idx]}" depth="0.32" color="${colors2[idx]}"></a-box>
        <a-box position="${bx} ${1.68 + heights2[idx]/2} 0.17" width="0.14" height="${heights2[idx] - 0.04}" depth="0.03" color="#fef9c3"></a-box>
    `).join('');

    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <a-box position="0 1.8 -0.22" width="2.4" height="3.4" depth="0.06" color="#3e1a07"></a-box>
        <a-box position="-1.2 1.8 0" width="0.08" height="3.4" depth="0.5" color="#5c2d16"></a-box>
        <a-box position="1.2 1.8 0" width="0.08" height="3.4" depth="0.5" color="#5c2d16"></a-box>
        <a-box position="0 0.1 0" width="2.48" height="0.2" depth="0.52" color="#3e1a07"></a-box>
        <a-box position="0 3.52 0" width="2.55" height="0.14" depth="0.56" color="#b8860b"></a-box>
        <a-box position="0 0.8 0" width="2.32" height="0.06" depth="0.46" color="#78350f"></a-box>
        ${books}
        <a-box position="0 1.65 0" width="2.32" height="0.06" depth="0.46" color="#78350f"></a-box>
        ${books2}
        <a-box position="0 2.5 0" width="2.32" height="0.06" depth="0.46" color="#78350f"></a-box>
        <a-cylinder position="0 2.65 0.02" radius="0.12" height="0.18" color="#b8860b"></a-cylinder>
        <a-octahedron position="0 2.86 0.02" radius="0.14" color="#fbbf24" material="metalness: 0.85; roughness: 0.15; emissive: #fbbf24; emissiveIntensity: 0.35;"></a-octahedron>
    </a-entity>`;
}

function makeSukuKataPlaqueSvg(word: string, themeColor: string) {
    const cleanWord = (word || '').toLowerCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120">
        <defs>
            ${ATLANTA_ROUNDED_SVG_STYLE}
            <linearGradient id="plaqGrad_${cleanWord.replace(/[^a-zA-Z0-9]/g, '_')}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${themeColor || '#0284c7'}"/>
                <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <filter id="pShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
        </defs>
        <!-- Gold outer border & backing -->
        <rect x="4" y="4" width="452" height="112" rx="26" fill="#fbbf24" stroke="#b8860b" stroke-width="4"/>
        <!-- Room theme color inner badge -->
        <rect x="10" y="10" width="440" height="100" rx="22" fill="url(#plaqGrad_${cleanWord.replace(/[^a-zA-Z0-9]/g, '_')})" stroke="#fef08a" stroke-width="2.5" filter="url(#pShadow)"/>
        <!-- Suku Kata in lowercase Atlanta Rounded font -->
        <text x="50%" y="62%" font-family="AtlantaRounded, AtlantaRoundedBlack, sans-serif" font-weight="900" font-size="52px" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="1.5px">
            ${cleanWord}
        </text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function vrPottedPlant(px: number, py: number, pz: number) {
    return `<a-entity position="${px} ${py} ${pz}">
        <a-cylinder position="0 0.1 0" radius="0.42" height="0.2" color="#b8860b"></a-cylinder>
        <a-cylinder position="0 0.45 0" radius="0.34" height="0.55" color="#78350f"></a-cylinder>
        <a-torus position="0 0.7 0" rotation="90 0 0" radius="0.36" radius-tubular="0.04" color="#b8860b"></a-torus>
        <a-sphere position="0 1.25 0" radius="0.6" color="#166534"></a-sphere>
        <a-sphere position="0.2 1.6 0.15" radius="0.35" color="#22c55e"></a-sphere>
        <a-sphere position="-0.2 1.55 -0.15" radius="0.32" color="#15803d"></a-sphere>
        <a-sphere position="0.15 1.45 -0.2" radius="0.16" color="#f43f5e"></a-sphere>
        <a-sphere position="-0.15 1.5 0.2" radius="0.16" color="#eab308"></a-sphere>
        <a-sphere position="0 1.7 0" radius="0.18" color="#a855f7"></a-sphere>
    </a-entity>`;
}

function vrWallSconce(px: number, py: number, pz: number, rotY: number) {
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <a-box position="0 0 0.05" width="0.18" height="0.32" depth="0.04" color="#b8860b"></a-box>
        <a-cylinder position="0 0 0.16" rotation="90 0 0" radius="0.025" height="0.2" color="#d97706"></a-cylinder>
        <a-cylinder position="0 0.12 0.22" radius="0.08" height="0.14" color="#fef08a" material="opacity: 0.9; transparent: true; emissive: #fef08a; emissiveIntensity: 0.6;"></a-cylinder>
        <a-sphere position="0 0.2 0.22" radius="0.05" color="#fbbf24" material="emissive: #fbbf24; emissiveIntensity: 0.8;"></a-sphere>
    </a-entity>`;
}

function vrLibraryCounter(px: number, py: number, pz: number, rotY: number) {
    const signSvg = makeVrHeaderSvg('KAUNTER PERPUSTAKAAN', '#fbbf24', '#0f172a', 650, 110);
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <!-- Main Reception Desk Structure (Rich Mahogany & Polished Gold) -->
        <!-- Front Main Counter Body -->
        <a-box position="0 0.55 0.85" width="4.6" height="1.1" depth="0.5" color="#5c2d16" material="roughness: 0.4;"></a-box>
        <!-- Gold Moulding Base & Trim on Front -->
        <a-box position="0 0.08 0.87" width="4.65" height="0.16" depth="0.52" color="#b8860b"></a-box>
        <a-box position="0 1.05 0.87" width="4.65" height="0.08" depth="0.52" color="#b8860b"></a-box>
        <!-- Left Return Wing -->
        <a-box position="-2.05 0.55 0.1" width="0.5" height="1.1" depth="1.5" color="#5c2d16" material="roughness: 0.4;"></a-box>
        <a-box position="-2.05 0.08 0.1" width="0.52" height="0.16" depth="1.55" color="#b8860b"></a-box>
        <a-box position="-2.05 1.05 0.1" width="0.52" height="0.08" depth="1.55" color="#b8860b"></a-box>
        <!-- Right Return Wing -->
        <a-box position="2.05 0.55 0.1" width="0.5" height="1.1" depth="1.5" color="#5c2d16" material="roughness: 0.4;"></a-box>
        <a-box position="2.05 0.08 0.1" width="0.52" height="0.16" depth="1.55" color="#b8860b"></a-box>
        <a-box position="2.05 1.05 0.1" width="0.52" height="0.08" depth="1.55" color="#b8860b"></a-box>

        <!-- Polished Marble Counter Top (Front & Wings) -->
        <a-box position="0 1.14 0.85" width="4.8" height="0.08" depth="0.7" color="#fef9c3" material="roughness: 0.2; metalness: 0.1;"></a-box>
        <a-box position="-2.05 1.14 0.1" width="0.7" height="0.08" depth="1.6" color="#fef9c3" material="roughness: 0.2; metalness: 0.1;"></a-box>
        <a-box position="2.05 1.14 0.1" width="0.7" height="0.08" depth="1.6" color="#fef9c3" material="roughness: 0.2; metalness: 0.1;"></a-box>

        <!-- Front Sign Plaque MOUNTED DIRECTLY onto Front Mahogany Face -->
        <a-box position="0 0.62 1.11" width="3.24" height="0.64" depth="0.02" color="#b8860b"></a-box>
        <a-plane position="0 0.62 1.13" width="3.2" height="0.6" material="src: url(${signSvg}); transparent: true;"></a-plane>

        <!-- Desk Top Accessories (Placed on marble counter surface y = 1.18, z = 0.85) -->
        <!-- 1. Modern Computer Terminal facing Librarian -->
        <a-box position="0 1.19 0.85" width="0.28" height="0.02" depth="0.25" color="#334155"></a-box>
        <a-cylinder position="0 1.28 0.85" radius="0.03" height="0.18" color="#475569"></a-cylinder>
        <a-box position="0 1.48 0.85" width="0.8" height="0.5" depth="0.04" color="#0f172a"></a-box>
        <a-plane position="0 1.48 0.82" rotation="0 180 0" width="0.75" height="0.45" color="#38bdf8" material="emissive: #38bdf8; emissiveIntensity: 0.4;"></a-plane>
        <a-box position="0 1.19 0.6" width="0.48" height="0.015" depth="0.16" color="#1e293b"></a-box>
        <a-box position="0.32 1.19 0.6" width="0.08" height="0.015" depth="0.12" color="#1e293b"></a-box>

        <!-- 2. Classic Banker's Brass Lamp -->
        <a-cylinder position="-1.4 1.25 0.85" radius="0.06" height="0.14" color="#b8860b"></a-cylinder>
        <a-cylinder position="-1.4 1.38 0.85" rotation="0 0 90" radius="0.08" height="0.3" color="#166534" material="emissive: #10b981; emissiveIntensity: 0.5;"></a-cylinder>
        <a-light type="point" color="#fef08a" intensity="0.5" distance="5" position="-1.4 1.35 0.85"></a-light>

        <!-- 3. Neat Stacks of Library Books with Bookmarks -->
        <a-box position="1.3 1.22 0.85" width="0.44" height="0.08" depth="0.32" color="#dc2626"></a-box>
        <a-box position="1.3 1.29 0.85" width="0.40" height="0.07" depth="0.30" color="#0284c7"></a-box>
        <a-box position="1.3 1.35 0.85" width="0.36" height="0.06" depth="0.28" color="#f59e0b"></a-box>

        <!-- 4. Counter Service Bell -->
        <a-cylinder position="-0.75 1.19 0.85" radius="0.07" height="0.02" color="#1e293b"></a-cylinder>
        <a-sphere position="-0.75 1.22 0.85" radius="0.05" color="#fbbf24" material="metalness: 0.9; roughness: 0.1;"></a-sphere>

        <!-- 5. Guest Register Book & Pen Stand -->
        <a-box position="0.75 1.19 0.85" rotation="0 -10 0" width="0.36" height="0.02" depth="0.26" color="#fef9c3"></a-box>
        <a-cylinder position="0.98 1.23 0.85" rotation="15 0 10" radius="0.008" height="0.16" color="#b8860b"></a-cylinder>

        <!-- 6. Friendly Librarian NPC standing comfortably behind counter at z = -0.1 -->
        <a-entity position="0 0 -0.1" rotation="0 0 0">
            <!-- Legs & Trousers -->
            <a-cylinder position="-0.14 0.5 0" radius="0.08" height="1.0" color="#1e293b"></a-cylinder>
            <a-cylinder position="0.14 0.5 0" radius="0.08" height="1.0" color="#1e293b"></a-cylinder>
            <a-box position="-0.14 0.05 0.04" width="0.14" height="0.1" depth="0.22" color="#0f172a"></a-box>
            <a-box position="0.14 0.05 0.04" width="0.14" height="0.1" depth="0.22" color="#0f172a"></a-box>

            <!-- Torso & Librarian Royal Blue Vest -->
            <a-box position="0 1.35 0" width="0.52" height="0.65" depth="0.26" color="#1e3a8a"></a-box>
            <!-- White Shirt Collar & Gold Tie -->
            <a-box position="0 1.58 0.13" width="0.18" height="0.14" depth="0.02" color="#ffffff"></a-box>
            <a-box position="0 1.44 0.14" width="0.08" height="0.22" depth="0.02" color="#f59e0b"></a-box>
            <!-- Pustakawan ID Badge -->
            <a-box position="0.16 1.48 0.14" width="0.10" height="0.06" depth="0.01" color="#fef08a"></a-box>
            <!-- Head & Friendly Face -->
            <a-sphere position="0 1.86 0" radius="0.22" color="#fde0b0"></a-sphere>
            <!-- Hair -->
            <a-sphere position="0 1.94 -0.02" radius="0.22" color="#3b1f0a" theta-start="0" theta-length="110"></a-sphere>
            <!-- Glasses -->
            <a-torus position="-0.07 1.88 0.20" radius="0.04" radius-tubular="0.005" color="#b8860b"></a-torus>
            <a-torus position="0.07 1.88 0.20" radius="0.04" radius-tubular="0.005" color="#b8860b"></a-torus>
            <a-cylinder position="0 1.88 0.20" rotation="0 0 90" radius="0.004" height="0.06" color="#b8860b"></a-cylinder>
            <!-- Eyes & Smile -->
            <a-sphere position="-0.07 1.88 0.20" radius="0.02" color="#1e293b"></a-sphere>
            <a-sphere position="0.07 1.88 0.20" radius="0.02" color="#1e293b"></a-sphere>
            <a-torus position="0 1.78 0.19" rotation="10 0 0" radius="0.035" radius-tubular="0.006" theta-start="200" theta-length="140" color="#dc2626"></a-torus>
            <!-- Librarian Songkok / Cap -->
            <a-cylinder position="0 2.06 0" radius="0.20" height="0.14" color="#0f172a"></a-cylinder>
            <a-cylinder position="0 2.00 0" radius="0.21" height="0.02" color="#fbbf24"></a-cylinder>
            <!-- Arms resting on counter -->
            <a-cylinder position="-0.32 1.35 0.35" rotation="45 -20 0" radius="0.06" height="0.44" color="#1e3a8a"></a-cylinder>
            <a-sphere position="-0.26 1.18 0.65" radius="0.05" color="#fde0b0"></a-sphere>
            <a-cylinder position="0.32 1.35 0.35" rotation="45 20 0" radius="0.06" height="0.44" color="#1e3a8a"></a-cylinder>
            <a-sphere position="0.26 1.18 0.65" radius="0.05" color="#fde0b0"></a-sphere>
        </a-entity>
    </a-entity>`;
}

function vrStudyTable(px: number, py: number, pz: number, rotY: number) {
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <a-box position="0 0.72 0" width="3.2" height="0.08" depth="1.5" color="#78350f"></a-box>
        <a-cylinder position="-1.45 0.36 -0.65" radius="0.05" height="0.72" color="#b8860b"></a-cylinder>
        <a-cylinder position="1.45 0.36 -0.65" radius="0.05" height="0.72" color="#b8860b"></a-cylinder>
        <a-cylinder position="-1.45 0.36 0.65" radius="0.05" height="0.72" color="#b8860b"></a-cylinder>
        <a-cylinder position="1.45 0.36 0.65" radius="0.05" height="0.72" color="#b8860b"></a-cylinder>
        <a-cylinder position="0 0.85 0" radius="0.03" height="0.22" color="#b8860b"></a-cylinder>
        <a-cylinder position="0 0.98 0" rotation="0 0 90" radius="0.08" height="0.3" color="#166534" material="emissive: #10b981; emissiveIntensity: 0.4;"></a-cylinder>
        <a-box position="-0.8 0.77 -0.1" rotation="0 15 0" width="0.4" height="0.02" depth="0.28" color="#fef9c3"></a-box>
        <a-box position="0.8 0.77 0.1" rotation="0 -20 0" width="0.4" height="0.02" depth="0.28" color="#fef9c3"></a-box>
        <a-box position="0 0.44 -1.0" width="0.75" height="0.06" depth="0.65" color="#5c2d16"></a-box>
        <a-box position="0 0.8 -1.3" width="0.75" height="0.7" depth="0.06" color="#5c2d16"></a-box>
        <a-box position="0 0.44 1.0" width="0.75" height="0.06" depth="0.65" color="#5c2d16"></a-box>
        <a-box position="0 0.8 1.3" width="0.75" height="0.7" depth="0.06" color="#5c2d16"></a-box>
    </a-entity>`;
}

function vr3DTransitBus(px: number, py: number, pz: number, rotY: number) {
    const destSvg = makeVrHeaderSvg('PERPUSTAKAAN KOTA', '#fbbf24', '#0f172a', 600, 100);
    return `<a-entity position="${px} ${py} ${pz}" rotation="0 ${rotY || 0} 0">
        <a-box position="0 1.6 0" width="2.6" height="2.4" depth="8.8" color="#0284c7" material="roughness: 0.2; metalness: 0.4;"></a-box>
        <a-box position="0 0.35 0" width="2.66" height="0.45" depth="9.0" color="#0f172a"></a-box>
        <a-box position="0 1.0 0" width="2.64" height="0.16" depth="8.85" color="#fbbf24"></a-box>
        <a-plane position="0 2.0 -4.42" rotation="0 180 0" width="2.4" height="1.3" color="#38bdf8" material="opacity: 0.85; transparent: true; metalness: 0.8;"></a-plane>
        <a-plane position="0 2.65 -4.42" rotation="0 180 0" width="2.0" height="0.38" material="src: url(${destSvg}); transparent: true;"></a-plane>
        <a-box position="0 0.7 -4.42" width="1.4" height="0.5" depth="0.05" color="#1e293b"></a-box>
        <a-sphere position="-1.0 0.7 -4.43" radius="0.14" color="#fef08a" material="emissive: #fef08a; emissiveIntensity: 0.8;"></a-sphere>
        <a-sphere position="1.0 0.7 -4.43" radius="0.14" color="#fef08a" material="emissive: #fef08a; emissiveIntensity: 0.8;"></a-sphere>
        <a-plane position="0 2.0 4.42" width="2.2" height="1.1" color="#1e293b" material="opacity: 0.9; transparent: true;"></a-plane>
        <a-box position="-1.0 0.7 4.42" width="0.22" height="0.35" depth="0.04" color="#ef4444" material="emissive: #ef4444; emissiveIntensity: 0.8;"></a-box>
        <a-box position="1.0 0.7 4.42" width="0.22" height="0.35" depth="0.04" color="#ef4444" material="emissive: #ef4444; emissiveIntensity: 0.8;"></a-box>
        ${[-2.6, -1.0, 0.6, 2.2].map(z => `
            <a-plane position="-1.31 2.0 ${z}" rotation="0 -90 0" width="1.3" height="1.1" color="#38bdf8" material="opacity: 0.82; transparent: true; metalness: 0.8;"></a-plane>
            <a-plane position="1.31 2.0 ${z}" rotation="0 90 0" width="1.3" height="1.1" color="#38bdf8" material="opacity: 0.82; transparent: true; metalness: 0.8;"></a-plane>
        `).join('')}
        <a-plane position="-1.32 1.3 -3.4" rotation="0 -90 0" width="1.0" height="2.1" color="#1e293b" material="opacity: 0.9; transparent: true;"></a-plane>
        <a-plane position="-1.32 1.3 0.0" rotation="0 -90 0" width="1.0" height="2.1" color="#1e293b" material="opacity: 0.9; transparent: true;"></a-plane>
        <a-cylinder position="-1.25 0.45 -2.6" rotation="0 0 90" radius="0.45" height="0.35" color="#0f172a"></a-cylinder>
        <a-cylinder position="-1.43 0.45 -2.6" rotation="0 0 90" radius="0.24" height="0.04" color="#cbd5e1"></a-cylinder>
        <a-cylinder position="1.25 0.45 -2.6" rotation="0 0 90" radius="0.45" height="0.35" color="#0f172a"></a-cylinder>
        <a-cylinder position="1.43 0.45 -2.6" rotation="0 0 90" radius="0.24" height="0.04" color="#cbd5e1"></a-cylinder>
        <a-cylinder position="-1.25 0.45 2.6" rotation="0 0 90" radius="0.45" height="0.35" color="#0f172a"></a-cylinder>
        <a-cylinder position="-1.43 0.45 2.6" rotation="0 0 90" radius="0.24" height="0.04" color="#cbd5e1"></a-cylinder>
        <a-cylinder position="1.25 0.45 2.6" rotation="0 0 90" radius="0.45" height="0.35" color="#0f172a"></a-cylinder>
        <a-cylinder position="1.43 0.45 2.6" rotation="0 0 90" radius="0.24" height="0.04" color="#cbd5e1"></a-cylinder>
        <a-box position="0 2.95 -1.0" width="1.4" height="0.3" depth="2.2" color="#e2e8f0"></a-box>
        <a-box position="0 2.95 2.0" width="1.4" height="0.3" depth="2.0" color="#e2e8f0"></a-box>
    </a-entity>`;
}

// Exact 3D Bunyi Kata Chibi Avatar Character
function build3DPlayerCharacterHTML(studentName: string, avatarSrc: string, nameBadgeSvg: string, initX = 0, initZ = 4.5, mode = 'exterior') {
    return `
        <a-entity id="vr-player-character" position="${initX} 0 ${initZ}" rotation="0 0 0" perpustakaan-player-controller="mode: ${mode}">
            <!-- Glowing Floor Shadow -->
            <a-circle position="0 0.04 0" rotation="-90 0 0" radius="0.55" color="#3b82f6" material="opacity: 0.28; transparent: true; emissive: #3b82f6; emissiveIntensity: 0.5;"
                animation="property: material.opacity; from: 0.20; to: 0.35; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine"></a-circle>
            <a-circle position="0 0.045 0" rotation="-90 0 0" radius="0.44" color="#000000" material="opacity: 0.36; transparent: true;"></a-circle>
            <a-circle position="0 0.048 0" rotation="-90 0 0" radius="0.26" color="#000000" material="opacity: 0.25; transparent: true;"></a-circle>

            <a-entity id="vr-player-body" position="0 0.86 0"
                animation="property: position; from: 0 0.86 0; to: 0 0.89 0; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine">

                <a-cylinder position="0 0 0" radius="0.29" height="0.58" color="#1e3a8a" material="metalness: 0.1; roughness: 0.7;"></a-cylinder>
                <a-cylinder position="0 0 0" radius="0.275" height="0.50" color="#172e73" material="opacity: 0.5; transparent: true;"></a-cylinder>
                <a-torus position="0 0.26 0" rotation="90 0 0" radius="0.24" radius-tubular="0.04" color="#152c6b" material="metalness: 0.1; roughness: 0.6;"></a-torus>
                <a-plane position="0 0.02 0.295" width="0.06" height="0.52" color="#fbbf24" material="metalness: 0.5; roughness: 0.3;"></a-plane>

                <a-sphere position="-0.06 0.14 0.295" radius="0.025" color="#fbbf24" material="metalness: 0.8; roughness: 0.2;"></a-sphere>
                <a-sphere position="-0.06 0.02 0.295" radius="0.025" color="#fbbf24" material="metalness: 0.8; roughness: 0.2;"></a-sphere>
                <a-sphere position="-0.06 -0.10 0.295" radius="0.025" color="#fbbf24" material="metalness: 0.8; roughness: 0.2;"></a-sphere>

                <a-cylinder position="-0.28 0.22 0" rotation="0 0 -75" radius="0.08" height="0.06" color="#1e40af" material="metalness: 0.15; roughness: 0.5;">
                    <a-torus position="0 0.035 0" rotation="90 0 0" radius="0.065" radius-tubular="0.012" color="#fbbf24" material="metalness: 0.7; roughness: 0.2;"></a-torus>
                </a-cylinder>
                <a-cylinder position="0.28 0.22 0" rotation="0 0 75" radius="0.08" height="0.06" color="#1e40af" material="metalness: 0.15; roughness: 0.5;">
                    <a-torus position="0 0.035 0" rotation="90 0 0" radius="0.065" radius-tubular="0.012" color="#fbbf24" material="metalness: 0.7; roughness: 0.2;"></a-torus>
                </a-cylinder>

                <a-plane position="-0.15 -0.10 0.295" width="0.12" height="0.10" color="#152c6b" material="metalness: 0.05; roughness: 0.8;">
                    <a-plane position="0 0.045 0.003" width="0.12" height="0.015" color="#fbbf24" material="metalness: 0.5; roughness: 0.3;"></a-plane>
                </a-plane>
                <a-plane position="0.15 -0.10 0.295" width="0.12" height="0.10" color="#152c6b" material="metalness: 0.05; roughness: 0.8;">
                    <a-plane position="0 0.045 0.003" width="0.12" height="0.015" color="#fbbf24" material="metalness: 0.5; roughness: 0.3;"></a-plane>
                </a-plane>

                <a-circle position="-0.12 0.10 0.296" radius="0.09" color="#fbbf24" material="metalness: 0.6; roughness: 0.3;"></a-circle>
                <a-plane position="-0.12 0.10 0.30" width="0.15" height="0.15" material="src: url(${avatarSrc}); transparent: true;"></a-plane>

                <a-cylinder position="0 -0.24 0" radius="0.295" height="0.08" color="#78350f" material="metalness: 0.1; roughness: 0.55;">
                    <a-box position="0 0 0.30" width="0.14" height="0.08" depth="0.025" color="#fbbf24" material="metalness: 0.8; roughness: 0.15;">
                        <a-box position="0 0 0.005" width="0.06" height="0.04" depth="0.01" color="#b8860b" material="metalness: 0.9; roughness: 0.1;"></a-box>
                    </a-box>
                </a-cylinder>

                <!-- Head & Face -->
                <a-sphere position="0 0.50 0" radius="0.285" color="#fde0b0" material="metalness: 0; roughness: 0.8;"></a-sphere>
                <a-sphere position="0 0.56 0.12" radius="0.10" color="#fde8c0" material="opacity: 0.35; transparent: true;"></a-sphere>

                <a-sphere position="0 0.58 -0.02" radius="0.27" theta-start="0" theta-length="110" color="#3b1f0a" material="metalness: 0.05; roughness: 0.75;"></a-sphere>
                <a-box position="-0.10 0.63 0.18" width="0.14" height="0.10" depth="0.12" color="#3b1f0a" material="metalness: 0.05; roughness: 0.75;" rotation="10 15 -5"></a-box>
                <a-box position="0.06 0.64 0.18" width="0.12" height="0.08" depth="0.10" color="#4a2810" material="metalness: 0.05; roughness: 0.75;" rotation="8 -10 5"></a-box>
                <a-box position="0.16 0.60 0.14" width="0.08" height="0.10" depth="0.10" color="#3b1f0a" material="metalness: 0.05; roughness: 0.75;" rotation="5 -20 8"></a-box>
                <a-box position="-0.24 0.50 0.04" width="0.08" height="0.15" depth="0.12" color="#3b1f0a" rotation="0 12 -10"></a-box>
                <a-box position="0.24 0.50 0.04" width="0.08" height="0.15" depth="0.12" color="#3b1f0a" rotation="0 -12 10"></a-box>
                <a-box position="0 0.48 -0.22" width="0.36" height="0.22" depth="0.10" color="#2d1808" rotation="-5 0 0"></a-box>

                <a-box position="-0.09 0.57 0.25" width="0.09" height="0.02" depth="0.02" color="#2d1808" rotation="0 0 5"></a-box>
                <a-box position="0.09 0.57 0.25" width="0.09" height="0.02" depth="0.02" color="#2d1808" rotation="0 0 -5"></a-box>

                <a-entity position="-0.09 0.51 0.245">
                    <a-sphere radius="0.048" color="#ffffff" material="metalness: 0; roughness: 1;"></a-sphere>
                    <a-sphere position="0 0 0.028" radius="0.034" color="#1e3a8a"></a-sphere>
                    <a-sphere position="0 0 0.042" radius="0.020" color="#0a0a0a"></a-sphere>
                    <a-sphere position="0.012 0.015 0.050" radius="0.012" color="#ffffff" material="emissive: #ffffff; emissiveIntensity: 0.4;"></a-sphere>
                    <a-sphere position="-0.008 -0.008 0.048" radius="0.006" color="#ffffff" material="emissive: #ffffff; emissiveIntensity: 0.3;"></a-sphere>
                </a-entity>
                <a-entity position="0.09 0.51 0.245">
                    <a-sphere radius="0.048" color="#ffffff" material="metalness: 0; roughness: 1;"></a-sphere>
                    <a-sphere position="0 0 0.028" radius="0.034" color="#1e3a8a"></a-sphere>
                    <a-sphere position="0 0 0.042" radius="0.020" color="#0a0a0a"></a-sphere>
                    <a-sphere position="0.012 0.015 0.050" radius="0.012" color="#ffffff" material="emissive: #ffffff; emissiveIntensity: 0.4;"></a-sphere>
                    <a-sphere position="-0.008 -0.008 0.048" radius="0.006" color="#ffffff" material="emissive: #ffffff; emissiveIntensity: 0.3;"></a-sphere>
                </a-entity>

                <a-sphere position="0 0.465 0.27" radius="0.018" color="#e8c4a0" material="metalness: 0; roughness: 0.9;"></a-sphere>
                <a-torus position="0 0.425 0.24" rotation="-5 0 0" radius="0.04" radius-tubular="0.007" theta-start="200" theta-length="140" color="#d4756b" material="metalness: 0; roughness: 0.8;"></a-torus>
                <a-circle position="-0.155 0.45 0.24" rotation="0 -28 0" radius="0.04" color="#fca5a5" material="opacity: 0.55; transparent: true;"></a-circle>
                <a-circle position="0.155 0.45 0.24" rotation="0 28 0" radius="0.04" color="#fca5a5" material="opacity: 0.55; transparent: true;"></a-circle>
                <a-sphere position="-0.265 0.49 0" radius="0.045" color="#fde0b0"></a-sphere>
                <a-sphere position="0.265 0.49 0" radius="0.045" color="#fde0b0"></a-sphere>

                <a-cylinder position="0 0.68 0" radius="0.40" height="0.035" color="#0f172a" material="metalness: 0.12; roughness: 0.6;"></a-cylinder>
                <a-torus position="0 0.685 0" rotation="90 0 0" radius="0.385" radius-tubular="0.014" color="#fbbf24" material="metalness: 0.7; roughness: 0.2;"></a-torus>
                <a-cone position="0 0.81 0" radius-bottom="0.34" radius-top="0.18" height="0.28" color="#0f172a" material="metalness: 0.1; roughness: 0.55;"></a-cone>
                <a-torus position="0 0.72 0" rotation="90 0 0" radius="0.335" radius-tubular="0.025" color="#991b1b" material="metalness: 0.05; roughness: 0.7;"></a-torus>
                <a-box position="0 0.76 0.30" width="0.10" height="0.10" depth="0.02" color="#fbbf24" rotation="0 0 45" material="metalness: 0.85; roughness: 0.12;">
                    <a-sphere position="0 0 0.008" radius="0.025" color="#b8860b" material="metalness: 0.9; roughness: 0.1;"></a-sphere>
                </a-box>
                <a-sphere position="0 0.96 0" radius="0.03" color="#fbbf24" material="metalness: 0.85; roughness: 0.15; emissive: #fbbf24; emissiveIntensity: 0.3;"></a-sphere>
            </a-entity>

            <a-entity id="perp-arm-left" position="-0.36 0.84 0">
                <a-cylinder position="0 0 0" radius="0.065" height="0.38" color="#1e3a8a" material="metalness: 0.1; roughness: 0.7;"></a-cylinder>
                <a-torus position="0 -0.15 0" rotation="90 0 0" radius="0.068" radius-tubular="0.012" color="#fbbf24" material="metalness: 0.65; roughness: 0.25;"></a-torus>
                <a-sphere position="0 -0.22 0" radius="0.058" color="#fde0b0" material="metalness: 0.85; roughness: 0.85;"></a-sphere>
                <a-sphere position="0.03 -0.22 0.03" radius="0.025" color="#fde0b0"></a-sphere>
            </a-entity>
            <a-entity id="perp-arm-right" position="0.36 0.84 0">
                <a-cylinder position="0 0 0" radius="0.065" height="0.38" color="#1e3a8a" material="metalness: 0.1; roughness: 0.7;"></a-cylinder>
                <a-torus position="0 -0.15 0" rotation="90 0 0" radius="0.068" radius-tubular="0.012" color="#fbbf24" material="metalness: 0.65; roughness: 0.25;"></a-torus>
                <a-sphere position="0 -0.22 0" radius="0.058" color="#fde0b0" material="metalness: 0.85; roughness: 0.85;"></a-sphere>
                <a-sphere position="-0.03 -0.22 0.03" radius="0.025" color="#fde0b0"></a-sphere>
            </a-entity>

            <a-entity id="perp-leg-left" position="-0.13 0.38 0">
                <a-cylinder position="0 0 0" radius="0.075" height="0.28" color="#334155" material="metalness: 0.05; roughness: 0.7;"></a-cylinder>
                <a-cylinder position="0 -0.15 0" radius="0.068" height="0.18" color="#2d3a4a" material="metalness: 0.05; roughness: 0.7;"></a-cylinder>
                <a-box position="0 -0.26 0.04" width="0.14" height="0.09" depth="0.20" color="#1a1a2e" material="metalness: 0.15; roughness: 0.5;">
                    <a-box position="0 -0.045 0.005" width="0.15" height="0.02" depth="0.21" color="#4a3728" material="metalness: 0.05; roughness: 0.8;"></a-box>
                    <a-plane position="0 0.02 0.101" width="0.07" height="0.04" color="#fbbf24" material="metalness: 0.5; roughness: 0.3;"></a-plane>
                </a-box>
            </a-entity>
            <a-entity id="perp-leg-right" position="0.13 0.38 0">
                <a-cylinder position="0 0 0" radius="0.075" height="0.28" color="#334155" material="metalness: 0.05; roughness: 0.7;"></a-cylinder>
                <a-cylinder position="0 -0.15 0" radius="0.068" height="0.18" color="#2d3a4a" material="metalness: 0.05; roughness: 0.7;"></a-cylinder>
                <a-box position="0 -0.26 0.04" width="0.14" height="0.09" depth="0.20" color="#1a1a2e" material="metalness: 0.15; roughness: 0.5;">
                    <a-box position="0 -0.045 0.005" width="0.15" height="0.02" depth="0.21" color="#4a3728" material="metalness: 0.05; roughness: 0.8;"></a-box>
                    <a-plane position="0 0.02 0.101" width="0.07" height="0.04" color="#fbbf24" material="metalness: 0.5; roughness: 0.3;"></a-plane>
                </a-box>
            </a-entity>

            <a-entity position="0 2.05 0"
                animation__float="property: position; from: 0 2.05 0; to: 0 2.10 0; dir: alternate; loop: true; dur: 2200; easing: easeInOutSine">
                <a-plane position="0 0 -0.01" width="1.6" height="0.26" color="#0f172a" material="opacity: 0.72; transparent: true; metalness: 0.1; roughness: 0.5;"></a-plane>
                <a-plane position="0 0 -0.015" width="1.66" height="0.30" color="#fbbf24" material="opacity: 0.35; transparent: true; emissive: #fbbf24; emissiveIntensity: 0.3;"></a-plane>
                <a-plane id="vr-name-badge-plane" position="0 0.01 0.001" width="1.4" height="0.24" material="src: url(${nameBadgeSvg}); transparent: true; alphaTest: 0.05;"></a-plane>
            </a-entity>
        </a-entity>
    `;
}

// =========================================================================
// REACT COMPONENT: 3D PERPUSTAKAAN (ASAS & HERO)
// =========================================================================
export const PerpustakaanGame: React.FC<PerpustakaanGameProps> = ({ onClose, isHeroMode = false }) => {
    const [phase, setPhase] = useState<'exterior' | 'interior'>('exterior');
    const [countdown, setCountdown] = useState<number | null>(null);
    const [countdownTarget, setCountdownTarget] = useState<'interior' | 'exterior'>('interior');
    const [activeShelfIdx, setActiveShelfIdx] = useState<number | null>(null);
    const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
    const [exploredShelves, setExploredShelves] = useState<number[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
    const isAutoPlayingRef = useRef<boolean>(false);
    const [showCelebration, setShowCelebration] = useState<boolean>(false);
    const [showVRGuideModal, setShowVRGuideModal] = useState<boolean>(true); // Shows initially like 3D Bunyi Kata!

    const sceneContainerRef = useRef<HTMLDivElement>(null);
    const joystickBaseRef = useRef<HTMLDivElement>(null);
    const joystickKnobRef = useRef<HTMLDivElement>(null);
    const entranceLockedRef = useRef<boolean>(false);

    const shelves = isHeroMode ? HERO_SHELVES : ASAS_SHELVES;
    const modeTitle = isHeroMode ? '3D PERPUSTAKAAN HERO' : '3D PERPUSTAKAAN ASAS';

    // Synchronize global phase for A-Frame and close modals on phase switch
    useEffect(() => {
        (window as any).perpCurrentPhase = phase;
        setActiveShelfIdx(null);
        const char = document.getElementById('vr-player-character');
        if (char && (char as any).components && (char as any).components['perpustakaan-player-controller']) {
            (char as any).components['perpustakaan-player-controller'].shelfCooldown = 5.0;
        }
    }, [phase]);

    // Synthesized Sound Effects
    const playSynthesizedSound = (type: 'portal' | 'chime' | 'tick' | 'victory') => {
        try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            if (type === 'tick') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.1);
            } else if (type === 'portal') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.5);
            } else if (type === 'chime') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
                    gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.08);
                    osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
                });
            } else if (type === 'victory') {
                const notes = [440, 554.37, 659.25, 880, 1108.73];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.1);
                    osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
                });
            }
        } catch (e) {}
    };

    // Pronounce word or syllable with full voice engine support & completion promise
    const speakText = (text: string): Promise<void> => {
        return new Promise<void>((resolve) => {
            if (!text) {
                resolve();
                return;
            }

            // 1. Primary Engine: Global playVRStationVoice (handles MP3 & SpeechSynthesis with true onEnd)
            if (typeof (window as any).playVRStationVoice === 'function') {
                (window as any).playVRStationVoice(text, resolve);
                return;
            }

            // 2. Secondary Engine: Global sebutAudio
            if (typeof (window as any).sebutAudio === 'function') {
                try {
                    (window as any).sebutAudio(text);
                } catch (e) {}
                setTimeout(resolve, 1200);
                return;
            }

            // 3. Fallback: Robust Web Speech API with GC retention & timeout safety
            if ('speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                    if (window.speechSynthesis.paused) window.speechSynthesis.resume();

                    const cleanText = String(text).replace(/[-_/]/g, ' ').trim();
                    const utter = new SpeechSynthesisUtterance(cleanText);
                    utter.lang = 'ms-MY';
                    utter.rate = 0.88;
                    utter.pitch = 1.05;

                    (window as any)._perpActiveUtterance = utter;

                    let isDone = false;
                    const onFinish = () => {
                        if (isDone) return;
                        isDone = true;
                        resolve();
                    };

                    utter.onend = onFinish;
                    utter.onerror = onFinish;
                    setTimeout(onFinish, Math.max(1600, cleanText.length * 200));

                    window.speechSynthesis.speak(utter);
                } catch (e) {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    };

    // Auto Play all words in current shelf with gold outline & glow animation
    const handlePlayAll = async () => {
        if (activeShelfIdx === null) return;
        const currentShelf = shelves[activeShelfIdx];
        const currentWords = currentShelf?.words || [];
        setIsAutoPlaying(true);
        isAutoPlayingRef.current = true;

        for (let i = 0; i < currentWords.length; i++) {
            if (!isAutoPlayingRef.current) break;
            setCurrentCardIdx(i);

            // Animate card with gold outline & gold glow (matching 3D Bunyi Kata)
            const card = document.getElementById('vr-perp-showcase-card');
            const speakerBtn = document.getElementById('vr-perp-speaker-icon');
            if (card) {
                card.style.borderColor = '#f59e0b';
                card.style.boxShadow = '0 0 0 4.5px #fbbf24, 0 8px 25px rgba(251,191,36,0.6)';
                card.style.transform = 'scale(1.02)';
            }
            if (speakerBtn) {
                speakerBtn.style.transform = 'scale(1.25)';
                speakerBtn.style.backgroundColor = '#f59e0b';
            }

            // Speak word and wait for audio to TRULY finish playing
            await speakText(currentWords[i].word);
            await new Promise((r) => setTimeout(r, 450));

            // Reset outline & speaker
            if (card) {
                card.style.borderColor = currentShelf?.color || '#3b82f6';
                card.style.boxShadow = '';
                card.style.transform = '';
            }
            if (speakerBtn) {
                speakerBtn.style.transform = '';
                speakerBtn.style.backgroundColor = currentShelf?.color || '#3b82f6';
            }
        }

        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);
    };

    const handleClosePopup = () => {
        isAutoPlayingRef.current = false;
        setIsAutoPlaying(false);

        // Stop any running station audio
        if ((window as any).currentVRStationAudio) {
            try {
                (window as any).currentVRStationAudio.pause();
                (window as any).currentVRStationAudio.currentTime = 0;
            } catch (e) {}
            (window as any).currentVRStationAudio = null;
        }
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }

        // Reset visual animations on card
        const card = document.getElementById('vr-perp-showcase-card');
        const speakerBtn = document.getElementById('vr-perp-speaker-icon');
        if (card) {
            card.style.borderColor = '';
            card.style.boxShadow = '';
            card.style.transform = '';
        }
        if (speakerBtn) {
            speakerBtn.style.transform = '';
            speakerBtn.style.backgroundColor = '';
        }

        setActiveShelfIdx(null);

        // Apply 5.0s cooldown so player doesn't instantly re-trigger the shelf while closing
        const char = document.getElementById('vr-player-character');
        if (char && (char as any).components && (char as any).components['perpustakaan-player-controller']) {
            (char as any).components['perpustakaan-player-controller'].shelfCooldown = 5.0;
        }

        if (exploredShelves.length >= 6) {
            setShowCelebration(true);
            playSynthesizedSound('victory');
        }
    };

    // Global communication hooks
    useEffect(() => {
        (window as any).perpustakaanTriggerShelf = (shelfId: number) => {
            if (shelfId >= 0 && shelfId < shelves.length) {
                setActiveShelfIdx(shelfId);
                setCurrentCardIdx(0);
                playSynthesizedSound('chime');

                setExploredShelves((prev) => {
                    if (!prev.includes(shelfId)) {
                        const next = [...prev, shelfId];
                        try {
                            if (typeof (window as any).logProgress === 'function') {
                                (window as any).logProgress('perpustakaan', 'belajar', next.length * 15, 'perpustakaan');
                            }
                        } catch (e) {}
                        return next;
                    }
                    return prev;
                });
            }
        };

        (window as any).perpustakaanTriggerEntrance = () => {
            if (entranceLockedRef.current || countdown !== null) return;
            entranceLockedRef.current = true;
            setCountdownTarget('interior');
            playSynthesizedSound('portal');
            setCountdown(3);
        };

        (window as any).perpustakaanTriggerExit = () => {
            if (entranceLockedRef.current || countdown !== null) return;
            entranceLockedRef.current = true;
            setCountdownTarget('exterior');
            playSynthesizedSound('portal');
            setCountdown(3);
        };

        (window as any).perpustakaanSetPhase = (p: 'exterior' | 'interior') => {
            setPhase(p);
        };

        return () => {
            delete (window as any).perpustakaanTriggerShelf;
            delete (window as any).perpustakaanTriggerEntrance;
            delete (window as any).perpustakaanTriggerExit;
            delete (window as any).perpustakaanSetPhase;
        };
    }, [countdown, shelves]);

    // 3-Second Countdown Effect (Handles both entering interior & returning to exterior)
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            playSynthesizedSound('tick');
            const timer = setTimeout(() => {
                setCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCountdown(null);
            setPhase(countdownTarget);
            playSynthesizedSound('chime');
            setTimeout(() => {
                entranceLockedRef.current = false;
            }, 1500);
        }
    }, [countdown, countdownTarget]);

    // Build & inject A-Frame scene
    useEffect(() => {
        const renderScene = () => {
            if (!sceneContainerRef.current) return;
            const container = sceneContainerRef.current;

            const AFRAME = (window as any).AFRAME;
            if (AFRAME && !AFRAME.components['perpustakaan-player-controller']) {
                AFRAME.registerComponent('perpustakaan-player-controller', {
                    schema: {
                        mode: { type: 'string', default: 'exterior' },
                    },
                    init: function () {
                        const posAttr = this.el.getAttribute('position') || { x: 0, y: 0, z: 4.5 };
                        this.charPos = {
                            x: (posAttr.x !== undefined && posAttr.x !== null) ? Number(posAttr.x) : 0,
                            y: (posAttr.y !== undefined && posAttr.y !== null) ? Number(posAttr.y) : 0,
                            z: (posAttr.z !== undefined && posAttr.z !== null) ? Number(posAttr.z) : 4.5,
                        };
                        this.charRotation = 0;
                        this.animTime = 0;
                        this.armLeft = document.getElementById('perp-arm-left');
                        this.armRight = document.getElementById('perp-arm-right');
                        this.legLeft = document.getElementById('perp-leg-left');
                        this.legRight = document.getElementById('perp-leg-right');
                        this.cameraRig = document.getElementById('camera-rig');
                        this._wasMoving = false;
                        this._footstepTimer = 0;
                        this._footstepInterval = 0.32;
                        this._footstepToggle = false;
                        this.shelfCooldown = 5.0; // 5-second initial grace cooldown on spawn/respawn
                        this.lastStationId = null;

                        this._getAudioCtx = () => {
                            if (!(window as any)._sharedPerpAudioCtx) {
                                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                                if (AudioCtx) (window as any)._sharedPerpAudioCtx = new AudioCtx();
                            }
                            const ctx = (window as any)._sharedPerpAudioCtx;
                            if (ctx && ctx.state === 'suspended') {
                                ctx.resume().catch(() => {});
                            }
                            return ctx;
                        };

                        this._playFootstep = () => {
                            try {
                                const ctx = this._getAudioCtx();
                                if (ctx) {
                                    const osc = ctx.createOscillator();
                                    const gain = ctx.createGain();
                                    osc.type = 'sine';
                                    this._footstepToggle = !this._footstepToggle;
                                    osc.frequency.setValueAtTime(this._footstepToggle ? 140 : 120, ctx.currentTime);
                                    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
                                    gain.gain.setValueAtTime(0.04, ctx.currentTime);
                                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                                    osc.connect(gain);
                                    gain.connect(ctx.destination);
                                    osc.start();
                                    osc.stop(ctx.currentTime + 0.08);
                                }
                            } catch (e) {}
                        };

                        (window as any).perpJoystickInput = { x: 0, y: 0 };
                        (window as any).perpKeysState = {};
                        (window as any).perpCamYaw = 0;
                        (window as any).perpCamPitch = 0;
                    },
                    tick: function (time: number, delta: number) {
                        if (!delta) delta = 16;
                        const dt = Math.min(delta / 1000, 0.05);

                        const modalActive = document.querySelector('.vr-station-popup-overlay') || document.querySelector('.vr-guide-modal-overlay') || document.querySelector('.perpustakaan-countdown-overlay');
                        if (modalActive) {
                            if (this.legLeft && this.legLeft.object3D) this.legLeft.object3D.rotation.x = 0;
                            if (this.legRight && this.legRight.object3D) this.legRight.object3D.rotation.x = 0;
                            if (this.armLeft && this.armLeft.object3D) this.armLeft.object3D.rotation.x = 0;
                            if (this.armRight && this.armRight.object3D) this.armRight.object3D.rotation.x = 0;
                            return;
                        }

                        let moveX = 0;
                        let moveZ = 0;

                        const keys = (window as any).perpKeysState || {};
                        if (keys.w || keys.W || keys.ArrowUp) moveZ -= 1;
                        if (keys.s || keys.S || keys.ArrowDown) moveZ += 1;
                        if (keys.a || keys.A || keys.ArrowLeft) moveX -= 1;
                        if (keys.d || keys.D || keys.ArrowRight) moveX += 1;

                        const jInput = (window as any).perpJoystickInput || { x: 0, y: 0 };
                        if (Math.abs(jInput.x) > 0.12) moveX += jInput.x;
                        if (Math.abs(jInput.y) > 0.12) moveZ += jInput.y;

                        const mag = Math.sqrt(moveX * moveX + moveZ * moveZ);
                        const isMoving = mag > 0.12;

                        const camYaw = (window as any).perpCamYaw || 0;
                        const camPitch = (window as any).perpCamPitch || 0;

                        if (this.cameraRig) {
                            const camEl = this.cameraRig.querySelector('a-camera');
                            if (camEl && camEl.object3D) {
                                camEl.object3D.rotation.order = 'YXZ';
                                camEl.object3D.rotation.y = camYaw;
                                camEl.object3D.rotation.x = camPitch;
                                camEl.object3D.rotation.z = 0;
                            }
                        }

                        const currentMode = (window as any).perpCurrentPhase || this.data.mode || 'exterior';

                        if (isMoving) {
                            const normX = moveX / Math.max(1, mag);
                            const normZ = moveZ / Math.max(1, mag);

                            const worldX = normX * Math.cos(camYaw) + normZ * Math.sin(camYaw);
                            const worldZ = -normX * Math.sin(camYaw) + normZ * Math.cos(camYaw);

                            const speed = 5.4;
                            let nextX = this.charPos.x + worldX * speed * dt;
                            let nextZ = this.charPos.z + worldZ * speed * dt;

                            if (currentMode === 'exterior') {
                                nextX = Math.max(-28, Math.min(28, nextX));
                                nextZ = Math.max(-10.8, Math.min(19.5, nextZ));

                                if (nextZ < -9.5 && Math.abs(nextX) > 6) {
                                    nextZ = this.charPos.z;
                                }
                            } else {
                                // Interior 80m x 80m boundary
                                nextX = Math.max(-36, Math.min(36, nextX));
                                nextZ = Math.max(-36, Math.min(36, nextZ));
                            }

                            this.charPos.x = nextX;
                            this.charPos.z = nextZ;

                            // Dynamic stair climbing height in exterior
                            let targetGroundY = 0;
                            if (currentMode === 'exterior') {
                                if (this.charPos.z <= -7.8 && this.charPos.z >= -10.8 && Math.abs(this.charPos.x) <= 8.5) {
                                    if (this.charPos.z < -9.6) targetGroundY = 0.75;
                                    else if (this.charPos.z < -8.7) targetGroundY = 0.45;
                                    else targetGroundY = 0.15;
                                }
                            }
                            this.charPos.y += (targetGroundY - this.charPos.y) * 0.25;

                            this.charRotation = Math.atan2(worldX, worldZ) * (180 / Math.PI);
                            if (this.el.object3D) {
                                this.el.object3D.position.set(this.charPos.x, this.charPos.y, this.charPos.z);
                                this.el.object3D.rotation.y = this.charRotation * (Math.PI / 180);
                            }

                            this.animTime += dt * 14;
                            const swing = Math.sin(this.animTime) * 26;
                            const swingRad = swing * (Math.PI / 180);
                            const bob = Math.abs(Math.sin(this.animTime)) * 0.05;

                            if (this.legLeft && this.legLeft.object3D) this.legLeft.object3D.rotation.x = swingRad;
                            if (this.legRight && this.legRight.object3D) this.legRight.object3D.rotation.x = -swingRad;
                            if (this.armLeft && this.armLeft.object3D) this.armLeft.object3D.rotation.x = -swingRad * 0.75;
                            if (this.armRight && this.armRight.object3D) this.armRight.object3D.rotation.x = swingRad * 0.75;

                            const bodyMesh = document.getElementById('vr-player-body');
                            if (bodyMesh && bodyMesh.object3D) {
                                bodyMesh.removeAttribute('animation');
                                bodyMesh.object3D.position.y = 0.72 + bob;
                            }

                            this._footstepTimer += dt;
                            if (this._footstepTimer >= this._footstepInterval) {
                                this._footstepTimer = 0;
                                this._playFootstep();
                            }
                            this._wasMoving = true;
                        } else {
                            if (this.legLeft && this.legLeft.object3D) this.legLeft.object3D.rotation.x = 0;
                            if (this.legRight && this.legRight.object3D) this.legRight.object3D.rotation.x = 0;
                            if (this.armLeft && this.armLeft.object3D) this.armLeft.object3D.rotation.x = 0;
                            if (this.armRight && this.armRight.object3D) this.armRight.object3D.rotation.x = 0;

                            if (this._wasMoving) {
                                const bodyMesh = document.getElementById('vr-player-body');
                                if (bodyMesh) {
                                    bodyMesh.setAttribute('animation', 'property: position; from: 0 0.72 0; to: 0 0.75 0; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine');
                                }
                                this._wasMoving = false;
                                this._footstepTimer = 0;
                            }
                        }

                        // Follower Camera
                        if (this.cameraRig && this.cameraRig.object3D) {
                            const followDist = 2.6;
                            const targetCamX = this.charPos.x + followDist * Math.sin(camYaw);
                            const targetCamZ = this.charPos.z + followDist * Math.cos(camYaw);
                            const targetCamY = this.charPos.y + 1.95 - camPitch * 0.8;

                            this.cameraRig.object3D.position.x += (targetCamX - this.cameraRig.object3D.position.x) * 0.25;
                            this.cameraRig.object3D.position.z += (targetCamZ - this.cameraRig.object3D.position.z) * 0.25;
                            this.cameraRig.object3D.position.y += (targetCamY - this.cameraRig.object3D.position.y) * 0.25;
                        }

                        // Trigger Zones
                        if (currentMode === 'exterior') {
                            const distToDoor = Math.hypot(this.charPos.x - 0, this.charPos.z - (-10.0));
                            if (distToDoor < 2.0) {
                                if (typeof (window as any).perpustakaanTriggerEntrance === 'function') {
                                    (window as any).perpustakaanTriggerEntrance();
                                }
                            }
                        } else {
                            // Check Interior Exit Door Portal Trigger (at x = 9.2, z = 12.0)
                            const distToExit = Math.hypot(this.charPos.x - 9.2, this.charPos.z - 12.0);
                            if (distToExit < 2.2) {
                                if (typeof (window as any).perpustakaanTriggerExit === 'function') {
                                    (window as any).perpustakaanTriggerExit();
                                }
                            }

                            if (this.shelfCooldown > 0) {
                                this.shelfCooldown -= dt;
                            }

                            // 6 Distinct Reading Room Stations
                            const shelfPositions = [
                                { id: 0, x: 0, z: -27 },     // Room 0: North
                                { id: 1, x: 27, z: -20 },    // Room 1: North-East
                                { id: 2, x: 27, z: 20 },     // Room 2: South-East
                                { id: 3, x: 0, z: 27 },      // Room 3: South
                                { id: 4, x: -27, z: 20 },    // Room 4: South-West
                                { id: 5, x: -27, z: -20 },   // Room 5: North-West
                            ];

                            let inRangeId = null;
                            for (const sp of shelfPositions) {
                                const dist = Math.hypot(this.charPos.x - sp.x, this.charPos.z - sp.z);
                                if (dist < 3.2) {
                                    inRangeId = sp.id;
                                    break;
                                }
                            }

                            if (inRangeId !== null) {
                                if (this.lastStationId !== inRangeId && this.shelfCooldown <= 0) {
                                    this.lastStationId = inRangeId;
                                    this.shelfCooldown = 3.5;
                                    if (typeof (window as any).perpustakaanTriggerShelf === 'function') {
                                        (window as any).perpustakaanTriggerShelf(inRangeId);
                                    }
                                }
                            } else {
                                this.lastStationId = null;
                            }
                        }
                    },
                });
            }

            const avatarSrc = (window as any).selectedAvatarIcon || '/images/avatar/avatar1.png';
            const studentName = (window as any).namaMuridAktif || 'Kapten Suku';
            const nameBadgeSvg = generateAtlantaBadgeSvg(studentName);
            const creamWallTexture = generateCreamWallTexture();
            const librarySideWallTexture = makeLibrarySideWallSvg();

            if (phase === 'exterior') {
                entranceLockedRef.current = false;
                const pedimentSvg = makeVrHeaderSvg('PERPUSTAKAAN BUNYI KATA', '#fbbf24', '#0f172a', 800, 160);
                const busSignSvg = makeVrHeaderSvg('HENTIAN BAS PERPUSTAKAAN', '#ffffff', '#0284c7', 600, 120);

                const startX = 0;
                const startZ = 4.5;

                container.innerHTML = `
                    <a-scene embedded webxr="referenceSpaceType: local-floor; optionalFeatures: local-floor;" device-orientation-permission-ui="enabled: false" style="width: 100vw; height: 100dvh; display: block; position: absolute; inset: 0;" renderer="logarithmicDepthBuffer: true; antialias: true; colorManagement: true; sortObjects: true;">
                        <a-light type="ambient" color="#fffbeb" intensity="0.85"></a-light>
                        <a-light type="directional" color="#ffffff" intensity="0.95" position="15 30 10"></a-light>

                        <a-entity id="camera-rig" position="${startX} 1.95 ${startZ + 2.6}">
                            <a-camera position="0 0 0" near="0.2" far="300" look-controls="enabled: false;" wasd-controls="enabled: false"></a-camera>
                        </a-entity>

                        ${build3DPlayerCharacterHTML(studentName, avatarSrc, nameBadgeSvg, startX, startZ, 'exterior')}

                        <a-sky color="#bae6fd"></a-sky>
                        <a-plane position="0 0 0" rotation="-90 0 0" width="80" height="80" segments-width="12" segments-height="12" material="src: url(${floorSvg}); repeat: 80 80; side: double;"></a-plane>

                        <!-- Solid 3D Neoclassical Building Structure -->
                        <a-box position="0 6.0 -12" width="38" height="12" depth="1.2" material="src: url(${creamWallTexture}); repeat: 10 3;"></a-box>
                        <a-box position="0 1.2 -11.9" width="38.2" height="2.4" depth="1.3" color="#5c2d16"></a-box>
                        <a-box position="0 2.4 -11.8" width="38.4" height="0.1" depth="1.4" color="#fbbf24"></a-box>

                        <a-box position="-19.0 6.0 -24.0" width="1.2" height="12" depth="24" material="src: url(${librarySideWallTexture}); repeat: 6 3;"></a-box>
                        <a-box position="-18.9 1.2 -24.0" width="1.3" height="2.4" depth="24.2" color="#5c2d16"></a-box>
                        <a-box position="-18.8 2.4 -24.0" width="1.4" height="0.1" depth="24.4" color="#fbbf24"></a-box>

                        <a-box position="19.0 6.0 -24.0" width="1.2" height="12" depth="24" material="src: url(${librarySideWallTexture}); repeat: 6 3;"></a-box>
                        <a-box position="18.9 1.2 -24.0" width="1.3" height="2.4" depth="24.2" color="#5c2d16"></a-box>
                        <a-box position="18.8 2.4 -24.0" width="1.4" height="0.1" depth="24.4" color="#fbbf24"></a-box>

                        <a-box position="0 6.0 -36.0" width="39" height="12" depth="1.2" material="src: url(${creamWallTexture}); repeat: 10 3;"></a-box>

                        <a-box position="0 12.2 -24.0" width="40" height="0.6" depth="25.5" color="#d4a574"></a-box>
                        <a-box position="0 12.6 -24.0" width="39" height="0.3" depth="24.5" color="#b8860b"></a-box>

                        ${[-12, -8, -4, 4, 8, 12].map(x => `
                            <a-cylinder position="${x} 5.2 -10.5" radius="0.5" height="10.4" color="#fef3c7" material="roughness: 0.3;"></a-cylinder>
                            <a-box position="${x} 0.25 -10.5" width="1.4" height="0.5" depth="1.4" color="#b8860b"></a-box>
                            <a-box position="${x} 10.35 -10.5" width="1.4" height="0.5" depth="1.4" color="#b8860b"></a-box>
                        `).join('')}

                        <a-box position="0 11.2 -10.5" width="28" height="1.4" depth="1.8" color="#d4a574"></a-box>
                        <a-plane position="0 11.2 -9.55" width="14" height="1.8" material="src: url(${pedimentSvg}); transparent: true;"></a-plane>

                        <!-- Stairs with Real Step Elevation -->
                        <a-box position="0 0.15 -8.2" width="16" height="0.3" depth="2.6" color="#cbd5e1"></a-box>
                        <a-box position="0 0.45 -9.0" width="14" height="0.3" depth="2.0" color="#e2e8f0"></a-box>
                        <a-box position="0 0.75 -9.8" width="12" height="0.3" depth="1.6" color="#f8fafc"></a-box>

                        <a-box position="-1.5 3.5 -11.3" width="2.8" height="5.4" depth="0.15" color="#3e1a07"></a-box>
                        <a-box position="1.5 3.5 -11.3" width="2.8" height="5.4" depth="0.15" color="#3e1a07"></a-box>
                        <a-box position="-0.2 3.5 -11.2" width="0.12" height="1.4" depth="0.08" color="#fbbf24"></a-box>
                        <a-box position="0.2 3.5 -11.2" width="0.12" height="1.4" depth="0.08" color="#fbbf24"></a-box>

                        <!-- Door Portal Teleport Pad -->
                        <a-entity position="0 0.05 -10.0">
                            <a-ring rotation="-90 0 0" radius-inner="1.0" radius-outer="2.2" color="#10b981" material="opacity: 0.9; transparent: true;"
                                animation="property: rotation; to: -90 360 0; loop: true; dur: 4500; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.9" color="#fde047" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.6" height="3.6" material="color: #10b981; opacity: 0.25; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-octahedron position="0 2.2 0" radius="0.6" color="#fbbf24" material="emissive: #fbbf24; emissiveIntensity: 0.6;"
                                animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-octahedron>
                        </a-entity>

                        ${vrGrandFlowerUrn(-16, 0, -4)}
                        ${vrGrandFlowerUrn(16, 0, -4)}
                        ${vrGrandFlowerUrn(-16, 0, 4)}
                        ${vrGrandFlowerUrn(16, 0, 4)}
                        ${vrMuseumBench(-8, 0, 4, 0)}
                        ${vrMuseumBench(8, 0, 4, 0)}

                        <!-- Paved City Road at Z = 16 -->
                        <a-plane position="0 0.02 16" rotation="-90 0 0" width="80" height="7.5" color="#1e293b"></a-plane>
                        <a-plane position="0 0.025 16" rotation="-90 0 0" width="80" height="0.3" color="#facc15"></a-plane>
                        ${[-8, -5, -2, 1, 4, 7].map(x => `
                            <a-plane position="${x} 0.03 16" rotation="-90 0 0" width="1.1" height="4.2" color="#ffffff"></a-plane>
                        `).join('')}

                        <a-box position="0 0.1 12.0" width="80" height="0.2" depth="0.5" color="#94a3b8"></a-box>
                        <a-box position="0 0.1 20.0" width="80" height="0.2" depth="0.5" color="#94a3b8"></a-box>

                        <a-entity position="14 0 11">
                            <a-box position="0 1.6 0" width="4.8" height="3.2" depth="0.08" color="#0284c7" material="opacity: 0.7; transparent: true;"></a-box>
                            <a-box position="0 3.2 0.8" width="5.2" height="0.1" depth="1.8" color="#1e293b"></a-box>
                            <a-plane position="0 3.5 1.75" width="4.2" height="0.8" material="src: url(${busSignSvg}); transparent: true;"></a-plane>
                            <a-box position="0 0.45 0.6" width="3.8" height="0.12" depth="0.6" color="#78350f"></a-box>
                        </a-entity>

                        ${vr3DTransitBus(14, 0, 16.5, 90)}

                        <!-- Real 3D Exterior City Buildings & Architecture (GLB) -->
                        <!-- North-West Apartment Tower (Left of Library) -->
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="-28 16.75 -26" scale="2.2 2.5 2.2" rotation="0 35 0"></a-gltf-model>

                        <!-- North-East Apartment Tower (Right of Library) -->
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="28 16.75 -26" scale="2.2 2.5 2.2" rotation="0 -35 0"></a-gltf-model>

                        <!-- Side Wings Apartment Towers (Flanking the Plaza) -->
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="-36 14.74 4" scale="2.0 2.2 2.0" rotation="0 85 0"></a-gltf-model>
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="36 14.74 4" scale="2.0 2.2 2.0" rotation="0 -85 0"></a-gltf-model>

                        <!-- Street-Side Real Commercial Shops (Across the Road, Z = 24.5) -->
                        <!-- Convenience Store (Left Side across Road) -->
                        <a-gltf-model src="/models/bangunan/convenience-store-01.glb" position="-11 3.89 24.5" scale="1.35 1.35 1.35" rotation="0 180 0"></a-gltf-model>

                        <!-- Corner Store (Right Side across Road) -->
                        <a-gltf-model src="/models/bangunan/corner-store-01.glb" position="9 4.84 24.5" scale="1.25 1.25 1.25" rotation="0 180 0"></a-gltf-model>

                        <!-- South-West & South-East Background Skyline Apartment Towers (Behind the Shops) -->
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="-26 16.75 32" scale="2.2 2.5 2.2" rotation="0 15 0"></a-gltf-model>
                        <a-gltf-model src="/models/bangunan/apartment-block-01.glb" position="26 16.75 32" scale="2.2 2.5 2.2" rotation="0 -15 0"></a-gltf-model>
                    </a-scene>
                `;
            } else {
                // =========================================================================
                // INTERIOR SCENE: REAL ROOM WALLS & 6 DISTINCT ENCLOSED READING ROOMS
                // =========================================================================
                const spawnX = 0;
                const spawnZ = 8.0;
                const exitSignSvg = makeVrHeaderSvg('PINTU KELUAR', '#fbbf24', '#0f172a', 600, 130);

                // Classical 3D Ornate Framed Art Paintings Generator (All Words Framed on Room Walls)
                const roomPaintingsHtml = shelves.map((shelf, sIdx) => {
                    const words = shelf.words;
                    // 8 Painting wall positions inside each of the 6 enclosed rooms (No empty walls!)
                    const paintingPositions = [
                        // Room 0: North Wing (inside room walls)
                        [
                            { x: -13.4, y: 3.2, z: -20, rotY: 90 },
                            { x: -13.4, y: 3.2, z: -28, rotY: 90 },
                            { x: -13.4, y: 3.2, z: -35, rotY: 90 },
                            { x: 13.4, y: 3.2, z: -20, rotY: -90 },
                            { x: 13.4, y: 3.2, z: -28, rotY: -90 },
                            { x: 13.4, y: 3.2, z: -35, rotY: -90 },
                            { x: -6, y: 3.2, z: -39.3, rotY: 0 },
                            { x: 6, y: 3.2, z: -39.3, rotY: 0 },
                        ],
                        // Room 1: North-East Wing (X: 14 to 40, Z: -40 to -1)
                        [
                            { x: 20, y: 3.2, z: -39.3, rotY: 0 },
                            { x: 28, y: 3.2, z: -39.3, rotY: 0 },
                            { x: 36, y: 3.2, z: -39.3, rotY: 0 },
                            { x: 39.3, y: 3.2, z: -30, rotY: -90 },
                            { x: 39.3, y: 3.2, z: -16, rotY: -90 },
                            { x: 34, y: 3.2, z: -0.8, rotY: 180 },
                            { x: 26, y: 3.2, z: -0.8, rotY: 180 },
                            { x: 18, y: 3.2, z: -0.8, rotY: 180 },
                        ],
                        // Room 2: South-East Wing (X: 14 to 40, Z: 1 to 40)
                        [
                            { x: 18, y: 3.2, z: 0.8, rotY: 0 },
                            { x: 26, y: 3.2, z: 0.8, rotY: 0 },
                            { x: 34, y: 3.2, z: 0.8, rotY: 0 },
                            { x: 39.3, y: 3.2, z: 16, rotY: -90 },
                            { x: 39.3, y: 3.2, z: 30, rotY: -90 },
                            { x: 36, y: 3.2, z: 39.3, rotY: 180 },
                            { x: 28, y: 3.2, z: 39.3, rotY: 180 },
                            { x: 20, y: 3.2, z: 39.3, rotY: 180 },
                        ],
                        // Room 3: South Wing (X: -14 to 14, Z: 14 to 40)
                        [
                            { x: -13.4, y: 3.2, z: 20, rotY: 90 },
                            { x: -13.4, y: 3.2, z: 28, rotY: 90 },
                            { x: -13.4, y: 3.2, z: 35, rotY: 90 },
                            { x: 13.4, y: 3.2, z: 20, rotY: -90 },
                            { x: 13.4, y: 3.2, z: 28, rotY: -90 },
                            { x: 13.4, y: 3.2, z: 35, rotY: -90 },
                            { x: -6, y: 3.2, z: 39.3, rotY: 180 },
                            { x: 6, y: 3.2, z: 39.3, rotY: 180 },
                        ],
                        // Room 4: South-West Wing (X: -40 to -14, Z: 1 to 40)
                        [
                            { x: -18, y: 3.2, z: 0.8, rotY: 0 },
                            { x: -26, y: 3.2, z: 0.8, rotY: 0 },
                            { x: -34, y: 3.2, z: 0.8, rotY: 0 },
                            { x: -39.3, y: 3.2, z: 16, rotY: 90 },
                            { x: -39.3, y: 3.2, z: 30, rotY: 90 },
                            { x: -36, y: 3.2, z: 39.3, rotY: 180 },
                            { x: -28, y: 3.2, z: 39.3, rotY: 180 },
                            { x: -20, y: 3.2, z: 39.3, rotY: 180 },
                        ],
                        // Room 5: North-West Wing (X: -40 to -14, Z: -40 to -1)
                        [
                            { x: -20, y: 3.2, z: -39.3, rotY: 0 },
                            { x: -28, y: 3.2, z: -39.3, rotY: 0 },
                            { x: -36, y: 3.2, z: -39.3, rotY: 0 },
                            { x: -39.3, y: 3.2, z: -30, rotY: 90 },
                            { x: -39.3, y: 3.2, z: -16, rotY: 90 },
                            { x: -34, y: 3.2, z: -0.8, rotY: 180 },
                            { x: -26, y: 3.2, z: -0.8, rotY: 180 },
                            { x: -18, y: 3.2, z: -0.8, rotY: 180 },
                        ],
                    ];

                    const cfgs = paintingPositions[sIdx] || [];
                    return words.map((w, wIdx) => {
                        const cfg = cfgs[wIdx];
                        if (!cfg) return '';
                        const artImg = getSukuKataImageUrl(w.word, isHeroMode);
                        const plaqueSvg = makeSukuKataPlaqueSvg(w.word, shelf.color);
                        return `
                            <a-entity position="${cfg.x} ${cfg.y} ${cfg.z}" rotation="0 ${cfg.rotY} 0">
                                <!-- Outer Polished Gold Frame (Solid 3D Moulding) -->
                                <a-box position="0 0 0" width="2.4" height="2.9" depth="0.08" color="#b8860b" material="roughness: 0.25; metalness: 0.75;"></a-box>
                                
                                <!-- Pure White Canvas Matting (Safe 0.045 z-offset) -->
                                <a-plane position="0 0 0.045" width="2.1" height="2.6" color="#ffffff" material="roughness: 0.9;"></a-plane>

                                <!-- Suku Kata Artwork Image (Safe 0.065 z-offset) -->
                                <a-plane position="0 0.22 0.065" width="1.8" height="1.6" material="src: url(${artImg}); transparent: true; roughness: 0.2;"></a-plane>

                                <!-- Suku Kata Plaque (Safe 0.07 z-offset) -->
                                <a-plane position="0 -0.86 0.07" width="1.8" height="0.48" material="src: url(${plaqueSvg}); transparent: true;"></a-plane>
                            </a-entity>
                        `;
                    }).join('');
                }).join('');

                container.innerHTML = `
                    <a-scene embedded webxr="referenceSpaceType: local-floor; optionalFeatures: local-floor;" device-orientation-permission-ui="enabled: false" style="width: 100vw; height: 100dvh; display: block; position: absolute; inset: 0;" renderer="logarithmicDepthBuffer: true; antialias: true; colorManagement: true; sortObjects: true;">
                        <a-light type="ambient" color="#fffbeb" intensity="0.8"></a-light>
                        <a-light type="directional" color="#ffffff" intensity="0.85" position="0 14 0"></a-light>

                        <a-entity id="camera-rig" position="${spawnX} 1.95 ${spawnZ + 2.6}">
                            <a-camera position="0 0 0" near="0.2" far="300" look-controls="enabled: false;" wasd-controls="enabled: false"></a-camera>
                        </a-entity>

                        ${build3DPlayerCharacterHTML(studentName, avatarSrc, nameBadgeSvg, spawnX, spawnZ, 'interior')}

                        <!-- Ambient backdrop sky prevents any black void -->
                        <a-sky color="#fefce8"></a-sky>

                        <!-- Grand Palace Floor & Ceiling (80m x 80m) -->
                        <a-plane position="0 0 0" rotation="-90 0 0" width="80" height="80" segments-width="12" segments-height="12" material="src: url(${floorSvg}); repeat: 80 80; side: double;"></a-plane>
                        <a-plane position="0 8.5 0" rotation="90 0 0" width="80" height="80" segments-width="12" segments-height="12" material="src: url(${ceilingSvg}); repeat: 40 40; roughness: 0.8; side: double;"></a-plane>

                        <!-- Outer Perimeter Walls (80m) -->
                        <a-plane position="0 4.25 -39.8" width="80" height="8.5" material="src: url(${creamWallTexture}); repeat: 20 2; roughness: 0.85;"></a-plane>
                        <a-plane position="0 4.25 39.8" rotation="0 180 0" width="80" height="8.5" material="src: url(${creamWallTexture}); repeat: 20 2; roughness: 0.85;"></a-plane>
                        <a-plane position="-39.8 4.25 0" rotation="0 90 0" width="80" height="8.5" material="src: url(${creamWallTexture}); repeat: 20 2; roughness: 0.85;"></a-plane>
                        <a-plane position="39.8 4.25 0" rotation="0 -90 0" width="80" height="8.5" material="src: url(${creamWallTexture}); repeat: 20 2; roughness: 0.85;"></a-plane>
                        <!-- Perimeter Wood Wainscoting & Gold Trim (Identical to 3D Bunyi Kata) -->
                        <a-box position="0 0.65 -39.75" width="80" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="0 1.32 -39.75" width="80" height="0.06" depth="0.12" color="#fbbf24"></a-box>
                        <a-box position="0 0.65 39.75" width="80" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="0 1.32 39.75" width="80" height="0.06" depth="0.12" color="#fbbf24"></a-box>
                        <a-box position="-39.75 0.65 0" width="0.1" height="1.3" depth="80" color="#5c2d16"></a-box>
                        <a-box position="-39.75 1.32 0" width="0.12" height="0.06" depth="80" color="#fbbf24"></a-box>
                        <a-box position="39.75 0.65 0" width="0.1" height="1.3" depth="80" color="#5c2d16"></a-box>
                        <a-box position="39.75 1.32 0" width="0.12" height="0.06" depth="80" color="#fbbf24"></a-box>

                        <!-- ================= REAL ENCLOSING ROOM PARTITION WALLS (AIRTIGHT & SEAMLESS) ================= -->
                        <!-- North Wing (Room 0) Partition Walls (Along x = -14 and x = +14, spanning z = -14.0 to -40.0) -->
                        <a-box position="-14 4.25 -27.0" width="0.6" height="8.5" depth="26.0" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="-14 0.65 -27.0" width="0.66" height="1.3" depth="26.0" color="#5c2d16"></a-box>
                        <a-box position="-14 1.32 -27.0" width="0.68" height="0.06" depth="26.0" color="#fbbf24"></a-box>

                        <a-box position="14 4.25 -27.0" width="0.6" height="8.5" depth="26.0" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="14 0.65 -27.0" width="0.66" height="1.3" depth="26.0" color="#5c2d16"></a-box>
                        <a-box position="14 1.32 -27.0" width="0.68" height="0.06" depth="26.0" color="#fbbf24"></a-box>

                        <!-- North Front Atrium Entry Wall Flanks (Leaves center open x: -4.3 to +4.3 for Archway) -->
                        <a-box position="-9.3 4.25 -14.0" width="10.0" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>
                        <a-box position="9.3 4.25 -14.0" width="10.0" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>

                        <!-- South Wing (Room 3) Partition Walls (Along x = -14 and x = +14, spanning z = 14.0 to 40.0) -->
                        <a-box position="-14 4.25 27.0" width="0.6" height="8.5" depth="26.0" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="-14 0.65 27.0" width="0.66" height="1.3" depth="26.0" color="#5c2d16"></a-box>
                        <a-box position="-14 1.32 27.0" width="0.68" height="0.06" depth="26.0" color="#fbbf24"></a-box>

                        <a-box position="14 4.25 27.0" width="0.6" height="8.5" depth="26.0" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="14 0.65 27.0" width="0.66" height="1.3" depth="26.0" color="#5c2d16"></a-box>
                        <a-box position="14 1.32 27.0" width="0.68" height="0.06" depth="26.0" color="#fbbf24"></a-box>

                        <!-- South Front Atrium Entry Wall Flanks (Leaves center open x: -4.3 to +4.3 for Archway) -->
                        <a-box position="-9.3 4.25 14.0" width="10.0" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>
                        <a-box position="9.3 4.25 14.0" width="10.0" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>

                        <!-- Horizontal Divider dividing North-East (Room 1) from South-East (Room 2) -->
                        <a-box position="27 4.25 0" width="26" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="27 0.65 0" width="26" height="1.3" depth="0.66" color="#5c2d16"></a-box>
                        <a-box position="27 1.32 0" width="26" height="0.06" depth="0.68" color="#fbbf24"></a-box>

                        <!-- East Center Wall between Room 1 & Room 2 Archways (Spans z = -2.65 to +2.65, touching pillars seamlessly) -->
                        <a-box position="14.0 4.25 0" width="0.6" height="8.5" depth="5.3" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>
                        <a-box position="14.0 0.65 0" width="0.66" height="1.3" depth="5.3" color="#5c2d16"></a-box>
                        <a-box position="14.0 1.32 0" width="0.68" height="0.06" depth="5.3" color="#fbbf24"></a-box>

                        <!-- East North Corner Wall (Spans z = -11.4 to -14.3, touching Room 1 outer pillar and North partition wall) -->
                        <a-box position="14.0 4.25 -12.85" width="0.6" height="8.5" depth="2.9" material="src: url(${creamWallTexture}); repeat: 1 2;"></a-box>
                        <a-box position="14.0 0.65 -12.85" width="0.66" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="14.0 1.32 -12.85" width="0.68" height="0.06" depth="2.9" color="#fbbf24"></a-box>

                        <!-- East South Corner Wall (Spans z = +11.4 to +14.3, touching Room 2 outer pillar and South partition wall) -->
                        <a-box position="14.0 4.25 12.85" width="0.6" height="8.5" depth="2.9" material="src: url(${creamWallTexture}); repeat: 1 2;"></a-box>
                        <a-box position="14.0 0.65 12.85" width="0.66" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="14.0 1.32 12.85" width="0.68" height="0.06" depth="2.9" color="#fbbf24"></a-box>

                        <!-- Horizontal Divider dividing North-West (Room 5) from South-West (Room 4) -->
                        <a-box position="-27 4.25 0" width="26" height="8.5" depth="0.6" material="src: url(${creamWallTexture}); repeat: 6 2;"></a-box>
                        <a-box position="-27 0.65 0" width="26" height="1.3" depth="0.66" color="#5c2d16"></a-box>
                        <a-box position="-27 1.32 0" width="26" height="0.06" depth="0.68" color="#fbbf24"></a-box>

                        <!-- West Center Wall between Room 5 & Room 4 Archways (Spans z = -2.65 to +2.65, touching pillars seamlessly) -->
                        <a-box position="-14.0 4.25 0" width="0.6" height="8.5" depth="5.3" material="src: url(${creamWallTexture}); repeat: 2 2;"></a-box>
                        <a-box position="-14.0 0.65 0" width="0.66" height="1.3" depth="5.3" color="#5c2d16"></a-box>
                        <a-box position="-14.0 1.32 0" width="0.68" height="0.06" depth="5.3" color="#fbbf24"></a-box>

                        <!-- West North Corner Wall (Spans z = -11.4 to -14.3, touching Room 5 outer pillar and North partition wall) -->
                        <a-box position="-14.0 4.25 -12.85" width="0.6" height="8.5" depth="2.9" material="src: url(${creamWallTexture}); repeat: 1 2;"></a-box>
                        <a-box position="-14.0 0.65 -12.85" width="0.66" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="-14.0 1.32 -12.85" width="0.68" height="0.06" depth="2.9" color="#fbbf24"></a-box>

                        <!-- West South Corner Wall (Spans z = +11.4 to +14.3, touching Room 4 outer pillar and South partition wall) -->
                        <a-box position="-14.0 4.25 12.85" width="0.6" height="8.5" depth="2.9" material="src: url(${creamWallTexture}); repeat: 1 2;"></a-box>
                        <a-box position="-14.0 0.65 12.85" width="0.66" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="-14.0 1.32 12.85" width="0.68" height="0.06" depth="2.9" color="#fbbf24"></a-box>

                        <!-- Wood Wainscoting Base on Central Atrium Walls -->
                        <a-box position="-9.3 0.65 -13.7" width="10.0" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="9.3 0.65 -13.7" width="10.0" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="-9.3 0.65 13.7" width="10.0" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="9.3 0.65 13.7" width="10.0" height="1.3" depth="0.1" color="#5c2d16"></a-box>
                        <a-box position="13.7 0.65 0" width="0.1" height="1.3" depth="5.3" color="#5c2d16"></a-box>
                        <a-box position="13.7 0.65 -12.85" width="0.1" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="13.7 0.65 12.85" width="0.1" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="-13.7 0.65 0" width="0.1" height="1.3" depth="5.3" color="#5c2d16"></a-box>
                        <a-box position="-13.7 0.65 -12.85" width="0.1" height="1.3" depth="2.9" color="#5c2d16"></a-box>
                        <a-box position="-13.7 0.65 12.85" width="0.1" height="1.3" depth="2.9" color="#5c2d16"></a-box>

                        <!-- ================= GRAND EXIT DOUBLE DOORS & PORTAL POINT (PINTU KELUAR) ================= -->
                        <a-entity position="9.2 0 13.8">
                            <!-- Architrave Frame -->
                            <a-box position="0 2.8 0" width="4.4" height="5.6" depth="0.25" color="#78350f"></a-box>
                            <a-box position="0 2.8 -0.05" width="4.0" height="5.2" depth="0.15" color="#b8860b"></a-box>
                            <!-- Double Mahogany Doors -->
                            <a-box position="-0.95 2.7 -0.1" width="1.8" height="4.8" depth="0.1" color="#3e1a07"></a-box>
                            <a-box position="0.95 2.7 -0.1" width="1.8" height="4.8" depth="0.1" color="#3e1a07"></a-box>
                            <!-- Door Glass Viewing Panels -->
                            <a-plane position="-0.95 3.3 -0.16" width="1.2" height="2.0" color="#38bdf8" material="opacity: 0.8;"></a-plane>
                            <a-plane position="0.95 3.3 -0.16" width="1.2" height="2.0" color="#38bdf8" material="opacity: 0.8;"></a-plane>
                            <!-- Gold Door Handles -->
                            <a-cylinder position="-0.15 2.4 -0.18" radius="0.03" height="0.4" color="#fbbf24"></a-cylinder>
                            <a-cylinder position="0.15 2.4 -0.18" radius="0.03" height="0.4" color="#fbbf24"></a-cylinder>
                            <!-- Exit Header Signboard -->
                            <a-plane position="0 5.2 -0.16" width="3.6" height="0.7" material="src: url(${exitSignSvg}); transparent: true;"></a-plane>
                        </a-entity>

                        <!-- Glowing Exit Teleport Point on Floor (Stepping here triggers 3s countdown to exterior) -->
                        <a-entity position="9.2 0.05 12.0">
                            <a-ring rotation="-90 0 0" radius-inner="1.0" radius-outer="2.2" color="#0284c7" material="opacity: 0.9; transparent: true;"
                                animation="property: rotation; to: -90 360 0; loop: true; dur: 4500; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.9" color="#facc15" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.6" height="3.6" material="color: #0284c7; opacity: 0.25; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-octahedron position="0 2.2 0" radius="0.6" color="#38bdf8" material="emissive: #38bdf8; emissiveIntensity: 0.7;"
                                animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.5 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-octahedron>
                            <a-text value="PINTU KELUAR" position="0 3.0 0" align="center" color="#ffffff" width="6" font="kelsonsans"></a-text>
                        </a-entity>

                        <!-- ================= 6 GRAND ENTRANCE ARCHWAYS (SEAMLESSLY INTEGRATED WITH WALLS) ================= -->
                        <!-- Room 0: North Entry (Centered at x: 0, z: -14.0) -->
                        ${vrGrandArchway(0, 0, -14.0, 0, shelves[0].title, shelves[0].color)}
                        <!-- Room 1: North-East Entry (Centered at x: 14.0, z: -7.0) -->
                        ${vrGrandArchway(14.0, 0, -7.0, -90, shelves[1].title, shelves[1].color)}
                        <!-- Room 2: South-East Entry (Centered at x: 14.0, z: 7.0) -->
                        ${vrGrandArchway(14.0, 0, 7.0, -90, shelves[2].title, shelves[2].color)}
                        <!-- Room 3: South Entry (Centered at x: 0, z: 14.0) -->
                        ${vrGrandArchway(0, 0, 14.0, 180, shelves[3].title, shelves[3].color)}
                        <!-- Room 4: South-West Entry (Centered at x: -14.0, z: 7.0) -->
                        ${vrGrandArchway(-14.0, 0, 7.0, 90, shelves[4].title, shelves[4].color)}
                        <!-- Room 5: North-West Entry (Centered at x: -14.0, z: -7.0) -->
                        ${vrGrandArchway(-14.0, 0, -7.0, 90, shelves[5].title, shelves[5].color)}

                        <!-- ================= CENTRAL ROTUNDA & KAUNTER PERPUSTAKAAN ================= -->
                        ${vrLibraryCounter(0, 0, -3.5, 0)}

                        <a-entity position="0 0 3.8">
                            <a-ring rotation="-90 0 0" position="0 0.02 0" radius-inner="2.5" radius-outer="5.5" color="#b8860b" material="opacity: 0.9;"></a-ring>
                            <a-ring rotation="-90 0 0" position="0 0.025 0" radius-inner="0" radius-outer="2.5" color="#78350f"></a-ring>
                            <a-cylinder position="0 0.25 0" radius="1.3" height="0.5" color="#b8860b"></a-cylinder>
                            <a-cylinder position="0 0.65 0" radius="1.0" height="0.3" color="#fef3c7"></a-cylinder>
                            <a-cylinder position="0 1.15 0" radius="0.4" height="0.7" color="#d97706"></a-cylinder>
                            <a-octahedron position="0 2.2 0" radius="0.55" color="#fbbf24" material="emissive: #fbbf24; emissiveIntensity: 0.7; metalness: 0.8;"
                                animation="property: rotation; to: 360 360 0; loop: true; dur: 6000; easing: linear"
                                animation__bob="property: position; to: 0 2.45 0; dir: alternate; loop: true; dur: 1600; easing: easeInOutSine"></a-octahedron>
                        </a-entity>

                        <!-- Grand Chandeliers in Atrium and Each Room -->
                        ${vrGrandChandelier(0, 7.8, 0)}
                        ${vrGrandChandelier(0, 7.8, -27)}
                        ${vrGrandChandelier(27, 7.8, -20)}
                        ${vrGrandChandelier(27, 7.8, 20)}
                        ${vrGrandChandelier(0, 7.8, 27)}
                        ${vrGrandChandelier(-27, 7.8, 20)}
                        ${vrGrandChandelier(-27, 7.8, -20)}

                        <!-- Benches & Urns in Atrium -->
                        ${vrMuseumBench(-5.5, 0, -5.5, 45)}
                        ${vrMuseumBench(5.5, 0, -5.5, -45)}
                        ${vrMuseumBench(-5.5, 0, 5.5, 135)}
                        ${vrMuseumBench(5.5, 0, 5.5, -135)}
                        ${vrGrandFlowerUrn(-8.5, 0, -8.5)}
                        ${vrGrandFlowerUrn(8.5, 0, -8.5)}
                        ${vrGrandFlowerUrn(-8.5, 0, 8.5)}
                        ${vrGrandFlowerUrn(8.5, 0, 8.5)}

                        <!-- ================= PURE ART PAINTINGS ON WALLS (UNOBSTRUCTED) ================= -->
                        ${roomPaintingsHtml}

                        <!-- ================= ABUNDANT BOOKSHELVES, DESKS & RICH DECORATIONS IN ALL 6 ROOMS ================= -->
                        <!-- Room 0: North Wing -->
                        ${vrGrandBookshelf(-6.5, 0, -22, 0)}
                        ${vrGrandBookshelf(6.5, 0, -22, 0)}
                        ${vrStudyTable(0, 0, -33, 0)}
                        ${vrMuseumBench(-9, 0, -33, 90)}
                        ${vrMuseumBench(9, 0, -33, -90)}
                        ${vrPottedPlant(-12, 0, -37.5)}
                        ${vrPottedPlant(12, 0, -37.5)}
                        ${vrPottedPlant(-4.5, 0, -17)}
                        ${vrPottedPlant(4.5, 0, -17)}
                        ${vrGrandFlowerUrn(-12, 0, -17)}
                        ${vrGrandFlowerUrn(12, 0, -17)}
                        ${vrWallSconce(-13.4, 3.6, -24, 90)}
                        ${vrWallSconce(13.4, 3.6, -24, -90)}

                        <!-- Room 1: North-East Wing -->
                        ${vrGrandBookshelf(16.5, 0, -22, 90)}
                        ${vrGrandBookshelf(16.5, 0, -30, 90)}
                        ${vrStudyTable(27, 0, -20, 0)}
                        ${vrMuseumBench(27, 0, -31, 0)}
                        ${vrMuseumBench(37, 0, -23, -90)}
                        ${vrPottedPlant(16.5, 0, -37.5)}
                        ${vrPottedPlant(37.5, 0, -37.5)}
                        ${vrPottedPlant(16.5, 0, -15)}
                        ${vrPottedPlant(37.5, 0, -3.5)}
                        ${vrGrandFlowerUrn(27, 0, -37.5)}
                        ${vrWallSconce(24, 3.6, -39.3, 0)}
                        ${vrWallSconce(32, 3.6, -39.3, 0)}

                        <!-- Room 2: South-East Wing -->
                        ${vrGrandBookshelf(16.5, 0, 22, 90)}
                        ${vrGrandBookshelf(16.5, 0, 30, 90)}
                        ${vrStudyTable(27, 0, 20, 180)}
                        ${vrMuseumBench(27, 0, 31, 180)}
                        ${vrMuseumBench(37, 0, 23, -90)}
                        ${vrPottedPlant(16.5, 0, 37.5)}
                        ${vrPottedPlant(37.5, 0, 37.5)}
                        ${vrPottedPlant(16.5, 0, 15)}
                        ${vrPottedPlant(37.5, 0, 3.5)}
                        ${vrGrandFlowerUrn(27, 0, 37.5)}
                        ${vrWallSconce(24, 3.6, 39.3, 180)}
                        ${vrWallSconce(32, 3.6, 39.3, 180)}

                        <!-- Room 3: South Wing -->
                        ${vrGrandBookshelf(-6.5, 0, 22, 0)}
                        ${vrGrandBookshelf(6.5, 0, 22, 0)}
                        ${vrStudyTable(0, 0, 33, 180)}
                        ${vrMuseumBench(-9, 0, 33, 90)}
                        ${vrMuseumBench(9, 0, 33, -90)}
                        ${vrPottedPlant(-12, 0, 37.5)}
                        ${vrPottedPlant(12, 0, 37.5)}
                        ${vrPottedPlant(-4.5, 0, 17)}
                        ${vrPottedPlant(4.5, 0, 17)}
                        ${vrGrandFlowerUrn(-12, 0, 17)}
                        ${vrGrandFlowerUrn(12, 0, 17)}
                        ${vrWallSconce(-13.4, 3.6, 24, 90)}
                        ${vrWallSconce(13.4, 3.6, 24, -90)}

                        <!-- Room 4: South-West Wing -->
                        ${vrGrandBookshelf(-16.5, 0, 22, -90)}
                        ${vrGrandBookshelf(-16.5, 0, 30, -90)}
                        ${vrStudyTable(-27, 0, 20, 180)}
                        ${vrMuseumBench(-27, 0, 31, 180)}
                        ${vrMuseumBench(-37, 0, 23, 90)}
                        ${vrPottedPlant(-16.5, 0, 37.5)}
                        ${vrPottedPlant(-37.5, 0, 37.5)}
                        ${vrPottedPlant(-16.5, 0, 15)}
                        ${vrPottedPlant(-37.5, 0, 3.5)}
                        ${vrGrandFlowerUrn(-27, 0, 37.5)}
                        ${vrWallSconce(-24, 3.6, 39.3, 180)}
                        ${vrWallSconce(-32, 3.6, 39.3, 180)}

                        <!-- Room 5: North-West Wing -->
                        ${vrGrandBookshelf(-16.5, 0, -22, -90)}
                        ${vrGrandBookshelf(-16.5, 0, -30, -90)}
                        ${vrStudyTable(-27, 0, -20, 0)}
                        ${vrMuseumBench(-27, 0, -31, 0)}
                        ${vrMuseumBench(-37, 0, -23, 90)}
                        ${vrPottedPlant(-16.5, 0, -37.5)}
                        ${vrPottedPlant(-37.5, 0, -37.5)}
                        ${vrPottedPlant(-16.5, 0, -15)}
                        ${vrPottedPlant(-37.5, 0, -3.5)}
                        ${vrGrandFlowerUrn(-27, 0, -37.5)}
                        ${vrWallSconce(-24, 3.6, -39.3, 0)}
                        ${vrWallSconce(-32, 3.6, -39.3, 0)}

                        <!-- ================= 6 INTERACTIVE READING STATIONS ================= -->
                        <!-- Station 0: ${shelves[0].title} (0, -27) -->
                        <a-entity position="0 0.03 -27">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[0].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[0].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[0].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-octahedron position="0 2.2 0" radius="0.6" color="${shelves[0].color}" material="emissive: ${shelves[0].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-octahedron>
                        </a-entity>

                        <!-- Station 1: ${shelves[1].title} (27, -20) -->
                        <a-entity position="27 0.03 -20">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[1].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 -360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[1].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[1].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-sphere position="0 2.2 0" radius="0.55" color="${shelves[1].color}" material="emissive: ${shelves[1].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 0 360 360; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-sphere>
                        </a-entity>

                        <!-- Station 2: ${shelves[2].title} (27, 20) -->
                        <a-entity position="27 0.03 20">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[2].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[2].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[2].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-dodecahedron position="0 2.2 0" radius="0.6" color="${shelves[2].color}" material="emissive: ${shelves[2].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 360 0 360; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-dodecahedron>
                        </a-entity>

                        <!-- Station 3: ${shelves[3].title} (0, 27) -->
                        <a-entity position="0 0.03 27">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[3].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 -360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[3].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[3].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-box position="0 2.2 0" width="0.85" height="0.85" depth="0.85" color="${shelves[3].color}" material="emissive: ${shelves[3].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 360 0 360; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-box>
                        </a-entity>

                        <!-- Station 4: ${shelves[4].title} (-27, 20) -->
                        <a-entity position="-27 0.03 20">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[4].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[4].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[4].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-octahedron position="0 2.2 0" radius="0.6" color="${shelves[4].color}" material="emissive: ${shelves[4].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 360 360 0; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-octahedron>
                        </a-entity>

                        <!-- Station 5: ${shelves[5].title} (-27, -20) -->
                        <a-entity position="-27 0.03 -20">
                            <a-ring rotation="-90 0 0" radius-inner="0.9" radius-outer="2.0" color="${shelves[5].color}" material="opacity: 0.85; transparent: true;"
                                animation="property: rotation; to: -90 -360 0; loop: true; dur: 5000; easing: linear"></a-ring>
                            <a-ring rotation="-90 0 0" radius-inner="0.3" radius-outer="0.8" color="${shelves[5].accentColor}" material="opacity: 0.95; transparent: true;"></a-ring>
                            <a-cylinder position="0 1.8 0" radius="1.5" height="3.6" material="color: ${shelves[5].color}; opacity: 0.22; transparent: true; side: double; depthWrite: false;"></a-cylinder>
                            <a-sphere position="0 2.2 0" radius="0.55" color="${shelves[5].color}" material="emissive: ${shelves[5].color}; emissiveIntensity: 0.5;"
                                animation="property: rotation; to: 0 360 360; loop: true; dur: 4000; easing: linear"
                                animation__bob="property: position; to: 0 2.6 0; dir: alternate; loop: true; dur: 1200; easing: easeInOutSine"></a-sphere>
                        </a-entity>
                    </a-scene>
                `;
            }

            const sceneEl = container.querySelector('a-scene');
            if (sceneEl) {
                const onLoaded = () => {
                    if ((sceneEl as any).resize) (sceneEl as any).resize();
                    if ((sceneEl as any).renderer) {
                        const isMobile = /Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent) || window.innerWidth <= 1024;
                        (sceneEl as any).renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
                    }
                    window.dispatchEvent(new Event('resize'));
                };
                if ((sceneEl as any).hasLoaded) {
                    onLoaded();
                } else {
                    sceneEl.addEventListener('loaded', onLoaded);
                }
            }
        };

        const timer = setTimeout(renderScene, 40);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (!(window as any).perpKeysState) (window as any).perpKeysState = {};
            (window as any).perpKeysState[e.key] = true;
            (window as any).perpKeysState[e.code] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!(window as any).perpKeysState) (window as any).perpKeysState = {};
            (window as any).perpKeysState[e.key] = false;
            (window as any).perpKeysState[e.code] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Camera Drag (Mouse & Multi-Touch enabled)
        let lastCameraTouchX = 0;
        let lastCameraTouchY = 0;
        let isMouseDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;

        const isTouchOnInteractiveUI = (el: HTMLElement | null) => {
            if (!el) return false;
            return !!el.closest('#vr-joystick-container, .vr-joystick-container, .perpustakaan-header-bar, .neo-btn, .vr-station-popup-overlay, .vr-guide-modal-overlay');
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (isTouchOnInteractiveUI(e.target as HTMLElement)) return;

            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === (window as any).perpJoystickTouchId) continue;
                if ((window as any).perpCameraTouchId == null) {
                    (window as any).perpCameraTouchId = touch.identifier;
                    lastCameraTouchX = touch.clientX;
                    lastCameraTouchY = touch.clientY;
                    break;
                }
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if ((window as any).perpCameraTouchId == null) return;

            let touch: Touch | null = null;
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === (window as any).perpCameraTouchId) {
                    touch = e.touches[i];
                    break;
                }
            }
            if (!touch) return;

            const dx = touch.clientX - lastCameraTouchX;
            const dy = touch.clientY - lastCameraTouchY;
            lastCameraTouchX = touch.clientX;
            lastCameraTouchY = touch.clientY;

            const rotSpeed = 0.0055;
            (window as any).perpCamYaw = ((window as any).perpCamYaw || 0) - dx * rotSpeed;
            (window as any).perpCamPitch = Math.max(-0.45, Math.min(0.55, ((window as any).perpCamPitch || 0) + dy * rotSpeed * 0.7));
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if ((window as any).perpCameraTouchId != null) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    if (e.changedTouches[i].identifier === (window as any).perpCameraTouchId) {
                        (window as any).perpCameraTouchId = null;
                        break;
                    }
                }
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (isTouchOnInteractiveUI(e.target as HTMLElement)) return;
            if (e.button !== 0) return;
            isMouseDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMouseDragging) return;
            const dx = e.clientX - lastMouseX;
            const dy = e.clientY - lastMouseY;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;

            const rotSpeed = 0.0055;
            (window as any).perpCamYaw = ((window as any).perpCamYaw || 0) - dx * rotSpeed;
            (window as any).perpCamPitch = Math.max(-0.45, Math.min(0.55, ((window as any).perpCamPitch || 0) + dy * rotSpeed * 0.7));
        };

        const handleMouseUp = () => {
            isMouseDragging = false;
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [phase, isHeroMode]);

    // Virtual Joystick with Multi-Touch Safety
    const handleJoystickPointer = (e: any) => {
        if (!joystickBaseRef.current) return;
        const rect = joystickBaseRef.current.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            const targetId = (window as any).perpJoystickTouchId;
            let touch = null;
            if (targetId != null) {
                for (let i = 0; i < e.touches.length; i++) {
                    if (e.touches[i].identifier === targetId) {
                        touch = e.touches[i];
                        break;
                    }
                }
            }
            if (!touch) touch = e.touches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;

        const maxDist = rect.width / 2 - 15;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > maxDist) {
            deltaX = (deltaX / distance) * maxDist;
            deltaY = (deltaY / distance) * maxDist;
        }

        if (joystickKnobRef.current) {
            joystickKnobRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }

        const normX = deltaX / maxDist;
        const normY = deltaY / maxDist;
        (window as any).perpJoystickInput = { x: normX, y: normY };
    };

    const resetJoystick = () => {
        if (joystickKnobRef.current) {
            joystickKnobRef.current.style.transform = 'translate(0px, 0px)';
        }
        (window as any).perpJoystickInput = { x: 0, y: 0 };
        (window as any).perpJoystickTouchId = null;
    };

    const activeShelf = activeShelfIdx !== null ? shelves[activeShelfIdx] : null;
    const currentWord = activeShelf ? activeShelf.words[currentCardIdx] : null;
    const accentColor = isHeroMode ? '#ea580c' : '#0284c7';
    const borderColor = isHeroMode ? '#c2410c' : '#0369a1';

    return (
        <div className="perpustakaan-3d-wrapper">
            {/* 1. TOP HEADER BAR */}
            <div className="perpustakaan-header-bar">
                <button
                    className="neo-btn bg-orange header-btn"
                    onClick={() => {
                        if (onClose) {
                            onClose();
                        }
                    }}
                    title="Kembali ke Peta"
                    aria-label="Kembali ke Peta"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>

                <div className="header-center-group">
                    <div className="neo-btn bg-orange header-pill-title">
                        <i className="fa-solid fa-cube"></i>
                        <span>{modeTitle}</span>
                    </div>
                </div>

                <button
                    className="neo-btn bg-orange header-btn"
                    onClick={() => setShowVRGuideModal(true)}
                    title="Panduan"
                    aria-label="Panduan"
                >
                    <i className="fa-solid fa-lightbulb"></i>
                </button>
            </div>

            {/* 2. A-FRAME SCENE CONTAINER */}
            <div ref={sceneContainerRef} className="perpustakaan-scene-container"></div>

            {/* 4. VIRTUAL JOYSTICK OVERLAY (Identical styling to 3D Bunyi Kata) */}
            <div
                id="vr-joystick-container"
                className="vr-joystick-container"
                ref={joystickBaseRef}
                onTouchStart={(e) => {
                    e.stopPropagation();
                    const touch = e.changedTouches[0];
                    if (touch) (window as any).perpJoystickTouchId = touch.identifier;
                    handleJoystickPointer(e);
                }}
                onTouchMove={(e) => {
                    e.stopPropagation();
                    handleJoystickPointer(e);
                }}
                onTouchEnd={(e) => {
                    e.stopPropagation();
                    resetJoystick();
                }}
                onTouchCancel={(e) => {
                    e.stopPropagation();
                    resetJoystick();
                }}
                onMouseDown={handleJoystickPointer}
                onMouseMove={(e) => {
                    if (e.buttons === 1) handleJoystickPointer(e);
                }}
                onMouseUp={resetJoystick}
            >
                <div className="vr-joystick-base">
                    <div ref={joystickKnobRef} className="vr-joystick-knob">
                        <i className="fa-solid fa-arrows-up-down-left-right" style={{ pointerEvents: 'none' }}></i>
                    </div>
                </div>
            </div>

            {/* 5. 3-SECOND COUNTDOWN OVERLAY ON ENTRANCE & EXIT PORTAL */}
            {countdown !== null && (
                <div className="perpustakaan-countdown-overlay">
                    <div className="perpustakaan-countdown-circle-wrapper">
                        {/* Animated SVG Countdown Ring */}
                        <svg className="perpustakaan-countdown-svg-ring" viewBox="0 0 120 120">
                            <defs>
                                <linearGradient id="countdownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="50%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#fbbf24" />
                                </linearGradient>
                            </defs>
                            <circle className="ring-track" cx="60" cy="60" r="50" />
                            <circle
                                className="ring-progress"
                                cx="60"
                                cy="60"
                                r="50"
                                style={{
                                    strokeDashoffset: `${((3 - (countdown || 0)) / 3) * 314}px`,
                                }}
                            />
                        </svg>
                        <div className="perpustakaan-countdown-content">
                            <div className="countdown-icon-glow">
                                <i className={countdownTarget === 'interior' ? "fa-solid fa-door-open" : "fa-solid fa-person-walking-arrow-right"}></i>
                            </div>
                            <div className="countdown-number-glow" key={countdown}>
                                {countdown}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. EXACT 3D BUNYI KATA WELCOME / GUIDE MODAL */}
            {showVRGuideModal && (
                <div
                    className="vr-guide-modal-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 99999,
                        padding: '16px',
                        fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                    }}
                    onClick={() => setShowVRGuideModal(false)}
                >
                    <div
                        className="neo-box"
                        style={{
                            backgroundColor: '#ffffff',
                            backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.12) 1.5px, transparent 1.5px)',
                            backgroundSize: '16px 16px',
                            maxWidth: '520px',
                            width: '100%',
                            padding: '28px 24px',
                            textAlign: 'center',
                            borderRadius: '24px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
                            border: `4px solid ${accentColor}`,
                            fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                            position: 'relative',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            style={{
                                fontSize: '1.6rem',
                                color: '#ffffff',
                                backgroundColor: accentColor,
                                padding: '6px 24px',
                                borderRadius: '16px',
                                display: 'inline-block',
                                margin: '0 0 15px 0',
                                fontWeight: 'bold',
                                fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                                border: `3px solid ${borderColor}`,
                            }}
                        >
                            {modeTitle}
                        </h2>

                        <p
                            style={{
                                fontSize: '0.95rem',
                                color: '#1e293b',
                                margin: '0 0 20px 0',
                                lineHeight: 1.6,
                                fontWeight: 'bold',
                                fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                            }}
                        >
                            Terokai Perpustakaan Bunyi Kata dalam mod 3D! Pusingkan peranti atau seret skrin untuk melihat 6 bilik bacaan dan pelbagai rak buku. Terokai bilik-bilik dengan gambar dan sebutan audio interaktif!
                        </p>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px',
                                marginBottom: '24px',
                                padding: '14px 10px',
                                backgroundColor: 'rgba(248, 250, 252, 0.9)',
                                borderRadius: '16px',
                                border: '2px solid #cbd5e1',
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '6px' }}>
                                    <i className="fa-solid fa-cube" style={{ fontSize: '1.6rem', color: accentColor }}></i>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
                                    Dunia 3D
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '6px' }}>
                                    <i className="fa-solid fa-volume-high" style={{ fontSize: '1.6rem', color: accentColor }}></i>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
                                    Sebut Audio
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ marginBottom: '6px' }}>
                                    <i className="fa-solid fa-arrows-spin" style={{ fontSize: '1.6rem', color: accentColor }}></i>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>
                                    Pusing 360°
                                </div>
                            </div>
                        </div>

                        <button
                            className="neo-btn"
                            style={{
                                backgroundColor: '#168f81',
                                color: '#ffffff',
                                fontSize: '1.1rem',
                                padding: '12px 32px',
                                width: '100%',
                                fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                                fontWeight: 'bold',
                                justifyContent: 'center',
                                textTransform: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowVRGuideModal(false)}
                        >
                            Mula Belajar
                        </button>
                    </div>
                </div>
            )}

            {/* 7. EXACT 3D BUNYI KATA SHOWCASE GALLERY POPUP */}
            {activeShelf && currentWord && (
                <div
                    className="vr-station-popup-overlay"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        zIndex: 99998,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        backdropFilter: 'blur(4px)',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleClosePopup();
                    }}
                >
                    <div
                        id="vr-perp-station-popup"
                        className="vr-station-popup active"
                        style={{
                            width: '94%',
                            maxWidth: '520px',
                            backgroundColor: '#ffffff',
                            borderRadius: '24px',
                            border: '4px solid #1e293b',
                            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.22), 0 4px 0 #1e293b',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            fontFamily: '"AtlantaRounded", "Century Gothic", sans-serif',
                            position: 'relative',
                            transform: 'none',
                            top: 'auto',
                            left: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Bar matching 3D Bunyi Kata */}
                        <div
                            id="vr-perp-station-header"
                            style={{
                                backgroundColor: activeShelf.color,
                                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 2px, transparent 2px)',
                                backgroundSize: '14px 14px',
                                padding: '14px 16px',
                                color: 'white',
                                textAlign: 'center',
                                position: 'relative',
                                borderBottom: '3px solid #1e293b',
                            }}
                        >
                            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: 'white' }}>
                                Galeri {activeShelf.title}
                            </h2>
                            <button
                                type="button"
                                className="neo-btn bg-red"
                                onClick={handleClosePopup}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '12px',
                                    width: '34px',
                                    height: '34px',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    zIndex: 10,
                                    color: 'white',
                                    cursor: 'pointer',
                                }}
                                title="Tutup"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Showcase Body matching 3D Bunyi Kata */}
                        <div
                            id="vr-perp-station-items-grid"
                            style={{
                                padding: '10px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                backgroundColor: '#ffffff',
                                backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.15) 1.5px, transparent 1.5px)',
                                backgroundSize: '16px 16px',
                            }}
                        >
                            <div className="vr-station-showcase-container">
                                {/* Page Indicator Badge */}
                                <div
                                    className="vr-station-page-badge"
                                    style={{
                                        backgroundColor: activeShelf.color,
                                        color: '#ffffff',
                                        border: '2px solid #1e293b',
                                        boxShadow: '0 2px 0 rgba(0,0,0,0.15)',
                                        padding: '3px 18px',
                                        borderRadius: '999px',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold',
                                        marginBottom: '6px',
                                    }}
                                >
                                    {currentCardIdx + 1} / {activeShelf.words.length}
                                </div>

                                {/* Main Carousel Row */}
                                <div className="vr-station-showcase-row">
                                    {/* Left Arrow Nav Button */}
                                    <button
                                        type="button"
                                        className="neo-btn vr-station-nav-btn"
                                        disabled={currentCardIdx === 0}
                                        onClick={() => {
                                            const prevIdx = Math.max(0, currentCardIdx - 1);
                                            setCurrentCardIdx(prevIdx);
                                        }}
                                        title="Sebelum"
                                    >
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>

                                    {/* Center Interactive Card */}
                                    <div
                                        id="vr-perp-showcase-card"
                                        className="vr-station-card"
                                        onClick={() => {
                                            const card = document.getElementById('vr-perp-showcase-card');
                                            const speakerBtn = document.getElementById('vr-perp-speaker-icon');
                                            if (card) {
                                                card.style.transform = 'scale(0.97)';
                                                card.style.borderColor = '#f59e0b';
                                                card.style.boxShadow = '0 0 0 3.5px #f59e0b, 0 8px 24px rgba(245,158,11,0.45)';
                                                setTimeout(() => {
                                                    card.style.transform = '';
                                                    card.style.borderColor = activeShelf.color;
                                                    card.style.boxShadow = '';
                                                }, 250);
                                            }
                                            if (speakerBtn) {
                                                speakerBtn.style.transform = 'scale(1.25)';
                                                speakerBtn.style.backgroundColor = '#f59e0b';
                                                setTimeout(() => {
                                                    speakerBtn.style.transform = '';
                                                    speakerBtn.style.backgroundColor = activeShelf.color;
                                                }, 350);
                                            }
                                            speakText(currentWord.word);
                                        }}
                                        style={{
                                            borderColor: activeShelf.color,
                                            borderTopWidth: '6px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                        }}
                                        title="Tekan untuk dengar audio"
                                    >
                                        {/* Audio Speaker Corner Badge Button */}
                                        <button
                                            id="vr-perp-speaker-icon"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const card = document.getElementById('vr-perp-showcase-card');
                                                const speakerBtn = document.getElementById('vr-perp-speaker-icon');
                                                if (card) {
                                                    card.style.borderColor = '#f59e0b';
                                                    card.style.boxShadow = '0 0 0 3.5px #f59e0b, 0 8px 24px rgba(245,158,11,0.45)';
                                                    setTimeout(() => {
                                                        card.style.borderColor = activeShelf.color;
                                                        card.style.boxShadow = '';
                                                    }, 300);
                                                }
                                                if (speakerBtn) {
                                                    speakerBtn.style.transform = 'scale(1.25)';
                                                    speakerBtn.style.backgroundColor = '#f59e0b';
                                                    setTimeout(() => {
                                                        speakerBtn.style.transform = '';
                                                        speakerBtn.style.backgroundColor = activeShelf.color;
                                                    }, 350);
                                                }
                                                speakText(currentWord.word);
                                            }}
                                            title="Dengar sebutan audio"
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '50%',
                                                backgroundColor: activeShelf.color,
                                                color: '#ffffff',
                                                border: '2.5px solid #1e293b',
                                                boxShadow: '0 2.5px 0 #1e293b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                zIndex: 15,
                                                transition: 'transform 0.18s ease, background-color 0.18s ease',
                                            }}
                                        >
                                            <i className="fa-solid fa-volume-high"></i>
                                        </button>

                                        {/* Suku Kata Artwork Image */}
                                        <div style={{ width: '135px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                            <img
                                                src={getSukuKataImageUrl(currentWord.word, isHeroMode)}
                                                alt={currentWord.word}
                                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', pointerEvents: 'none', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' }}
                                            />
                                        </div>

                                        {/* Connected Syllables Highlight Badge (White Pill with Black & Red Syllables, No Duplicate Word Below) */}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                speakText(currentWord.word);
                                            }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#ffffff',
                                                border: '3px solid #1e293b',
                                                borderRadius: '999px',
                                                padding: '6px 26px',
                                                boxShadow: '0 3.5px 0 #1e293b',
                                                cursor: 'pointer',
                                                marginTop: '4px',
                                                marginBottom: '4px',
                                                transition: 'transform 0.15s ease',
                                            }}
                                            title={`Dengar sebutan ${currentWord.word}`}
                                        >
                                            {currentWord.syllables.length <= 1 ? (
                                                <span
                                                    style={{
                                                        fontFamily: "AtlantaRounded, 'AtlantaRoundedBlack', Arial, sans-serif",
                                                        fontSize: '1.75rem',
                                                        fontWeight: 900,
                                                        color: '#0f172a',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    {currentWord.word.toLowerCase()}
                                                </span>
                                            ) : (
                                                currentWord.syllables.map((syl, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        style={{
                                                            fontFamily: "AtlantaRounded, 'AtlantaRoundedBlack', Arial, sans-serif",
                                                            fontSize: '1.75rem',
                                                            fontWeight: 900,
                                                            color: sIdx % 2 === 0 ? '#0f172a' : '#dc2626',
                                                            letterSpacing: '0.5px',
                                                        }}
                                                    >
                                                        {syl.toLowerCase()}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Arrow Nav Button */}
                                    <button
                                        type="button"
                                        className="neo-btn vr-station-nav-btn"
                                        disabled={currentCardIdx === activeShelf.words.length - 1}
                                        onClick={() => {
                                            const nextIdx = Math.min(activeShelf.words.length - 1, currentCardIdx + 1);
                                            setCurrentCardIdx(nextIdx);
                                        }}
                                        title="Seterusnya"
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>

                                {/* Mini Navigation Dots Below Card */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '6px', maxWidth: '90%', flexWrap: 'wrap' }}>
                                    {activeShelf.words.map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setCurrentCardIdx(i);
                                            }}
                                            style={{
                                                height: '7px',
                                                borderRadius: '999px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                width: i === currentCardIdx ? '20px' : '7px',
                                                backgroundColor: i === currentCardIdx ? activeShelf.color : '#cbd5e1',
                                                boxShadow: i === currentCardIdx ? '0 1px 0 #1e293b' : 'none',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls matching 3D Bunyi Kata */}
                        <div
                            style={{
                                padding: '12px 16px',
                                borderTop: '2px solid #e2e8f0',
                                backgroundColor: '#ffffff',
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <button
                                id="vr-auto-btn"
                                type="button"
                                className="neo-btn cursor-pointer"
                                style={{
                                    padding: '8px 18px',
                                    fontSize: '0.92rem',
                                    backgroundColor: isAutoPlaying ? '#dc2626' : '#168f81',
                                    color: 'white',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                                onClick={isAutoPlaying ? handleClosePopup : handlePlayAll}
                            >
                                <i className={`fa-solid ${isAutoPlaying ? 'fa-stop' : 'fa-volume-high'}`}></i>
                                <span>{isAutoPlaying ? 'Berhenti' : 'Dengar Semua'}</span>
                            </button>

                            <button
                                type="button"
                                className="neo-btn bg-orange cursor-pointer"
                                style={{
                                    padding: '8px 18px',
                                    fontSize: '0.92rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#f97316',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                }}
                                onClick={handleClosePopup}
                            >
                                <i className="fa-solid fa-person-walking"></i>
                                <span>Teruskan Teroka</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 8. CELEBRATION MODAL */}
            {showCelebration && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        padding: 16,
                    }}
                >
                    <div
                        className="neo-box"
                        style={{
                            maxWidth: 440,
                            textAlign: 'center',
                            padding: '30px 24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '24px',
                            border: '4px solid #10b981',
                        }}
                    >
                        <div style={{ fontSize: '3.5rem', color: '#f59e0b', marginBottom: 12 }}>
                            <i className="fa-solid fa-trophy"></i>
                        </div>
                        <h2 style={{ fontSize: '1.6rem', color: '#1e293b', fontWeight: 900, marginBottom: 8 }}>
                            TAHNIAH, PEMBACA BIJAK!
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.5, marginBottom: 20 }}>
                            Anda telah berjaya meneroka kesemua 6 Bilik Bacaan di Perpustakaan Bunyi Kata! Teruskan usaha murni ini!
                        </p>
                        <button
                            className="neo-btn bg-green"
                            style={{ width: '100%', padding: '12px', fontSize: '1.05rem', fontWeight: 900, cursor: 'pointer' }}
                            onClick={() => setShowCelebration(false)}
                        >
                            Teruskan Membaca!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
