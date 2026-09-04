sed -i "748c\\
            const mapTitles = { 1: 'MISI HURUF', 2: 'MISI SUKU KATA ASAS', 3: 'MISI SUKU KATA HERO', 4: 'MISI BACAAN BERGRED' };\\
            document.getElementById('map-title-bar').innerHTML = mapTitles[nomborPeta] || \`PETA \${nomborPeta}\`;" public/app.js
