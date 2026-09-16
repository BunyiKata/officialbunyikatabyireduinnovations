import React from "react";

export interface PirateAvatar3DSwiperProps {
  onStart?: () => void;
  onOpenProPackage?: () => void;
  onRequestEntryChoice?: () => void;
}

export function PirateAvatar3DSwiper({
  onStart,
  onOpenProPackage,
  onRequestEntryChoice,
}: PirateAvatar3DSwiperProps = {}) {
  const kiraIsTrial = React.useCallback(() => {
    if (typeof (window as any).isEffectiveTrial === "function") {
      return Boolean((window as any).isEffectiveTrial());
    }
    return Boolean(
      typeof window !== "undefined" &&
        ((window as any).isGuestMode ||
          (window as any).userAccessLevel === "trial" ||
          localStorage.getItem("bunyiKataAccessLevel") === "trial" ||
          !(window as any).namaMuridAktif ||
          (window as any).namaMuridAktif === "Tetamu"),
    );
  }, []);

  // PENTING: Sebelum ini isTrial dikira sekali sahaja semasa render dan swiper
  // TIDAK melanggan sebarang peristiwa. Apabila React membersihkan sisa sesi
  // admin selepas render pertama (di skrin log masuk), avatar kekal "Terbuka"
  // (kunci terbuka) kerana komponen ini tidak pernah dikira semula. Kita jadikan
  // ia state dan kira semula apabila akses/mod berubah.
  const [isTrial, setIsTrial] = React.useState(kiraIsTrial);

  React.useEffect(() => {
    const segarSemula = () => setIsTrial(kiraIsTrial());
    segarSemula();
    window.addEventListener("akses-level-change", segarSemula);
    window.addEventListener("admin-mode-change", segarSemula);
    return () => {
      window.removeEventListener("akses-level-change", segarSemula);
      window.removeEventListener("admin-mode-change", segarSemula);
    };
  }, [kiraIsTrial]);

  // 2 Avatar Utama (Kapten Suku & Pahlawan Kata) kekal UNLOCKED untuk laluan cuba percuma.
  // 3 Avatar lain kekal TERKUNCI (Versi Pro) pada skrin log masuk untuk promosi langganan.
  const characters = [
    {
      id: 1,
      name: "Kapten Suku",
      icon: "/images/avatar/avatar1.png",
      unlocked: true,
      tag: "Terbuka",
    },
    {
      id: 2,
      name: "Pahlawan Kata",
      icon: "/images/avatar/avatar2.png",
      unlocked: true,
      tag: "Terbuka",
    },
    {
      id: 3,
      name: "Pendekar ABC",
      icon: "/images/avatar/avatar3.png",
      unlocked: false,
      tag: "Versi Pro",
    },
    {
      id: 4,
      name: "Laksamana Suku",
      icon: "/images/avatar/avatar4.png",
      unlocked: false,
      tag: "Versi Pro",
    },
    {
      id: 5,
      name: "Pengembara Vokal",
      icon: "/images/avatar/avatar5.png",
      unlocked: false,
      tag: "Versi Pro",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedAvatar, setSelectedAvatar] = React.useState(
    characters[0].icon,
  );
  const [lockedNotice, setLockedNotice] = React.useState<string | null>(null);
  const dragStartX = React.useRef<number | null>(null);

  const triggerProNotice = (charName?: string) => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    if (onOpenProPackage) {
      onOpenProPackage();
    } else if (typeof (window as any).openPakejProModal === "function") {
      (window as any).openPakejProModal("guru");
    }
  };

  const handleSelectIndex = (idx: number) => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    setActiveIndex(idx);
    setSelectedAvatar(characters[idx].icon);
    if (!characters[idx].unlocked) {
      setLockedNotice(
        `Watak ${characters[idx].name} terkunci (${characters[idx].tag})`,
      );
    } else {
      setLockedNotice(null);
    }
  };

  const handleNext = () => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    if (activeIndex < characters.length - 1) {
      handleSelectIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    if (activeIndex > 0) {
      handleSelectIndex(activeIndex - 1);
    }
  };

  const handlePointerStart = (clientX: number) => {
    dragStartX.current = clientX;
  };

  const handlePointerEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - clientX;
    if (diff > 25) {
      handleNext();
    } else if (diff < -25) {
      handlePrev();
    }
    dragStartX.current = null;
  };

  const activeChar = characters[activeIndex];

  const handleStartGame = () => {
    if (typeof (window as any).playBubble === "function") (window as any).playBubble();
    if (!activeChar.unlocked) {
      triggerProNotice(activeChar.name);
      return;
    }

    const finalAvatar = selectedAvatar || activeChar.icon;
    (window as any).selectedAvatarIcon = finalAvatar;

    // PENTING: Laluan mula cuba percuma di login screen HANYA untuk mod percuma (trial/tetamu)
    if (typeof window !== "undefined") {
      (window as any).isGuestMode = true;
      (window as any).userAccessLevel = "trial";
      (window as any).adminClaimDisahkan = false;
      (window as any).isAdminMode = false;
      (window as any).modAdminAktif = false;
      (window as any).modGuruAktif = false;
      (window as any).modIbuBapaAktif = false;
      (window as any).modAffiliateAktif = false;
      localStorage.setItem("bunyiKataAccessLevel", "trial");
      localStorage.removeItem("bunyiKataUserRole");
      if (typeof (window as any).setUserAccessLevel === "function") {
        (window as any).setUserAccessLevel("trial");
      }
    }

    const studentName = (window as any).namaMuridAktif || "Tetamu";
    if (
      typeof (window as any).studentData !== "undefined" &&
      (window as any).studentData[studentName]
    ) {
      (window as any).studentData[studentName].avatar = finalAvatar;
      if (typeof (window as any).saveStudentData === "function") {
        (window as any).saveStudentData();
      }
    }

    if (onRequestEntryChoice) {
      onRequestEntryChoice();
    } else if (onStart) {
      onStart();
    } else if (typeof (window as any).bukaModalAppInfo === "function") {
      (window as any).bukaModalAppInfo("murid");
    } else if (typeof (window as any).masukModMurid === "function") {
      (window as any).masukModMurid("Tetamu");
    }
  };

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "485px",
        margin: "0 auto 20px auto",
        padding: "5px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, #064e3b, #34d399, #10b981, #064e3b)",
        backgroundSize: "300% 300%",
        animation: "borderGradientShift 4s ease infinite",
        boxShadow: "0 0 15px rgba(52, 211, 153, 0.4), 0 0 30px rgba(16, 185, 129, 0.3), 0 10px 40px rgba(0,0,0,0.5)",
        position: "relative",
        zIndex: 1,
        boxSizing: "border-box",
      }}
    >
      {/* Tape Element at Center Top */}
      <div
        style={{
          position: "absolute",
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100px",
          height: "18px",
          backgroundColor: "#fde047",
          border: "2.5px solid var(--color-dark)",
          borderRadius: "4px",
          boxShadow: "0 2px 0 var(--color-dark)",
          zIndex: 30,
        }}
      />

      <div
        className="neo-box"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0e7a6e",
          backgroundImage:
            "linear-gradient(170deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(rgba(255,255,255,0.18) 2.5px, transparent 2.5px)",
          backgroundSize: "100% 100%, 18px 18px",
          border: "2px solid rgba(52, 211, 153, 0.3)",
          borderRadius: "20px",
          boxShadow: "inset 10px 10px 20px rgba(255,255,255,0.05), inset -10px -10px 20px rgba(0,0,0,0.2)",
          padding: "20px 16px 18px 16px",
          textAlign: "center",
          position: "relative",
          color: "white",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Scanning Line */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(to right, transparent, rgba(52, 211, 153, 0.8), transparent)",
          boxShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
          zIndex: 1,
          animation: "gamingScanLine 4s linear infinite",
          opacity: 0.5,
          pointerEvents: "none"
        }} />

        {/* 3D Swiper Stage */}
        <div
          onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handlePointerEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => handlePointerStart(e.clientX)}
          onMouseUp={(e) => handlePointerEnd(e.clientX)}
          style={{
            position: "relative",
            zIndex: 5,
            height: "200px",
            width: "100%",
            perspective: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            userSelect: "none",
            touchAction: "pan-y",
          }}
        >
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIndex === 0}
            style={{
              position: "absolute",
              left: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 35,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor:
                activeIndex === 0 ? "rgba(255,255,255,0.3)" : "#f59e0b",
              border: "2px solid white",
              color: activeIndex === 0 ? "#cbd5e1" : "#000",
              fontWeight: "900",
              fontSize: "1.2rem",
              cursor: activeIndex === 0 ? "default" : "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={activeIndex === characters.length - 1}
            style={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 35,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor:
                activeIndex === characters.length - 1
                  ? "rgba(255,255,255,0.3)"
                  : "#f59e0b",
              border: "2px solid white",
              color: activeIndex === characters.length - 1 ? "#cbd5e1" : "#000",
              fontWeight: "900",
              fontSize: "1.2rem",
              cursor:
                activeIndex === characters.length - 1 ? "default" : "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          {/* Cards */}
          {characters.map((char, idx) => {
            const offset = idx - activeIndex;
            const absOffset = Math.abs(offset);

            let xPos = offset * 110;
            let rotateY = offset * -28;
            let scale = 1 - absOffset * 0.2;
            let opacity = 1 - absOffset * 0.45;
            let zIndex = 25 - absOffset * 5;

            if (absOffset > 2) {
              opacity = 0;
            }

            const isSelected = activeIndex === idx;

            return (
              <div
                key={char.id}
                className={isSelected ? "gaming-card-glow" : ""}
                onClick={() => {
                  if (activeIndex === idx) {
                    if (!char.unlocked) {
                      triggerProNotice(char.name);
                    }
                  } else {
                    handleSelectIndex(idx);
                  }
                }}
                style={{
                  position: "absolute",
                  width: "135px",
                  height: "170px",
                  borderRadius: "18px",
                  backgroundColor: isSelected ? "#fffdf7" : "#f7f4eb",
                  backgroundImage: isSelected
                    ? "radial-gradient(#e5dec9 0.75px, transparent 0.75px), linear-gradient(135deg, #ffffff 0%, #fffdf7 50%, #f5eee0 100%)"
                    : "radial-gradient(#dcd5c0 0.75px, transparent 0.75px), linear-gradient(135deg, #f7f4eb 0%, #ebe4d5 100%)",
                  backgroundSize: "10px 10px, 100% 100%",
                  border: isSelected
                    ? "4px solid #f59e0b"
                    : char.unlocked
                      ? "3px solid #10b981"
                      : "3px solid #64748b",
                  boxShadow: isSelected
                    ? "0 0 16px rgba(245, 158, 11, 0.8), 0 8px 20px rgba(0,0,0,0.25)"
                    : "0 8px 20px rgba(0,0,0,0.2), inset 0 0 10px rgba(180, 160, 120, 0.12)",
                  transform: `translateX(${xPos}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
                  opacity: Math.max(0, opacity),
                  zIndex: zIndex,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 6px",
                  boxSizing: "border-box",
                  overflow: "hidden",
                }}
              >
                {/* Paper Card Texture & Grain Overlay for Unlocked */}
                {char.unlocked && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "18px",
                      backgroundImage:
                        "linear-gradient(0deg, rgba(160, 140, 100, 0.05) 1px, transparent 1px)",
                      backgroundSize: "100% 3px",
                      pointerEvents: "none",
                      zIndex: 1,
                      border: "1px solid rgba(210, 190, 160, 0.45)",
                    }}
                  />
                )}

                {/* Shine Sweep Glint Loop Animation for Selected Card */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "18px",
                      overflow: "hidden",
                      pointerEvents: "none",
                      zIndex: 12,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-150%",
                        width: "60%",
                        height: "200%",
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)",
                        transform: "rotate(25deg)",
                        animation: "shineSweepLoop 3s infinite ease-in-out",
                      }}
                    />
                  </div>
                )}

                {/* Unlocked Card Image Content */}
                {char.unlocked ? (
                  <div
                    style={{
                      position: "relative",
                      width: "110px",
                      height: "140px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 5,
                    }}
                  >
                    <img
                      src={char.icon}
                      alt="Avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
                      }}
                    />
                  </div>
                ) : (
                  /* Locked Card: Inner Dark Slate Box Framed by White/Cream Border */
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activeIndex === idx) {
                        triggerProNotice(char.name);
                      } else {
                        handleSelectIndex(idx);
                      }
                    }}
                    style={{
                      position: "absolute",
                      inset: "4px",
                      borderRadius: "13px",
                      backgroundColor: "rgba(30, 41, 59, 0.45)",
                      backgroundImage: "linear-gradient(150deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.6) 100%)",
                      backdropFilter: "blur(0.8px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 6px",
                      boxSizing: "border-box",
                      zIndex: 5,
                      overflow: "hidden",
                    }}
                  >
                    {/* Silhouette background avatar */}
                    <img
                      src={char.icon}
                      alt="Avatar Locked"
                      style={{
                        position: "absolute",
                        width: "90%",
                        height: "90%",
                        objectFit: "contain",
                        filter: "brightness(75%) opacity(0.75)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Lock Icon */}
                    <i
                      className="fa-solid fa-lock"
                      style={{
                        fontSize: "1.9rem",
                        color: "#ffffff",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.85))",
                        position: "relative",
                        zIndex: 6,
                        marginBottom: "6px",
                      }}
                    ></i>

                    {/* Red Versi Pro Badge */}
                    <div
                      style={{
                        position: "relative",
                        zIndex: 6,
                        fontSize: "0.78rem",
                        fontWeight: "800",
                        color: "#ffffff",
                        backgroundColor: "#dc2626",
                        border: "1.5px solid #ef4444",
                        borderRadius: "10px",
                        padding: "5px 12px",
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
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "14px",
          }}
        >
          {characters.map((char, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectIndex(idx)}
              style={{
                width: activeIndex === idx ? "22px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  activeIndex === idx ? "#f59e0b" : "rgba(255,255,255,0.4)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        {/* Start Button ("Mula") */}
        <button
          id="btn-mula-login"
          type="button"
          className="neo-btn bg-yellow mula-start-btn"
          style={{
            position: "relative",
            zIndex: 10,
            width: "min(75%, 230px)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            padding: "10px 16px",
            color: "var(--color-dark)",
            border: "3px solid #000",
            textTransform: "uppercase",
            fontWeight: "900",
            letterSpacing: "0.5px",
            animation: "mulaBtnGoldPulse 2.2s infinite ease-in-out !important",
          }}
          onClick={handleStartGame}
        >
          <i className="fa-solid fa-play" style={{ marginRight: "8px" }}></i>
          Mula
        </button>
      </div>
    </div>
  );
}

export default PirateAvatar3DSwiper;
