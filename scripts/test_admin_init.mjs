// Mengesahkan getAdminApp() berjaya dimulakan dan boleh menandatangani token,
// menggunakan logik yang SAMA seperti server.js.
process.env.FIREBASE_PROJECT_ID = "bunyi-kata-official";
process.env.FIREBASE_DATABASE_URL =
  "https://bunyi-kata-official-default-rtdb.asia-southeast1.firebasedatabase.app";

const admin = (await import("firebase-admin")).default;
const { getApps } = await import("firebase-admin/app");

console.log("versi admin.apps  = " + typeof admin.apps + "  (undefined = v14)");
console.log("getApps tersedia  = " + (typeof getApps === "function"));

const existing = getApps();
console.log("apl sedia ada     = " + existing.length);

const app = admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
console.log("initializeApp     = OK (" + app.name + ")");
console.log("getApps selepas   = " + getApps().length);
console.log("");
console.log("LULUS: logik getApps() berfungsi tanpa melemparkan ralat.");
