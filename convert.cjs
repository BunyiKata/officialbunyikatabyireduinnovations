const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

// Remove script tags from body
bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Convert some common HTML to JSX
let jsx = bodyContent;
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');
// Handle inline styles
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = {};
    p1.split(';').forEach(rule => {
        if (!rule.trim()) return;
        let [key, value] = rule.split(':');
        if (key && value) {
            key = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            styleObj[key] = value.trim();
        }
    });
    return `style={${JSON.stringify(styleObj)}}`;
});
// Self-closing tags
const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
voidElements.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*[^/])>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
});
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Some event handlers to camelCase
const events = ['onclick', 'onchange', 'ondragover', 'ondragleave', 'ondrop', 'onpointerdown', 'onpointermove', 'onpointerup'];
events.forEach(event => {
    const regex = new RegExp(`${event}=`, 'gi');
    jsx = jsx.replace(regex, `${event.replace(/^on/, 'on').replace(/^[a-z]/, (m) => m.toLowerCase()).replace(/c/,'C').replace(/change/,'Change').replace(/dragover/,'DragOver').replace(/dragleave/,'DragLeave').replace(/drop/,'Drop').replace(/pointerdown/,'PointerDown').replace(/pointermove/,'PointerMove').replace(/pointerup/,'PointerUp')}=`);
});

// Wait, the replace string for events was a bit messy. Let's fix that manually.
jsx = jsx.replace(/onclick=/gi, 'onClick=');
jsx = jsx.replace(/onchange=/gi, 'onChange=');
jsx = jsx.replace(/ondragover=/gi, 'onDragOver=');
jsx = jsx.replace(/ondragleave=/gi, 'onDragLeave=');
jsx = jsx.replace(/ondrop=/gi, 'onDrop=');
jsx = jsx.replace(/onpointerdown=/gi, 'onPointerDown=');
jsx = jsx.replace(/onpointermove=/gi, 'onPointerMove=');
jsx = jsx.replace(/onpointerup=/gi, 'onPointerUp=');

// event attributes value string -> function call
// e.g. onClick="myFunction()" -> onClick={(e) => myFunction()}
jsx = jsx.replace(/on[A-Z][a-zA-Z]*="([^"]*)"/g, (match, p1) => {
    const eventName = match.split('=')[0];
    let fnBody = p1.trim();
    if(fnBody.includes('event.')) fnBody = fnBody.replace(/event\./g, 'e.');
    if(fnBody.includes('event ')) fnBody = fnBody.replace(/event /g, 'e ');
    if(fnBody.includes('(event)')) fnBody = fnBody.replace(/\(event\)/g, '(e)');
    if(fnBody.includes('(event,')) fnBody = fnBody.replace(/\(event,/g, '(e,');
    if(fnBody.includes(', event)')) fnBody = fnBody.replace(/, event\)/g, ', e)');
    if(fnBody.includes(',event)')) fnBody = fnBody.replace(/,event\)/g, ',e)');
    return `${eventName}={(e) => { ${fnBody} }}`;
});

const appTsx = `import React, { useEffect } from 'react';
import './index.css';

export default function App() {
  useEffect(() => {
    // We will load the logic here or via external file
    const script = document.createElement('script');
    script.src = '/app-logic.js';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div id="app-root">
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', appTsx);

// Write a clean index.html
const newHtml = `<!DOCTYPE html>
<html lang="ms">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bunyi Kata - Pembelajaran Interaktif</title>
    <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

fs.writeFileSync('index.html', newHtml);
console.log("Done");
