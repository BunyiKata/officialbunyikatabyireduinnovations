const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

// The flex wrapper
const wrapperRegex = /<div style={{\s*display: "flex",\s*flexDirection: "row",\s*flexWrap: "wrap",\s*gap: "20px",\s*justifyContent: "center",\s*alignItems: "flex-start"\s*}}>/g;
code = code.replace(wrapperRegex, '<div className="flex flex-col-reverse md:flex-row flex-wrap gap-5 justify-center items-center md:items-start w-full">');

// The Word List container
const wordListContainerRegex = /<div style={{\s*flex: "1 1 180px",\s*minWidth: "160px",\s*maxWidth: "240px",\s*display: "flex",\s*flexDirection: "column",\s*gap: "8px"\s*}}>/g;
code = code.replace(wordListContainerRegex, '<div className="flex-1 min-w-[280px] md:min-w-[160px] md:max-w-[240px] flex flex-col gap-3 bg-slate-100 p-4 rounded-2xl border-2 border-slate-200">');

// The words wrapper
const wordsWrapperRegex = /<div style={{\s*display: "flex",\s*flexDirection: "column",\s*gap: "8px"\s*}}>/g;
code = code.replace(wordsWrapperRegex, '<div className="flex flex-row md:flex-col flex-wrap gap-2">');

// Word item
const wordItemRegex = /<div\s*key={idx}\s*className="neo-box"\s*style={{\s*padding: "8px 12px",\s*borderRadius: "12px",\s*backgroundColor: isFound \? "#dcfce7" : "#ffffff",\s*border: isFound \? "2px solid #22c55e" : "2px solid #cbd5e1",\s*color: isFound \? "#15803d" : "#0f172a",\s*fontWeight: "800",\s*fontSize: "1.1rem",\s*display: "flex",\s*alignItems: "center",\s*justifyContent: "space-between",\s*textDecoration: isFound \? "line-through" : "none"\s*}}\s*>/g;
code = code.replace(wordItemRegex, '<div key={idx} className={`neo-box flex-1 min-w-[100px] md:min-w-0 flex items-center justify-between px-3 py-1.5 md:px-3 md:py-2 rounded-xl font-bold text-[0.9rem] md:text-[1.1rem] ${isFound ? "bg-green-100 border-2 border-green-500 text-green-700 line-through" : "bg-white border-2 border-slate-300 text-slate-800"}`}>');

fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
console.log("Success");
