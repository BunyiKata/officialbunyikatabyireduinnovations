sed -i '115,130c\
            <div id="modal-pilih-peta-tajuk" class="neo-btn bg-orange page-title" style="margin: 0 auto 20px; font-size: 1.2rem; pointer-events: none; border: 3px solid var(--color-dark); display: inline-flex;">Pilih Peta Kembara</div>\
            <div style="display: grid; grid-template-columns: repeat(2, minmax(140px, 250px)); gap: 20px; justify-content: center;">\
                <div class="neo-box map-select-btn" style="cursor: pointer; padding: 15px; background: white; width: 100%; max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;" onclick="bukaPeta(1)">\
                    <img src="https://i.postimg.cc/tRLgqDPN/Copy-of-BUNYI-KATA-APPS.png" style="width: 100%; height: auto; max-height: 120px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;" alt="Misi Huruf">\
                    <button class="neo-btn bg-white" style="width: 100%; font-size: 1rem; pointer-events: none; text-wrap: wrap;">Misi Huruf</button>\
                </div>\
                <div class="neo-box map-select-btn" style="cursor: pointer; padding: 15px; background: white; width: 100%; max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;" onclick="bukaPeta(2)">\
                    <img src="https://i.postimg.cc/sgJfJrLP/Copy-of-BUNYI-KATA-APPS-(1).png" style="width: 100%; height: auto; max-height: 120px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;" alt="Misi Suku Kata Asas">\
                    <button class="neo-btn bg-white" style="width: 100%; font-size: 1rem; pointer-events: none; text-wrap: wrap;">Misi Suku Kata Asas</button>\
                </div>\
                <div class="neo-box map-select-btn" style="cursor: pointer; padding: 15px; background: white; width: 100%; max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;" onclick="bukaPeta(3)">\
                    <img src="https://i.postimg.cc/FKW92xNL/Copy-of-BUNYI-KATA-APPS-(2).png" style="width: 100%; height: auto; max-height: 120px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;" alt="Misi Suku Kata Hero">\
                    <button class="neo-btn bg-white" style="width: 100%; font-size: 1rem; pointer-events: none; text-wrap: wrap;">Misi Suku Kata Hero</button>\
                </div>\
                <div class="neo-box map-select-btn" style="cursor: pointer; padding: 15px; background: white; width: 100%; max-width: 250px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;" onclick="bukaPeta(4)">\
                    <img src="https://i.postimg.cc/sfZVNS8F/Copy-of-BUNYI-KATA-APPS-(3).png" style="width: 100%; height: auto; max-height: 120px; object-fit: contain; border-radius: 8px; margin-bottom: 10px;" alt="Misi Bacaan Bergred">\
' index.html
