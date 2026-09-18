// ============================================================================
// renderIconHtml.tsx — Util render selamat (Fasa A.5)
// ----------------------------------------------------------------------------
// Tujuan: menggantikan render HTML mentah (XSS) untuk dua pola HTML yang
// digunakan dalam data statik permainan:
//
//   1) Ikon/gambar format:  <img src="/images/sukukata/bas.png"
//                              class="sk-icon-img" alt="bas"/>
//      -> renderIconHtml()  : parse guna regex, sahkan src, pulang React <img>
//
//   2) Teks suku kata berwarna (hitam #0f172a / merah #dc2626 berselang-seli)
//      -> formatSukuKataTeksReact() : pulang React <p>/<span> (bukan HTML string)
//
// KESELAMATAN:
//   - `src` WAJIB bermula dengan "/images/" (aset dalam app sahaja).
//   - Ditolak: "javascript:", "data:", "vbscript:", protokol// serta nilai
//     bukan "/images/". Bila ditolak, util pulang null supaya pemanggil jatuh
//     semula ke paparan teks biasa (kelakuan lama dikekalkan).
//   - Tiada atribut lain daripada <img> dipaparkan (onerror/onload dsb. diabaikan).
//   - Teks suku kata dirender sebagai React nodes, bukan HTML mentah.
// ============================================================================

import React from "react";

// ---------------------------------------------------------------------------
// Kawalan keselamatan atribut src.
// ---------------------------------------------------------------------------
const AWALAN_SAH = "/images/";

/**
 * Sahkan `src` gambar: mesti bermula "/images/" dan tiada skema berbahaya.
 */
