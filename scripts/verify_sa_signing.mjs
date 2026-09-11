// Semak sama ada SA App Hosting boleh menandatangani custom token.
// createCustomToken() perlukan peranan iam.serviceAccountTokenCreator
// ke atas SA itu sendiri, jika tidak /api/admin/verify akan gagal 500.
import fs from "node:fs";

const PROJECT = "bunyi-kata-official";
const SA = "firebase-app-hosting-compute@bunyi-kata-official.iam.gserviceaccount.com";

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

// 1) Dasar IAM pada SA itu sendiri (untuk signBlob).
const saPolicy = await (
  await fetch(
    "https://iam.googleapis.com/v1/projects/" +
      PROJECT +
      "/serviceAccounts/" +
      SA +
      ":getIamPolicy",
    { method: "POST", headers: auth, body: "{}" },
  )
).json();
console.log("== Dasar IAM pada SA sendiri ==");
console.log(JSON.stringify(saPolicy.bindings || [], null, 2));
console.log("");

// 2) Peranan peringkat projek yang dipegang SA ini.
const projPolicy = await (
  await fetch(
    "https://cloudresourcemanager.googleapis.com/v1/projects/" + PROJECT + ":getIamPolicy",
    { method: "POST", headers: auth, body: "{}" },
  )
).json();
const member = "serviceAccount:" + SA;
const roles = (projPolicy.bindings || [])
  .filter((b) => (b.members || []).includes(member))
  .map((b) => b.role);
console.log("== Peranan peringkat projek untuk SA App Hosting ==");
console.log(roles.length ? roles.join("\n") : "(tiada)");
