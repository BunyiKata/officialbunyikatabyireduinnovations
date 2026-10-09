// @ts-nocheck
import React from "react";
import { motion, AnimatePresence } from "motion/react";

export interface ModeChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: "guru" | "ibubapa") => void;
}

/**
 * Popup kecil (wajib pilih) untuk memilih mod guru/ibu bapa
 * bagi tujuan langganan pakej Pro Bunyi Kata.
 * Tiada icon pada butang — hanya teks sahaja.
 */
export function ModeChoiceModal({ isOpen, onClose, onSelectMode }: ModeChoiceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "15px",
          }}
          onClick={(e) => {
            (window as any).bkSfx?.press?.();
            // Klik pada overlay hitam TIDAK menutup popup (wajib pilih mod)
            void e;
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="neo-box"
            style={{
              backgroundColor: "#fef9ec",
              backgroundImage:
                "radial-gradient(circle, rgba(16, 24, 47, .11) 1.5px, transparent 1.5px)",
              backgroundSize: "15px 15px",
              maxWidth: "440px",
              width: "100%",
              padding: "28px 24px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              className="neo-btn"
              style={{
                backgroundColor: "#168f81",
                color: "white",
                fontSize: "clamp(1.05rem, 3.8vw, 1.3rem)",
                margin: "0 auto 16px auto",
                display: "inline-block",
                pointerEvents: "none",
                padding: "8px 24px",
                lineHeight: "1.2",
                fontWeight: "900",
                borderRadius: "12px",
              }}
            >
              Pakej Pro Bunyi Kata
            </div>

            <p
              style={{
                margin: "0 0 22px 0",
                fontSize: "0.98rem",
                lineHeight: "1.5",
                color: "#334155",
                fontWeight: "bold",
              }}
            >
              Pilih mod bagi tujuan langganan pakej:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                className="neo-btn bg-orange"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1.05rem",
                  color: "white",
                  fontWeight: "bold",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => { (window as any).bkSfx?.press?.(); onSelectMode("guru"); }}
              >
                <i className="fa-solid fa-person-chalkboard"></i> Guru
              </button>
              <button
                className="neo-btn bg-blue"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1.05rem",
                  color: "white",
                  fontWeight: "bold",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => { (window as any).bkSfx?.press?.(); onSelectMode("ibubapa"); }}
              >
                <i className="fa-solid fa-users"></i> Ibu Bapa
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}