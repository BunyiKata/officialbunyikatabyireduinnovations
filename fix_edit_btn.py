import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# For the teacher stats card
old_btn = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKeluarga') || 'KELUARGA123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s"}}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >"""

new_btn = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKelas') || '1 Cemerlang');
                        setEditGuruTemp(localStorage.getItem('pdf_guru') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"position": "absolute", "top": "15px", "right": "15px", "background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s", "zIndex": 10}}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >"""
content = content.replace(old_btn, new_btn)

# We should also check the parent stats card edit button if they want it top right too.
# Let's find it.
old_parent_btn = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKeluarga') || 'Keluarga Razak');
                        setEditGuruTemp(localStorage.getItem('pdf_ibubapa') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKeluarga') || 'KELUARGA123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s"}}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >"""

new_parent_btn = """                <button 
                    onClick={(e) => { 
                        setEditKelasTemp(localStorage.getItem('bunyiKataNamaKeluarga') || 'Keluarga Razak');
                        setEditGuruTemp(localStorage.getItem('pdf_ibubapa') || '');
                        setEditKodTemp(localStorage.getItem('bunyiKataKodKeluarga') || 'KELUARGA123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"position": "absolute", "top": "15px", "right": "15px", "background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s", "zIndex": 10}}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >"""
content = content.replace(old_parent_btn, new_parent_btn)


with open('src/App.tsx', 'w') as f:
    f.write(content)
