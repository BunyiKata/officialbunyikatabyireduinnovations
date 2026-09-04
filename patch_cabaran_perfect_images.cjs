const fs = require('fs');
const path = require('path');

// 1. PATCH src/index.css
const cssPath = path.join(__dirname, 'src', 'index.css');
let cssCode = fs.readFileSync(cssPath, 'utf8');

const cssAdd = `
/* Fix Cabaran option box fit size & image scaling */
.cabaran-opt-img-btn {
    height: 115px !important;
    max-height: 115px !important;
    padding: 8px !important;
    overflow: hidden !important;
}

.cabaran-opt-img-btn img,
.cabaran-opt-img-btn .sk-icon-img {
    max-height: 85px !important;
    max-width: 95% !important;
    height: auto !important;
    width: auto !important;
    object-fit: contain !important;
    display: block !important;
    margin: 0 auto !important;
}

.cabaran-bacaan-image img,
.cabaran-bacaan-image .sk-icon-img,
.cabaran-susun-image img,
.cabaran-susun-image .sk-icon-img {
    max-height: 125px !important;
    max-width: 90% !important;
    height: auto !important;
    width: auto !important;
    object-fit: contain !important;
    display: block !important;
    margin: 0 auto !important;
}
`;

if (!cssCode.includes('cabaran-opt-img-btn img')) {
  cssCode += cssAdd;
  fs.writeFileSync(cssPath, cssCode, 'utf8');
  console.log('✅ src/index.css updated with cabaran image styles');
}

// 2. PATCH src/components/CabaranSukuKataGame.tsx
const cabaranPath = path.join(__dirname, 'src', 'components', 'CabaranSukuKataGame.tsx');
let cabaranCode = fs.readFileSync(cabaranPath, 'utf8');

// 2a. Replace cari_gambar option grid maxWidth and button styles
cabaranCode = cabaranCode.replace(
  `gridTemplateColumns: '1fr 1fr', \n                              gap: '14px', \n                              width: '100%', \n                              maxWidth: '450px'`,
  `gridTemplateColumns: '1fr 1fr', \n                              gap: '14px', \n                              width: '100%', \n                              maxWidth: '540px'`
);

cabaranCode = cabaranCode.replace(
  `padding: '16px 10px', \n                                              fontSize: '3.6rem', \n                                              display: 'flex', \n                                              alignItems: 'center', \n                                              justifyContent: 'center',\n                                              borderRadius: '20px',\n                                              cursor: 'pointer',\n                                              minHeight: '110px',\n                                              color: textColor,\n                                              lineHeight: '1'`,
  `padding: '8px', \n                                              height: '115px', \n                                              maxHeight: '115px', \n                                              display: 'flex', \n                                              alignItems: 'center', \n                                              justifyContent: 'center',\n                                              borderRadius: '20px',\n                                              cursor: 'pointer',\n                                              color: textColor,\n                                              overflow: 'hidden'`
);

// 2b. Replace currentQ.image in padan/lengkap/teka (line 1946)
cabaranCode = cabaranCode.replace(
  `                              ) : (
                                currentQ.image
                              )}`,
  `                              ) : currentQ.image && currentQ.image.includes('<img') ? (
                                <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                              ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png')) ? (
                                <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '125px', maxWidth: '100%', objectFit: 'contain' }} />
                              ) : (
                                currentQ.image
                              )}`
);

// 2c. Replace currentQ.image in bacaan (line 2034)
cabaranCode = cabaranCode.replace(
  `<div className="cabaran-bacaan-image" style={{ fontSize: currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 2.5rem)' : 'clamp(2.5rem, 10vw, 3rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', wordBreak: 'break-word', lineHeight: 1.3 }}>
                         {currentQ.image}
                     </div>`,
  `<div className="cabaran-bacaan-image" style={{ fontSize: currentQ.image && currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2rem)' : 'clamp(2.5rem, 10vw, 3rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', wordBreak: 'break-word', lineHeight: 1.3 }}>
                         {currentQ.image && currentQ.image.includes('<img') ? (
                             <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                         ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png')) ? (
                             <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '125px', maxWidth: '100%', objectFit: 'contain' }} />
                         ) : (
                             currentQ.image
                         )}
                     </div>`
);

// 2d. Replace currentQ.image in susun (line 2078)
cabaranCode = cabaranCode.replace(
  `<div className="cabaran-bacaan-image cabaran-susun-image" style={{ fontSize: currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : currentQ.image.length > 10 ? 'clamp(2rem, 8vw, 3rem)' : 'clamp(2.5rem, 10vw, 3.8rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', cursor: currentQ.imageText ? 'pointer' : 'default', wordBreak: 'break-word', lineHeight: 1.3 }} onClick={() => currentQ.imageText && playAudio(currentQ.imageText)}>{currentQ.image}</div>`,
  `<div className="cabaran-bacaan-image cabaran-susun-image" style={{ fontSize: currentQ.image && currentQ.image.length > 20 ? 'clamp(1.5rem, 5vw, 2.5rem)' : 'clamp(2.5rem, 10vw, 3.8rem)', filter: 'drop-shadow(2px 4px 0 rgba(0,0,0,0.2))', cursor: currentQ.imageText ? 'pointer' : 'default', wordBreak: 'break-word', lineHeight: 1.3 }} onClick={() => currentQ.imageText && playAudio(currentQ.imageText)}>
                           {currentQ.image && currentQ.image.includes('<img') ? (
                               <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                           ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png')) ? (
                               <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '125px', maxWidth: '100%', objectFit: 'contain' }} />
                           ) : (
                               currentQ.image
                           )}
                       </div>`
);

fs.writeFileSync(cabaranPath, cabaranCode, 'utf8');
console.log('✅ CabaranSukuKataGame.tsx updated with perfect image renderers and layout sizes');
