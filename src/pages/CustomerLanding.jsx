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
  { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981", appointment: "Mo, 28. Apr · 14:00" },
  { name: "Café Milano", emoji: "☕", stamps: 3, total: 6, color: "#F59E0B", appointment: null },
  { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899", appointment: "Do, 01. Mai · 11:30" },
];

// Berlin map pins with realistic coordinates
const MAP_PINS = [
  { x: 38, y: 42, label: "Kings Barbershop", emoji: "✂️", color: "#10B981" },
  { x: 52, y: 30, label: "Café Milano", emoji: "☕", color: "#F59E0B" },
  { x: 65, y: 55, label: "Bella Nails", emoji: "💅", color: "#EC4899" },
  { x: 30, y: 62, label: "Sushi Lounge", emoji: "🍱", color: "#06B6D4" },
  { x: 72, y: 38, label: "Lotus Massage", emoji: "💆", color: "#8B5CF6" },
];

const HOW_STEPS = [
  { emoji: "📱", num: "01", title: "QR-Code scannen", desc: "Beim nächsten Besuch einfach den QR-Code an der Kasse scannen — kein Aufwand, keine Registrierung vor Ort.", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" },
  { emoji: "⭐", num: "02", title: "Stempel sammeln", desc: "Mit jedem Einkauf einen Stempel. Bald hast du deine Belohnung verdient.", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
  { emoji: "🎁", num: "03", title: "Prämie einlösen", desc: "Wenn die Karte voll ist, löse deine Prämie direkt beim nächsten Besuch ein.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
  { emoji: "💸", num: "04", title: "Geld verdienen", desc: "Empfehle Freunde und kassiere automatisch Provision — passiv und ohne Aufwand.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80" },
];

// ── Phone Mockup ──────────────────────────────────────────────────────────────
function PhoneMockup() {
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % STAMP_CARDS.length), 2500);
    return () => clearInterval(t);
  }, []);
  const c = STAMP_CARDS[activeCard];
  return (
    <div style={{
      background: "linear-gradient(160deg, #1a2530, #111e28)",
      borderRadius: 40, padding: "22px 16px 26px",
      width: 230, border: "1.5px solid rgba(255,255,255,0.14)",
      boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(16,185,129,0.08)",
      margin: "0 auto", position: "relative",
    }}>
      <div style={{ width: 60, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 100, margin: "0 auto 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", marginBottom: 14 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>9:41</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>●●● ▌</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Meine Karten</div>
        <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#10B981" }}>3 aktiv</div>
      </div>
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
      {STAMP_CARDS.filter((_, i) => i !== activeCard).map(card => (
        <div key={card.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "9px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{card.emoji} {card.name}</span>
          <span style={{ fontSize: 10, color: card.color, fontWeight: 700 }}>{card.stamps}/{card.total}</span>
        </div>
      ))}
      {STAMP_CARDS.filter(c => c.appointment)[0] && (
        <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 12, padding: "8px 12px", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>📅</span>
          <div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Nächster Termin</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{STAMP_CARDS.filter(c => c.appointment)[0].name}</div>
            <div style={{ fontSize: 9, color: "#EC4899", fontWeight: 600 }}>{STAMP_CARDS.filter(c => c.appointment)[0].appointment}</div>
          </div>
        </div>
      )}
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "10px 12px", marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>💸 Provision verdient</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>42,50 €</div>
        </div>
        <div style={{ fontSize: 20 }}>🤑</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 14 }}>
        {STAMP_CARDS.map((_, i) => (
          <div key={i} onClick={() => setActiveCard(i)} style={{ width: i === activeCard ? 16 : 5, height: 5, borderRadius: 100, background: i === activeCard ? "#10B981" : "rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const features = [
    { emoji: "🎫", title: "Digitale Stempelkarten", desc: "Sammel bei Barbershops, Cafés, Nagelstudios & Co. — alles auf einem Blick, immer dabei.", color: "#10B981", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
    { emoji: "💸", title: "100 € + verdienen", desc: "Empfehle deine Lieblingsgeschäfte an Freunde und kassiere automatisch Provision.", color: "#F59E0B", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80" },
    { emoji: "📅", title: "Termine verwalten", desc: "Buche und verwalte Termine bei deinen Partnerbetrieben direkt über Sensalie.", color: "#EC4899", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80" },
    { emoji: "⚡", title: "Alles an einem Ort", desc: "Stempelkarten, Prämien, Termine und Provision — alles digital, alles übersichtlich.", color: "#8B5CF6", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" },
  ];

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0d1f14 0%, #0a1a10 100%)", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>DEIN MEHRWERT</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Warum Sensalie?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Mehr als eine Stempelkarte.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 22, overflow: "hidden",
                border: hovered === i ? `1.5px solid ${f.color}66` : "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                boxShadow: hovered === i ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${f.color}22` : "0 8px 32px rgba(0,0,0,0.3)",
                transform: hovered === i ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transitionDelay: visible ? `${i * 0.08}s` : "0s",
              }}>
              <div style={{ height: 130, position: "relative", overflow: "hidden" }}>
                <img src={f.img} alt={f.title} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: hovered === i ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.5s ease",
                }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)` }} />
                <div style={{ position: "absolute", top: 14, left: 14, width: 42, height: 42, borderRadius: 12, background: `${f.color}dd`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 14px ${f.color}66` }}>{f.emoji}</div>
              </div>
              <div style={{ background: hovered === i ? `rgba(255,255,255,0.06)` : "rgba(255,255,255,0.03)", padding: "16px 18px", transition: "background 0.3s" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
                <div style={{ marginTop: 10, height: 2, borderRadius: 100, background: `linear-gradient(to right, ${f.color}, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Carousel Section ──────────────────────────────────────────────────────────
function CarouselSection() {
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = 0.28;
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
    <div style={{ padding: "70px 0", background: "linear-gradient(180deg, #0a1a10 0%, #0d2318 50%, #0a1a10 100%)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>PARTNER-KATEGORIEN</div>
        <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Überall in deiner Stadt</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Lokale Lieblinge. Einfach sammeln.</p>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #0a1a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #0a1a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", gap: 14, width: "max-content", padding: "8px 20px" }}>
          {doubled.map((cat, idx) => (
            <div key={idx} style={{
              position: "relative", width: 150, height: 180,
              borderRadius: 20, overflow: "hidden", flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
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

// ── Animated Steps "Video" ────────────────────────────────────────────────────
function StepsSection() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActive(i => (i + 1) % HOW_STEPS.length);
      setAnimKey(k => k + 1);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const handleClick = (i) => {
    setActive(i);
    setAnimKey(k => k + 1);
  };

  const s = HOW_STEPS[active];

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0a1a10 0%, #0d2318 50%, #0a1a10 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>SO EINFACH GEHT'S</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>In 4 Schritten durchstarten</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Tippe auf einen Schritt — oder schau einfach zu.</p>
        </div>

        {/* Animated "video" preview card */}
        <div style={{
          borderRadius: 24, overflow: "hidden", position: "relative",
          border: "1px solid rgba(16,185,129,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          marginBottom: 20,
          minHeight: 200,
        }}>
          {/* BG image with transition */}
          <img
            key={`img-${animKey}`}
            src={s.img}
            alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
              animation: "stepImgIn 0.6s ease forwards",
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,20,12,0.7) 0%, rgba(8,20,12,0.4) 100%)" }} />

          {/* Progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)" }}>
            <div
              key={`bar-${animKey}`}
              style={{
                height: "100%", background: "#10B981", borderRadius: 100,
                animation: "progressBar 3.2s linear forwards",
              }}
            />
          </div>

          {/* Content */}
          <div
            key={`content-${animKey}`}
            style={{
              position: "relative", zIndex: 1,
              padding: "28px 28px 24px",
              animation: "stepContentIn 0.5s ease forwards",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: "rgba(16,185,129,0.25)", border: "2px solid rgba(16,185,129,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              }}>{s.emoji}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 1, marginBottom: 3 }}>SCHRITT {s.num} / 04</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{s.title}</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480 }}>{s.desc}</div>
          </div>

          {/* Step indicator dots */}
          <div style={{ position: "absolute", bottom: 18, right: 20, display: "flex", gap: 6, zIndex: 2 }}>
            {HOW_STEPS.map((_, i) => (
              <div key={i} onClick={() => handleClick(i)} style={{
                width: i === active ? 22 : 7, height: 7, borderRadius: 100,
                background: i === active ? "#10B981" : "rgba(255,255,255,0.25)",
                transition: "all 0.3s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Step buttons row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {HOW_STEPS.map((step, i) => (
            <button key={i} onClick={() => handleClick(i)} style={{
              padding: "12px 8px", borderRadius: 16, border: "none",
              cursor: "pointer", fontFamily: "inherit",
              background: active === i ? "rgba(16,185,129,0.18)" : "rgba(255,255,255,0.05)",
              border: active === i ? "1.5px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.25s",
              transform: active === i ? "scale(1.04)" : "scale(1)",
            }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{step.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: active === i ? "#10B981" : "rgba(255,255,255,0.4)" }}>SCHRITT {step.num}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: active === i ? "#fff" : "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.3 }}>{step.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Berlin SVG Map ────────────────────────────────────────────────────────────
function BerlinMap({ activePin, setActivePin, visible }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 340, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(16,185,129,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
      {/* Dark map background */}
      <svg
        viewBox="0 0 800 460"
        style={{ width: "100%", height: "100%", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="800" height="460" fill="#0d1f14" />
        {/* Water - Spree / Havel (simplified) */}
        <path d="M 0 200 Q 80 195 120 205 Q 160 215 200 210 Q 240 205 280 215 Q 320 225 360 220 Q 400 215 440 222 Q 480 229 520 225 Q 560 221 600 228 Q 640 235 680 230 Q 720 225 760 232 L 800 235 L 800 250 L 760 248 Q 720 242 680 248 Q 640 254 600 246 Q 560 238 520 243 Q 480 248 440 240 Q 400 232 360 238 Q 320 244 280 234 Q 240 224 200 230 Q 160 236 120 225 Q 80 214 0 218 Z" fill="#1a3d5c" opacity="0.6" />
        {/* Spree curve through center */}
        <path d="M 150 240 Q 200 235 250 245 Q 300 255 350 250 Q 400 245 450 255 Q 500 265 550 258" stroke="#1a4a6e" strokeWidth="10" fill="none" opacity="0.5" />
        {/* Tiergarten park */}
        <ellipse cx="280" cy="195" rx="60" ry="38" fill="#0f2e1a" opacity="0.8" />
        {/* Brandenburger Tor area */}
        <rect x="315" y="185" width="8" height="20" fill="rgba(16,185,129,0.3)" rx="1" />
        {/* Main streets - horizontal */}
        <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <line x1="0" y1="230" x2="800" y2="230" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="0" y1="270" x2="800" y2="270" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <line x1="0" y1="310" x2="800" y2="310" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="120" x2="800" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {/* Main streets - vertical */}
        <line x1="100" y1="0" x2="100" y2="460" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="200" y2="460" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <line x1="300" y1="0" x2="300" y2="460" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        <line x1="400" y1="0" x2="400" y2="460" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <line x1="500" y1="0" x2="500" y2="460" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <line x1="600" y1="0" x2="600" y2="460" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="700" y1="0" x2="700" y2="460" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {/* Diagonal - Ku'damm */}
        <line x1="0" y1="220" x2="300" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        {/* Diagonal - Karl-Marx-Allee */}
        <line x1="400" y1="200" x2="800" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        {/* Ring road */}
        <circle cx="400" cy="230" r="160" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <circle cx="400" cy="230" r="240" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        {/* Small blocks */}
        {[...Array(12)].map((_, row) => [...Array(18)].map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={20 + col * 44}
            y={40 + row * 38}
            width={28}
            height={22}
            rx={3}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        )))}
        {/* City center highlight */}
        <circle cx="320" cy="200" r="40" fill="rgba(16,185,129,0.04)" />
        {/* Label: Berlin */}
        <text x="400" y="420" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="13" fontWeight="bold" letterSpacing="6">BERLIN</text>
      </svg>

      {/* Green tint overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 60%)" }} />

      {/* Pins */}
      {MAP_PINS.map((pin, i) => (
        <div
          key={i}
          onClick={() => setActivePin(activePin === i ? null : i)}
          style={{
            position: "absolute",
            left: `${pin.x}%`, top: `${pin.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            animation: visible ? `pinPop 0.5s ease ${i * 0.14}s both` : "none",
            zIndex: activePin === i ? 10 : 2,
          }}>
          {/* Pulse */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 44, height: 44, borderRadius: "50%",
            background: `${pin.color}18`,
            border: `1.5px solid ${pin.color}55`,
            animation: "pulseMap 2s ease-in-out infinite",
            animationDelay: `${i * 0.4}s`,
          }} />
          {/* Pin */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${pin.color}ee, ${pin.color}99)`,
            border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, boxShadow: `0 4px 18px ${pin.color}88, 0 2px 8px rgba(0,0,0,0.5)`,
            transition: "transform 0.2s",
            transform: activePin === i ? "scale(1.3)" : "scale(1)",
          }}>{pin.emoji}</div>
          {/* Tooltip */}
          {activePin === i && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(8,20,12,0.97)", border: `1.5px solid ${pin.color}88`,
              backdropFilter: "blur(12px)",
              borderRadius: 12, padding: "7px 14px", whiteSpace: "nowrap",
              fontSize: 11, fontWeight: 700, color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              animation: "stepFade 0.2s ease",
            }}>
              <span style={{ marginRight: 5 }}>{pin.emoji}</span>{pin.label}
            </div>
          )}
        </div>
      ))}

      {/* Badge */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        background: "rgba(8,20,12,0.9)", border: "1px solid rgba(16,185,129,0.4)",
        backdropFilter: "blur(12px)",
        borderRadius: 100, padding: "9px 22px", fontSize: 12, fontWeight: 700,
        color: "#10B981", whiteSpace: "nowrap", zIndex: 5,
        display: "flex", alignItems: "center", gap: 7,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
        Demnächst in deiner Stadt
      </div>

      {/* Top-left: Berlin label */}
      <div style={{ position: "absolute", top: 16, left: 18, display: "flex", alignItems: "center", gap: 6, background: "rgba(8,20,12,0.7)", borderRadius: 100, padding: "5px 12px", backdropFilter: "blur(8px)" }}>
        <span style={{ fontSize: 14 }}>🇩🇪</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Berlin</span>
      </div>
    </div>
  );
}

// ── Map Section ───────────────────────────────────────────────────────────────
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
    <div ref={ref} style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0d2318 0%, #0a1a10 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>BALD VERFÜGBAR</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Entdecke Partner in deiner Nähe</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Tippe auf einen Pin — komm vorbei, scanne, sammle.</p>
        </div>
        <BerlinMap activePin={activePin} setActivePin={setActivePin} visible={visible} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
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
    <div style={{ minHeight: "100vh", background: "#0d1f14", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes pulseMap {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
        }
        @keyframes pinPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes stepFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepImgIn {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes stepContentIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,31,20,0.95)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(16,185,129,0.12)",
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
      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "60px 20px 40px", background: "linear-gradient(180deg, #0d1f14 0%, #0a1810 100%)" }}>
        {/* BG slideshow */}
        {HERO_SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === heroSlide ? 0.22 : 0,
            transition: "opacity 1.5s ease",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(13,31,20,0.85) 0%, rgba(13,31,20,0.55) 50%, rgba(13,31,20,0.88) 100%)" }} />
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Hero Text */}
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            {HERO_SLIDES[heroSlide].label} & mehr
          </div>

          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 6px" }}>
            Sammel digitale
          </h1>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 24px", color: "#10B981" }}>
            Stempelkarten
          </h1>

          {/* Animated badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, alignItems: "center" }}>
            {[
              { emoji: "🎁", text: "Hol dir großartige Prämien", sub: "Rabatte, Gratisleistungen & mehr", delay: "0.2s" },
              { emoji: "💸", text: <span>Verdiene <span style={{ color: "#10B981", fontWeight: 900 }}>100 €</span> und mehr</span>, sub: "Einfach durch Empfehlungen. Passiv. Automatisch.", delay: "0.35s" },
            ].map((item, i) => (
              <div key={i} style={{
                opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.7s ease ${item.delay}, transform 0.7s ease ${item.delay}`,
                textAlign: "center",
                animation: heroVisible ? `badgeFloat ${3.5 + i * 0.5}s ease-in-out ${i * 0.8}s infinite` : "none",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 100, padding: "10px 20px", marginBottom: 5,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}>
                  <span style={{ fontSize: 18 }}>{item.emoji}</span>
                  <span style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700 }}>{item.text}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.sub}</div>
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
                background: i === heroSlide ? "#10B981" : "rgba(255,255,255,0.2)",
                transition: "all 0.35s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Phone */}
        <div style={{
          position: "relative", zIndex: 2, marginTop: 40,
          animation: "float 4s ease-in-out infinite",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 65%)", pointerEvents: "none" }} />
          <PhoneMockup />

          {/* 3 checkmarks below phone */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 14, marginTop: 22,
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
          }}>
            {[
              { label: "Prämie", color: "#10B981", delay: "0s" },
              { label: "Provision", color: "#F59E0B", delay: "0.12s" },
              { label: "Termin", color: "#EC4899", delay: "0.24s" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,0.06)", border: `1px solid ${item.color}44`,
                borderRadius: 100, padding: "6px 12px",
                animation: heroVisible ? `badgeFloat ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite` : "none",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: item.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, color: "#fff",
                  flexShrink: 0,
                }}>✓</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2, animation: "float 2s ease-in-out infinite" }}>
          ENTDECKEN ↓
        </div>
      </div>

      {/* Features — Warum Sensalie */}
      <FeaturesSection />

      {/* Partner Carousel */}
      <CarouselSection />

      {/* 4 Schritte — animated */}
      <StepsSection />

      {/* Berlin Map */}
      <MapSection />

      {/* ── CTA ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0d2318 0%, #0f2d1c 40%, #162d1e 100%)",
        padding: "100px 20px",
      }}>
        {/* Decorative glows */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        {/* Grid pattern */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>JETZT STARTEN</div>
          <h2 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 14px" }}>
            Bereit für mehr<br /><span style={{ color: "#10B981" }}>aus jedem Besuch?</span>
          </h2>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36, maxWidth: 380, margin: "0 auto 36px" }}>
            Kostenlos starten. Deine Lieblingsgeschäfte. Deine Prämien.
          </div>
          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "16px 44px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 40px rgba(16,185,129,0.5)",
          }}>
            Jetzt kostenlos registrieren →
          </Link>
          {/* 3 checks under CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
            {["Kostenlos", "Sofort aktiv", "Kein Abo"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                <span style={{ color: "#10B981", fontWeight: 800 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}