sed -i 's/z-index: 1500;/z-index: 9999;/g' src/index.css
sed -i 's/z-index: 9999;/.student-nav-bar { z-index: 1500; }/g' # wait this is wrong
