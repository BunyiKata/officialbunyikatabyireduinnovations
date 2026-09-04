import re

with open('src/components/TandukKataGame.tsx', 'r') as f:
    content = f.read()

# 1. Add showGameOver state
content = content.replace("const [showReward, setShowReward] = useState(false);", "const [showReward, setShowReward] = useState(false);\n    const [showGameOver, setShowGameOver] = useState(false);")

# 2. Update logProgress call
old_log = "if ((window as any).logProgress) {\n                    (window as any).logProgress('tandukKata', 'latihan', nextStars * 10, 'tandukKata');\n                }"
new_log = "if ((window as any).logProgress) {\n                    (window as any).logProgress('tandukKata_' + selectedCategory, 'latihan', nextStars, 'tandukKata');\n                }"
content = content.replace(old_log, new_log)

# 3. Update endgame logic
old_end = """                if (gameItemsRef.current.every(i => i.collected)) {
                    setTimeout(() => {
                        playPopConfettiSound();
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                    }, 500);
                    setTimeout(() => {
                        setGameState('idle');
                        onClose();
                    }, 3500);
                }"""
new_end = """                if (gameItemsRef.current.every(i => i.collected)) {
                    setTimeout(() => {
                        playPopConfettiSound();
                        confetti({
                            particleCount: 150,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                        setShowGameOver(true);
                    }, 500);
                }"""
content = content.replace(old_end, new_end)

# 4. Add the modal UI inside the return block
# I need to find where to put it. Just before the last </div> which is at the very end.
modal_ui = """
            {/* Game Over Modal */}
            <AnimatePresence>
                {showGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            style={{
                                backgroundColor: 'white',
                                backgroundImage: 'radial-gradient(circle, rgba(16, 24, 47, 0.1) 1.5px, transparent 1.5px)',
                                backgroundSize: '15px 15px',
                                padding: '30px 40px',
                                borderRadius: '24px',
                                textAlign: 'center',
                                border: '4px solid var(--color-dark)',
                                boxShadow: '0 8px 0 var(--color-dark)',
                                maxWidth: '400px',
                                width: '90%'
                            }}
                        >
                            <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: 'var(--color-dark)' }}>Tahniah! 🎉</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#475569', fontWeight: 'bold' }}>Kamu berjaya kumpul:</p>
                            <div style={{ fontSize: '3rem', marginBottom: '30px', fontWeight: '900', color: '#f59e0b', textShadow: '2px 2px 0 #b45309' }}>
                                <i className="fa-solid fa-star"></i> {stars}
                            </div>
                            <button
                                className="neo-btn bg-green"
                                onClick={() => {
                                    setShowGameOver(false);
                                    setGameState('idle');
                                    onClose();
                                }}
                                style={{ width: '100%', fontSize: '1.2rem', padding: '12px' }}
                            >
                                <i className="fa-solid fa-check"></i> Selesai
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
"""
# Replace the last "        </div>" with modal_ui
content = content.rsplit("        </div>\n    );\n}", 1)
if len(content) == 2:
    content = content[0] + modal_ui + "    );\n}"
else:
    print("Failed to replace last div")

with open('src/components/TandukKataGame.tsx', 'w') as f:
    f.write(content)

print("Patched TandukKataGame.tsx")
