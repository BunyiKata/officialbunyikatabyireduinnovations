sed -i 's/white-glow/gold-glow/g' public/styles.css
sed -i '272,275c\
        @keyframes gold-glow {\
            0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 2px 3px 0px rgba(0,0,0,0.8); }\
            100% { box-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 15px rgba(255, 215, 0, 1), 2px 3px 0px rgba(0,0,0,0.8); }\
        }\
' public/styles.css