export function srcIkonSah(src: string | null | undefined): src is string {
  if (!src) return false;
  const nilai = src.trim();
  if (!nilai.startsWith(AWALAN_SAH)) return false;
  // Tolak apa-apa skema berbahaya yang terselit (pertahanan berlapis).
  if (/^\s*(javascript|data|vbscript|file|blob):/i.test(nilai)) return false;
  if (nilai.includes("://")) return false;
  // Tolak sebarang aksara kawalan / newline dalam src.
  if (/[\u0000-\u001F\u007F]/.test(nilai)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Hurai satu tag <img ...> daripada teks HTML.
// ---------------------------------------------------------------------------
export interface IkonDiurai {
  src: string;
  alt: string;
}

/**
 * Kembalikan butiran <img> jika `html` ialah tag img tunggal yang sah,
 * jika tidak pulang null.
 */
export function uraiIkonImg(html: string | null | undefined): IkonDiurai | null {
  if (!html) return null;
  const teks = html.trim();
  // Hanya terima tag <img ...> (dengan atau tanpa "/" penutup).
  if (!/^<img\b[^>]*\/?>$/i.test(teks)) return null;

  const padananSrc = teks.match(/\bsrc\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!padananSrc) return null;
  const src = (padananSrc[2] ?? padananSrc[3] ?? "").trim();
  if (!srcIkonSah(src)) return null;

  // Defense in depth: tolak sebarang pengendali peristiwa (onerror, onload...)
  // atau skrip dalam tag — walaupun React tidak akan render ia, kita tidak
  // mahu menerima input yang mencurigakan langsung.
  const tanpaAttrSah = teks
    .replace(/<img\b/i, "")
    .replace(/\/?>$/, "");
  if (/\bon[a-z]+\s*=/i.test(tanpaAttrSah)) return null;
  if (/<|>/.test(tanpaAttrSah)) return null;

  const padananAlt = teks.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
  const alt = (padananAlt?.[2] ?? padananAlt?.[3] ?? "").trim();

  return { src, alt };
}

export interface OpsyenIkonHtml {
  maxHeight?: number | string;
  maxWidth?: number | string;
  width?: number | string;
  height?: number | string;
  objectFit?: React.CSSProperties["objectFit"];
  borderRadius?: number | string;
  cursor?: React.CSSProperties["cursor"];
}

function ukuran(nilai: number | string | undefined): string | undefined {
  if (nilai === undefined) return undefined;
  return typeof nilai === "number" ? `${nilai}px` : nilai;
}

/**
 * Render ikon/gambar daripada teks HTML statik TANPA render HTML mentah.
 *
 * - Bila `html` ialah <img> sah (src "/images/...") -> pulang elemen <img>.
 * - Bila tidak -> pulang null supaya pemanggil jatuh ke teks/<img> biasa.
 */
export function renderIconHtml(
  html: string | null | undefined,
  opsyen: OpsyenIkonHtml = {},
): React.ReactElement | null {
  const ikon = uraiIkonImg(html);
  if (!ikon) return null;

  const gayaGambar: React.CSSProperties = {
    maxHeight: ukuran(opsyen.maxHeight ?? 135),
    maxWidth: ukuran(opsyen.maxWidth ?? "100%"),
    objectFit: opsyen.objectFit ?? "contain",
  };
  if (opsyen.width !== undefined) gayaGambar.width = ukuran(opsyen.width);
  if (opsyen.height !== undefined) gayaGambar.height = ukuran(opsyen.height);
  if (opsyen.borderRadius !== undefined)
    gayaGambar.borderRadius = ukuran(opsyen.borderRadius);
  if (opsyen.cursor !== undefined) gayaGambar.cursor = opsyen.cursor;

  return React.createElement("img", {
    src: ikon.src,
    alt: ikon.alt || "Ikon",
    style: gayaGambar,
  });
}

// ---------------------------------------------------------------------------
// Pemecahan suku kata Bahasa Melayu (salinan tepat daripada app-logic.js).
// ---------------------------------------------------------------------------
const VOKAL = "aeiouAEIOU";

export function splitMalayWordSyllables(perkataan: string): string[] {
  const bersih = (perkataan || "").trim();
  if (!bersih) return [];
  if (bersih.length <= 2) return [bersih];

  const vIndices: number[] = [];
  for (let i = 0; i < bersih.length; i++) {
    if (VOKAL.includes(bersih[i])) vIndices.push(i);
  }

  if (vIndices.length <= 1) return [bersih];

  const bunyiDiftong = ["ng", "ny", "sy", "kh", "gh", "th"];
  function isDigraph(sub: string): boolean {
    return bunyiDiftong.includes(sub.toLowerCase());
  }

  const pemisah: number[] = [];
  for (let k = 0; k < vIndices.length - 1; k++) {
    const v1 = vIndices[k];
    const v2 = vIndices[k + 1];
    const jurang = v2 - v1 - 1;

    if (jurang === 0) {
      pemisah.push(v2);
    } else if (jurang === 1) {
      pemisah.push(v1 + 1);
    } else if (jurang === 2) {
      const sub = bersih.substring(v1 + 1, v2);
      if (isDigraph(sub)) {
        pemisah.push(v1 + 1);
      } else {
        pemisah.push(v1 + 2);
      }
    } else if (jurang >= 3) {
      pemisah.push(v1 + 2);
    }
  }

  const sukuKata: string[] = [];
  let mula = 0;
  for (const b of pemisah) {
    sukuKata.push(bersih.substring(mula, b));
    mula = b;
  }
  sukuKata.push(bersih.substring(mula));
  return sukuKata;
}

// ---------------------------------------------------------------------------
// Format teks suku kata berwarna (salinan tepat formatSukuKataTeks HTML).
// ---------------------------------------------------------------------------
const WARNA_HITAM = "#0f172a";
const WARNA_MERAH = "#dc2626";

interface PerkataanDiurai {
  prefix: string;
  syllables: string[];
  suffix: string;
  isAllBlack: boolean;
}

function uraiPerkataan(rawWord: string): PerkataanDiurai {
  if (!rawWord)
    return { prefix: "", syllables: [], suffix: "", isAllBlack: false };

  const padanan = rawWord.match(
    /^([^a-zA-ZÀ-ÿ0-9]*)([a-zA-ZÀ-ÿ0-9\-]+)([^a-zA-ZÀ-ÿ0-9]*)$/,
  );
  if (!padanan) {
    return { prefix: "", syllables: [rawWord], suffix: "", isAllBlack: true };
  }

  const prefix = padanan[1];
  const bersih = padanan[2];
  const suffix = padanan[3];
  const hurufKecil = bersih.toLowerCase();

  const isAllBlack =
    hurufKecil === "miau" ||
    hurufKecil === "slurp" ||
    hurufKecil === "yay" ||
    hurufKecil === "prriittt";

  if (bersih.includes("-")) {
    const subPerkataan = bersih.split("-");
    const bahagian: string[] = [];
    subPerkataan.forEach((sw, idx) => {
      if (idx > 0) bahagian.push("-");
      bahagian.push(...splitMalayWordSyllables(sw));
    });
    return { prefix, syllables: bahagian, suffix, isAllBlack };
  }

  return {
    prefix,
    syllables: splitMalayWordSyllables(bersih),
    suffix,
    isAllBlack,
  };
}

function kunciUnik(i: number | string): string {
  return `bk-${i}`;
}

/**
 * Render teks suku kata berwarna sebagai React nodes.
 *
 * Keluaran adalah SERUPA dari segi visual dengan HTML lama:
 *   <p style="margin:4px 0; line-height:...; text-align:...">
 *     <span style="color:#0f172a !important; font-weight:inherit">…</span>…
 *   </p>
 *
 * @param text     Teks penuh (boleh ada "\n" untuk baris baharu).
 * @param textAlign Penjajaran ("left" | "center" | "justify" | ...).
 * @param isAyatPanjang  Jika true, line-height 1.25 (lama: modul ayat_panjang).
 */
export function formatSukuKataTeksReact(
  text: string | null | undefined,
  textAlign: string = "center",
  isAyatPanjang: boolean = false,
): React.ReactNode {
  if (!text) return null;

  let isRed = false;
  const lHeight = isAyatPanjang ? "1.25" : "1.45";
  const lines = text.split("\n");

  const gayaSpan = (warna: string): React.CSSProperties => ({
    color: warna,
    fontWeight: "inherit",
  });

  return lines.map((line, lineIdx) => {
    const tokens = line.split(/(\s+)/);
    const bahagian: React.ReactNode[] = [];

    tokens.forEach((token, tokenIdx) => {
      if (/^\s+$/.test(token)) {
        bahagian.push(token);
        return;
      }

      const { prefix, syllables, suffix, isAllBlack } = uraiPerkataan(token);
      const nodPerkataan: React.ReactNode[] = [];

      if (prefix) {
        nodPerkataan.push(
          React.createElement(
            "span",
            {
              key: kunciUnik(`p-${lineIdx}-${tokenIdx}`),
              style: gayaSpan(WARNA_HITAM),
            },
            prefix,
          ),
        );
      }

      syllables.forEach((syl, sylIdx) => {
        if (syl === "-") {
          nodPerkataan.push(
            React.createElement(
              "span",
              {
                key: kunciUnik(`d-${lineIdx}-${tokenIdx}-${sylIdx}`),
                style: gayaSpan(WARNA_HITAM),
              },
              "-",
            ),
          );
          return;
        }

        const warna = !isAllBlack && isRed ? WARNA_MERAH : WARNA_HITAM;
        if (!isAllBlack) {
          isRed = !isRed;
        }
        nodPerkataan.push(
          React.createElement(
            "span",
            {
              key: kunciUnik(`s-${lineIdx}-${tokenIdx}-${sylIdx}`),
              style: gayaSpan(warna),
            },
            syl,
          ),
        );
      });

      if (suffix) {
        nodPerkataan.push(
          React.createElement(
            "span",
            {
              key: kunciUnik(`q-${lineIdx}-${tokenIdx}`),
              style: gayaSpan(WARNA_HITAM),
            },
            suffix,
          ),
        );
      }

      bahagian.push(
        React.createElement(
          React.Fragment,
          { key: kunciUnik(`w-${lineIdx}-${tokenIdx}`) },
          nodPerkataan,
        ),
      );
    });

    return React.createElement(
      "p",
      {
        key: kunciUnik(`l-${lineIdx}`),
        style: {
          margin: "4px 0",
          lineHeight: lHeight,
          textAlign: textAlign as React.CSSProperties["textAlign"],
        },
      },
      bahagian,
    );
  });
}
