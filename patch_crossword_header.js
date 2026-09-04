const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const targetStr = `<div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          display: "inline-block",
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "4px 14px",
          borderRadius: "9999px",
          fontWeight: "800",
          fontSize: "0.88rem",
          letterSpacing: "0.5px"
        }}>
          Cabaran KVK+KV+KVK
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0f172a", marginTop: "6px" }}>
          Cari perkataan KVK+KV+KVK dalam teka silang kata (drag/pilih huruf):
        </div>
      </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, '');
  fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
  console.log("Success");
} else {
  console.log("Not found");
}
