// @ts-nocheck
import React from "react";

const masukModGuru = (...args: any[]) => (window as any).masukModGuru?.(...args);

interface AppInfoModalsProps {
  feedbackNama?: string;
  setFeedbackNama?: (val: string) => void;
  feedbackMesej?: string;
  setFeedbackMesej?: (val: string) => void;
  feedbackStatus?: string;
  hantarFeedback?: () => void;
  setUserAccessLevel?: (level: any) => void;
  setIsAdminActive?: (active: boolean) => void;
}

export default function AppInfoModals({
  feedbackNama = "",
  setFeedbackNama = () => {},
  feedbackMesej = "",
  setFeedbackMesej = () => {},
  feedbackStatus = "",
  hantarFeedback = () => {},
  setUserAccessLevel = () => {},
  setIsAdminActive = () => {},
}: AppInfoModalsProps) {
  return (
    <>
          <div
            id="modal-info-lencana"
            className="modal-overlay"
            style={{
              display: "none",
              zIndex: 999999,
              backgroundColor: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(4px)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                (window as any).tutupModalInfoLencana &&
                  (window as any).tutupModalInfoLencana();
              }
            }}
          >
            <div
              className="modal-content neo-box"
              style={{
                maxWidth: "540px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                textAlign: "center",
                padding: "24px 18px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
                position: "relative",
                backgroundColor: "#ffffff",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.08) 1.5px, transparent 1.5px)",
                backgroundSize: "18px 18px",
                borderRadius: "24px",
                border: "4px solid var(--color-dark, #10182f)",
                boxShadow: "0 8px 0 var(--color-dark, #10182f)",
              }}
            >
              {/* Square Red Close Button */}
              <button
                className="neo-btn bg-red close-btn"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  fontSize: "1.15rem",
                  color: "white",
                  border: "2.5px solid var(--color-dark, #10182f)",
                  boxShadow: "0 2.5px 0 var(--color-dark, #10182f)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => {
                  (window as any).tutupModalInfoLencana &&
                    (window as any).tutupModalInfoLencana();
                }}
                title="Tutup"
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* Purple Title Badge */}
              <div
                className="neo-btn bg-purple"
                style={{
                  fontSize: "clamp(1.15rem, 3.8vw, 1.35rem)",
                  fontWeight: "900",
                  color: "white",
                  padding: "8px 28px",
                  borderRadius: "20px",
                  border: "3px solid var(--color-dark, #10182f)",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  margin: "4px auto 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  letterSpacing: "0.5px",
                }}
              >
                Panduan Koleksi Lencana
              </div>

              {/* Card 1: Syarat Buka 4 Lencana Utama */}
              <div
                style={{
                  width: "100%",
                  background: "#f0fdf4",
                  border: "2.5px solid #16a34a",
                  borderRadius: "18px",
                  padding: "12px 12px 10px",
                  marginBottom: "12px",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                {/* Green Header Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#16a34a",
                    color: "white",
                    padding: "5px 14px",
                    borderRadius: "14px",
                    fontWeight: "900",
                    fontSize: "0.88rem",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                    marginBottom: "8px",
                  }}
                >
                  <i className="fa-solid fa-trophy" style={{ color: "#fef08a" }}></i>
                  <span>Syarat Buka 4 Lencana Utama</span>
                </div>

                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#1e293b",
                    lineHeight: "1.4",
                    fontWeight: "700",
                  }}
                >
                  Dapatkan <span style={{ background: "#fef08a", color: "#854d0e", padding: "1px 6px", borderRadius: "6px", fontWeight: "800" }}>3 Bintang Penuh</span> dalam sekurang-kurangnya <span style={{ textDecoration: "underline", fontWeight: "800" }}>3 aktiviti</span> bagi setiap cabaran:
                </div>

                {/* Visual 4 Badges Cards Grid */}
                <div
                  style={{
                    marginTop: "8px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "8px",
                  }}
                >
                  {/* Badge 1 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-penjelajah-alfabet.png"
                      alt="Kenal Huruf"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Kenal Huruf
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-pemburu-suku-kata.png"
                      alt="Suku Kata Asas"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Suku Kata Asas
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-wira-pulau.png"
                      alt="Suku Kata Hero"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Suku Kata Hero
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>

                  {/* Badge 4 */}
                  <div
                    style={{
                      background: "white",
                      border: "2px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      boxShadow: "0 2px 0 #cbd5e1",
                    }}
                  >
                    <img
                      src="/images/lencana/lencana-naib-raja-bacaan.png"
                      alt="Bacaan Bergred"
                      style={{ width: "42px", height: "42px", objectFit: "contain", flexShrink: 0 }}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: "900", color: "#10182f", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Bacaan Bergred
                      </div>
                      <div style={{ display: "flex", gap: "2px", fontSize: "0.72rem", marginTop: "2px", color: "#eab308" }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Syarat Buka Sijil & Lencana Master */}
              <div
                style={{
                  width: "100%",
                  background: "#fefce8",
                  border: "2.5px solid #ca8a04",
                  borderRadius: "18px",
                  padding: "12px 12px 12px",
                  marginBottom: "14px",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                {/* Gold/Brown Header Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#ca8a04",
                    color: "white",
                    padding: "5px 14px",
                    borderRadius: "14px",
                    fontWeight: "900",
                    fontSize: "0.88rem",
                    border: "2px solid var(--color-dark, #10182f)",
                    boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                    marginBottom: "10px",
                  }}
                >
                  <i className="fa-solid fa-certificate" style={{ color: "#fef08a" }}></i>
                  <span>Syarat Buka Sijil & Lencana Master</span>
                </div>

                {/* Visual Workflow: 4 Badges -> Arrow -> Master Badge + Sijil (Centered & Prominent) */}
                <div
                  style={{
                    background: "white",
                    border: "2px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "clamp(8px, 2.5vw, 16px)",
                    boxShadow: "0 2px 0 #e2e8f0",
                  }}
                >
                  {/* 4 Mini Badges (Larger & Rapat) */}
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <img src="/images/lencana/lencana-penjelajah-alfabet.png" alt="Kenal Huruf" title="Kenal Huruf" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-pemburu-suku-kata.png" alt="Suku Kata Asas" title="Suku Kata Asas" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-wira-pulau.png" alt="Suku Kata Hero" title="Suku Kata Hero" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                    <img src="/images/lencana/lencana-naib-raja-bacaan.png" alt="Bacaan Bergred" title="Bacaan Bergred" style={{ width: "38px", height: "38px", objectFit: "contain" }} />
                  </div>

                  <i className="fa-solid fa-arrow-right" style={{ color: "#ca8a04", fontSize: "1.25rem", margin: "0 2px" }}></i>

                  {/* Master Badge & Certificate (No KAPTEN label) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src="/images/lencana/lencana-kapten-harta-karun.png"
                      alt="Master Badge"
                      title="Kapten Harta Karun"
                      style={{ width: "46px", height: "46px", objectFit: "contain" }}
                    />
                    <div style={{ height: "36px", width: "2px", background: "#cbd5e1" }}></div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#fef3c7", border: "2px solid #d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fa-solid fa-file-pdf" style={{ color: "#dc2626", fontSize: "1.25rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.68rem", fontWeight: "900", color: "#b45309", marginTop: "2px" }}>SIJIL</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Close Button */}
              <button
                className="neo-btn bg-purple"
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  fontSize: "1.05rem",
                  fontWeight: "900",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  borderRadius: "16px",
                  border: "3px solid var(--color-dark, #10182f)",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  (window as any).tutupModalInfoLencana &&
                    (window as any).tutupModalInfoLencana();
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ fontSize: "1.2rem" }}></i>
                <span>Faham & Mula Kumpul Lencana!</span>
              </button>
            </div>
          </div>

          <div
            id="app-info-modal"
            className="modal-overlay"
            style={{
              display: "none",
              zIndex: 999999,
              backgroundColor: "rgba(0,0,0,0.85)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                (window as any).tutupModalAppInfo &&
                  (window as any).tutupModalAppInfo();
              }
            }}
          >
            <div
              className="modal-content"
              style={{
                maxWidth: "500px",
                width: "90%",
                textAlign: "center",
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "auto",
                position: "relative",
                backgroundColor: "#ffffff",
                backgroundImage:
                  "radial-gradient(circle, rgba(16, 24, 47, 0.11) 1.5px, transparent 1.5px), linear-gradient(#ffffff, #ffffff)",
                backgroundSize: "18px 18px, auto",
              }}
            >
              <button
                className="neo-btn bg-red"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "36px",
                  height: "36px",
                  minWidth: "36px",
                  minHeight: "36px",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  zIndex: 10,
                }}
                onClick={() => {
                  (window as any).tutupModalAppInfo &&
                    (window as any).tutupModalAppInfo();
                }}
                aria-label="Tutup"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div
                className="app-info-logo-wrapper"
                style={{
                  padding: "0",
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  margin: "0 auto 15px auto",
                }}
              >
                <img
                  referrerPolicy="no-referrer"
                  src="/images/sampingan/logo-login-screen.png"
                  alt="Bunyi Kata"
                  className="glitch-logo"
                  style={{
                    maxWidth: "180px",
                    width: "45vw",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "clamp(0.7rem, 3.5vw, 0.95rem)",
                  lineHeight: "1.6",
                  color: "var(--color-dark)",
                  marginBottom: "15px",
                  textAlign: "justify",
                  width: "100%",
                }}
              >
                Aplikasi ini adalah satu aplikasi mengenal huruf dan suku kata
                yang sesuai untuk murid Prasekolah dan murid Pemulihan Khas.
                Aplikasi ini terbahagi kepada dua bahagian utama iaitu
                Pembelajaran dan Latihan. Elemen gamifikasi yang ditekankan
                membawa kepada keseronokan dalam pembelajaran. Di akhir
                pembelajaran dan latihan, murid akan memperoleh hadiah yang
                menarik!
              </p>
              <p
                style={{
                  fontSize: "clamp(0.65rem, 3vw, 0.9rem)",
                  color: "var(--color-dark)",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Aplikasi ini dibangunkan sepenuhnya oleh
                <br />
                IR EduInnovations.
              </p>

              {/* Butang Ikon Media Sosial (Website, Telegram, Google Play Store, Apple App Store) */}
              <div
                id="app-info-social-buttons-container"
                className="app-info-social-row"
                style={{
                  margin: "6px auto 14px auto",
                }}
              >
                {/* Website */}
                <button
                  type="button"
                  className="app-info-social-btn btn-web"
                  title="Laman Web Rasmi (bunyikata.my)"
                  aria-label="Laman Web Rasmi"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://bunyikata.my", "_blank");
                  }}
                >
                  <i className="fa-solid fa-globe"></i>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  className="app-info-social-btn btn-telegram"
                  title="Saluran Telegram"
                  aria-label="Saluran Telegram"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://t.me/+YHsrwwqA-eE5N2Vl", "_blank");
                  }}
                >
                  <i className="fa-brands fa-telegram"></i>
                </button>

                {/* Google Play Store */}
                <button
                  type="button"
                  className="app-info-social-btn btn-playstore"
                  title="Google Play Store"
                  aria-label="Google Play Store"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://play.google.com/store/apps/details?id=com.bunyikatabacaan", "_blank");
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                    <path d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z" fill="#4285F4"/>
                    <path d="m13.544 10.989 3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z" fill="#34A853"/>
                    <path d="m13.544 13.056-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z" fill="#EA4335"/>
                    <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z" fill="#FBBC04"/>
                  </svg>
                </button>

                {/* Apple App Store */}
                <button
                  type="button"
                  className="app-info-social-btn btn-appstore"
                  title="Apple App Store"
                  aria-label="Apple App Store"
                  onClick={() => {
                    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                    window.open("https://apps.apple.com/my/app/bunyi-kata/id6739794132", "_blank");
                  }}
                >
                  <i className="fa-brands fa-app-store-ios" style={{ fontSize: "1.45rem", color: "#ffffff" }}></i>
                </button>
              </div>

              {/* Hak Cipta Terpelihara hanya untuk Onboarding (Mula Bermain) */}
              <div
                id="app-info-copyright"
                style={{
                  display: "none",
                  fontSize: "clamp(0.6rem, 2.5vw, 0.78rem)",
                  color: "#475569",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  width: "100%",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
              >
                <div>&copy; 2026 Bunyi Kata &bull; Hak Cipta Terpelihara &bull; CRDV2025M00849</div>
              </div>

              {/* Ruangan Feedback (Hanya dipaparkan untuk Popup Info) */}
              <div
                id="app-info-feedback-section"
                className="feedback-section-box"
                style={{
                  display: "none",
                  width: "100%",
                  backgroundColor: "#168f81",
                  backgroundImage:
                    "linear-gradient(to bottom, transparent 45%, #168f81 100%), radial-gradient(rgba(255, 255, 255, 0.22) 2px, transparent 2px)",
                  backgroundSize: "100% 100%, 15px 15px",
                  border: "3px solid var(--color-dark, #10182f)",
                  borderRadius: "18px",
                  padding: "14px",
                  boxShadow: "0 4px 0 var(--color-dark, #10182f)",
                  textAlign: "left",
                  boxSizing: "border-box",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "0.92rem",
                    fontWeight: "900",
                    color: "#ffffff",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                  }}
                >
                  <i
                    className="fa-solid fa-comment-dots"
                    style={{ color: "#fef08a", fontSize: "1.15rem" }}
                  ></i>
                  <span>Maklum Balas &amp; Cadangan Penambahbaikan</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nama anda"
                    value={feedbackNama}
                    onChange={(e) => setFeedbackNama(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "2px solid var(--color-dark, #10182f)",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      backgroundColor: "#ffffff",
                      color: "var(--color-dark, #10182f)",
                      fontWeight: "600",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "stretch",
                      width: "100%",
                    }}
                  >
                    <textarea
                      placeholder="Tulis apa-apa cadangan atau penambahbaikan..."
                      value={feedbackMesej}
                      onChange={(e) => setFeedbackMesej(e.target.value)}
                      rows={2}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "2px solid var(--color-dark, #10182f)",
                        fontSize: "0.85rem",
                        resize: "none",
                        boxSizing: "border-box",
                        backgroundColor: "#ffffff",
                        color: "var(--color-dark, #10182f)",
                        fontWeight: "600",
                      }}
                    ></textarea>
                    <button
                      type="button"
                      className="neo-btn bg-blue"
                      onClick={() => hantarFeedback()}
                      title="Hantar Maklum Balas"
                      style={{
                        width: "48px",
                        minWidth: "48px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        padding: "0",
                        backgroundColor: "#0284c7",
                        color: "#ffffff",
                        border: "2.5px solid var(--color-dark, #10182f)",
                        cursor: "pointer",
                        boxShadow: "0 2px 0 var(--color-dark, #10182f)",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="fa-solid fa-paper-plane"
                        style={{ fontSize: "1.1rem", color: "#ffffff" }}
                      ></i>
                    </button>
                  </div>
                  {feedbackStatus === "success" && (
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#064e3b",
                        backgroundColor: "#ecfdf5",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "2px solid #059669",
                        textAlign: "center",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ color: "#059669" }}></i>
                      <span>Maklum balas berjaya dihantar! Terima kasih.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Butang Teruskan (Hanya dipaparkan untuk Onboarding / Mula Bermain) */}
              <button
                id="app-info-teruskan-btn"
                className="neo-btn"
                style={{
                  display: "none",
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  padding: "12px",
                  backgroundColor: "#168f81",
                  color: "#ffffff",
                }}
                onClick={() => {
                  try {
                    const modal = document.getElementById("app-info-modal");
                    if (modal) modal.style.display = "none";
                    const mode = (window as any).pendingAppInfoMode || "murid";
                    (window as any).pendingAppInfoMode = "";
                    if (mode === "murid") {
                      const currentActive = (window as any).namaMuridAktif || localStorage.getItem("muridAktif") || localStorage.getItem("bunyiKataCurrentMurid");
                      const hasSelectedStudent = Boolean(currentActive && currentActive !== "Tetamu" && currentActive !== "Murid");
                      const isExplicitTrial = (window as any).isGuestMode || localStorage.getItem("bunyiKataAccessLevel") === "trial";
                      const isTrial = !hasSelectedStudent && isExplicitTrial;

                      if (isTrial) {
                        (window as any).isGuestMode = true;
                        (window as any).isAdminMode = false;
                        (window as any).modAdminAktif = false;
                        (window as any).userAccessLevel = "trial";
                        (window as any).namaMuridAktif = "Tetamu";
                        setUserAccessLevel("trial");
                        setIsAdminActive(false);
                        localStorage.setItem("bunyiKataAccessLevel", "trial");
                        localStorage.removeItem("bunyiKataUserRole");
                      } else if (hasSelectedStudent) {
                        (window as any).namaMuridAktif = currentActive;
                        (window as any).isGuestMode = false;
                      }
                      if (typeof (window as any).masukModMurid === "function") {
                        try {
                          (window as any).masukModMurid(
                            hasSelectedStudent ? currentActive : (isTrial ? "Tetamu" : "Murid"),
                          );
                        } catch (e) {
                          console.warn("masukModMurid notice:", e);
                        }
                      }
                      if (typeof (window as any).paparSkrin === "function") {
                        try {
                          (window as any).paparSkrin("main-menu-screen");
                        } catch (e) {
                          console.warn("paparSkrin notice:", e);
                        }
                      }
                      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
                      document.getElementById("main-menu-screen")?.classList.add("active");
                      document.body.classList.remove("teacher-mode", "admin-mode", "parent-mode");
                      const topBanner = document.getElementById("teacher-top-banner");
                      if (topBanner) topBanner.style.display = "none";
                      const tNav = document.getElementById("teacher-sticky-nav");
                      if (tNav) tNav.style.display = "none";
                      const aNav = document.getElementById("admin-sticky-nav");
                      if (aNav) aNav.style.display = "none";
                      const pNav = document.getElementById("parent-sticky-nav");
                      if (pNav) pNav.style.display = "none";
                      if (typeof (window as any).updateProfilUI === "function") {
                        try {
                          (window as any).updateProfilUI();
                        } catch (e) {
                          console.warn("updateProfilUI notice:", e);
                        }
                      }
                    } else if (mode === "guru") {
                      masukModGuru();
                    } else if (mode === "ibubapa") {
                      (window as any).bukaModalPilihAnak &&
                        (window as any).bukaModalPilihAnak();
                    } else if (mode === "admin") {
                      (window as any).masukModAdmin &&
                        (window as any).masukModAdmin();
                    }
                  } catch (err) {
                    console.error("Teruskan click error:", err);
                    const modal = document.getElementById("app-info-modal");
                    if (modal) modal.style.display = "none";
                    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
                    document.getElementById("main-menu-screen")?.classList.add("active");
                  }
                }}
              >
                Teruskan{" "}
                <i
                  className="fa-solid fa-arrow-right"
                  style={{ marginLeft: "8px" }}
                ></i>
              </button>
            </div>
          </div>
    </>
  );
}
