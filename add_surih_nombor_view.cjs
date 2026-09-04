const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('id="view-surih-nombor"')) {
    const surihViewStr = `
      {/* Surih Huruf */}
      <div id="view-surih-huruf"`;
    
    const surihNomborView = `
      {/* Surih Nombor */}
      <div id="view-surih-nombor" className="screen">
        <div className="map-top-bar">
          <button
            className="neo-btn bg-orange back-icon-btn"
            onClick={(e) => {
              paparSkrin("map-screen");
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div
            className="neo-btn bg-orange page-title"
            style={{
              pointerEvents: "none",
              fontSize: "1.2rem",
              zIndex: "1",
              whiteSpace: "nowrap",
            }}
          >
            Surih Nombor
          </div>
          <div></div>
        </div>

        <div
          id="surih-nombor-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
            padding: "clamp(12px, 4vw, 25px)",
            backgroundColor: "#168f81",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)",
            backgroundSize: "20px 20px",
            borderRadius: "24px",
            border: "4px solid var(--color-dark)",
            boxShadow: "var(--shadow-hard)",
          }}
        >
          {/* Navigasi Nombor */}
          <div
            id="surih-nombor-nav-bar"
            style={{
              display: "flex",
              gap: "5px",
              overflowX: "auto",
              width: "100%",
              padding: "10px",
              background: "#ffffff",
              borderRadius: "12px",
              border: "2px solid var(--color-dark)",
              fontFamily: "var(--font-main)",
            }}
          >
            {/* Dijana oleh JS */}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <button
              id="surih-nombor-prev-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihNomborTukar && window.surihNomborTukar(-1);
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            <button
              id="surih-nombor-next-btn"
              className="neo-btn bg-blue"
              style={{ padding: "8px 16px", minWidth: "auto" }}
              onClick={(e) => {
                window.surihNomborTukar && window.surihNomborTukar(1);
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div
            id="surih-nombor-canvas-container"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "1/1",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "4px solid var(--color-dark)",
              overflow: "hidden",
              touchAction: "none",
              backgroundImage:
                "linear-gradient(rgba(16, 24, 47, 0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(16, 24, 47, 0.1) 2px, transparent 2px)",
              backgroundSize: "20px 20px",
              boxShadow: "inset 0px 0px 15px rgba(0,0,0,0.05)",
            }}
          >
            {/* Confetti container */}
            <div
              id="surih-nombor-confetti"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: "10",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></div>

            <canvas
              id="surih-nombor-canvas"
              width="500"
              height="500"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0",
                left: "0",
                touchAction: "none",
                cursor: "crosshair",
              }}
              onPointerDown={(e) => {
                window.surihNomborStartDraw && window.surihNomborStartDraw(e);
              }}
              onPointerMove={(e) => {
                window.surihNomborDraw && window.surihNomborDraw(e);
              }}
              onPointerUp={(e) => {
                window.surihNomborEndDraw && window.surihNomborEndDraw(e);
              }}
              onPointerCancel={(e) => {
                window.surihNomborEndDraw && window.surihNomborEndDraw(e);
              }}
            ></canvas>
          </div>

          {/* Tools */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "500px",
              marginTop: "8px",
            }}
          >
            <button
              className="neo-btn bg-red"
              onClick={(e) => {
                window.surihNomborReset && window.surihNomborReset();
              }}
              style={{ flex: "1", marginRight: "8px" }}
            >
              <i className="fa-solid fa-eraser"></i> Padam
            </button>
            <button
              className="neo-btn bg-green"
              onClick={(e) => {
                window.surihNomborTunjukCara && window.surihNomborTunjukCara();
              }}
              style={{ flex: "1", marginLeft: "8px" }}
            >
              <i className="fa-solid fa-play"></i> Tunjuk
            </button>
          </div>
        </div>
      </div>
`;
    content = content.replace(surihViewStr, surihNomborView + '\n' + surihViewStr);
    fs.writeFileSync('src/App.tsx', content);
}
