with open('public/app-logic.js', 'r') as f:
    content = f.read()

old_anak = """                // Add child buttons
                childNames.forEach(name => {
                    const btnAnak = document.createElement('button');
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnAnak.innerHTML = `<div style="font-size: 2rem; color: #f59e0b; margin-bottom: 8px;"><i class="fa-solid fa-child"></i></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word;">${name}</span>`;"""

new_anak = """                // Add child buttons
                childNames.forEach(name => {
                    const btnAnak = document.createElement('button');
                    const childData = (typeof studentData !== 'undefined' && studentData[name]) ? studentData[name] : null;
                    const avatarSrc = (childData && childData.avatar) ? childData.avatar : 'https://i.postimg.cc/bNscvjR5/Copy-of-BUNYI-KATA-APPS-(1).png';
                    
                    btnAnak.className = 'neo-btn bg-white';
                    btnAnak.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px 10px; border-radius: 15px; width: 100%; aspect-ratio: 1;';
                    btnAnak.innerHTML = `<div style="margin-bottom: 8px; width: 50px; height: 50px; border-radius: 50%; overflow: hidden; border: 2px solid #0284c7; background: #e0f2fe; display: flex; align-items: center; justify-content: center;"><img src="${avatarSrc}" style="width: 100%; height: 100%; object-fit: cover;" /></div><span style="font-size: 0.85rem; line-height: 1.2; text-align: center; word-break: break-word; font-weight: bold;">${name}</span>`;"""

content = content.replace(old_anak, new_anak)

with open('public/app-logic.js', 'w') as f:
    f.write(content)
