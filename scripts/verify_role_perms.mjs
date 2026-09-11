// Semak kebenaran yang terkandung dalam roles/firebase.sdkAdminServiceAgent.
// Kita perlu tahu sama ada iam.serviceAccounts.signBlob disertakan,
// kerana createCustomToken() bergantung padanya.
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
const auth = { Authorization: "Bearer " + tj.access_token };

for (const role of [
  "roles/firebase.sdkAdminServiceAgent",
  "roles/firebaseapphosting.computeRunner",
]) {
  const res = await fetch("https://iam.googleapis.com/v1/" + role, { headers: auth });
  const j = await res.json();
  const perms = j.includedPermissions || [];
  const interesting = perms.filter((p) => p.startsWith("iam.serviceAccounts"));
  console.log("== " + role + " ==");
  console.log("  jumlah kebenaran = " + perms.length);
  console.log("  berkaitan        = " + (interesting.join(", ") || "(tiada)"));
  console.log("");
}
