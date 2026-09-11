// Senaraikan backend App Hosting terus melalui REST API.
// Sebab: `firebase apphosting:backends:list` memaparkan jadual kosong.
import fs from "node:fs";

const CONFIG = "C:/Users/User/.config/configstore/firebase-tools.json";
const PROJECTS_TO_SCAN = [
  "bunyi-kata-official",
  "bunyikata",
];

const REGIONS = [
  "asia-east1",
  "asia-southeast1",
  "europe-west4",
  "us-central1",
  "us-east4",
  "us-west1",
];

const store = JSON.parse(fs.readFileSync(CONFIG, "utf8"));
const refreshToken = store?.tokens?.refresh_token;
if (!refreshToken) {
  console.error("Tiada refresh_token dalam firebase-tools.json");
  process.exit(1);
}

const body = new URLSearchParams({
  client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
  client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
  refresh_token: refreshToken,
  grant_type: "refresh_token",
});

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  body,
});
const tokenJson = await tokenRes.json();
const accessToken = tokenJson.access_token;
if (!accessToken) {
  console.error("Gagal refresh token:", JSON.stringify(tokenJson));
  process.exit(1);
}

// Cubaan 1: locations/- (semua region sekali gus)
for (const PROJECT of PROJECTS_TO_SCAN) {
  const url =
    "https://firebaseapphosting.googleapis.com/v1beta/projects/" +
    PROJECT +
    "/locations/-/backends";
  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + accessToken },
  });
  const json = await res.json();
  console.log("[locations/- " + PROJECT + "] status=" + res.status);
  console.log(JSON.stringify(json).slice(0, 600));
  console.log("");
}

// Cubaan 2: senarai projek yang token ini boleh lihat
const projRes = await fetch(
  "https://cloudresourcemanager.googleapis.com/v1/projects?filter=lifecycleState%3AACTIVE",
  { headers: { Authorization: "Bearer " + accessToken } },
);
const projJson = await projRes.json();
console.log("[projek boleh lihat] status=" + projRes.status);
for (const p of projJson.projects || []) {
  console.log("   " + p.projectId);
}
console.log("");

let found = 0;
for (const PROJECT of PROJECTS_TO_SCAN) {
  console.log("=== PROJEK: " + PROJECT + " ===");
  for (const region of REGIONS) {
    const url =
      "https://firebaseapphosting.googleapis.com/v1beta/projects/" +
      PROJECT +
      "/locations/" +
      region +
      "/backends";
    const res = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    const json = await res.json();
    if (json.error) {
      console.log("  " + region + ": ERROR " + json.error.message);
      continue;
    }
    const backends = json.backends || [];
    if (backends.length === 0) {
      console.log("  " + region + ": (kosong)");
      continue;
    }
    for (const b of backends) {
      found += 1;
      console.log("  " + region + ": " + b.name);
      console.log("     uri            = " + (b.uri || "-"));
      console.log("     serviceAccount = " + (b.serviceAccount || "-"));
      console.log("     repo           = " + (b.codebase?.repository || "-"));
    }
  }
  console.log("");
}

console.log("");
console.log("JUMLAH BACKEND DIJUMPAI: " + found);
