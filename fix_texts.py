import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_guru_texts = """                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                        <div style={{"fontSize":"0.9rem","opacity":"0.95","fontWeight":"500", "marginTop":"5px"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>"""

new_guru_texts = """                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px"}}>Guru: <span id="guru-dashboard-nama-guru-title">-</span></div>
                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px", "marginLeft":"8px"}}>Kod Kelas: <span id="guru-dashboard-kod-kelas-title">-</span></div>"""

content = content.replace(old_guru_texts, new_guru_texts)

old_ibu_texts = """                        <div style={{"fontSize":"0.85rem","opacity":"0.95","fontWeight":"500"}}>Kelas: <span id="ibubapa-nama-kelas-title">1 Cemerlang</span></div>
                        <div style={{"fontSize":"0.85rem","opacity":"0.95","fontWeight":"500", "marginTop":"5px"}}>Kod Keluarga: <span id="ibubapa-kod-keluarga-title">-</span></div>"""

new_ibu_texts = """                        <div style={{"fontSize":"0.85rem","fontWeight":"bold","background":"rgba(255,255,255,0.2)","padding":"4px 10px","borderRadius":"20px","display":"inline-block","marginTop":"6px"}}>Kod Keluarga: <span id="ibubapa-kod-keluarga-title">-</span></div>"""

content = content.replace(old_ibu_texts, new_ibu_texts)

with open('src/App.tsx', 'w') as f:
    f.write(content)
