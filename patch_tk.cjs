const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf8');

const startIndex = code.indexOf("<h2 style={{ fontSize: 'clamp(1.8rem, 8vw, 2.6rem)', backgroundColor: 'var(--color-orange, #f97316)'");

// find "<div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '12px' }}>"
const nextDiv = code.indexOf("display: 'flex', gap: '12px', width: '100%', marginTop: '12px'", startIndex);
const endIndex = code.lastIndexOf("<div", nextDiv);


if (startIndex !== -1 && endIndex !== -1) {
    const target = code.substring(startIndex, endIndex);
    
    const replacement = `<motion.div 
                                    className="shiny-reveal"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                    style={{ borderRadius: '16px', overflow: 'hidden', padding: 0 }}
                                >
                                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', whiteSpace: 'nowrap', backgroundColor: 'var(--color-purple, #9333ea)', padding: '12px 24px', borderRadius: '16px', color: 'white', fontWeight: '900', margin: 0, fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif", border: '3px solid var(--color-dark, #10182f)', boxShadow: '0 6px 0 var(--color-dark, #10182f)', textShadow: '0 2px 4px rgba(0,0,0,0.2)', position: 'relative' }}>
                                        {headerText}
                                    </h2>
                                </motion.div>
                                
                                <div style={{ display: 'flex', gap: '14px', margin: '10px 0', justifyContent: 'center', alignItems: 'center' }}>
                                    <motion.div
                                        initial={{ y: -90, opacity: 0, scale: 0.2, rotate: -25 }}
                                        animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 360,
                                            damping: 18,
                                            delay: 0.1
                                        }}
                                        style={{
                                            position: 'relative',
                                            filter: 'drop-shadow(0px 7px 0px #b45309) drop-shadow(0px 10px 16px rgba(245, 158, 11, 0.45))',
                                            transform: 'scale(1.08)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <div className="shiny-reveal" style={{ borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                                            <svg width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                                                <defs>
                                                    <linearGradient id="starGold_tk_single" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                                        <stop offset="0%" stopColor="#fef08a" />
                                                        <stop offset="35%" stopColor="#fbbf24" />
                                                        <stop offset="75%" stopColor="#f59e0b" />
                                                        <stop offset="100%" stopColor="#d97706" />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z"
                                                    fill="url(#starGold_tk_single)"
                                                    stroke="#10182f"
                                                    strokeWidth="4"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z"
                                                    fill="rgba(255, 255, 255, 0.3)"
                                                />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-dark, #10182f)', fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif" }}>
                                            {activeStars}
                                        </span>
                                    </motion.div>
                                </div>
                                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#334155', margin: '4px 0 8px 0' }}>
                                    Anda berjaya mendapat {activeStars} bintang.
                                </p>\n                                `;

    code = code.replace(target, replacement);
    fs.writeFileSync('src/components/TandukKataGame.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to find target");
}
