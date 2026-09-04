sed -i '251,275c\
    <div id="murid-menu-belajar" class="screen">\
        <div class="map-top-bar">\
            <button class="neo-btn bg-orange back-icon-btn" onclick="paparSkrin('map-screen')"><i class="fa-solid fa-arrow-left"></i></button>\
            <div class="neo-btn bg-orange page-title" style="font-size: 1.2rem; pointer-events: none; z-index:1; white-space: nowrap; border: 3px solid var(--color-dark);">Pilih Peta Kembara</div>\
            <div></div>\
        </div>\
        <div class="sub-menu-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">\
            <div id="btn-misi-huruf" class="neo-box learning-card" style="background: white; border: 3px solid var(--color-dark);" onclick="navigate('\''learn-1'\'', this)">\
                <img src="https://i.postimg.cc/tRLgqDPN/Copy-of-BUNYI-KATA-APPS.png" style="width: 100%; height: auto; max-height: 150px; object-fit: contain; border-radius: 12px; margin-bottom: 10px;" alt="Misi Huruf">\
                <h3 style="color: var(--color-dark); font-size: 1.3rem;">Misi Huruf</h3>\
            </div>\
            <div id="btn-misi-sukukata-asas" class="neo-box learning-card" style="background: white; border: 3px solid var(--color-dark);" onclick="navigate('\''learn-2'\'', this)">\
                <img src="https://i.postimg.cc/sgJfJrLP/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 100%; height: auto; max-height: 150px; object-fit: contain; border-radius: 12px; margin-bottom: 10px;" alt="Misi Suku Kata Asas">\
                <h3 style="color: var(--color-dark); font-size: 1.3rem;">Misi Suku Kata Asas</h3>\
            </div>\
            <div id="btn-misi-sukukata-hero" class="neo-box learning-card" style="background: white; border: 3px solid var(--color-dark);" onclick="navigate('\''latihan-1'\'', this)">\
                <img src="https://i.postimg.cc/FKW92xNL/Copy-of-BUNYI-KATA-APPS-(2).png" style="width: 100%; height: auto; max-height: 150px; object-fit: contain; border-radius: 12px; margin-bottom: 10px;" alt="Misi Suku Kata Hero">\
                <h3 style="color: var(--color-dark); font-size: 1.3rem;">Misi Suku Kata Hero</h3>\
            </div>\
            <div id="btn-misi-bacaan-bergred" class="neo-box learning-card" style="background: white; border: 3px solid var(--color-dark);" onclick="navigate('\''learn-4'\'', this)">\
                <img src="https://i.postimg.cc/sfZVNS8F/Copy-of-BUNYI-KATA-APPS-(3).png" style="width: 100%; height: auto; max-height: 150px; object-fit: contain; border-radius: 12px; margin-bottom: 10px;" alt="Misi Bacaan Bergred">\
                <h3 style="color: var(--color-dark); font-size: 1.3rem;">Misi Bacaan Bergred</h3>\
            </div>\
        </div>\
    </div>\
' index.html
