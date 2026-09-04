const fs = require('fs');
let code = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

const targetEffect = `useEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [matchedPairIds]);`;

const replacementEffect = `useEffect(() => {
    updateLines();
    const observer = new ResizeObserver(() => {
      updateLines();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", updateLines);
    return () => {
      window.removeEventListener("resize", updateLines);
      observer.disconnect();
    };
  }, [matchedPairIds]);`;

if (code.includes(targetEffect)) {
  code = code.replace(targetEffect, replacementEffect);
  fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', code);
  console.log("Success");
} else {
  console.log("Target not found");
}
