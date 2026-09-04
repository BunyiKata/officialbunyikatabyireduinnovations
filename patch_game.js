const fs = require('fs');
let content = fs.readFileSync('src/components/CabaranSukuKataGame.tsx', 'utf8');

content = content.replace(
  "const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);",
  "const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);\n  const [selectedOption, setSelectedOption] = useState<string | null>(null);"
);

content = content.replace(
  "setSusunSlots([]);\n      setActiveBakulWordIndex(0);",
  "setSusunSlots([]);\n      setActiveBakulWordIndex(0);\n      setSelectedOption(null);"
);

content = content.replace(
  "const handleOptionClick = (option: string) => {\n    if (feedback !== null || gameState !== 'playing') return;\n    \n    const currentQ = questions[currentIndex];",
  "const handleOptionClick = (option: string) => {\n    if (feedback !== null || gameState !== 'playing') return;\n    setSelectedOption(option);\n    \n    const currentQ = questions[currentIndex];"
);

content = content.replace(
  "const handleBakulClick = (category: string) => {\n     if (feedback !== null || gameState !== 'playing') return;\n     \n     const currentQ = questions[currentIndex];",
  "const handleBakulClick = (category: string) => {\n     if (feedback !== null || gameState !== 'playing') return;\n     setSelectedOption(category);\n     \n     const currentQ = questions[currentIndex];"
);

content = content.replace(
  "border: `4px solid ${feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : 'var(--color-dark)'}`",
  "border: '4px solid var(--color-dark)'"
);

content = content.replace(
  /{currentQ\.options\.map\(\(opt: string, i: number\) => \([\s\S]*?<\/button>\s*\)\)}/,
  `{currentQ.options.map((opt: string, i: number) => {
                         let btnBg = 'bg-white';
                         let textColor = 'var(--color-dark)';
                         let btnStyle = { padding: '20px', fontSize: '1.8rem', textTransform: 'none' as const, opacity: 1, pointerEvents: 'auto' as const, color: textColor };
                         
                         if (currentQ.type === 'susun') {
                             if (susunSlots.includes(opt)) {
                                 btnStyle.opacity = 0.5;
                                 btnStyle.pointerEvents = 'none';
                             }
                         } else {
                             if (selectedOption === opt) {
                                 btnBg = feedback === 'correct' ? 'bg-green' : feedback === 'wrong' ? 'bg-red' : 'bg-white';
                                 if (feedback) btnStyle.color = 'white';
                             }
                         }

                         return (
                             <button 
                                 key={i} 
                                 className={\`neo-btn \${btnBg}\`} 
                                 style={btnStyle}
                                 onClick={() => handleOptionClick(opt)}
                             >
                                 {opt}
                             </button>
                         );
                     })}`
);

content = content.replace(
  `<button className="neo-box" onClick={() => handleBakulClick('A')} style={{ backgroundColor: '#fef08a', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>`,
  `<button className="neo-box" onClick={() => handleBakulClick('A')} style={{ backgroundColor: selectedOption === 'A' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#fef08a') : '#fef08a', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>`
);

content = content.replace(
  `<strong style={{ color: '#854d0e' }}>Bakul A</strong>
                             <span style={{ fontSize: '0.9rem', color: '#a16207' }}>Bermula Vokal "A"</span>`,
  `<strong style={{ color: selectedOption === 'A' && feedback ? 'white' : '#854d0e' }}>Bakul A</strong>
                             <span style={{ fontSize: '0.9rem', color: selectedOption === 'A' && feedback ? 'white' : '#a16207' }}>Bermula Vokal "A"</span>`
);

content = content.replace(
  `<button className="neo-box" onClick={() => handleBakulClick('B')} style={{ backgroundColor: '#bae6fd', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>`,
  `<button className="neo-box" onClick={() => handleBakulClick('B')} style={{ backgroundColor: selectedOption === 'B' ? (feedback === 'correct' ? 'var(--color-green)' : feedback === 'wrong' ? 'var(--color-red)' : '#bae6fd') : '#bae6fd', width: '200px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'transform 0.2s' }}>`
);

content = content.replace(
  `<strong style={{ color: '#075985' }}>Bakul B</strong>
                             <span style={{ fontSize: '0.9rem', color: '#0ea5e9' }}>Bermula Vokal "I/U/E/O"</span>`,
  `<strong style={{ color: selectedOption === 'B' && feedback ? 'white' : '#075985' }}>Bakul B</strong>
                             <span style={{ fontSize: '0.9rem', color: selectedOption === 'B' && feedback ? 'white' : '#0ea5e9' }}>Bermula Vokal "I/U/E/O"</span>`
);

// Map top bar fixing
content = content.replace(
  `<div className="map-top-bar" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="neo-btn bg-purple" onClick={onClose} style={{ minWidth: '48px', minHeight: '48px', padding: 0, borderRadius: '50%' }}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="neo-btn bg-purple" style={{ pointerEvents: 'none', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
          {title.toUpperCase()}
        </div>
        <div style={{ width: '48px' }}></div>
      </div>`,
  `<div className="map-top-bar">
        <button className="neo-btn bg-purple back-icon-btn" onClick={onClose} aria-label="Kembali">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="neo-btn bg-purple page-title" style={{ pointerEvents: 'none', fontSize: '1.2rem', whiteSpace: 'nowrap' }}>
          {title.toUpperCase()}
        </div>
        <div></div>
      </div>`
);


fs.writeFileSync('src/components/CabaranSukuKataGame.tsx', content);
