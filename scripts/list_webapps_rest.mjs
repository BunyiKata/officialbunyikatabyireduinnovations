// Senaraikan Web App sebenar dalam projek, untuk sahkan appId.
import fs from "node:fs";

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

const res = await fetch(
  "https://firebase.googleapis.com/v1beta1/projects/bunyi-kata-official/webApps",
  { headers: { Authorization: "Bearer " + tj.access_token } },
);
const json = await res.json();
for (const app of json.apps || []) {
  console.log("displayName = " + (app.displayName || "-"));
  console.log("appId       = " + app.appId);
  console.log("");
}
