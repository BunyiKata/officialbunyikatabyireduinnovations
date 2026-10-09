// @ts-nocheck
import SoundToggle from "../SoundToggle";

import React from "react";

const tutupSidePanel = (...args: any[]) => (window as any).tutupSidePanel?.(...args);
const paparSkrin = (...args: any[]) => (window as any).paparSkrin?.(...args);

interface MuridSidePanelProps {
  activeStudentName: string;
}

export default function MuridSidePanel({
  activeStudentName,
}: MuridSidePanelProps) {
  return (
      <div
        id="murid-side-panel-overlay"
        className="modal-overlay"
        style={{
          zIndex: "2000",
          justifyContent: "flex-start",
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={(e) => {
          (window as any).bkSfx?.press?.();
          if (e.target === e.currentTarget) tutupSidePanel();
        }}
      >
        <div
          className="murid-side-panel"
          style={{
            backgroundColor: "white",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)",
            backgroundSize: "15px 15px",
            width: "280px",
            height: "100%",
            borderRight: "var(--border-thick)",
            display: "flex",
            flexDirection: "column",
            animation: "slideInLeft 0.3s forwards",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#168f81",
              backgroundImage:
                "linear-gradient(to bottom, transparent 50%, #168f81 100%), radial-gradient(rgba(255,255,255,0.15) 2px, transparent 2px)",
              backgroundSize: "100% 100%, 15px 15px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              borderBottom: "var(--border-thick)",
              position: "relative",
            }}
          >
            <div
              className="profile-card-avatar-box side-panel-avatar-box"
              style={{
                fontSize: "1.5rem",
                background: "white",
                width: "52px",
                height: "52px",
                borderRadius: "13px",
                border: "3px solid #f59e0b",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: "0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                className="murid-info-avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "9px",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  zIndex: 1,
                }}
              ></div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "flex-start",
              }}
            >
              <h2
                className="murid-info-name"
                style={{
                  fontSize: "1.2rem",
                  margin: "0",
                  wordBreak: "break-word",
                }}
              >
                {activeStudentName}
              </h2>
              <span
                className="score-pill"
                style={{
                  fontSize: "0.85rem",
                  padding: "4px 10px",
                  background: "white",
                  border: "1.5px solid var(--color-dark)",
                  borderRadius: "20px",
                  color: "var(--color-dark)",
                  fontWeight: "bold",
                  boxShadow: "0 2px 0 var(--color-dark)",
                }}
              >
                <i
                  className="fa-solid fa-star"
                  style={{
                    color: "#ffc107",
                    WebkitTextStroke: "1px var(--color-dark)",
                  }}
                ></i>{" "}
                <strong id="side-panel-jumlah-markah">0</strong>
              </span>
            </div>
            <button
              className="neo-btn bg-red"
              style={{
                display: "none",
                marginLeft: "auto",
                padding: "5px 10px",
                minWidth: "auto",
                minHeight: "auto",
              }}
              onClick={(e) => {
                (window as any).bkSfx?.press?.();
                tutupSidePanel();
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              overflowY: "auto",
              flex: "1",
            }}
          >
            <SoundToggle />
            <button
              className="neo-btn bg-purple"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.1rem",
                padding: "12px",
              }}
              onClick={(e) => {
                (window as any).bkSfx?.press?.();
                tutupSidePanel();
                paparSkrin("lencana-screen");
              }}
            >
              <i className="fa-solid fa-medal" style={{ width: "30px" }}></i>{" "}
              Lencana
            </button>
            <button
              className="neo-btn bg-yellow"
              style={{
                justifyContent: "flex-start",
                fontSize: "1.1rem",
                padding: "12px",
              }}
              onClick={(e) => {
                (window as any).bkSfx?.press?.();
                tutupSidePanel();
                paparSkrin("leaderboard-screen");
              }}
            >
              <i className="fa-solid fa-trophy" style={{ width: "30px" }}></i>{" "}
              Kedudukan
            </button>
          </div>

          <div
            style={{
              background: "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px",
                paddingBottom: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                className="neo-btn"
                style={{
                  backgroundColor: "#168f81",
                  color: "white",
                  justifyContent: "flex-start",
                  fontSize: "1.1rem",
                  padding: "12px",
                }}
                onClick={(e) => {
                  (window as any).bkSfx?.press?.();
                  tutupSidePanel();
                  paparSkrin("profile-screen");
                }}
              >
                <i className="fa-solid fa-user" style={{ width: "30px" }}></i>{" "}
                Profil
              </button>
            </div>
            <div
              style={{
                padding: "20px",
                borderTop: "var(--border-thick)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <button
                className="neo-btn bg-red"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
                onClick={(e) => {
                  (window as any).bkSfx?.press?.();
                  tutupSidePanel();
                  paparSkrin("login-screen");
                }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
