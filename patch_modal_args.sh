sed -i "s/onclick=\"bukaPeta('belajar')\"/onclick=\"bukaPeta(1)\"/g" index.html
sed -i "0,/onclick=\"bukaPeta(1)\"/! s/onclick=\"bukaPeta(1)\"/onclick=\"bukaPeta(2)\"/1" index.html
sed -i "s/onclick=\"bukaPeta('latihan')\"/onclick=\"bukaPeta(3)\"/g" index.html
sed -i "s/onclick=\"alert('Akan Datang!')\"/onclick=\"bukaPeta(4)\"/g" index.html
