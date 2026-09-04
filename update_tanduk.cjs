const fs = require('fs');
let code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

// 1. Update ENVIRONMENT_DECORATIONS
code = code.replace(
    /const ENVIRONMENT_DECORATIONS = \{[\s\S]*?\}\s*};\n/,
    "const ENVIRONMENT_DECORATIONS = {\n" +
    "    bushes: [...Array(20)].map((_, i) => ({\n" +
    "        id: `barrel-${i}`,\n" +
    "        x: 200 + i * 400 + Math.random() * 200,\n" +
    "        emoji: '🛢️'\n" +
    "    })),\n" +
    "    trees: [...Array(15)].map((_, i) => ({\n" +
    "        id: `crate-${i}`,\n" +
    "        x: 400 + i * 550 + Math.random() * 200,\n" +
    "        emoji: '📦'\n" +
    "    }))\n" +
    "};\n"
);

// 2. Add platform state
code = code.replace(
    /const \[gameItems, setGameItems\] = useState<any\[\]>\(\[\]\);/,
    "const [gameItems, setGameItems] = useState<any[]>([]);\n    const [gamePlatforms, setGamePlatforms] = useState<any[]>([]);"
);

// 3. Add platform ref
code = code.replace(
    /const gameItemsRef = useRef<any\[\]>\(\[\]\);/,
    "const gameItemsRef = useRef<any[]>([]);\n    const platformsRef = useRef<any[]>([]);"
);

// 4. Update startGame to generate platforms
code = code.replace(
    /const items = words\.map\(\(item, index\) => \(\{[\s\S]*?id: index,\s*x: 600 \+ index \* 600,\s*y: 0,\s*collected: false\s*\}\)\);/,
    "const items = words.map((item, index) => {\n" +
    "            const isElevated = index % 2 !== 0;\n" +
    "            const platformY = isElevated ? 150 + Math.random() * 50 : 0;\n" +
    "            return {\n" +
    "                ...item,\n" +
    "                id: index,\n" +
    "                x: 600 + index * 600,\n" +
    "                y: platformY,\n" +
    "                collected: false\n" +
    "            };\n" +
    "        });\n" +
    "        const platforms = items.filter(i => i.y > 0).map((item, i) => ({\n" +
    "            id: `plat-${i}`,\n" +
    "            x: item.x - 150,\n" +
    "            y: item.y,\n" +
    "            width: 300,\n" +
    "            height: 30\n" +
    "        }));"
);

// 5. Set platforms state
code = code.replace(
    /setGameItems\(items\);\n\s*gameItemsRef\.current = items;/,
    "setGameItems(items);\n        gameItemsRef.current = items;\n        setGamePlatforms(platforms);\n        platformsRef.current = platforms;"
);

fs.writeFileSync('src/components/TandukKataGame.tsx', code);
