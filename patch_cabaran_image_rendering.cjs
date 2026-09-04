const fs = require('fs');
const path = require('path');

const cabaranPath = path.join(__dirname, 'src', 'components', 'CabaranSukuKataGame.tsx');
let cabaranCode = fs.readFileSync(cabaranPath, 'utf8');

// 1. Fix option rendering in cari_gambar (lines 2231-2233)
cabaranCode = cabaranCode.replace(
  `                                          onClick={() => handleOptionClick(optIcon, i)}
                                      >
                                          {optIcon}
                                      </button>`,
  `                                          onClick={() => handleOptionClick(optIcon, i)}
                                      >
                                          {optIcon && optIcon.includes('<img') ? (
                                              <div dangerouslySetInnerHTML={{ __html: optIcon }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                          ) : optIcon && (optIcon.startsWith('/') || optIcon.includes('.png')) ? (
                                              <img src={optIcon} alt="Pilihan" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} />
                                          ) : (
                                              optIcon
                                          )}
                                      </button>`
);

// 2. Fix option rendering in general options loop (lines 2298-2306)
const oldGeneralOpt = `                                      {opt.includes('🍪') ? (
                                          <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '4px' }}>
                                              {opt.split(' ').map((char: string, j: number) => (
                                                  char === '🍪' ? <span key={j} style={{ display: 'inline-block' }}>🍪</span> : (char === '\\n' ? <div key={j} style={{ width: '100%', height: 0 }}></div> : <span key={j}>{char}</span>)
                                              ))}
                                          </div>
                                      ) : (
                                          opt
                                      )}`;

const newGeneralOpt = `                                      {opt && opt.includes('🍪') ? (
                                          <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '4px' }}>
                                              {opt.split(' ').map((char: string, j: number) => (
                                                  char === '🍪' ? <span key={j} style={{ display: 'inline-block' }}>🍪</span> : (char === '\\n' ? <div key={j} style={{ width: '100%', height: 0 }}></div> : <span key={j}>{char}</span>)
                                              ))}
                                          </div>
                                      ) : opt && opt.includes('<img') ? (
                                          <div dangerouslySetInnerHTML={{ __html: opt }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                                      ) : opt && (opt.startsWith('/') || opt.includes('.png')) ? (
                                          <img src={opt} alt="Pilihan" style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} />
                                      ) : (
                                          opt
                                      )}`;

if (cabaranCode.includes(oldGeneralOpt)) {
  cabaranCode = cabaranCode.replace(oldGeneralOpt, newGeneralOpt);
  console.log('✅ General options rendering updated');
} else {
  console.log('⚠️ Could not match oldGeneralOpt');
}

// 3. Fix image rendering in padan/lengkap/teka question card (lines 1945-1947)
const oldPadanImg = `                              ) : (
                                currentQ.image
                              )}`;

const newPadanImg = `                              ) : currentQ.image && currentQ.image.includes('<img') ? (
                                <div dangerouslySetInnerHTML={{ __html: currentQ.image }} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                              ) : currentQ.image && (currentQ.image.startsWith('/') || currentQ.image.includes('.png')) ? (
                                <img src={currentQ.image} alt="Soalan" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                              ) : (
                                currentQ.image
                              )}`;

if (cabaranCode.includes(oldPadanImg)) {
  cabaranCode = cabaranCode.replace(oldPadanImg, newPadanImg);
  console.log('✅ Padan question card image rendering updated');
} else {
  console.log('⚠️ Could not match oldPadanImg');
}

fs.writeFileSync(cabaranPath, cabaranCode, 'utf8');
console.log('✅ CabaranSukuKataGame.tsx updated cleanly');
