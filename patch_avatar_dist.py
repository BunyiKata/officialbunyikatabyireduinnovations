import re

with open('dist/app-logic.js', 'r') as f:
    content = f.read()

new_avatar_config = """        var AVATAR_CONFIG = [
            { icon: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png', name: 'Lelaki 1', reqStars: 0 },
            { icon: 'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png', name: 'Perempuan 2', reqStars: 0 },
            { icon: 'https://i.postimg.cc/T3DzrqFV/Copy-of-BUNYI-KATA-APPS-(3).png', name: 'Lelaki 2', reqStars: 20 },
            { icon: 'https://i.postimg.cc/fTp4tg2b/Copy-of-BUNYI-KATA-APPS-(2).png', name: 'Perempuan 1', reqStars: 40 },
            { icon: 'https://i.postimg.cc/fLw1Q4LX/Copy-of-BUNYI-KATA-APPS-(5).png', name: 'Hero 1', reqStars: 60 },
            { icon: 'https://i.postimg.cc/85t91yJm/Copy-of-BUNYI-KATA-APPS-(6).png', name: 'Hero 2', reqStars: 60 }
        ];"""

content = re.sub(r'var AVATAR_CONFIG = \[\s*\{ icon.*?\} \s*\];', new_avatar_config, content, flags=re.DOTALL)

old_render_part = """                    <span style="font-size:0.7rem; font-weight:bold; color:var(--color-dark);">${cfg.name}</span>
                    <span style="font-size:0.62rem; font-weight:bold; color:${isClaimed ? '#166534' : (canClaim ? '#b45309' : '#64748b')};">
                        ${isClaimed ? '✓ Percuma' : (canClaim ? '🎁 Claim!' : `${reqStars} ⭐`)}
                    </span>"""

new_render_part = """                    ${!isClaimed ? `<span style="font-size:0.65rem; font-weight:bold; color:${canClaim ? '#b45309' : '#64748b'}; margin-top:2px;">
                        ${canClaim ? '🎁 Claim!' : `${reqStars} ⭐`}
                    </span>` : ''}"""

content = content.replace(old_render_part, new_render_part)

with open('dist/app-logic.js', 'w') as f:
    f.write(content)
print("Patched dist/app-logic.js")
