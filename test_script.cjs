const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

// 1. ENVIRONMENT_DECORATIONS
code = code.replace(
    /const ENVIRONMENT_DECORATIONS = \{[\s\S]*?trees: \[\.\.\.Array\(15\)\]\.map\(\(_, i\) => \(\{[\s\S]*?\}\)\)\s*\};/,
    `const ENVIRONMENT_DECORATIONS = {\n    bushes: [...Array(30)].map((_, i) => ({\n        id: \`bush-\${i}\`,\n        x: 300 + i * 350 + Math.random() * 150,\n    }))\n};`
);

// 2. Add showHint state and idleTimerRef
code = code.replace(
    /const \[gameItems, setGameItems\] = useState<any\[\]>\(\[\]\);/,
    `const [gameItems, setGameItems] = useState<any[]>([]);\n    const [showHint, setShowHint] = useState(false);\n    const idleTimerRef = useRef(0);`
);

// 3. startGame clear
code = code.replace(
    /activeWordRef\.current = null;\s*setGameState\('playing'\);/,
    `activeWordRef.current = null;\n    idleTimerRef.current = 0;\n    setShowHint(false);\n    setGameState('playing');`
);

// 4. Update function logic
const oldInputLogic = `            if (!isPaused) {
                if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
                    state.vx = -MOVE_SPEED;
                    state.facingRight = false;
                } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
                    state.vx = MOVE_SPEED;
                    state.facingRight = true;
                } else {
                    state.vx = 0;
                }
            } else {
                state.vx = 0;
            }`;

const newInputLogic = `            if (!isPaused) {
                if (keys.current['ArrowLeft'] || keys.current['KeyA']) {
                    state.vx = -MOVE_SPEED;
                    state.facingRight = false;
                    idleTimerRef.current += dt;
                } else if (keys.current['ArrowRight'] || keys.current['KeyD']) {
                    state.vx = MOVE_SPEED;
                    state.facingRight = true;
                    idleTimerRef.current = 0;
                } else {
                    state.vx = 0;
                    idleTimerRef.current += dt;
                }
                if (idleTimerRef.current > 5) {
                    setShowHint(true);
                } else {
                    setShowHint(false);
                }
            } else {
                state.vx = 0;
                idleTimerRef.current = 0;
                setShowHint(false);
            }`;
code = code.replace(oldInputLogic, newInputLogic);

// 5. Barrel collision logic
const oldPhysicsLogic = `        if (state.vy < 0 && !dropDown && platformsRef.current) {
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
        }`;
        
const newPhysicsLogic = `        if (state.vy < 0 && !dropDown && platformsRef.current) {
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
        
        for (const bush of ENVIRONMENT_DECORATIONS.bushes) {
            const barrelL = bush.x;
            const barrelR = bush.x + 60;
            const barrelTop = 75;
            
            if (nextY < barrelTop) {
                if (nextX + 30 > barrelL && nextX - 30 < barrelR) {
                    if (state.vx > 0) {
                        nextX = barrelL - 30;
                    } else if (state.vx < 0) {
                        nextX = barrelR + 30;
                    }
                }
            }
            
            if (state.vy < 0) {
                if (state.y >= barrelTop && nextY <= barrelTop) {
                    if (nextX + 30 > barrelL && nextX - 30 < barrelR) {
                        nextY = barrelTop;
                        state.vy = 0;
                        onGround = true;
                    }
                }
            }
        }`;
code = code.replace(oldPhysicsLogic, newPhysicsLogic);

// 6. Rendering updates
code = code.replace(
    /\{ENVIRONMENT_DECORATIONS\.trees\.map\(tree => <div key=\{tree\.id\}[\s\S]*?<\/div>\)\}/,
    "" // Remove trees rendering
);

code = code.replace(
    /\{\/\* Hint Arrow at Start \*\/\}\s*\{characterPos\.x < 500 && \(/,
    `{/* Hint Arrow */}\n                {(characterPos.x < 500 || showHint) && (`
);

// 7. Remove mobile down button
const mobileControlsDown = `<button 
                        className="neo-btn bg-yellow" 
                        style={{ width: '70px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onPointerDown={(e) => { e.preventDefault(); keys.current['ArrowDown'] = true; }}
                        onPointerUp={(e) => { e.preventDefault(); keys.current['ArrowDown'] = false; }}
                        onPointerLeave={(e) => { e.preventDefault(); keys.current['ArrowDown'] = false; }}
                    > <i className="fa-solid fa-arrow-down"></i> </button>`;
code = code.replace(mobileControlsDown, "");

fs.writeFileSync('/tmp/new_code.tsx', code);
