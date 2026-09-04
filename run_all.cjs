const fs = require('fs');
let code = fs.readFileSync('/tmp/TandukKataGame.tsx.bak', 'utf-8');

// 1. States
code = code.replace(
    /const \[gameItems, setGameItems\] = useState<any\[\]>\(\[\]\);\s*const \[stars, setStars\] = useState\(0\);/,
    "const [gameItems, setGameItems] = useState<any[]>([]);\n  const [gamePlatforms, setGamePlatforms] = useState<any[]>([]);\n  const [stars, setStars] = useState(0);"
);

// 2. startGame
const startGameRegex = /const startGame = \(category: string\) => \{[\s\S]*?setActiveWord\(null\);\s*activeWordRef\.current = null;\s*setGameState\('playing'\);\s*\};/;
const newStartGame = `const startGame = (category: string) => {
    setSelectedCategory(category);
    const words = WORD_DATABASE[category as keyof typeof WORD_DATABASE] || WORD_DATABASE['KV'];
    const items = words.map((item, index) => {
        const isElevated = index % 2 !== 0;
        const platformY = isElevated ? 150 + Math.random() * 50 : 0;
        return {
          ...item,
          id: index,
          x: 600 + index * 600,
          y: platformY,
          collected: false
        };
    });
    const platforms = items.filter(i => i.y > 0).map((item, i) => ({
        id: \`plat-\${i}\`, x: item.x - 120, y: item.y - 45, width: 240, height: 30
    }));
    setGameItems(items);
    gameItemsRef.current = items;
    setGamePlatforms(platforms);
    platformsRef.current = platforms;
    charStateRef.current = {
      x: 100, y: 0, vx: 0, vy: 0, facingRight: true, isJumping: false
    };
    setCharacterPos({ x: 100, y: 0 });
    setCameraX(0);
    setStars(0);
    setActiveWord(null);
    activeWordRef.current = null;
    setGameState('playing');
  };`;
code = code.replace(startGameRegex, newStartGame);

// 3. Physics loop
const physicsRegex = /if \(!isPaused \|\| state\.y > 0\) \{[\s\S]*?setCameraX\(state\.x > 300 \? state\.x - 300 : 0\);/;
const newPhysics = `if (!isPaused || state.y > 0) {
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
        
        if (state.vy < 0 && !dropDown && platformsRef.current) {
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

      setCharacterPos({
        x: state.x,
        y: state.y
      });
      setIsJumping(state.isJumping);
      setFacingRight(state.facingRight);
      
      const screenWidth = window.innerWidth || 800;
      let targetCameraX = state.x - screenWidth / 2;
      if (targetCameraX < 0) targetCameraX = 0;
      setCameraX(prev => prev + (targetCameraX - prev) * 8 * dt);`;
code = code.replace(physicsRegex, newPhysics);

// 4. Background color
code = code.replace(/backgroundColor:\s*'#70c5ce'/g, "backgroundColor: '#fb923c'");

// 5. Game World UI
const floorRegex = /\{\/\* Floor \*\/\}([\s\S]*?)\{\/\* Hint Arrow at Start \*\/\}/;
const newWorld = `{/* Floor */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: \`\${FLOOR_Y}px\`, backgroundColor: '#eab308', borderTop: '20px solid #78350f', backgroundImage: 'radial-gradient(#a16207 3px, transparent 3px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Platforms */}
                {gamePlatforms && gamePlatforms.map(plat => (
                    <div key={plat.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y + plat.y}px\`, left: \`\${plat.x}px\`, width: \`\${plat.width}px\`, height: \`\${plat.height}px\`, backgroundColor: '#8b5a2b', borderTop: '6px solid #5c3a21', borderBottom: '6px solid #3e2717', borderRadius: '4px', boxShadow: '0 8px 0 rgba(0,0,0,0.2)', zIndex: 2 }}>
                        <div style={{ position: 'absolute', top: 0, left: '10%', width: '80%', height: '100%', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)' }}></div>
                    </div>
                ))}

                {/* Decorative bushes & trees (Now Pirate Theme Barrels & Crates) */}
                {ENVIRONMENT_DECORATIONS.bushes.map(bush => <div key={bush.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${bush.x}px\`, fontSize: '5rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>🛢️</div>)}
                {ENVIRONMENT_DECORATIONS.trees.map(tree => <div key={tree.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${tree.x}px\`, fontSize: '4rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>📦</div>)}
                {/* Hint Arrow at Start */}`;
code = code.replace(floorRegex, newWorld);

// 6. Mobile controls: we'll match exactly from the start of the button div to the end
const mobileBtnRegex = /<div style=\{\{ display: 'flex', gap: '15px' \}\}>([\s\S]*?)<button[\s\S]*?className="neo-btn bg-yellow"[\s\S]*?onPointerDown=\{\(e\) => \{ e\.preventDefault\(\); jump\(\); \}\}[\s\S]*?<\/button>/;
const newBtns = `<div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        className="neo-btn bg-yellow" style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onPointerDown={(e) => { e.preventDefault(); handleMobileInput('left', true); }}
                        onPointerUp={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                        onPointerLeave={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                    > <i className="fa-solid fa-arrow-left"></i> </button>
                    <button 
                        className="neo-btn bg-yellow" style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onPointerDown={(e) => { e.preventDefault(); handleMobileInput('right', true); }}
                        onPointerUp={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                        onPointerLeave={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                    > <i className="fa-solid fa-arrow-right"></i> </button>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
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
                    > <i className="fa-solid fa-arrow-up"></i> </button>`;
code = code.replace(mobileBtnRegex, newBtns);

// 7. Jump condition
const oldJump = `charStateRef.current.y <= 0 && activeWordRef.current === null`;
const newJump = `!charStateRef.current.isJumping && activeWordRef.current === null`;
code = code.replace(oldJump, newJump);

// 8. Refs 
const oldRefs = `const gameItemsRef = useRef<any[]>([]);
  const activeWordRef = useRef<any | null>(null);`;
const newRefs = `const gameItemsRef = useRef<any[]>([]);
  const platformsRef = useRef<any[]>([]);
  const activeWordRef = useRef<any | null>(null);`;
code = code.replace(/const gameItemsRef = useRef<any\[\]>\(\[\]\);\s*const activeWordRef = useRef<any \| null>\(null\);/, newRefs);

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
