import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    id: 0,
    emoji: "👋",
    title: "Willkommen bei Sensalie Business!",
    subtitle: "Dein digitales Wachstumssystem",
    desc: "Du bist dabei! Sensalie hilft dir, Stammkunden zu halten und neue Kunden durch Empfehlungen zu gewinnen — vollautomatisch.",
    color: "#10B981",
    bgGradient: "linear-gradient(160deg, #0d2318 0%, #0a1a10 100%)",
    phone: { screen: "welcome" },
  },
  {
    id: 1,
    emoji: "⬛",
    title: "Dein QR-Code ist dein Werkzeug",
    subtitle: "Einmal aufstellen — für immer aktiv",
    desc: "Drucke deinen persönlichen QR-Code aus und stelle ihn an der Kasse auf. Kunden scannen ihn — du gewinnst automatisch Stammkunden.",
    color: "#F59E0B",
    bgGradient: "linear-gradient(160deg, #1a1200 0%, #0f0d00 100%)",
    phone: { screen: "qr" },
  },
  {
    id: 2,
    emoji: "🎁",
    title: "Stempelkarte & Prämie festlegen",
    subtitle: "Deine Regeln. Deine Prämie.",
    desc: "Lege fest, ab welchem Einkaufsbetrag ein Stempel vergeben wird, und was deine Kunden als Belohnung erhalten. Einmal einrichten — läuft dann von alleine.",
    color: "#EC4899",
    bgGradient: "linear-gradient(160deg, #1a0d14 0%, #110a10 100%)",
    phone: { screen: "stamp" },
  },
  {
    id: 3,
    emoji: "💸",
    title: "Empfehlungen = Gratis-Marketing",
    subtitle: "Kunden werben Kunden — automatisch",
    desc: "Jeder Kunde bekommt einen persönlichen Link. Wenn er einen Freund mitbringt und der X-mal kommt, erhält er automatisch Provision. Du zahlst nur bei Erfolg.",
    color: "#8B5CF6",
    bgGradient: "linear-gradient(160deg, #100d1a 0%, #0a0910 100%)",
    phone: { screen: "referral" },
  },
  {
    id: 4,
    emoji: "📈",
    title: "Alles im Blick — in Echtzeit",
    subtitle: "Dein Dashboard. Deine Zahlen.",
    desc: "Sieh auf einen Blick wie viele Kunden aktiv sind, wie viele Empfehlungen laufen und welche Provisionen noch ausstehen. Keine Überraschungen.",
    color: "#10B981",
    bgGradient: "linear-gradient(160deg, #0d2318 0%, #0a1a10 100%)",
    phone: { screen: "dashboard" },
  },
];

