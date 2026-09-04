import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_modal = """    {showAppInfoModal && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center', padding: '30px' }}>
                <img referrerPolicy="no-referrer" src="https://i.postimg.cc/cHTb186H/Copy-of-BUNYI-KATA-APPS-(2).png" alt="Bunyi Kata" style={{ maxWidth: '180px', height: 'auto', marginBottom: '20px' }} />
                
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--color-dark)', marginBottom: '15px', textAlign: 'justify' }}>
                    Aplikasi ini adalah satu aplikasi mengenal huruf dan suku kata yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas. Aplikasi ini terbahagi kepada dua iaitu Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan membawa kepada keseronokan dalam pembelajaran. Di akhir pembelajaran dan latihan, murid akan memperoleh hadiah yang menarik!
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-dark)', fontWeight: 'bold', marginBottom: '10px' }}>
                    Aplikasi ini dibangunkan sepenuhnya oleh IR EduInnovation.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '25px', fontWeight: 'bold' }}>
                    <div>MYIPO Hak Cipta Terpelihara: CRDV2025M00849</div>
                    <div>&copy; 2026</div>
                </div>
                
                <button 
                    className="neo-btn bg-green" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px' }}"""

new_modal = """    {showAppInfoModal && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 3000, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="modal-content" style={{ maxWidth: '500px', textAlign: 'center', padding: '5vw' }}>
                <div style={{ padding: '0', background: 'transparent', boxShadow: 'none', border: 'none', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    <img referrerPolicy="no-referrer" src="https://i.postimg.cc/cHTb186H/Copy-of-BUNYI-KATA-APPS-(2).png" alt="Bunyi Kata" className="glitch-logo" style={{ maxWidth: '180px', width: '40vw', height: 'auto', marginBottom: '15px' }} />
                </div>
                <p style={{ fontSize: 'clamp(0.75rem, 3.5vw, 0.95rem)', lineHeight: '1.6', color: 'var(--color-dark)', marginBottom: '15px', textAlign: 'justify' }}>
                    Aplikasi ini adalah satu aplikasi mengenal huruf dan suku kata yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas. Aplikasi ini terbahagi kepada dua bahagian utama iaitu Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan membawa kepada keseronokan dalam pembelajaran. Di akhir pembelajaran dan latihan, murid akan memperoleh hadiah yang menarik!
                </p>
                <p style={{ fontSize: 'clamp(0.7rem, 3vw, 0.9rem)', color: 'var(--color-dark)', fontWeight: 'bold', marginBottom: '10px' }}>
                    Aplikasi ini dibangunkan sepenuhnya oleh IR EduInnovation.
                </p>
                <div style={{ fontSize: 'clamp(0.65rem, 2.5vw, 0.8rem)', color: '#475569', marginBottom: '25px', fontWeight: 'bold' }}>
                    <div>MyIPO Hak Cipta Terpelihara CRDV2025M00849. &copy; 2026</div>
                </div>
                
                <button 
                    className="neo-btn" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '12px', backgroundColor: '#168f81', color: '#ffffff' }}"""

if old_modal in content:
    content = content.replace(old_modal, new_modal)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patched App.tsx modal content")
else:
    print("Old modal string not found")

