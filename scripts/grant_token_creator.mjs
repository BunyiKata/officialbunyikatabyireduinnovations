// Beri SA App Hosting peranan serviceAccountTokenCreator KE ATAS DIRINYA SENDIRI.
// Sebab: server.js /api/admin/verify memanggil createCustomToken(), yang perlukan
// iam.serviceAccounts.signBlob. Peranan lalai App Hosting TIDAK menyertakannya,
// jadi login admin akan gagal 500 tanpa pemberian ini.
import fs from "node:fs";

const PROJECT = "bunyi-kata-official";
const SA = "firebase-app-hosting-compute@bunyi-kata-official.iam.gserviceaccount.com";
const ROLE = "roles/iam.serviceAccountTokenCreator";
const MEMBER = "serviceAccount:" + SA;

const store = JSON.parse(
  fs.readFileSync("C:/Users/User/.config/configstore/firebase-tools.json", "utf8"),
);
const body = new URLSearchParams({
  client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
  client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
  refresh_token: store.tokens.refresh_token,
  grant_type: "refresh_token",
});
const tj = await (
  await fetch("https://oauth2.googleapis.com/token", { method: "POST", body })
).json();
const auth = {
  Authorization: "Bearer " + tj.access_token,
  "Content-Type": "application/json",
};

const base =
  "https://iam.googleapis.com/v1/projects/" + PROJECT + "/serviceAccounts/" + SA;

const policy = await (
  await fetch(base + ":getIamPolicy", { method: "POST", headers: auth, body: "{}" })
).json();

const bindings = policy.bindings || [];
let binding = bindings.find((b) => b.role === ROLE);
if (!binding) {
  binding = { role: ROLE, members: [] };
  bindings.push(binding);
}
if (binding.members.includes(MEMBER)) {
  console.log("Sudah ada — tiada perubahan diperlukan.");
  process.exit(0);
}
binding.members.push(MEMBER);

const setRes = await fetch(base + ":setIamPolicy", {
  method: "POST",
  headers: auth,
  body: JSON.stringify({
    policy: { bindings, etag: policy.etag },
  }),
});
const setJson = await setRes.json();
if (setJson.error) {
  console.error("GAGAL: " + setJson.error.message);
  process.exit(1);
}
console.log("BERJAYA. Bindings sekarang:");
for (const b of setJson.bindings || []) {
  console.log("  " + b.role + " -> " + (b.members || []).join(", "));
}
