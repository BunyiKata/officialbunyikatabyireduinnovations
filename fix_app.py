import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Tukar Anak button back to true
old_btn = """                            <button 
                                className="neo-btn bg-white" 
                                onClick={(e) => { 
                                    const modal = document.getElementById('modal-pilih-anak');
                                    if(modal) {
                                        modal.style.display = 'flex';
                                        if ((window as any).bukaModalPilihAnak) (window as any).bukaModalPilihAnak();
                                    }
                                }} 
                                style={{padding: '6px 12px', fontSize: '1.2rem', borderRadius: '10px'}}
                                title="Tukar Anak"
                            >"""

new_btn = """                            <button 
                                className="neo-btn bg-white" 
                                onClick={(e) => { 
                                    const modal = document.getElementById('modal-pilih-anak');
                                    if(modal) {
                                        modal.style.display = 'flex';
                                        if ((window as any).bukaModalPilihAnak) (window as any).bukaModalPilihAnak(true);
                                    }
                                }} 
                                style={{padding: '6px 12px', fontSize: '1.2rem', borderRadius: '10px'}}
                                title="Tukar Anak"
                            >"""
                                
content = content.replace(old_btn, new_btn)

with open('src/App.tsx', 'w') as f:
    f.write(content)
