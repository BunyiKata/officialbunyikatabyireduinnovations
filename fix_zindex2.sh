awk '/#mobile-floating-cta \{/{flag=1} flag && /z-index: 1500;/{sub("1500", "9999"); flag=0} 1' src/index.css > temp.css && mv temp.css src/index.css
