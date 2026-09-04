import re

with open("src/App.tsx", "r") as f:
    content = f.read()

admin_old = """        <div className="neo-box" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","padding":"20px","background":"white"}}>
            <h3 style={{"fontSize":"1.05rem","marginBottom":"15px","color":"var(--color-dark)","display":"flex","alignItems":"center","gap":"10px"}}><i className="fa-solid fa-chalkboard-user" style={{"color":"#168f81"}}></i> Senarai Guru Berdaftar</h3>
            <div style={{"overflowX":"auto","borderRadius":"12px","border":"2px solid var(--color-dark)"}}>
                <table style={{"width":"100%","borderCollapse":"collapse","textAlign":"left"}}>
                    <thead id="admin-table-head">
                        <tr>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem","width":"40px"}}>BIL.</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem"}}>NAMA GURU</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem"}}>NAMA SEKOLAH</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","textAlign":"center","fontSize":"0.9rem"}}>BILANGAN MURID</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body">
                        {/* Rendered by JS */}
                    </tbody>
                </table>
            </div>
        </div>"""

admin_new = """        <div className="neo-box" style={{"width":"100%","maxWidth":"900px","margin":"0 auto 20px","padding":"20px","background":"white"}}>
            <div style={{"display":"flex","justifyContent":"space-between","alignItems":"center","marginBottom":"15px","flexWrap":"wrap","gap":"10px"}}>
                <h3 id="admin-table-title" style={{"fontSize":"1.05rem","margin":"0","color":"var(--color-dark)","display":"flex","alignItems":"center","gap":"10px"}}>
                    <i className="fa-solid fa-chalkboard-user" style={{"color":"#168f81"}}></i> Senarai Guru Berdaftar
                </h3>
                <select id="admin-table-selector" className="neo-btn filter-select" style={{"padding":"6px 32px 6px 10px","fontSize":"0.85rem","fontWeight":"bold","borderRadius":"10px","border":"2px solid var(--color-dark)","backgroundColor":"#f1f5f9","cursor":"pointer"}} onChange={(e) => { (window as any).renderAdminTable && (window as any).renderAdminTable(e.target.value) }}>
                    <option value="guru">Senarai Guru Berdaftar</option>
                    <option value="ibubapa">Senarai Ibu Bapa Berdaftar</option>
                </select>
            </div>
            <div style={{"overflowX":"auto","borderRadius":"12px","border":"2px solid var(--color-dark)"}}>
                <table style={{"width":"100%","borderCollapse":"collapse","textAlign":"left"}}>
                    <thead id="admin-table-head">
                        <tr>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem","width":"40px"}}>BIL.</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem"}}>NAMA GURU</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem"}}>NAMA SEKOLAH</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","borderRight":"1px solid rgba(255,255,255,0.3)","textAlign":"center","fontSize":"0.9rem"}}>BILANGAN MURID</th>
                            <th style={{"padding":"8px 12px","backgroundColor":"#168f81","color":"white","borderBottom":"2px solid var(--color-dark)","textAlign":"center","fontSize":"0.9rem","width":"60px"}}>INFO</th>
                        </tr>
                    </thead>
                    <tbody id="admin-table-body">
                        {/* Rendered by JS */}
                    </tbody>
                </table>
            </div>
        </div>"""

if admin_old in content:
    content = content.replace(admin_old, admin_new)
    print("Patched admin table HTML")
else:
    print("Could not find admin table HTML")

with open("src/App.tsx", "w") as f:
    f.write(content)
