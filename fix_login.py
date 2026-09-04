import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add states
old_states = """  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");"""

new_states = """  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [pendingLoginMode, setPendingLoginMode] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");"""

content = content.replace(old_states, new_states)

# Replace Guru button action
old_guru_btn = """<button className="neo-btn bg-orange mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); setPendingMode("guru"); setShowAppInfoModal(true); }}>"""
new_guru_btn = """<button className="neo-btn bg-orange mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); setPendingLoginMode("guru"); setShowLoginModal(true); setLoginEmail(""); setLoginPassword(""); }}>"""
content = content.replace(old_guru_btn, new_guru_btn)

# Replace Ibu Bapa button action
old_ib_btn = """<button className="neo-btn bg-blue mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); setPendingMode("ibubapa"); setShowAppInfoModal(true); }}>"""
new_ib_btn = """<button className="neo-btn bg-blue mode-btn" style={{ padding: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }} onClick={(e) => { setIsModeMenuOpen(false); setPendingLoginMode("ibubapa"); setShowLoginModal(true); setLoginEmail(""); setLoginPassword(""); }}>"""
content = content.replace(old_ib_btn, new_ib_btn)

# Replace Admin button action
old_admin_btn = """<button className="neo-btn" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '8px', border: 'none', boxShadow: 'none', transform: 'none', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }} onClick={(e) => { setIsModeMenuOpen(false); (window as any).masukModAdmin(); }} title="Mod Admin">"""
new_admin_btn = """<button className="neo-btn" style={{ backgroundColor: 'transparent', color: '#64748b', padding: '8px', border: 'none', boxShadow: 'none', transform: 'none', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '0 auto' }} onClick={(e) => { setIsModeMenuOpen(false); setPendingLoginMode("admin"); setShowLoginModal(true); setLoginEmail(""); setLoginPassword(""); }} title="Mod Admin">"""
content = content.replace(old_admin_btn, new_admin_btn)

# Insert the Login Modal after Modal Pilih Mod
login_modal_code = """
            {/* Modal Log Masuk */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="neo-box"
                            style={{
                                backgroundColor: '#ffffff', maxWidth: '350px', width: '90%',
                                padding: '25px', position: 'relative', borderRadius: '20px'
                            }}
                        >
                            <button
                                className="neo-btn bg-red"
                                onClick={() => setShowLoginModal(false)}
                                style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    width: '36px', height: '36px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 10
                                }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            
                            <h2 style={{fontSize: '1.3rem', marginBottom: '20px', color: 'var(--color-dark)', textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px'}}>
                                Log Masuk {pendingLoginMode === 'guru' ? 'Guru' : pendingLoginMode === 'ibubapa' ? 'Ibu Bapa' : 'Admin'}
                            </h2>
                            
                            <div style={{marginBottom: '15px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem'}}>Emel</label>
                                <input 
                                    type="email" 
                                    placeholder="Masukkan emel anda"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '10px',
                                        border: '2px solid var(--color-dark)', fontSize: '1rem',
                                        fontFamily: "inherit", boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{marginBottom: '10px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569', fontSize: '0.9rem'}}>Kata Laluan</label>
                                <input 
                                    type="password" 
                                    placeholder="Masukkan kata laluan"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '10px',
                                        border: '2px solid var(--color-dark)', fontSize: '1rem',
                                        fontFamily: "inherit", boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                            
                            <div style={{textAlign: 'right', marginBottom: '20px'}}>
                                <button style={{background: 'none', border: 'none', color: '#0284c7', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', padding: '0'}} onClick={() => {
                                    alert('Sila hubungi pentadbir sistem untuk menetapkan semula kata laluan anda.');
                                }}>
                                    Lupa kata laluan?
                                </button>
                            </div>

                            <button 
                                className="neo-btn" 
                                style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px', backgroundColor: '#168f81', color: '#ffffff' }}
                                onClick={() => {
                                    if(!loginEmail || !loginPassword) {
                                        alert('Sila masukkan emel dan kata laluan!');
                                        return;
                                    }
                                    setShowLoginModal(false);
                                    if (pendingLoginMode === 'admin') {
                                        (window as any).masukModAdmin();
                                    } else {
                                        setPendingMode(pendingLoginMode);
                                        setShowAppInfoModal(true);
                                    }
                                }}
                            >
                                Log Masuk <i className="fa-solid fa-right-to-bracket" style={{ marginLeft: '8px' }}></i>
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
"""

content = content.replace("            {/* Modal Pilih Mod */}", login_modal_code + "\n            {/* Modal Pilih Mod */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
