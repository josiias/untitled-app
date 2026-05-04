import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    id: 0,
    emoji: "👋",
    title: "Willkommen bei Sensalie!",
    subtitle: "Dein digitales Treueprogramm",
    desc: "Sammle Stempel bei deinen Lieblingsgeschäften, verdiene Prämien und empfehle Freunde — alles an einem Ort.",
    color: "#10B981",
    bgGradient: "linear-gradient(160deg, #0d2318 0%, #0a1a10 100%)",
    phone: {
      screen: "welcome",
    },
  },
  {
    id: 1,
    emoji: "⬛",
    title: "QR-Code scannen",
    subtitle: "An der Kasse — in 2 Sekunden",
    desc: "Halte einfach dein Handy an den QR-Code an der Kasse. Kein Download, keine Registrierung vor Ort nötig.",
    color: "#F59E0B",
    bgGradient: "linear-gradient(160deg, #1a1200 0%, #0f0d00 100%)",
    phone: {
      screen: "scan",
    },
  },
  {
    id: 2,
    emoji: "⭐",
    title: "Stempel sammeln",
    subtitle: "Jeder Besuch zählt",
    desc: "Mit jedem Einkauf einen Stempel. Sieh deinen Fortschritt in Echtzeit und freu dich auf deine Prämie.",
    color: "#EC4899",
    bgGradient: "linear-gradient(160deg, #1a0d14 0%, #110a10 100%)",
    phone: {
      screen: "stamps",
    },
  },
  {
    id: 3,
    emoji: "🎁",
    title: "Prämien einlösen",
    subtitle: "Gratis. Bei jedem Vollstempel.",
    desc: "Ist deine Karte voll? Löse deine Prämie direkt beim nächsten Besuch ein — automatisch, kein Stress.",
    color: "#8B5CF6",
    bgGradient: "linear-gradient(160deg, #100d1a 0%, #0a0910 100%)",
    phone: {
      screen: "reward",
    },
  },
  {
    id: 4,
    emoji: "💸",
    title: "Geld verdienen",
    subtitle: "Passiv. Automatisch. Ohne Aufwand.",
    desc: "Teile deinen persönlichen Link mit Freunden. Wenn sie kommen, verdienst du automatisch Provision — ganz ohne Aufwand.",
    color: "#10B981",
    bgGradient: "linear-gradient(160deg, #0d2318 0%, #0a1a10 100%)",
    phone: {
      screen: "money",
    },
  },
];

