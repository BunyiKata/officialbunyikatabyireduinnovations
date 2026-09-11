// Sahkan IAM binding pada kedua-dua rahsia, dan senaraikan versi aktif.
import fs from "node:fs";

const PROJECT = "bunyi-kata-official";
const SECRETS = ["ADMIN_CODE", "CHIP_SECRET_KEY"];
const EXPECT =
  "serviceAccount:firebase-app-hosting-compute@bunyi-kata-official.iam.gserviceaccount.com";

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
const auth = { Authorization: "Bearer " + tj.access_token };

let allOk = true;
for (const secret of SECRETS) {
  const base =
    "https://secretmanager.googleapis.com/v1/projects/" + PROJECT + "/secrets/" + secret;

  const policy = await (await fetch(base + ":getIamPolicy", { headers: auth })).json();
  const accessors = (policy.bindings || [])
    .filter((b) => b.role === "roles/secretmanager.secretAccessor")
    .flatMap((b) => b.members || []);
  const ok = accessors.includes(EXPECT);
  if (!ok) allOk = false;

  const vers = await (
    await fetch(base + "/versions?filter=state:ENABLED", { headers: auth })
  ).json();
  const enabled = (vers.versions || []).map((v) => v.name.split("/").pop());

  console.log(secret);
  console.log("  accessor SA  = " + (ok ? "OK" : "TIADA <-- MASALAH"));
  console.log("  versi ENABLED= " + (enabled.join(", ") || "(tiada!)"));
  console.log("");
}

console.log(allOk ? "SEMUA IAM OK" : "ADA MASALAH IAM");
