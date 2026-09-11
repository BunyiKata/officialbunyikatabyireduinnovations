// Baca log Cloud Run bagi backend App Hosting untuk melihat ralat sebenar.
import fs from "node:fs";

const PROJECT = "bunyi-kata-official";

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

const res = await fetch("https://logging.googleapis.com/v2/entries:list", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + tj.access_token,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    resourceNames: ["projects/" + PROJECT],
    filter:
      'resource.type="cloud_run_revision" AND resource.labels.service_name="bunyikata" AND severity>=DEFAULT',
    orderBy: "timestamp desc",
    pageSize: 40,
  }),
});
const json = await res.json();
if (json.error) {
  console.error("Ralat: " + json.error.message);
  process.exit(1);
}
const entries = json.entries || [];
if (entries.length === 0) {
  console.log("Tiada log dijumpai.");
}
for (const e of entries.reverse()) {
  const msg = e.textPayload || JSON.stringify(e.jsonPayload || {});
  console.log("[" + (e.severity || "?") + "] " + msg.slice(0, 300));
}
