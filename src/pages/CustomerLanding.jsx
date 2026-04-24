import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: "Barbershops" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: "Cafés" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: "Nagelstudios" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80", label: "Massagestudios" },
  { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80", label: "Friseursalons" },
];

const CATEGORIES = [
  { label: "Cafés", emoji: "☕", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
  { label: "Nagelstudios", emoji: "💅", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
  { label: "Barbershops", emoji: "✂️", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
  { label: "Massage", emoji: "💆", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { label: "Friseur", emoji: "💇", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { label: "Restaurant", emoji: "🍽️", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { label: "Lokale Läden", emoji: "🏪", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { label: "Beauty", emoji: "💄", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" },
];

const STAMP_CARDS = [
  { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981" },
  { name: "Café Milano", emoji: "☕", stamps: 3, total: 6, color: "#F59E0B" },
  { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899" },
];

const MAP_PINS = [
  { x: 28, y: 38, label: "Kings Barbershop", emoji: "✂️", color: "#10B981" },
  { x: 55, y: 25, label: "Café Milano", emoji: "☕", color: "#F59E0B" },
  { x: 72, y: 52, label: "Bella Nails", emoji: "💅", color: "#EC4899" },
  { x: 40, y: 65, label: "Sushi Lounge", emoji: "🍱", color: "#06B6D4" },
  { x: 18, y: 58, label: "Lotus Massage", emoji: "💆", color: "#8B5CF6" },
];

const HOW_STEPS = [
  { emoji: "📱", num: "01", title: "QR-Code scannen", desc: "Beim nächsten Besuch einfach den QR-Code an der Kasse scannen — kein Download, kein Aufwand." },
  { emoji: "⭐", num: "02", title: "Stempel sammeln", desc: "Mit jedem Einkauf einen Stempel. Bald hast du deine Belohnung verdient." },
  { emoji: "🎁", num: "03", title: "Prämie einlösen", desc: "Wenn die Karte voll ist, löse deine Prämie direkt beim nächsten Besuch ein." },
  { emoji: "💸", num: "04", title: "Geld verdienen", desc: "Empfehle Freunde und kassiere automatisch Provision — passiv und ohne Aufwand." },
];

function PhoneMockup() {
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % STAMP_CARDS.length), 2500);
    return () => clearInterval(t);
  }, []);
  const c = STAMP_CARDS[activeCard];
  return (
    <div style={{
      background: "linear-gradient(160deg, #141c24, #0e1520)",
      borderRadius: 40, padding: "22px 16px 26px",
      width: 230, border: "1.5px solid rgba(255,255,255,0.12)",
      boxShadow: "0 50px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
      margin: "0 auto", position: "relative",
    }}>
      {/* Notch */}
      <div style={{ width: 60, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, margin: "0 auto 16px" }} />
      {/* Status */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", marginBottom: 14 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>9:41</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>●●● ▌</span>
      </div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Meine Karten</div>
        <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#10B981" }}>3 aktiv</div>
      </div>

      {/* Animated active card */}
      <div style={{
        background: `linear-gradient(135deg, ${c.color}18, ${c.color}08)`,
        border: `1.5px solid ${c.color}40`,
        borderRadius: 18, padding: "14px 14px",
        marginBottom: 10, transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 18 }}>{c.emoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Stempelkarte</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.color }}>{c.stamps}/{c.total}</div>
        </div>
        {/* Dots */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {Array.from({ length: c.total }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: "50%",
              background: i < c.stamps ? c.color : "rgba(255,255,255,0.08)",
              border: i < c.stamps ? "none" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#fff", fontWeight: 800,
              boxShadow: i === c.stamps - 1 ? `0 0 10px ${c.color}aa` : "none",
              transition: "all 0.4s",
            }}>
              {i < c.stamps ? "✓" : ""}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, background: c.color, borderRadius: 8, padding: "5px 10px", fontSize: 9, fontWeight: 800, color: "#fff", textAlign: "center" }}>
          🎁 Prämie: {c.total - c.stamps > 0 ? `noch ${c.total - c.stamps} Stempel` : "Einlösbar!"}
        </div>
      </div>

      {/* Mini cards */}
      {STAMP_CARDS.filter((_, i) => i !== activeCard).map(card => (
        <div key={card.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "9px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{card.emoji} {card.name}</span>
          <span style={{ fontSize: 10, color: card.color, fontWeight: 700 }}>{card.stamps}/{card.total}</span>
        </div>
      ))}

      {/* Earnings */}
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "10px 12px", marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>💸 Provision verdient</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>42,50 €</div>
        </div>
        <div style={{ fontSize: 20 }}>🤑</div>
      </div>

      {/* Card indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 14 }}>
        {STAMP_CARDS.map((_, i) => (
          <div key={i} onClick={() => setActiveCard(i)} style={{ width: i === activeCard ? 16 : 5, height: 5, borderRadius: 100, background: i === activeCard ? "#10B981" : "rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

function CarouselSection() {
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = 0.5;
    let raf;
    const animate = () => {
      x -= speed;
      const total = track.scrollWidth / 2;
      if (Math.abs(x) >= total) x = 0;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...CATEGORIES, ...CATEGORIES];

  return (
    <div style={{ padding: "70px 0", background: "#060d09", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>PARTNER-KATEGORIEN</div>
        <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Überall in deiner Stadt</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Lokale Lieblinge. Einfach sammeln.</p>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #060d09, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #060d09, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", gap: 14, width: "max-content", padding: "8px 20px" }}>
          {doubled.map((cat, idx) => (
            <div key={idx} style={{
              position: "relative", width: 150, height: 180,
              borderRadius: 20, overflow: "hidden", flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}>
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 12 }}>
                <div style={{ fontSize: 22, marginBottom: 3 }}>{cat.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cat.label}</div>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#10B981" }}>Aktiv</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MapSection() {
  const [activePin, setActivePin] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "#080f0b" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>BALD VERFÜGBAR</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Entdecke Partner in deiner Nähe</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Tippe auf einen Pin — komm vorbei, scanne, sammle.</p>
        </div>

        {/* Map mockup */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          {/* Map bg */}
          <div style={{
            height: 320,
            background: "linear-gradient(135deg, #0d1b12 0%, #0a1a1f 50%, #0d1320 100%)",
            position: "relative",
          }}>
            {/* Grid lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${i * 14}%`, height: 1, background: "rgba(255,255,255,0.04)" }} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 11}%`, width: 1, background: "rgba(255,255,255,0.04)" }} />
            ))}

            {/* Fake streets */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10 50 Q30 30 50 50 Q70 70 90 50" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
              <path d="M20 10 L20 90" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              <path d="M50 5 L50 95" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              <path d="M75 15 L75 85" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
              <path d="M5 30 Q40 25 60 40 Q80 55 95 45" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
              <path d="M5 70 L95 70" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
            </svg>

            {/* Pins */}
            {MAP_PINS.map((pin, i) => (
              <div key={i}
                onClick={() => setActivePin(activePin === i ? null : i)}
                style={{
                  position: "absolute",
                  left: `${pin.x}%`, top: `${pin.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  animation: visible ? `pinPop 0.5s ease ${i * 0.12}s both` : "none",
                  zIndex: activePin === i ? 10 : 1,
                }}>
                {/* Pulse ring */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  background: `${pin.color}22`,
                  border: `1px solid ${pin.color}55`,
                  animation: "pulse 2s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }} />
                {/* Pin */}
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${pin.color}, ${pin.color}aa)`,
                  border: `2px solid ${pin.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, boxShadow: `0 4px 16px ${pin.color}66`,
                  transition: "transform 0.2s",
                  transform: activePin === i ? "scale(1.25)" : "scale(1)",
                }}>{pin.emoji}</div>
                {/* Tooltip */}
                {activePin === i && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                    transform: "translateX(-50%)",
                    background: "#111e28", border: `1px solid ${pin.color}55`,
                    borderRadius: 10, padding: "6px 12px", whiteSpace: "nowrap",
                    fontSize: 11, fontWeight: 700, color: "#fff",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                  }}>{pin.label}</div>
                )}
              </div>
            ))}

            {/* Coming soon badge */}
            <div style={{
              position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
              background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
              backdropFilter: "blur(8px)",
              borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 700,
              color: "#10B981", whiteSpace: "nowrap", zIndex: 5,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 1.5s infinite" }} />
              Demnächst in deiner Stadt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const features = [
    { emoji: "🎁", title: "Prämien sammeln", desc: "Mit jedem Einkauf näher zur Belohnung — Rabatte, Freigetränke & mehr.", color: "#10B981" },
    { emoji: "💸", title: "100 € + verdienen", desc: "Empfehle Freunde und kassiere automatisch. Passiv, ohne Aufwand.", color: "#F59E0B" },
    { emoji: "📱", title: "Immer dabei", desc: "Alles digital. Kein Papierchaos. Kein App-Download nötig.", color: "#EC4899" },
    { emoji: "🤝", title: "Fair & sicher", desc: "Deine Daten gehören dir. Transparent, sicher, ohne Abo.", color: "#8B5CF6" },
  ];

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "#060d09" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>DEIN MEHRWERT</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Warum Sensalie?</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Mehr als eine Stempelkarte.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 22, padding: "28px 22px",
              opacity: 1,
              transform: "translateY(0)",
              transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, ${f.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: `${f.color}18`, border: `1px solid ${f.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, marginBottom: 16,
              }}>{f.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepsSection() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % HOW_STEPS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const step = HOW_STEPS[active];

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "#080f0b" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>SO EINFACH GEHT'S</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>In 4 Schritten durchstarten</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Tap auf einen Schritt.</p>
        </div>

        {/* Step buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {HOW_STEPS.map((s, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: "10px 18px", borderRadius: 100, border: "none",
              cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
              background: active === i ? "#10B981" : "rgba(255,255,255,0.07)",
              color: active === i ? "#fff" : "rgba(255,255,255,0.45)",
              transition: "all 0.25s",
              boxShadow: active === i ? "0 4px 16px rgba(16,185,129,0.35)" : "none",
            }}>{s.emoji} {s.num}</button>
          ))}
        </div>

        {/* Active step content */}
        <div style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))",
          border: "1px solid rgba(16,185,129,0.2)", borderRadius: 24,
          padding: "32px 28px",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s, transform 0.5s",
          animation: "stepFade 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{step.emoji}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 1 }}>SCHRITT {step.num}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{step.title}</div>
            </div>
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{step.desc}</div>
          {/* Progress bar */}
          <div style={{ marginTop: 20, display: "flex", gap: 6 }}>
            {HOW_STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i === active ? "#10B981" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLanding() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a1208", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes pinPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes stepFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,18,8,0.92)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 20px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
          Sensalie<span style={{ color: "#10B981" }}>.</span>
        </div>
        <Link to="/dashboard" style={{
          background: "#10B981", borderRadius: 100, padding: "9px 22px",
          fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
          boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
        }}>
          Anmelden
        </Link>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "60px 20px 40px" }}>
        {/* BG slideshow */}
        {HERO_SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === heroSlide ? 0.35 : 0,
            transition: "opacity 1.5s ease",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,18,8,0.88) 0%, rgba(10,18,8,0.6) 50%, rgba(10,18,8,0.9) 100%)" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Hero Text — above phone */}
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "pulse 1.5s infinite" }} />
            {HERO_SLIDES[heroSlide].label} & mehr
          </div>

          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 6px" }}>
            Sammel digitale
          </h1>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 24px", color: "#10B981" }}>
            Stempelkarten
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, alignItems: "center" }}>
            {[
              { emoji: "🎁", text: "Hol dir großartige Prämien" },
              { emoji: "💸", text: <span>Verdiene <span style={{ color: "#10B981", fontWeight: 900 }}>100 €</span> und mehr</span> },
            ].map((item, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100, padding: "9px 18px",
                opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.8s ease ${0.2 + i * 0.15}s, transform 0.8s ease ${0.2 + i * 0.15}s`,
              }}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <span style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "15px 36px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.45)",
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}>
            Kostenlos registrieren →
          </Link>

          {/* Slide dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
            {HERO_SLIDES.map((_, i) => (
              <div key={i} onClick={() => setHeroSlide(i)} style={{
                width: i === heroSlide ? 20 : 6, height: 6, borderRadius: 100,
                background: i === heroSlide ? "#10B981" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Phone — below text */}
        <div style={{
          position: "relative", zIndex: 2, marginTop: 40,
          animation: "float 4s ease-in-out infinite",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
          <PhoneMockup />
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: 2, animation: "float 2s ease-in-out infinite" }}>
          ENTDECKEN ↓
        </div>
      </div>

      {/* Features */}
      <FeaturesSection />

      {/* Steps */}
      <StepsSection />

      {/* Carousel */}
      <CarouselSection />

      {/* Map */}
      <MapSection />

      {/* ── CTA ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,10,8,0.82)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "80px 20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 14px" }}>
            Bereit für mehr<br /><span style={{ color: "#10B981" }}>aus jedem Besuch?</span>
          </h2>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 32, maxWidth: 380, margin: "0 auto 32px" }}>
            Kostenlos starten. Kein Abo. Keine versteckten Kosten.
          </div>
          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "16px 40px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.45)",
          }}>
            Jetzt kostenlos registrieren →
          </Link>
        </div>
      </div>
    </div>
  );
}