const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

// ENVIRONMENT_DECORATIONS update
code = code.replace(
    /const ENVIRONMENT_DECORATIONS = \{[\s\S]*?\}\s*};\n/,
    "const ENVIRONMENT_DECORATIONS = {\n" +
    "    bushes: [...Array(20)].map((_, i) => ({\n" +
    "        id: `barrel-${i}`,\n" +
    "        x: 200 + i * 400 + Math.random() * 200,\n" +
    "        emoji: '🛢️'\n" +
    "    })),\n" +
    "    trees: [...Array(15)].map((_, i) => ({\n" +
    "        id: `crate-${i}`,\n" +
    "        x: 400 + i * 550 + Math.random() * 200,\n" +
    "        emoji: '📦'\n" +
    "    }))\n" +
    "};\n"
);

// State hooks
code = code.replace(
    "const [gameItems, setGameItems] = useState<any[]>([]);",
    "const [gameItems, setGameItems] = useState<any[]>([]);\n    const [gamePlatforms, setGamePlatforms] = useState<any[]>([]);"
);

code = code.replace(
    "const gameItemsRef = useRef<any[]>([]);",
    "const gameItemsRef = useRef<any[]>([]);\n    const platformsRef = useRef<any[]>([]);"
);

// startGame method
const startGameRegex = /const startGame = \(category: string\) => \{[\s\S]*?setActiveWord\(null\);\n    \};/;
const newStartGame = `const startGame = (category: string) => {
        setSelectedCategory(category);
        const words = WORD_DATABASE[category as keyof typeof WORD_DATABASE] || [];
        const items = words.map((item, index) => {
            const isElevated = index % 2 !== 0;
            const platformY = isElevated ? 200 + Math.random() * 50 : 0;
            return { ...item, id: index, x: 600 + index * 600, y: platformY, collected: false };
        });
        const platforms = items.filter(i => i.y > 0).map((item, i) => ({
            id: \`plat-\${i}\`, x: item.x - 120, y: item.y - 45, width: 240, height: 30
        }));
        setGameItems(items);
        gameItemsRef.current = items;
        setGamePlatforms(platforms);
        platformsRef.current = platforms;
        setStars(0);
        setCharacterPos({ x: 100, y: 0 });
        setCameraX(0);
        charStateRef.current = { x: 100, y: 0, vx: 0, vy: 0, isJumping: false, facingRight: true };
        setGameState('playing');
        activeWordRef.current = null;
        setActiveWord(null);
    };`;
code = code.replace(startGameRegex, newStartGame);

// Physics loop
const oldPhysicsStr = `            if (!isPaused || state.y > 0) {
                state.vy -= GRAVITY * dt;
                state.x += state.vx * dt;
                state.y += state.vy * dt;
            }

            if (state.y <= 0) {
                state.y = 0;
                state.vy = 0;
                state.isJumping = false;
            }
            
            if (state.x < 50) state.x = 50;
            
            setCharacterPos({ x: state.x, y: state.y });
            setIsJumping(state.isJumping);
            setFacingRight(state.facingRight);

            setCameraX(state.x > 300 ? state.x - 300 : 0);`;

const newPhysicsStr = `            if (!isPaused || state.y > 0) {
                state.vy -= GRAVITY * dt;
                let nextX = state.x + state.vx * dt;
                let nextY = state.y + state.vy * dt;
                let onGround = false;
                const dropDown = keys.current['ArrowDown'] || keys.current['KeyS'];
                if (nextY <= 0) {
                    nextY = 0;
                    state.vy = 0;
                    onGround = true;
                }
                if (state.vy < 0 && !dropDown) {
                    for (const plat of platformsRef.current) {
                        if (state.y >= plat.y && nextY <= plat.y) {
                            if (nextX + 30 > plat.x && nextX - 30 < plat.x + plat.width) {
                                nextY = plat.y;
                                state.vy = 0;
                                onGround = true;
                                break;
                            }
                        }
                    }
                }
                state.x = Math.max(50, nextX);
                state.y = nextY;
                state.isJumping = !onGround;
            }

            setCharacterPos({ x: state.x, y: state.y });
            setIsJumping(state.isJumping);
            setFacingRight(state.facingRight);
            
            const screenWidth = window.innerWidth;
            let targetCameraX = state.x - screenWidth / 2;
            if (targetCameraX < 0) targetCameraX = 0;
            setCameraX(prev => prev + (targetCameraX - prev) * 8 * dt);`;

