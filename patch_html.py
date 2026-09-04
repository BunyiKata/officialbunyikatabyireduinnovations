import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace the Belajar Suku Kata block
old_block_regex = r'<div style="display: flex; gap: 30px; padding: 20px; max-width: 900px; margin: 40px auto 0; align-items: stretch; justify-content: center; flex-wrap: wrap;">.*?(?=<!-- Modal Senarai Suku Kata -->)'
new_block = """<div class="bs-wrapper">
            <div class="bs-container">
                
                <!-- LEFT CARD -->
                <div class="bs-card-left">
                    <div class="bs-title-sukukata neo-btn bg-orange">Suku Kata</div>
                    
                    <button class="bs-arrow prev neo-btn bg-orange" onclick="prevBelajarSukuKata()"><i class="fa-solid fa-arrow-left"></i></button>

                    <div class="scene bs-scene" onclick="this.querySelector('.card').classList.toggle('is-flipped')">
                        <div class="card" id="sukukata-k3d-card">
                            <div class="card__face" style="background: white;">
                                <div id="sukukata-card-front-content" class="bs-card-content-front">
                                     <i class="fa-solid fa-image" style="color: #cbd5e1;"></i>
                                </div>
                            </div>
                            <div class="card__face card__face--back" style="background: white;">
                                <div id="sukukata-card-back-content" class="bs-card-content-back"></div>
                            </div>
                        </div>
                    </div>

                    <button class="bs-arrow next neo-btn bg-orange" onclick="nextBelajarSukuKata()"><i class="fa-solid fa-arrow-right"></i></button>
                </div>

                <!-- RIGHT CARD -->
                <div class="bs-card-right">
                    <div id="sukukata-type-title" class="bs-type-title neo-btn bg-purple">KVK</div>
                    
                    <button class="bs-list-btn neo-btn bg-yellow" onclick="bukaModalSenaraiSukuKata()" aria-label="Senarai Perkataan">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    
                    <div class="bs-word-container">
                        <div id="sukukata-word" class="bs-word-text">bot</div>
                    </div>

                    <div class="bs-nav-desktop">
                        <button class="neo-btn bg-orange" onclick="prevBelajarSukuKata()"><i class="fa-solid fa-arrow-left"></i></button>
                        <button class="neo-btn bg-orange" onclick="nextBelajarSukuKata()"><i class="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    """

content = re.sub(old_block_regex, new_block, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(content)

