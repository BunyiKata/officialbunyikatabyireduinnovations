const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

// 1. Update the Physics Engine & Camera Logic
const oldPhysics = `
            if (!isPaused || state.y > 0) {
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

            setCameraX(state.x > 300 ? state.x - 300 : 0);
`;

const newPhysics = `
            if (!isPaused || state.y > 0) {
                // Apply gravity
                state.vy -= GRAVITY * dt;
                
                let nextX = state.x + state.vx * dt;
                let nextY = state.y + state.vy * dt;
                let onGround = false;
                
                const dropDown = keys.current['ArrowDown'] || keys.current['KeyS'];

                // Floor collision
                if (nextY <= 0) {
                    nextY = 0;
                    state.vy = 0;
                    onGround = true;
                }
                
                // Platform collision
                if (state.vy < 0 && !dropDown) {
                    for (const plat of platformsRef.current) {
                        const charLeft = nextX - 30;
                        const charRight = nextX + 30;
                        const platLeft = plat.x;
                        const platRight = plat.x + plat.width;
                        const platTop = plat.y;
                        
                        // Check if falling onto the platform
                        if (state.y >= platTop && nextY <= platTop) {
                            if (charRight > platLeft && charLeft < platRight) {
                                nextY = platTop;
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
            
            // Camera follow: center on mobile, slight offset on desktop
            const screenWidth = window.innerWidth;
            let targetCameraX = state.x - screenWidth / 2;
            if (targetCameraX < 0) targetCameraX = 0;
            // Smooth camera interpolation
            setCameraX(prev => prev + (targetCameraX - prev) * 8 * dt);
`;

code = code.replace(oldPhysics.trim(), newPhysics.trim());

// 2. Add Platform Rendering and Update Floor/Decorations
const oldJSX = `
                {/* Floor */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: \`\${FLOOR_Y}px\`, backgroundColor: '#4ade80', borderTop: '20px solid #d97706', backgroundImage: 'radial-gradient(#22c55e 3px, transparent 3px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Decorative bushes & trees */}
                {ENVIRONMENT_DECORATIONS.bushes.map(bush => (
                    <div key={bush.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${bush.x}px\`, fontSize: '5rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>🌲</div>
                ))}
                {ENVIRONMENT_DECORATIONS.trees.map(tree => (
                    <div key={tree.id} style={{ position: 'absolute', bottom: \`\${FLOOR_Y}px\`, left: \`\${tree.x}px\`, fontSize: '4rem', zIndex: 1, filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.2))', lineHeight: 1, transform: 'translateY(15%)' }}>🌳</div>
                ))}
`;

const newJSX = `
                {/* Floor */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: \`\${FLOOR_Y}px\`, backgroundColor: '#eab308', borderTop: '20px solid #78350f', backgroundImage: 'radial-gradient(#a16207 3px, transparent 3px)', backgroundSize: '30px 30px' }}></div>
                
                {/* Platforms */}
                {gamePlatforms.map(plat => (
                    <div key={plat.id} style={{ 
                        position: 'absolute', 
                        bottom: \`\${FLOOR_Y + plat.y}px\`, 
                        left: \`\${plat.x}px\`, 
                        width: \`\${plat.width}px\`, 
                        height: \`\${plat.height}px\`, 
                        backgroundColor: '#8b5a2b',
                        borderTop: '6px solid #5c3a21',
                        borderBottom: '6px solid #3e2717',
                        borderRadius: '4px',
                        boxShadow: '0 8px 0 rgba(0,0,0,0.2)',
                        zIndex: 2
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
                ))}
`;

code = code.replace(oldJSX.trim(), newJSX.trim());

// 3. Update Jump condition to allow jumping if on platform
code = code.replace(
    /if \(charStateRef\.current\.y <= 0 && activeWordRef\.current === null && gameState === 'playing'\) \{/g,
    "if (!charStateRef.current.isJumping && activeWordRef.current === null && gameState === 'playing') {"
);

// 4. Update the background color for pirate theme (sunset/evening)
code = code.replace(
    /backgroundColor: '#70c5ce'/,
    "backgroundColor: '#fb923c'" // orange sunset
);

// 5. Update startGame to actually create platforms (the previous step didn't match the regex)
const oldStartGame = `
    const startGame = (category: string) => {
        setSelectedCategory(category);
        const words = WORD_DATABASE[category as keyof typeof WORD_DATABASE] || [];
        // create items along the path
        const items = words.map((item, index) => ({
            ...item,
            id: index,
            x: 600 + index * 600,
            y: 0,
            collected: false
        }));
        setGameItems(items);
        gameItemsRef.current = items;
        setStars(0);
        setCharacterPos({ x: 100, y: 0 });
        setCameraX(0);
        charStateRef.current = { x: 100, y: 0, vx: 0, vy: 0, isJumping: false, facingRight: true };
        setGameState('playing');
        activeWordRef.current = null;
        setActiveWord(null);
    };
`;

const newStartGame = `
    const startGame = (category: string) => {
        setSelectedCategory(category);
        const words = WORD_DATABASE[category as keyof typeof WORD_DATABASE] || [];
        
        // create items along the path, some on platforms
        const items = words.map((item, index) => {
            const isElevated = index % 2 !== 0;
            const platformY = isElevated ? 200 + Math.random() * 50 : 0;
            return {
                ...item,
                id: index,
                x: 600 + index * 600,
                y: platformY,
                collected: false
            };
        });
        
        const platforms = items.filter(i => i.y > 0).map((item, i) => ({
            id: \`plat-\${i}\`,
            x: item.x - 120,
            y: item.y - 45, // platform is below the item
            width: 240,
            height: 30
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
    };
`;

code = code.replace(oldStartGame.trim(), newStartGame.trim());

// 6. Mobile jump/drop down hint
const mobileControlsOld = `
                <button 
        className="neo-btn bg-yellow" 
        style={{ width: '90px', height: '70px', borderRadius: '16px', fontSize: '2.5rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onPointerDown={(e) => { e.preventDefault(); jump(); }}
    > <i className="fa-solid fa-arrow-up"></i> </button>
`;

const mobileControlsNew = `
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
                    > <i className="fa-solid fa-arrow-up"></i> </button>
                </div>
`;

code = code.replace(mobileControlsOld.trim(), mobileControlsNew.trim());

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