code = code.replace(oldPhysicsStr, newPhysicsStr);

// Jump method update
code = code.replace(
    "if (charStateRef.current.y <= 0 && activeWordRef.current === null && gameState === 'playing')",
    "if (!charStateRef.current.isJumping && activeWordRef.current === null && gameState === 'playing')"
);

// JSX changes
// Sky Color
code = code.replace("backgroundColor: '#70c5ce'", "backgroundColor: '#fb923c'");

// Floor and platforms
const oldJSXStr = `                {/* Floor */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: \`\${FLOOR_Y}px\`, backgroundColor: '#4ade80', borderTop: '20px solid #d97706', backgroundImage: 'radial-gradient(#22c55e 3px, transparent 3px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Decorative bushes & trees */}
                {ENVIRONMENT_DECORATIONS.bushes.map(bush => (
                    <div key={bush.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${bush.x}px\`, fontSize: '5rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>🌲</div>
                ))}
                {ENVIRONMENT_DECORATIONS.trees.map(tree => (
                    <div key={tree.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${tree.x}px\`, fontSize: '4rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>🌳</div>
                ))}`;

const newJSXStr = `                {/* Floor */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: \`\${FLOOR_Y}px\`, backgroundColor: '#eab308', borderTop: '20px solid #78350f', backgroundImage: 'radial-gradient(#a16207 3px, transparent 3px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Platforms */}
                {gamePlatforms.map(plat => (
                    <div key={plat.id} style={{ 
                        position: 'absolute', bottom: \`\${FLOOR_Y + plat.y}px\`, left: \`\${plat.x}px\`, 
                        width: \`\${plat.width}px\`, height: \`\${plat.height}px\`, 
                        backgroundColor: '#8b5a2b', borderTop: '6px solid #5c3a21', borderBottom: '6px solid #3e2717',
                        borderRadius: '4px', boxShadow: '0 8px 0 rgba(0,0,0,0.2)', zIndex: 2
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '100%', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)' }}></div>
                    </div>
                ))}

                {/* Decorative bushes & trees (Now Pirate Theme Barrels & Crates) */}
                {ENVIRONMENT_DECORATIONS.bushes.map(bush => (
                    <div key={bush.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${bush.x}px\`, fontSize: '5rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>{bush.emoji}</div>
                ))}
                {ENVIRONMENT_DECORATIONS.trees.map(tree => (
                    <div key={tree.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${tree.x}px\`, fontSize: '4rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>{tree.emoji}</div>
                ))}`;

code = code.replace(oldJSXStr, newJSXStr);

// Mobile controls down arrow
const mobileControlsOldStr = `                <button 
        className="neo-btn bg-yellow" 
        style={{ width: '90px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { e.preventDefault(); jump(); }}
    > <i className="fa-solid fa-arrow-up"></i> </button>`;

const mobileControlsNewStr = `                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="neo-btn bg-yellow" 
                        style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onPointerDown={(e) => { e.preventDefault(); keys.current['ArrowDown'] = true; }}
                        onPointerUp={(e) => { e.preventDefault(); keys.current['ArrowDown'] = false; }}
                        onPointerLeave={(e) => { e.preventDefault(); keys.current['ArrowDown'] = false; }}
                    > <i className="fa-solid fa-arrow-down"></i> </button>
                    <button 
                        className="neo-btn bg-yellow" 
                        style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onPointerDown={(e) => { e.preventDefault(); jump(); }}
                    > <i className="fa-solid fa-arrow-up"></i> </button>
                </div>`;

code = code.replace(mobileControlsOldStr, mobileControlsNewStr);

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
