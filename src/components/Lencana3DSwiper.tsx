import React from "react";
import { getCoreAudioContext } from "../utils/coreAudio";

export function Lencana3DSwiper() {
  const FIVE_BADGES = [
    {
      id: "badge_peta_1",
      petaId: 1,
      title: "Penjelajah Alfabet",
      displayTitle: "Penjelajah Alfabet",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Kenal Huruf",
      image: "/images/lencana/lencana-penjelajah-alfabet.png",
      mapName: "Cabaran Kenal Huruf",
    },
    {
      id: "badge_peta_2",
      petaId: 2,
      title: "Pemburu Suku Kata",
      displayTitle: "Pemburu Suku Kata",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Suku Kata Asas",
      image: "/images/lencana/lencana-pemburu-suku-kata.png",
      mapName: "Cabaran Suku Kata Asas",
    },
    {
      id: "badge_peta_3",
      petaId: 3,
      title: "Wira Pulau",
      displayTitle: "Wira Pulau",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Suku Kata Hero",
      image: "/images/lencana/lencana-wira-pulau.png",
      mapName: "Cabaran Suku Kata Hero",
    },
    {
      id: "badge_peta_4",
      petaId: 4,
      title: "Naib Raja Bacaan",
      displayTitle: "Naib Raja Bacaan",
      desc: "Dapatkan 3 bintang dalam sekurang-kurangnya 3 aktiviti Cabaran Bacaan Bergred",
      image: "/images/lencana/lencana-naib-raja-bacaan.png",
      mapName: "Cabaran Bacaan Bergred",
    },
    {
      id: "badge_master",
      petaId: "all",
      title: "Kapten Harta Karun",
      displayTitle: "Kapten Harta Karun",
      desc: "Buka kesemua 4 lencana utama untuk memperoleh Sijil Pencapaian",
      image: "/images/lencana/lencana-kapten-harta-karun.png",
      mapName: "Koleksi Semua Cabaran",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [winWidth, setWinWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 800
  );
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef<number | null>(null);
  const [badgeStatus, setBadgeStatus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const handleResize = () => {
      setWinWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = winWidth <= 640;
  const isLaptop = winWidth >= 721;

  const checkBadgeStatus = () => {
    let data = typeof (window as any).getCurrentProfileData === 'function' ? (window as any).getCurrentProfileData() : null;
    if (!data) {
      const studentName = (window as any).namaMuridAktif || localStorage.getItem('muridAktif') || localStorage.getItem('bunyiKataCurrentMurid') || localStorage.getItem('bunyiKataNamaMurid') || '';
      if (studentName) {
        if ((window as any).studentData && (window as any).studentData[studentName]) {
          data = (window as any).studentData[studentName];
        } else {
          try {
            const raw = localStorage.getItem('bunyiKataStudentData');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed[studentName]) data = parsed[studentName];
            }
          } catch (e) {}
        }
      }
    }

    if (data && (!data.badges || data.badges.length === 0) && typeof (window as any).kiraLencanaMurid === 'function') {
      const earned = (window as any).kiraLencanaMurid(data);
      if (Array.isArray(earned) && earned.length > 0) {
        data.badges = earned;
      }
    }

    const calculatedBadges = (typeof (window as any).kiraLencanaMurid === 'function' && data) ? (window as any).kiraLencanaMurid(data) : [];
    const status: Record<string, boolean> = {};

    FIVE_BADGES.forEach((b) => {
      let isUnlocked = false;
      if (typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted(b.petaId, data)) {
        isUnlocked = true;
      }
      if (data && data.badges && data.badges.includes(b.id)) {
        isUnlocked = true;
      }
      if (Array.isArray(calculatedBadges) && calculatedBadges.includes(b.id)) {
        isUnlocked = true;
      }
      status[b.id] = isUnlocked;
    });

    setBadgeStatus(status);

    const all4Unlocked = Boolean(
      (typeof (window as any).isPetaCompleted === 'function' && (window as any).isPetaCompleted('all', data)) ||
      status['badge_master'] ||
      (status['badge_peta_1'] && status['badge_peta_2'] && status['badge_peta_3'] && status['badge_peta_4'])
    );

    const sijilBtn = document.getElementById('sijil-btn') as HTMLButtonElement | null;
    const lockIcon = document.getElementById('sijil-lock-icon');
    const mainIcon = document.getElementById('sijil-main-icon');
    if (sijilBtn) {
      if (all4Unlocked) {
        sijilBtn.classList.remove('is-locked');
        sijilBtn.classList.add('is-unlocked');
        if (lockIcon) lockIcon.style.display = 'none';
        if (mainIcon) mainIcon.style.display = 'inline-block';
      } else {
        sijilBtn.classList.remove('is-unlocked');
        sijilBtn.classList.add('is-locked');
        if (lockIcon) lockIcon.style.display = 'inline-block';
        if (mainIcon) mainIcon.style.display = 'none';
      }
    }
  };

  React.useEffect(() => {
    checkBadgeStatus();

    // Auto retry checking badge status in case of asynchronous Firebase data hydration on refresh
    const t1 = setTimeout(checkBadgeStatus, 150);
    const t2 = setTimeout(checkBadgeStatus, 500);
    const t3 = setTimeout(checkBadgeStatus, 1200);
    const t4 = setTimeout(checkBadgeStatus, 2500);

    const handleUpdate = () => checkBadgeStatus();
    window.addEventListener("kemaskini-profil", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("papar-skrin", handleUpdate);

    // Watch when #lencana-screen becomes active
    const screen = document.getElementById("lencana-screen");
    let observer: MutationObserver | null = null;
    if (screen) {
      observer = new MutationObserver(() => {
        if (screen.classList.contains("active")) {
          checkBadgeStatus();
        }
      });
      observer.observe(screen, { attributes: true, attributeFilter: ["class"] });
    }

    // Auto popup maklumat lencana setiap kali masuk skrin Lencana Saya
    const timer = setTimeout(() => {
      if (screen && screen.classList.contains("active")) {
        if (typeof (window as any).bukaModalInfoLencana === "function") {
          (window as any).bukaModalInfoLencana();
        }
      }
    }, 350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener("kemaskini-profil", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("papar-skrin", handleUpdate);
    };
  }, []);

  const totalBadges = FIVE_BADGES.length;

  const playSwipeSound = () => {
    try {
      const ctx = getCoreAudioContext();
      if (ctx) {
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        const now = ctx.currentTime;
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.09);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch (e) { }
  };

  const handleNext = () => {
    playSwipeSound();
    setActiveIndex((prev) => (prev + 1) % totalBadges);
  };

  const handlePrev = () => {
    playSwipeSound();
    setActiveIndex((prev) => (prev - 1 + totalBadges) % totalBadges);
  };

  const handlePointerStart = (clientX: number) => {
    dragStartX.current = clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handlePointerEnd = (clientX?: number) => {
    if (dragStartX.current === null) return;
    const finalOffset = clientX !== undefined ? clientX - dragStartX.current : dragOffset;
    if (finalOffset < -35) {
      handleNext();
    } else if (finalOffset > 35) {
      handlePrev();
    }
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleBadgeClick = (b: any, isUnlocked: boolean) => {
    if (Math.abs(dragOffset) > 8) return;
    if (isUnlocked) {
      if ((window as any).bukaDetailLencana) {
        (window as any).bukaDetailLencana(b.title, b.desc, b.image, b.mapName, b.petaId === 'all');
      }
    } else {
      const msg =
        b.petaId === 'all'
          ? `Lencana "${b.title}" masih terkunci! Selesaikan sekurang-kurangnya 3 aktiviti (skor 3 bintang penuh) dalam setiap 4 cabaran utama untuk membuka lencana ini dan Sijil Pencapaian.`
          : `Lencana "${b.title}" masih terkunci! Dapatkan 3 bintang (skor penuh) dalam sekurang-kurangnya 3 aktiviti ${b.mapName} untuk membuka lencana ini.`;

      if (typeof (window as any).showAppToast === "function") {
        (window as any).showAppToast("Lencana Masih Terkunci", msg, "warning");
      } else {
        alert(msg);
      }
    }
  };

  const getCircularOffset = (idx: number, active: number, total: number = 5) => {
    let diff = idx - active;
    while (diff < -total / 2) diff += total;
    while (diff > total / 2) diff -= total;
    return diff;
  };

  const stepX = isMobile ? 88 : (isLaptop ? 205 : 135);
  const dragFraction = isDragging ? Math.max(-1.2, Math.min(1.2, dragOffset / stepX)) : 0;

  return (
    <div style={{ width: "100%", margin: "0 auto", position: "relative", userSelect: "none" }}>
      {/* 3D Swiper Stage */}
      <div
        onTouchStart={(e) => handlePointerStart(e.touches[0].clientX)}
        onTouchMove={(e) => isDragging && handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={(e) => handlePointerEnd(e.changedTouches[0].clientX)}
        onTouchCancel={() => handlePointerEnd()}
        onMouseDown={(e) => handlePointerStart(e.clientX)}
        onMouseMove={(e) => isDragging && handlePointerMove(e.clientX)}
        onMouseUp={(e) => handlePointerEnd(e.clientX)}
        onMouseLeave={() => isDragging && handlePointerEnd()}
        style={{
          position: "relative",
          height: isMobile ? "145px" : (isLaptop ? "245px" : "175px"),
          width: "100%",
          perspective: "850px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: isMobile ? "4px 0 6px" : (isLaptop ? "12px 0 16px" : "8px 0 10px"),
          touchAction: "pan-y",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {/* Left Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          style={{
            position: "absolute",
            left: isLaptop ? "12px" : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            height: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            borderRadius: "50%",
            backgroundColor: "#f59e0b",
            border: "2.5px solid var(--color-dark, #10182f)",
            color: "#10182f",
            fontWeight: "900",
            fontSize: isLaptop ? "1.3rem" : (isMobile ? "1rem" : "1.1rem"),
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label="Lencana Sebelumnya"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          style={{
            position: "absolute",
            right: isLaptop ? "12px" : "4px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 50,
            width: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            height: isLaptop ? "44px" : (isMobile ? "34px" : "38px"),
            borderRadius: "50%",
            backgroundColor: "#f59e0b",
            border: "2.5px solid var(--color-dark, #10182f)",
            color: "#10182f",
            fontWeight: "900",
            fontSize: isLaptop ? "1.3rem" : (isMobile ? "1rem" : "1.1rem"),
            cursor: "pointer",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          aria-label="Lencana Seterusnya"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>

        {/* 3D Cards */}
        {FIVE_BADGES.map((badge, idx) => {
          const unlocked = Boolean(badgeStatus[badge.id]);
          const baseOffset = getCircularOffset(idx, activeIndex, totalBadges);
          const centerOffset = baseOffset + dragFraction;
          const absOffset = Math.abs(centerOffset);

          const xPos = centerOffset * stepX;
          const rotateY = Math.max(-20, Math.min(20, centerOffset * (isMobile ? -10 : -8)));
          const scale = isMobile
            ? Math.max(0.72, 1.0 - absOffset * 0.22)
            : Math.max(0.75, 1.02 - absOffset * 0.22);
          const opacity = Math.max(0, 1 - Math.max(0, absOffset - 0.4) * 0.65);
          const zIndex = Math.round(30 - absOffset * 8);

          if (absOffset > 2.2) {
            return null;
          }

          const isPrimaryInView = absOffset < 0.45;

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge, unlocked)}
              className={`badge-card-item ${unlocked ? "is-unlocked" : "is-locked"}`}
              style={{
                position: "absolute",
                width: isMobile ? "105px" : (isLaptop ? "185px" : "135px"),
                height: isMobile ? "135px" : (isLaptop ? "220px" : "160px"),
                borderRadius: isMobile ? "16px" : (isLaptop ? "24px" : "18px"),
                backgroundColor: "#ffffff",
                border: isPrimaryInView
                  ? unlocked
                    ? "3.5px solid #9333ea"
                    : "3.5px solid var(--color-dark, #10182f)"
                  : "2px solid #64748b",
                boxShadow: isPrimaryInView
                  ? unlocked
                    ? "0 8px 18px rgba(147, 51, 234, 0.35), 0 4px 0 var(--color-dark, #10182f)"
                    : "0 8px 18px rgba(0,0,0,0.25), 0 4px 0 var(--color-dark, #10182f)"
                  : "0 3px 8px rgba(0,0,0,0.15)",
                transform: `translateX(${xPos}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
                transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.35s ease, box-shadow 0.35s ease",
                opacity: opacity,
                zIndex: zIndex,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: isLaptop ? "10px" : "6px",
                boxSizing: "border-box",
                userSelect: "none",
              }}
            >
              {/* Top Purple Ribbon Tab */}
              <div
                style={{
                  width: isMobile ? "32px" : (isLaptop ? "52px" : "40px"),
                  height: isLaptop ? "8px" : "6px",
                  backgroundColor: "var(--color-purple, #9333ea)",
                  border: "2px solid var(--color-dark, #10182f)",
                  borderRadius: "4px",
                  position: "absolute",
                  top: "-4px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 5,
                }}
              />

              {/* Badge Image Frame */}
              <div
                style={{
                  position: "relative",
                  width: isMobile ? "90px" : (isLaptop ? "165px" : "120px"),
                  height: isMobile ? "90px" : (isLaptop ? "165px" : "120px"),
                  backgroundColor: "#f8fafc",
                  border: `2px solid ${unlocked ? "#9333ea" : "#94a3b8"}`,
                  borderRadius: isLaptop ? "18px" : "14px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0px",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="shine-sweep-slow"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                />
                <img
                  src={badge.image}
                  alt={badge.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                    filter: unlocked ? "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" : "grayscale(100%) opacity(0.4)",
                  }}
                />

                {!unlocked && (
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      color: "white",
                      fontSize: isMobile ? "1.8rem" : (isLaptop ? "3.2rem" : "2.4rem"),
                      textShadow: "0px 2px 6px rgba(0,0,0,0.85)",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2px" }}>
        {[0, 1, 2, 3, 4].map((pos) => (
          <div
            key={pos}
            onClick={() => {
              if (activeIndex !== pos) {
                playSwipeSound();
                setActiveIndex(pos);
              }
            }}
            style={{
              width: activeIndex === pos ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: activeIndex === pos ? "#f59e0b" : "rgba(255, 255, 255, 0.45)",
              border: "1.5px solid var(--color-dark, #10182f)",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Lencana3DSwiper;
