sed -i '274,276c\
        .island-node:not(.locked):hover {\
            transform: translateY(-5px) scale(1.02);\
            box-shadow: 0 0 12px rgba(255, 215, 0, 1), 2px 3px 0px rgba(0,0,0,0.8);\
        }\
' public/styles.css
