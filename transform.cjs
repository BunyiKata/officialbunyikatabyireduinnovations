const fs = require('fs');
const babel = require('@babel/core');
const t = require('@babel/types');

const code = fs.readFileSync('src/components/TandukKataGame.tsx', 'utf-8');

const { code: newCode } = babel.transformSync(code, {
    plugins: ['@babel/plugin-syntax-typescript', '@babel/plugin-syntax-jsx', function({ types: t }) {
        return {
            visitor: {
                // Change ENVIRONMENT_DECORATIONS
                ObjectProperty(path) {
                    if (path.node.key.name === 'emoji' && path.node.value.value === '🌲') {
                        path.node.value = t.stringLiteral('🛢️');
                    }
                    if (path.node.key.name === 'emoji' && path.node.value.value === '🌳') {
                        path.node.value = t.stringLiteral('📦');
                    }
                }
            }
        };
    }],
    retainLines: true,
    compact: false
});

fs.writeFileSync('src/components/TandukKataGame.tsx', newCode);
