const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          <h2
            id="ganjaran-celebration-title"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              backgroundColor: 'var(--color-purple, #9333ea)',
              padding: '12px 24px',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '900',
              margin: 0,
              fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif",
              border: '3px solid var(--color-dark, #10182f)',
              boxShadow: '0 6px 0 var(--color-dark, #10182f)',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              animation: 'popBounce 2s infinite'
            }}
          >
            Tahniah Anda Hebat!
          </h2>
          <div
            id="ganjaran-celebration-stars"
            style={{
              display: "flex",
              gap: "14px",
              margin: "8px 0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <div
                className="ganjaran-star-single"
                style={{
                  position: "relative",
                  filter: "drop-shadow(0px 7px 0px #b45309) drop-shadow(0px 10px 16px rgba(245, 158, 11, 0.45))",
                  animation: \`starDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both\`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <svg width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="starGold_gc_single" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="35%" stopColor="#fbbf24" />
                      <stop offset="75%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                  </defs>
                  <path
                    className="star-path-main"
                    d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z"
                    fill="url(#starGold_gc_single)"
                    stroke="#10182f"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    className="star-path-bevel"
                    d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z"
                    fill="rgba(255, 255, 255, 0.3)"
                  />
                </svg>
                <span id="ganjaran-celebration-star-count" style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-dark, #10182f)', fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif" }}>3</span>
              </div>
          </div>`;

const replacement = `          <h2
            id="ganjaran-celebration-title"
            className="shiny-reveal"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              backgroundColor: 'var(--color-purple, #9333ea)',
              padding: '12px 24px',
              borderRadius: '16px',
              color: 'white',
              fontWeight: '900',
              margin: 0,
              fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif",
              border: '3px solid var(--color-dark, #10182f)',
              boxShadow: '0 6px 0 var(--color-dark, #10182f)',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              animation: 'popBounce 2s infinite',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            Tahniah Anda Hebat!
          </h2>
          <div
            id="ganjaran-celebration-stars"
            style={{
              display: "flex",
              gap: "14px",
              margin: "8px 0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
              <div
                className="ganjaran-star-single"
                style={{
                  position: "relative",
                  filter: "drop-shadow(0px 7px 0px #b45309) drop-shadow(0px 10px 16px rgba(245, 158, 11, 0.45))",
                  animation: \`starDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s both\`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div className="shiny-reveal" style={{ borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                  <svg width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="starGold_gc_single" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="35%" stopColor="#fbbf24" />
                        <stop offset="75%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                    <path
                      className="star-path-main"
                      d="M50 5 L63 34 L95 38 L72 61 L77 93 L50 78 L23 93 L28 61 L5 38 L37 34 Z"
                      fill="url(#starGold_gc_single)"
                      stroke="#10182f"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <path
                      className="star-path-bevel"
                      d="M50 12 L59 34 L82 37 L65 54 L69 77 L50 66 L31 77 L35 54 L18 37 L41 34 Z"
                      fill="rgba(255, 255, 255, 0.3)"
                    />
                  </svg>
                </div>
                <span id="ganjaran-celebration-star-count" style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--color-dark, #10182f)', fontFamily: "'AtlantaRounded', 'Century Gothic', CenturyGothic, sans-serif" }}>3</span>
              </div>
          </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
