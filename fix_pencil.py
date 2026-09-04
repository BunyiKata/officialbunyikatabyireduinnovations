import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix Ibu Bapa edit pencil button position
old_ibubapa_btn = """                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"position": "absolute", "top": "15px", "right": "15px", "background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s", "zIndex": 10}}"""

new_ibubapa_btn = """                        setEditKodTemp(localStorage.getItem('bunyiKataKodKelas') || 'KELAS123');
                        setIsEditModalOpen(true);
                    }} 
                    style={{"position": "absolute", "top": "55px", "right": "15px", "background":"rgba(255,255,255,0.2)","border":"none","borderRadius":"50%","width":"40px","height":"40px","display":"flex","alignItems":"center","justifyContent":"center","cursor":"pointer","color":"white","boxShadow":"0 2px 4px rgba(0,0,0,0.1)","transition":"transform 0.1s", "zIndex": 10}}"""
content = content.replace(old_ibubapa_btn, new_ibubapa_btn)

with open('src/App.tsx', 'w') as f:
    f.write(content)
