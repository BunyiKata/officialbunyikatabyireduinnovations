// Pantau rollout App Hosting terkini melalui REST API.
import fs from "node:fs";

const PROJECT = "bunyi-kata-official";
const REGION = "asia-southeast1";
const BACKEND = "bunyikata";

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

const base =
  "https://firebaseapphosting.googleapis.com/v1beta/projects/" +
  PROJECT +
  "/locations/" +
  REGION +
  "/backends/" +
  BACKEND;

const res = await fetch(base + "/rollouts", { headers: auth });
const json = await res.json();
const rollouts = json.rollouts || [];

if (rollouts.length === 0) {
  console.log("Belum ada rollout. Build mungkin belum dicetuskan.");
  process.exit(0);
}

rollouts.sort((a, b) => (b.createTime || "").localeCompare(a.createTime || ""));
for (const r of rollouts.slice(0, 3)) {
  console.log("rollout   = " + r.name.split("/").pop());
  console.log("  state   = " + (r.state || "-"));
  console.log("  create  = " + (r.createTime || "-"));
  if (r.error) console.log("  ERROR   = " + JSON.stringify(r.error));
  console.log("");
}
