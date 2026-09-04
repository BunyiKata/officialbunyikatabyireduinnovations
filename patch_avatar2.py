import re

with open('public/app-logic.js', 'r') as f:
    content = f.read()

new_avatar_config = """        var AVATAR_CONFIG = [
            { icon: 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png', name: 'Lelaki 1', reqStars: 0 },
            { icon: 'https://i.postimg.cc/5t5Dr9xt/Copy-of-BUNYI-KATA-APPS-(4).png', name: 'Perempuan 2', reqStars: 0 },
            { icon: 'https://i.postimg.cc/T3DzrqFV/Copy-of-BUNYI-KATA-APPS-(3).png', name: 'Lelaki 2', reqStars: 20 },
            { icon: 'https://i.postimg.cc/fTp4tg2b/Copy-of-BUNYI-KATA-APPS-(2).png', name: 'Perempuan 1', reqStars: 40 },
            { icon: 'https://i.postimg.cc/fLw1Q4LX/Copy-of-BUNYI-KATA-APPS-(5).png', name: 'Hero 1', reqStars: 60 },
            { icon: 'https://i.postimg.cc/85t91yJm/Copy-of-BUNYI-KATA-APPS-(6).png', name: 'Hero 2', reqStars: 60 }
        ];"""

# Replace specifically from 'var AVATAR_CONFIG = [' to '];'
content = re.sub(r'var AVATAR_CONFIG = \[\n(?:.*?)\n\s*\];', new_avatar_config, content, flags=re.DOTALL)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
