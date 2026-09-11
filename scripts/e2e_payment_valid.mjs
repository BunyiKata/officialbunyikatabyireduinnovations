// E2E: Membuktikan pembayaran SAH (disahkan pelayan) masih memberi akses Pro.
// Kita pintas respons /api/chip/verify-purchase supaya ia memulangkan "paid",
// meniru pengesahan sebenar daripada CHIP tanpa membuat bayaran betul.
import { spawn } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import WebSocket from 'ws';

const TEST_EMAIL = 'e2e-sah@bunyikata.test';
const TEST_PURCHASE_ID = 'e2e-purchase-abc123';

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].find((p) => existsSync(p));
if (!CHROME) { console.error('Chrome tidak dijumpai.'); process.exit(1); }

const PORT = 9224;
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'bk-e2e2-'))}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', 'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const j = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { }
    await sleep(500);
  }
  throw new Error('Gagal sambung ke Chrome.');
}

const ws = new WebSocket(await getWsUrl(), { perMessageDeflate: false });
await new Promise((r) => ws.once('open', r));

let msgId = 0;
const pending = new Map();
let interceptedVerify = false;

function send(method, params = {}, sessionId) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

// PENTING: pengendali mesej mesti didaftarkan SEBELUM sebarang arahan dihantar,
// jika tidak respons pertama hilang dan skrip tergantung selama-lamanya.
ws.on('message', async (raw) => {
  const msg = JSON.parse(raw.toString());
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    return;
  }
  if (msg.method === 'Fetch.requestPaused') {
    const { requestId, request } = msg.params;
    if (request.url.includes('/api/chip/verify-purchase/')) {
      interceptedVerify = true;
      const body = JSON.stringify({
        success: true, paid: true, status: 'paid',
        email: TEST_EMAIL, purchase_id: TEST_PURCHASE_ID,
        amount: 1500, currency: 'MYR',
        plan: { key: '1bulan', name: '1 Bulan (Pro)', days: 30 },
      });
      await send('Fetch.fulfillRequest', {
        requestId, responseCode: 200,
        responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
        body: Buffer.from(body).toString('base64'),
      }, msg.sessionId);
    } else {
      await send('Fetch.continueRequest', { requestId }, msg.sessionId).catch(() => { });
    }
  }
});

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

await send('Runtime.enable', {}, sessionId);
await send('Page.enable', {}, sessionId);

// Ganti window.fetch SEBELUM app dimuatkan supaya respons verify daripada
// pelayan boleh ditiru (meniru CHIP mengesahkan bayaran sebagai "paid").
// Ini lebih boleh dipercayai daripada pemintasan Fetch domain CDP.
const stub = `
(() => {
  const asli = window.fetch;
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('/api/chip/verify-purchase/')) {
      window.__verifyDipanggil = true;
      return Promise.resolve(new Response(JSON.stringify({
        success: true, paid: true, status: 'paid',
        email: ${JSON.stringify(TEST_EMAIL)},
        purchase_id: ${JSON.stringify(TEST_PURCHASE_ID)},
        amount: 1500, currency: 'MYR',
        plan: { key: '1bulan', name: '1 Bulan (Pro)', days: 30 }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return asli.apply(this, arguments);
  };
})();
`;
await send('Page.addScriptToEvaluateOnNewDocument', { source: stub }, sessionId);

await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] }, sessionId);


const evaluate = async (expr) => {
  const r = await send('Runtime.evaluate',
    { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
  return r?.result?.value;
};

const URL_OK = `http://localhost:3000/?payment=success&purchase_id=${TEST_PURCHASE_ID}`;
console.log(`\n[1] Meniru pulangan bayaran SAH:\n    ${URL_OK}`);
await send('Page.navigate', { url: URL_OK }, sessionId);
await sleep(11000);

// Diagnostik: pastikan app benar-benar dimuatkan sebelum menilai keputusan.
const diag = {
  reactMounted: await evaluate('Boolean(document.querySelector("#root") && document.querySelector("#root").children.length > 0)'),
  hasVerifyFn: await evaluate('typeof window.sahkanBayaranChip'),
  bodyLen: await evaluate('Number(document.body.innerText.length)'),
};
console.log(`\n[1b] Diagnostik: react=${diag.reactMounted} sahkanFn=${diag.hasVerifyFn} bodyLen=${diag.bodyLen}`);

// Uji terus sama ada pemintasan Fetch berfungsi untuk endpoint verify.
const directCall = await evaluate(
  `window.sahkanBayaranChip("${TEST_PURCHASE_ID}").then(r => JSON.stringify(r))`,
);
console.log(`[1c] Panggilan terus sahkanBayaranChip => ${directCall}`);

const accessLevel = await evaluate('String(localStorage.getItem("bunyiKataAccessLevel"))');
const bodyText = await evaluate('String(document.body.innerText).slice(0,500)');
const verifyCalled = await evaluate('Boolean(window.__verifyDipanggil)');
if (verifyCalled) interceptedVerify = true;

console.log(`\n[2] Keputusan:`);
console.log(`    Verify dipintas       = ${interceptedVerify}`);
console.log(`    bunyiKataAccessLevel  = ${accessLevel}`);
console.log(`    Toast "Berjaya"       = ${/Langganan Pro Berjaya/i.test(bodyText || '')}`);

// Semak rekod order ditulis ke Firebase (node 'orders' dahulunya kosong)
const base = process.env.VITE_FIREBASE_DATABASE_URL;
let orderWritten = false;
if (base) {
  const orders = (await (await fetch(`${base}/orders.json`)).json()) || {};
  orderWritten = Object.values(orders).some((o) => o?.purchase_id === TEST_PURCHASE_ID);
  console.log(`    Rekod order ditulis   = ${orderWritten}`);

  // BERSIHKAN data ujian supaya DB kekal bersih
  const key = TEST_PURCHASE_ID.replace(/[.#$/[\]]/g, '_');
  await fetch(`${base}/orders/${key}.json`, { method: 'DELETE' });
  const profiles = (await (await fetch(`${base}/profiles.json`)).json()) || {};
  for (const [k, p] of Object.entries(profiles)) {
    if ((p?.email || '').toLowerCase() === TEST_EMAIL) {
      await fetch(`${base}/profiles/${k}.json`, { method: 'DELETE' });
      console.log(`    (dibersihkan profil ujian ${k})`);
    }
  }
  console.log(`    (dibersihkan rekod ujian)`);
}

const pass = interceptedVerify && accessLevel === 'pro' && orderWritten;
console.log(`\n${pass ? 'VERIFIED_VALID_PAYMENT_PASS' : 'VALID_PAYMENT_FAIL'}\n`);

ws.close();
chrome.kill();
process.exit(pass ? 0 : 1);
