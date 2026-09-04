sed -i '261,275c\
        .island-node { animation: soft-float 3.5s ease-in-out infinite, white-glow 2s infinite alternate;\
            position: relative; display: flex; flex-direction: column; align-items: center;\
            cursor: pointer; background: white; border: 2px solid var(--color-dark);\
            border-radius: 12px; box-shadow: 2px 3px 0px rgba(0,0,0,0.8);\
            padding: 12px 10px 10px; border-width: 3px; transition: transform 0.2s; margin-top: 10px;\
        }\
        .island-node.locked { cursor: not-allowed; animation: none; box-shadow: 2px 3px 0px rgba(0,0,0,0.8); }\
        .island-node:not(.locked):hover {\
            animation: white-glow 2s infinite alternate;\
            transform: translateY(-5px) scale(1.02);\
        }\
        @keyframes white-glow {\
            0% { box-shadow: 0 0 8px rgba(255, 255, 255, 0.6), 2px 3px 0px rgba(0,0,0,0.8); }\
            100% { box-shadow: 0 0 25px rgba(255, 255, 255, 1), 2px 3px 0px rgba(0,0,0,0.8); }\
        }\
' public/styles.css
