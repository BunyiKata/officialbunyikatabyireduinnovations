sed -i '261,277c\
        .island-node {\
            position: relative; display: flex; flex-direction: column; align-items: center;\
            cursor: pointer; background: white; border: 2px solid var(--color-dark);\
            border-radius: 12px; box-shadow: 2px 3px 0px rgba(0,0,0,0.8);\
            padding: 12px 10px 10px; border-width: 3px; transition: transform 0.2s; margin-top: 10px;\
        }\
        .island-node.locked { cursor: not-allowed; animation: none !important; box-shadow: 2px 3px 0px rgba(0,0,0,0.8) !important; }\
        .island-node.completed-level {\
            animation: grey-glow 2s infinite alternate;\
        }\
        .island-node.active-level {\
            animation: pulse-scale 2s infinite alternate, gold-glow 2s infinite alternate;\
        }\
        .island-node:not(.locked):hover {\
            transform: translateY(-5px) scale(1.02);\
        }\
        @keyframes pulse-scale {\
            0% { transform: scale(1); }\
            100% { transform: scale(1.05); }\
        }\
        @keyframes gold-glow {\
            0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 2px 3px 0px rgba(0,0,0,0.8); }\
            100% { box-shadow: 0 0 12px rgba(255, 215, 0, 1), 2px 3px 0px rgba(0,0,0,0.8); }\
        }\
        @keyframes grey-glow {\
            0% { box-shadow: 0 0 4px rgba(180, 180, 180, 0.5), 2px 3px 0px rgba(0,0,0,0.8); }\
            100% { box-shadow: 0 0 10px rgba(180, 180, 180, 0.9), 2px 3px 0px rgba(0,0,0,0.8); }\
        }\
' public/styles.css
