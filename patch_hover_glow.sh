sed -i '268,271c\
        .island-node:not(.locked):hover {\
            animation: soft-float 3.5s ease-in-out infinite, white-glow 2s infinite alternate;\
            transform: translateY(-5px) scale(1.02);\
        }\
' public/styles.css
