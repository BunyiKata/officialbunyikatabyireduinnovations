// @ts-nocheck
import React from "react";

interface PilihPetaModalProps {
  isEffectiveTrial: boolean;
}

export default function PilihPetaModal({
  isEffectiveTrial,
}: PilihPetaModalProps) {
  const tutupModal = () => {
    if (typeof (window as any).tutupModal === "function") {
      (window as any).tutupModal();
    } else {
      const el = document.getElementById("modal-pilih-peta");
      if (el) el.style.display = "none";
    }
  };

  const paparSkrin = (...args: any[]) => (window as any).paparSkrin?.(...args);

  return (
      <div id="modal-pilih-peta" className="modal-overlay">
        <div className="modal-content">
          <button
            className="neo-btn bg-red close-btn"
            onClick={(e) => {
              tutupModal();
            }}
            aria-label="Tutup"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div
            id="modal-pilih-peta-tajuk"
            className="neo-btn bg-orange page-title"
            style={{
              margin: "0 auto 20px",
              fontSize: "1.2rem",
              pointerEvents: "none",
              border: "3px solid var(--color-dark)",
              display: "inline-flex",
            }}
          >
            Pilih Peta Kembara
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(140px, 250px))",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={(e) => {
                if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                if (typeof (window as any).pilihPeta === "function") {
                  (window as any).pilihPeta(1);
                } else if (typeof (window as any).bukaPeta === "function") {
                  (window as any).bukaPeta(1);
                }
              }}
            >
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-huruf.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
                alt="Misi Asas Bunyi Kata"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Asas Bunyi Kata
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(2);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-suku-kata-asas.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Suku Kata Asas"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Suku Kata Asas
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(3);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-suku-kata-hero.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Suku Kata Hero"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Suku Kata Hero
              </button>
            </div>
            <div
              className="neo-box map-select-btn"
              style={{
                cursor: "pointer",
                padding: "15px",
                background: "white",
                width: "100%",
                maxWidth: "250px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={(e) => {
                if (isEffectiveTrial) {
                  if (typeof (window as any).playBubble === "function") (window as any).playBubble();
                  (window as any).openPakejProModal?.("guru");
                  return;
                }
                (window as any).pilihPeta(4);
              }}
            >
              {isEffectiveTrial && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "14px",
                    backgroundColor: "rgba(15, 23, 42, 0.40)",
                    backdropFilter: "blur(0.8px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                >
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "2rem",
                      color: "#ffffff",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                      marginBottom: "4px",
                    }}
                  ></i>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "800",
                      color: "#ffffff",
                      backgroundColor: "#dc2626",
                      border: "1.5px solid #ef4444",
                      borderRadius: "10px",
                      padding: "4px 12px",
                      textAlign: "center",
                      lineHeight: "1.2",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.45)",
                      letterSpacing: "0.2px",
                    }}
                  >
                    Versi Pro
                  </div>
                </div>
              )}
              <img
                referrerPolicy="no-referrer"
                src="/images/sampingan/peta-misi-bacaan-bergred.png"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "120px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  filter: isEffectiveTrial ? "brightness(75%) grayscale(20%)" : "none",
                }}
                alt="Misi Bacaan Bergred"
              />
              <button
                className="neo-btn bg-white map-select-text"
                style={{ width: "100%", pointerEvents: "none" }}
              >
                Misi Bacaan Bergred
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
