const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `    {/* Surih Huruf */}
    <div id="view-surih-huruf" className="screen" style={{"paddingTop":"80px"}}>
        <button className="neo-btn bg-red back-icon-btn" onClick={(e) => { paparSkrin('map-screen') }} style={{"width": "50px", "height": "50px", "display": "flex", "justifyContent": "center", "alignItems": "center", "padding": "0", "borderRadius": "50%", "position": "absolute", "top": "20px", "left": "20px", "zIndex": "50"}}><i className="fa-solid fa-arrow-left" style={{"fontSize": "1.5rem", "margin": "0"}}></i></button>
        
        <div id="surih-container" style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "15px", "width": "100%", "maxWidth": "800px", "margin": "0 auto", "padding": "15px", "background": "#1e4620", "borderRadius": "24px", "border": "4px solid var(--color-dark)", "boxShadow": "var(--shadow-hard)"}}>
            {/* Navigasi Huruf */}
            <div id="surih-nav-bar" style={{"display": "flex", "gap": "5px", "overflowX": "auto", "width": "100%", "padding": "10px", "background": "#ffffff", "borderRadius": "12px", "border": "2px solid var(--color-dark)", "fontFamily": "'Atlanta Rounded', var(--font-main)"}}>`;

const replacement = `    {/* Surih Huruf */}
    <div id="view-surih-huruf" className="screen" style={{"paddingTop":"80px"}}>
        <button className="neo-btn bg-red back-icon-btn" onClick={(e) => { paparSkrin('map-screen') }} style={{"width": "50px", "height": "50px", "display": "flex", "justifyContent": "center", "alignItems": "center", "padding": "0", "borderRadius": "50%", "position": "absolute", "top": "20px", "left": "20px", "zIndex": "50"}}><i className="fa-solid fa-arrow-left" style={{"fontSize": "1.5rem", "margin": "0"}}></i></button>
        
        <div id="surih-container" style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "15px", "width": "100%", "maxWidth": "650px", "margin": "0 auto", "padding": "25px", "backgroundColor": "#1e4620", "backgroundImage": "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)", "backgroundSize": "20px 20px", "borderRadius": "24px", "border": "4px solid var(--color-dark)", "boxShadow": "var(--shadow-hard)"}}>
            {/* Navigasi Huruf */}
            <div id="surih-nav-bar" style={{"display": "flex", "gap": "5px", "overflowX": "auto", "width": "100%", "padding": "10px", "background": "#ffffff", "borderRadius": "12px", "border": "2px solid var(--color-dark)", "fontFamily": "var(--font-main)"}}>`;

app = app.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', app);
