sed -i 's/<button class="neo-btn bg-red" onclick="tutupModalAksesGuru(); bukaAksesGuru('\''belajar'\'')">/<button class="neo-btn bg-red" onclick="tutupModalAksesGuru(); bukaModalPilihPeta('\''belajar'\'')">/g' index.html
sed -i 's/<button class="neo-btn bg-green" onclick="tutupModalAksesGuru(); bukaAksesGuru('\''latihan'\'')">/<button class="neo-btn bg-green" onclick="tutupModalAksesGuru(); bukaModalPilihPeta('\''latihan'\'')">/g' index.html
sed -i '/<button class="neo-btn bg-purple" onclick="tutupModalAksesGuru(); bukaModalPilihPeta('\''belajar'\'')">/d' index.html
