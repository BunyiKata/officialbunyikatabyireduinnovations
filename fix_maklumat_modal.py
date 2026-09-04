import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_layout = """                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>"""

new_layout = """                    <div className="maklumat-form-container" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>"""
content = content.replace(old_layout, new_layout)

old_inputs_wrapper = """                        <div style={{ flex: 1 }}>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Sekolah</label>"""
new_inputs_wrapper = """                        <div style={{ flex: 1, width: '100%' }}>
                            <div style={{marginBottom: '16px'}}>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--color-dark)'}}>Nama Sekolah</label>"""
content = content.replace(old_inputs_wrapper, new_inputs_wrapper)

with open('src/App.tsx', 'w') as f:
    f.write(content)