function BizPhoneScreen({ screen, color, active }) {
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    setAnimStep(0);
    const t1 = setTimeout(() => setAnimStep(1), 300);
    const t2 = setTimeout(() => setAnimStep(2), 800);
    const t3 = setTimeout(() => setAnimStep(3), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, screen]);

  if (screen === "welcome") return (
    <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 26, marginBottom: 6 }}>🏪</div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>Kings Barbershop</div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Business Dashboard · Bereit</div>
      </div>
      {[
        { emoji: "👥", label: "142 aktive Kunden", color: "#10B981" },
        { emoji: "💸", label: "87,50 € offene Provisionen", color: "#F59E0B" },
        { emoji: "⭐", label: "31 Empfehlungen diesen Monat", color: "#EC4899" },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: `${item.color}15`, border: `1px solid ${item.color}30`,
          borderRadius: 10, padding: "8px 11px",
          opacity: animStep > i ? 1 : 0,
          transform: animStep > i ? "translateX(0)" : "translateX(20px)",
          transition: "all 0.4s ease",
        }}>
          <span style={{ fontSize: 14 }}>{item.emoji}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{item.label}</span>
          <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: item.color }} />
        </div>
      ))}
    </div>
  );

  if (screen === "qr") return (
    <div style={{ padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Dein QR-Code</div>
      <div style={{
        width: 100, height: 100, borderRadius: 12,
        background: "#fff", padding: 6,
        border: `3px solid ${animStep >= 1 ? "#F59E0B" : "rgba(255,255,255,0.1)"}`,
        boxShadow: animStep >= 1 ? "0 0 18px #F59E0B66" : "none",
        transition: "all 0.5s ease",
      }}>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&bgcolor=ffffff&color=000000&data=sensalie-biz-demo"
          alt="QR" style={{ width: "100%", height: "100%", borderRadius: 6 }} />
      </div>
      <div style={{
        opacity: animStep >= 2 ? 1 : 0, transition: "opacity 0.4s ease",
        fontSize: 10, color: "#F59E0B", fontWeight: 700,
        background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: 100, padding: "4px 12px",
      }}>⬇ Herunterladen & ausdrucken</div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.5 }}>
        Stelle ihn gut sichtbar an der Kasse auf
      </div>
    </div>
  );

  if (screen === "stamp") return (
    <div style={{ padding: "14px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textAlign: "center" }}>Stempelkarte-Einstellung</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { label: "Ab welchem Betrag?", value: "20 €", color: "#EC4899" },
          { label: "Stempel bis Prämie", value: "8 Stempel", color: "#EC4899" },
          { label: "Prämie", value: "Gratis Haarschnitt 🎁", color: "#EC4899" },
        ].map((item, i) => (
          <div key={i} style={{
            background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)",
            borderRadius: 9, padding: "8px 10px",
            opacity: animStep > i ? 1 : 0, transform: animStep > i ? "translateY(0)" : "translateY(8px)",
            transition: `all 0.4s ease ${i * 0.12}s`,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{item.value}</div>
          </div>
        ))}
      </div>
      {animStep >= 3 && (
        <div style={{ marginTop: 8, background: "#EC4899", borderRadius: 9, padding: "7px", textAlign: "center", fontSize: 10, fontWeight: 800, color: "#fff", animation: "bizSlideUp 0.3s ease" }}>
          ✓ Gespeichert!
        </div>
      )}
    </div>
  );

  if (screen === "referral") return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Empfehlungs-Provision</div>
        <div style={{
          fontSize: 24, fontWeight: 900, color: "#8B5CF6",
          opacity: animStep >= 1 ? 1 : 0, transform: animStep >= 1 ? "scale(1)" : "scale(0.7)",
          transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}>8,50 €</div>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>pro erfolgreicher Empfehlung</div>
      </div>
      {[
        { from: "Mehmet", to: "2 Besuche", status: "aktiv" },
        { from: "Sara K.", to: "3/3 Besuche ✓", status: "ausgezahlt" },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)",
          borderRadius: 9, padding: "7px 10px",
          opacity: animStep > i + 1 ? 1 : 0, transition: `all 0.4s ease ${i * 0.15}s`,
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>{item.from}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{item.to}</div>
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, color: item.status === "ausgezahlt" ? "#10B981" : "#8B5CF6" }}>
            {item.status === "ausgezahlt" ? "✓ Ausgezahlt" : "⏳ Aktiv"}
          </div>
        </div>
      ))}
    </div>
  );

  if (screen === "dashboard") return (
    <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>Dein Überblick</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        {[
          { icon: "👥", label: "Kunden", value: "142", color: "#10B981" },
          { icon: "📊", label: "Scans heute", value: "23", color: "#F59E0B" },
          { icon: "💸", label: "Empfehlungen", value: "31", color: "#8B5CF6" },
          { icon: "💰", label: "Provision", value: "87,50€", color: "#EC4899" },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}12`, border: `1px solid ${s.color}28`,
            borderRadius: 8, padding: "7px 8px",
            opacity: animStep > i ? 1 : 0, transform: animStep > i ? "scale(1)" : "scale(0.85)",
            transition: `all 0.35s ease ${i * 0.1}s`,
          }}>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{s.icon} {s.label}</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 8, color: "#10B981", fontWeight: 600, textAlign: "center", marginTop: 4, opacity: animStep >= 3 ? 1 : 0, transition: "opacity 0.4s ease" }}>
        ● Echtzeit-Daten · wird automatisch aktualisiert
      </div>
    </div>
  );

  return null;
}

export default function BusinessOnboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animating, setAnimating] = useState(false);
  const startX = useRef(null);
  const slide = SLIDES[current];

  const goTo = (idx) => {
    if (animating || idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 280);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else onComplete();
  };

  const prev = () => { if (current > 0) goTo(current - 1); };

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
        @keyframes bizSlideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bizSlideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bizSlideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bizPhoneFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes bizBgPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .biz-onboarding-content { animation: bizSlideInRight 0.35s ease; }
        .biz-onboarding-content.back { animation: bizSlideInLeft 0.35s ease; }
      `}</style>

      {/* Skip */}
      <div style={{ position: "absolute", top: 16, right: 20, zIndex: 10 }}>
        <button onClick={onComplete} style={{
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 600,
          color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit",
        }}>
          Überspringen
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 10 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goTo(i)} style={{
            width: i === current ? 24 : 7, height: 7, borderRadius: 100,
            background: i === current ? slide.color : "rgba(255,255,255,0.2)",
            transition: "all 0.35s ease", cursor: "pointer",
          }} />
        ))}
      </div>

      {/* BG glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 300, height: 300, borderRadius: "50%",
        background: `radial-gradient(circle, ${slide.color}20 0%, transparent 70%)`,
        transition: "background 0.6s ease",
        animation: "bizBgPulse 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div
        key={current}
        className={`biz-onboarding-content${direction === -1 ? " back" : ""}`}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "70px 24px 20px", gap: 0,
        }}
      >
        {/* Phone mockup */}
        <div style={{ animation: "bizPhoneFloat 4s ease-in-out infinite", marginBottom: 28 }}>
          <div style={{
            width: 195, borderRadius: 36,
            background: "linear-gradient(160deg, #1a2a20, #111e18)",
            border: "2px solid rgba(255,255,255,0.12)",
            boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px ${slide.color}22`,
            overflow: "hidden",
            transition: "box-shadow 0.6s ease",
          }}>
            <div style={{ background: "#111", padding: "10px 0 6px", textAlign: "center" }}>
              <div style={{ width: 44, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 100, margin: "0 auto" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 14px 8px", background: "#111" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>9:41</span>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.25)" }}>●●● ▌</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "7px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: "#fff" }}>Sensalie<span style={{ color: slide.color }}>.</span> <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>Business</span></div>
              <div style={{ fontSize: 8, color: slide.color, fontWeight: 700 }}>● Live</div>
            </div>
            <div style={{ minHeight: 190, background: "rgba(0,0,0,0.2)" }}>
              <BizPhoneScreen screen={slide.phone.screen} color={slide.color} active={true} />
            </div>
            <div style={{ background: "#111", padding: "7px 14px 11px", display: "flex", justifyContent: "space-around" }}>
              {["📋", "⬛", "💸", "⚙️"].map((icon, i) => (
                <div key={i} style={{ fontSize: 13, opacity: i === 0 ? 1 : 0.3 }}>{icon}</div>
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
          <h2 style={{ fontSize: "clamp(21px, 5.5vw, 30px)", fontWeight: 900, margin: "0 0 12px", color: "#fff", lineHeight: 1.2 }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
            {slide.desc}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={next} style={{
          width: "100%", padding: "16px",
          background: slide.color, color: "#fff",
          fontWeight: 800, fontSize: 16, borderRadius: 100,
          border: "none", cursor: "pointer", fontFamily: "inherit",
          boxShadow: `0 8px 24px ${slide.color}55`,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
        }}>
          {current === SLIDES.length - 1 ? "Dashboard öffnen 🚀" : "Weiter →"}
        </button>
        {current > 0 && (
          <button onClick={prev} style={{
            width: "100%", padding: "12px",
            background: "transparent", color: "rgba(255,255,255,0.35)",
            fontWeight: 600, fontSize: 14, borderRadius: 100,
            border: "none", cursor: "pointer", fontFamily: "inherit",
          }}>
            ← Zurück
          </button>
        )}
      </div>
    </div>
  );
}