// ── Phone Screen Content ──────────────────────────────────────────────────────
function PhoneScreen({ screen, color, active }) {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    setAnimStep(0);
    const t1 = setTimeout(() => setAnimStep(1), 300);
    const t2 = setTimeout(() => setAnimStep(2), 800);
    const t3 = setTimeout(() => setAnimStep(3), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, screen]);

  const STAMP_COUNT = 8;
  const filled = animStep >= 2 ? 5 : animStep >= 1 ? 3 : 0;

  if (screen === "welcome") return (
    <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>👋</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Hey, schön dass du da bist!</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Dein Sensalie-Konto ist bereit</div>
      </div>
      {[
        { emoji: "⬛", label: "3 Stempelkarten aktiv", color: "#10B981" },
        { emoji: "💸", label: "42,50 € verdient", color: "#F59E0B" },
        { emoji: "🎁", label: "1 Prämie verfügbar", color: "#EC4899" },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: `${item.color}15`, border: `1px solid ${item.color}30`,
          borderRadius: 10, padding: "9px 12px",
          opacity: animStep > i ? 1 : 0,
          transform: animStep > i ? "translateX(0)" : "translateX(20px)",
          transition: "all 0.4s ease",
        }}>
          <span style={{ fontSize: 16 }}>{item.emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{item.label}</span>
          <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: item.color }} />
        </div>
      ))}
    </div>
  );

  if (screen === "scan") return (
    <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>QR-Code scannen</div>
      <div style={{
        width: 110, height: 110, borderRadius: 14,
        background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `3px solid ${animStep >= 1 ? "#F59E0B" : "rgba(255,255,255,0.1)"}`,
        boxShadow: animStep >= 1 ? `0 0 20px #F59E0B66` : "none",
        transition: "all 0.5s ease",
        padding: 8,
      }}>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=ffffff&color=000000&data=sensalie-demo`}
          alt="QR" style={{ width: "100%", height: "100%", borderRadius: 6 }}
        />
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        opacity: animStep >= 2 ? 1 : 0, transition: "opacity 0.4s ease",
        background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)",
        borderRadius: 100, padding: "5px 14px",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B" }} />
        <span style={{ fontSize: 10, fontWeight: 700, color: "#F59E0B" }}>✓ Stempel erhalten!</span>
      </div>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.5 }}>
        Zeig den Code an der Kasse
      </div>
    </div>
  );

  if (screen === "stamps") return (
    <div style={{ padding: "14px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>✂️ Kings Barbershop</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#EC4899" }}>{filled}/{STAMP_COUNT}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, marginBottom: 10 }}>
        {Array.from({ length: STAMP_COUNT }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: "1/1", borderRadius: 8,
            background: i < filled ? "#EC4899" : "rgba(255,255,255,0.07)",
            border: i < filled ? "none" : "1px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#fff", fontWeight: 800,
            boxShadow: i === filled - 1 && filled > 0 ? "0 0 10px #EC4899aa" : "none",
            transform: i < filled && animStep >= 2 ? "scale(1.05)" : "scale(1)",
            transition: `all 0.3s ease ${i * 0.06}s`,
          }}>
            {i < filled ? "✓" : ""}
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 8, padding: "7px 10px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#EC4899", fontWeight: 700 }}>🎁 Noch {STAMP_COUNT - filled} Stempel bis zur Prämie</div>
      </div>
      {animStep >= 3 && (
        <div style={{
          marginTop: 8, display: "flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 8, padding: "6px 10px",
          animation: "slideUp 0.4s ease",
        }}>
          <span style={{ fontSize: 12 }}>+1</span>
          <span style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>Neuer Stempel hinzugefügt!</span>
        </div>
      )}
    </div>
  );

  if (screen === "reward") return (
    <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "rgba(139,92,246,0.2)", border: "2px solid rgba(139,92,246,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
        transform: animStep >= 1 ? "scale(1)" : "scale(0.5)",
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: animStep >= 1 ? "0 0 24px rgba(139,92,246,0.4)" : "none",
      }}>🎁</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textAlign: "center" }}>
        Karte voll!
      </div>
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))",
        border: "1.5px solid rgba(139,92,246,0.4)",
        borderRadius: 14, padding: "12px 16px", width: "100%", textAlign: "center",
        opacity: animStep >= 2 ? 1 : 0, transform: animStep >= 2 ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.4s ease",
      }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Deine Prämie</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#8B5CF6" }}>10€ Gutschein</div>
      </div>
      <div style={{
        background: "#8B5CF6", borderRadius: 10, padding: "9px 20px",
        fontSize: 11, fontWeight: 800, color: "#fff",
        opacity: animStep >= 3 ? 1 : 0, transition: "opacity 0.4s ease",
        boxShadow: "0 4px 14px rgba(139,92,246,0.4)",
      }}>
        Jetzt einlösen →
      </div>
    </div>
  );

  if (screen === "money") return (
    <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Meine Provision</div>
        <div style={{
          fontSize: 28, fontWeight: 900, color: "#10B981",
          opacity: animStep >= 1 ? 1 : 0,
          transform: animStep >= 1 ? "scale(1)" : "scale(0.8)",
          transition: "all 0.5s ease",
        }}>42,50 €</div>
      </div>
      {[
        { name: "Mehmet → Barbershop", amount: "+8,50€", delay: 0 },
        { name: "Sara → Café Milano", amount: "+12,00€", delay: 1 },
        { name: "Jonas → Bella Nails", amount: "+22,00€", delay: 2 },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)",
          borderRadius: 10, padding: "8px 12px",
          opacity: animStep > item.delay ? 1 : 0,
          transform: animStep > item.delay ? "translateX(0)" : "translateX(-16px)",
          transition: `all 0.4s ease ${i * 0.1}s`,
        }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{item.name}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>{item.amount}</span>
        </div>
      ))}
    </div>
  );

  return null;
}

// ── Main Onboarding Component ─────────────────────────────────────────────────
export default function CustomerOnboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [animating, setAnimating] = useState(false);
  const startX = useRef(null);
  const slide = SLIDES[current];

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 280);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else onComplete();
  };

  const prev = () => {
    if (current > 0) goTo(current - 1);
  };

  // Swipe support
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startX.current = null;
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: slide.bgGradient,
        transition: "background 0.6s ease",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes phoneFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes bgPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .onboarding-content {
          animation: slideInRight 0.35s ease;
        }
        .onboarding-content.back {
          animation: slideInLeft 0.35s ease;
        }
      `}</style>

      {/* Skip button */}
      <div style={{ position: "absolute", top: 16, right: 20, zIndex: 10 }}>
        <button
          onClick={onComplete}
          style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 600,
            color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Überspringen
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? 24 : 7, height: 7, borderRadius: 100,
              background: i === current ? slide.color : "rgba(255,255,255,0.2)",
              transition: "all 0.35s ease", cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, ${slide.color}20 0%, transparent 70%)`,
        transition: "background 0.6s ease",
        animation: "bgPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Main content */}
      <div
        key={current}
        className={`onboarding-content${direction === -1 ? " back" : ""}`}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "70px 24px 20px",
          gap: 0,
        }}
      >
        {/* Phone mockup */}
        <div style={{
          animation: "phoneFloat 4s ease-in-out infinite",
          marginBottom: 32,
        }}>
          <div style={{
            width: 200, borderRadius: 36,
            background: "linear-gradient(160deg, #1a2a20, #111e18)",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${slide.color}22`,
            overflow: "hidden",
            transition: "box-shadow 0.6s ease",
          }}>
            {/* Phone notch */}
            <div style={{ background: "#111", padding: "10px 0 6px", textAlign: "center" }}>
              <div style={{ width: 44, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 100, margin: "0 auto" }} />
            </div>
            {/* Status bar */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 14px 8px", background: "#111" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>9:41</span>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.25)" }}>●●● ▌</span>
            </div>
            {/* App header */}
            <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#fff" }}>Sensalie<span style={{ color: slide.color }}>.</span></div>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${slide.color}33`, border: `1px solid ${slide.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>👤</div>
            </div>
            {/* Screen content */}
            <div style={{ minHeight: 200, background: "rgba(0,0,0,0.2)" }}>
              <PhoneScreen screen={slide.phone.screen} color={slide.color} active={true} />
            </div>
            {/* Bottom bar */}
            <div style={{ background: "#111", padding: "8px 14px 12px", display: "flex", justifyContent: "space-around" }}>
              {["🏠", "⬛", "💸", "👤"].map((icon, i) => (
                <div key={i} style={{ fontSize: 14, opacity: i === 0 ? 1 : 0.3 }}>{icon}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${slide.color}20`, border: `1px solid ${slide.color}40`,
            borderRadius: 100, padding: "5px 14px", marginBottom: 14,
            fontSize: 12, fontWeight: 700, color: slide.color,
          }}>
            <span>{slide.emoji}</span>
            <span>{slide.subtitle}</span>
          </div>
          <h2 style={{ fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, margin: "0 0 12px", color: "#fff", lineHeight: 1.2 }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={next}
          style={{
            width: "100%", padding: "16px",
            background: slide.color, color: "#fff",
            fontWeight: 800, fontSize: 16, borderRadius: 100,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            boxShadow: `0 8px 24px ${slide.color}55`,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          {current === SLIDES.length - 1 ? "Los geht's! 🚀" : "Weiter →"}
        </button>
        {current > 0 && (
          <button
            onClick={prev}
            style={{
              width: "100%", padding: "12px",
              background: "transparent", color: "rgba(255,255,255,0.35)",
              fontWeight: 600, fontSize: 14, borderRadius: 100,
              border: "none", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ← Zurück
          </button>
        )}
      </div>
    </div>
  );
}