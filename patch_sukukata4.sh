#!/bin/bash

# 1. Update the bs-arrow HTML to use bg-purple and change border-radius
sed -i 's/<button class="bs-arrow prev neo-btn bg-orange" onclick="prevBelajarSukuKata()">/<button class="bs-arrow prev neo-btn bg-purple" style="border-radius: 12px; color: white;" onclick="prevBelajarSukuKata()">/g' index.html
sed -i 's/<button class="bs-arrow next neo-btn bg-orange" onclick="nextBelajarSukuKata()">/<button class="bs-arrow next neo-btn bg-purple" style="border-radius: 12px; color: white;" onclick="nextBelajarSukuKata()">/g' index.html

# 2. Update the modal close button to be a squircle and positioned properly
sed -i 's/<button class="neo-btn bg-red" onclick="tutupModalSenaraiSukuKata()" style="position: absolute; top: -15px; right: -15px; width: 44px; height: 44px; border-radius: 50%;/<button class="neo-btn bg-red" onclick="tutupModalSenaraiSukuKata()" style="position: absolute; top: -15px; right: -15px; width: 44px; height: 44px; border-radius: 12px;/g' index.html

# 3. Add CSS for senarai-sukukata-grid 3 columns on mobile, and ensure bs-arrow is shaped right
cat << 'CSS_EOF' >> public/styles.css

@media (max-width: 768px) {
    #senarai-sukukata-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 10px !important;
    }
    
    #modal-senarai-sukukata .bg-red {
        top: -15px !important;
        right: -15px !important;
    }
}
CSS_EOF
