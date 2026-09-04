import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change the Main button action
old_main = """            <button className="neo-btn bg-yellow" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"var(--color-dark)", "animation":"pulse-scale 1.5s infinite", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)"}} onClick={(e) => { setPendingMode("murid"); setShowAppInfoModal(true); }}>
                <i className="fa-solid fa-play"></i> <span>Main</span>
            </button>"""
new_main = """            <button className="neo-btn bg-yellow" style={{"width":"100%", "maxWidth":"250px", "fontSize":"clamp(1.5rem, 5vw, 2rem)", "padding":"15px", "display":"flex", "alignItems":"center", "justifyContent":"center", "gap":"12px", "color":"var(--color-dark)", "animation":"pulse-scale 1.5s infinite", "boxShadow":"0 4px 15px rgba(255, 215, 0, 0.4)"}} onClick={(e) => { setPendingMode("murid"); setShowOnboardingAvatar(true); }}>
                <i className="fa-solid fa-play"></i> <span>Main</span>
            </button>"""
content = content.replace(old_main, new_main)

# And update the Onboarding Avatar modal
old_onboarding = """                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--color-dark)' }}>
                        Selamat datang ke Bunyi Kata!
                    </h2>
                    <p style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#475569', fontWeight: 'bold' }}>
                        Pilih watak kamu untuk mula:
                    </p>

                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "25px" }}>
                        <button type="button" className="neo-btn bg-white" onClick={() => {
                            const container = document.getElementById('onboarding-avatar-options');
                            if (container) container.scrollBy({ left: -150, behavior: 'smooth' });
                        }} style={{ position: "absolute", left: "-10px", zIndex: 10, width: "40px", height: "40px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", cursor: "pointer" }} aria-label="Sebelumnya">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <div id="onboarding-avatar-options" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", gap: "15px", padding: "10px", width: "100%", WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}>
                            {[
                                { icon: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png', name: 'Lelaki 1' },
                                { icon: 'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png', name: 'Perempuan 2' }
                            ].map((avatar, idx) => (
                                <div key={idx} onClick={() => setOnboardingSelectedAvatar(avatar.icon)} style={{ cursor: "pointer", minWidth: "120px", scrollSnapAlign: "center", border: onboardingSelectedAvatar === avatar.icon ? "4px solid #168f81" : "3px solid #cbd5e1", borderRadius: "16px", padding: "10px", backgroundColor: onboardingSelectedAvatar === avatar.icon ? "var(--color-orange)" : "white", transform: onboardingSelectedAvatar === avatar.icon ? "scale(1.05)" : "scale(1)", transition: "all 0.2s ease" }}>
                                    <img src={avatar.icon} alt={avatar.name} style={{ width: "80px", height: "80px", objectFit: "contain", marginBottom: "5px", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }} />
                                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--color-dark)" }}>{avatar.name}</div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="neo-btn bg-white" onClick={() => {
                            const container = document.getElementById('onboarding-avatar-options');
                            if (container) container.scrollBy({ left: 150, behavior: 'smooth' });
                        }} style={{ position: "absolute", right: "-10px", zIndex: 10, width: "40px", height: "40px", padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", cursor: "pointer" }} aria-label="Seterusnya">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>"""

new_onboarding = """                    <div className="neo-btn page-title" style={{ backgroundColor: '#168f81', color: 'white', fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', margin: '0 auto 20px auto', whiteSpace: 'normal', display: 'inline-block', pointerEvents: 'none', padding: '10px 20px', lineHeight: '1.2' }}>
                        Selamat datang ke Bunyi Kata!
                    </div>
                    <p style={{ marginBottom: '20px', fontSize: '1.1rem', color: '#475569', fontWeight: 'bold' }}>
                        Pilih watak kamu untuk mula:
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
                        {[
                            { icon: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png', name: 'Lelaki 1' },
                            { icon: 'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png', name: 'Perempuan 2' }
                        ].map((avatar, idx) => (
                            <div key={idx} onClick={() => setOnboardingSelectedAvatar(avatar.icon)} style={{ cursor: "pointer", width: "120px", border: onboardingSelectedAvatar === avatar.icon ? "4px solid #168f81" : "3px solid #cbd5e1", borderRadius: "16px", padding: "10px", backgroundColor: onboardingSelectedAvatar === avatar.icon ? "var(--color-orange)" : "white", transform: onboardingSelectedAvatar === avatar.icon ? "scale(1.05)" : "scale(1)", transition: "all 0.2s ease", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <img src={avatar.icon} alt="Avatar" style={{ width: "90px", height: "90px", objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }} />
                            </div>
                        ))}
                    </div>"""

content = content.replace(old_onboarding, new_onboarding)

with open('src/App.tsx', 'w') as f:
    f.write(content)
